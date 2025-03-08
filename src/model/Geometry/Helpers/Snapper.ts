import * as THREE from 'three';
import { Model } from '../../Model';
import Node from '../../Elements/Node/Node';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
class Snapper {
  // scene : THREE.Scene
  snap : THREE.Mesh | THREE.Group | null
  nodeSnap : THREE.Group | null
  gridSnap : THREE.Mesh | null
  model : Model
  enabled : boolean
  snappedCoords : THREE.Vector3 | null
  snappedNode : Node | null
  threshold : number = 0.01
  enableEndPointSnapping : boolean = true
  set setupEvent(enabled: boolean) {
    if (enabled) {
      this.addToScene()
      this.updatePosition()
    } else {
    }
  }
  constructor(model : Model) {
    this.model = model
    this.snap = null
    this.snappedCoords = null
    this.snappedNode = null
    this.nodeSnap = null
    this.gridSnap = null
    this.enabled = true
    this.setupEvent = true
  }

  addToScene() {
    const circleShape = new THREE.Shape();
    circleShape.absarc(0, 0, 0.1, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 0.0, 0, Math.PI * 2, true);
    circleShape.holes.push(holePath);

    const extrudeSettings = {depth: 0.,bevelEnabled: false};

    const circleGeometry = new THREE.ExtrudeGeometry(circleShape, extrudeSettings);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x9c27b0 });
    circleGeometry.rotateX(-Math.PI / 2)
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    const nodeSnap = this.getNodeSnap()
    
    // nodeSnap.layers.enableAll()
    // circleMesh.layers.enableAll()

    this.model.scene.add(nodeSnap)
    this.model.scene.add(circleMesh) 
    
    this.nodeSnap = nodeSnap
    this.gridSnap = circleMesh
    this.snap = this.gridSnap
    // this.snap = this.nodeSnap
    this.nodeSnap.visible = false
    // console.log('nodeSnap', this.nodeSnap)
    // this.snap = nodeSnap

  }
  snapToGrid = (pointerCoords: THREE.Vector3, gridSize : number ): THREE.Vector3 => {
    
    const newCoords = new THREE.Vector3().copy(pointerCoords);
    const screenCoords = new THREE.Vector2(pointerCoords.x, pointerCoords.y)
    const worldPosition = this.screenToWorld(screenCoords, this.model.camera.cam)

    //declaration of function which calculates new values and returns them
    const getCoordByOriginAndGridSize = (coord: number, gridSize: number): number => {
      if (gridSize < 1) {
        return Math.round(coord * 2) / 2;
      } else {
        return Math.round(coord / gridSize) * gridSize;
      };
    };

    
    newCoords.x = getCoordByOriginAndGridSize(worldPosition.x, gridSize);
    newCoords.y = getCoordByOriginAndGridSize(worldPosition.y, gridSize)
    newCoords.z = getCoordByOriginAndGridSize(worldPosition.z, gridSize);

    const distanceToCurrent = pointerCoords.distanceTo(newCoords);

    return newCoords;
  };
  updatePosition()
  
  { 
    let snapPosition = this.snapToGrid(this.model.pointerCoords, 1)
    this.snap!.position.set( snapPosition.x,  snapPosition.y , snapPosition.z)
    this.snappedCoords = snapPosition

    this.snapToNearestEndPoint()
  }
  screenToWorld(screenCoords : THREE.Vector2, camera : THREE.PerspectiveCamera | THREE.OrthographicCamera) {
    const worldPosition = new THREE.Vector3()
    // const plane = new THREE.Plane(new THREE.Vector3(0.0, 1.0, 0.0), )
    const plane = this.model.worldPlane
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(screenCoords, camera)
    raycaster.ray.intersectPlane(plane, worldPosition)
    return worldPosition

  }
  snapToNearestEndPoint() {
    if(!this.enableEndPointSnapping) return

    const targetLayer = new THREE.Layers();
    targetLayer.set(this.model.layer);
    const beams = this.model?.beams;
    
    if (!beams) return;

    for (const beam of beams) {
      const isVisible = beam.mesh.layers.test(targetLayer);
      if (!isVisible) continue;

      const nodes = beam.nodes;
      const pointer = new THREE.Vector2(this.model.pointerCoords.x, this.model.pointerCoords.y);
      
      const start = new THREE.Vector3(nodes[0].x, nodes[0].y, nodes[0].z)
        .clone()
        .project(this.model.camera.cam);

      const end = new THREE.Vector3(nodes[1].x, nodes[1].y, nodes[1].z)
        .clone()
        .project(this.model.camera.cam);

      const startOnScreen = new THREE.Vector2(start.x, start.y);
      const endOnScreen = new THREE.Vector2(end.x, end.y);

      const startDistance = startOnScreen.distanceTo(pointer);
      const endDistance = endOnScreen.distanceTo(pointer);

      if (startDistance < this.threshold || endDistance < this.threshold) {
        // If we find a snap point, update the snap position to the closest node
        const closestNode = startDistance < endDistance ? nodes[0] : nodes[1];
        this.snappedNode = closestNode
        this.gridSnap!.visible = false
        this.nodeSnap!.visible = true
        const layer = new THREE.Layers()
        layer.set(this.model.layer)
        
        this.nodeSnap!.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.layers.set(this.model.layer)
          }
        })
        
        this.nodeSnap!.position.set(closestNode.x, closestNode.y, closestNode.z);
        this.snap = this.nodeSnap
        return; 
      }else{
        this.snappedNode = null
        this.nodeSnap!.visible = false
        this.gridSnap!.visible = true
        this.snap = this.gridSnap
      }
    }
  }

  disable() {
    this.enabled = false
    this.snap!.visible = false
  }

  enable() {
    this.enabled = true
    this.snap!.visible = true
  }

  getNodeSnap() {

     // Define the material for the lines.
    const size = 0.1
    const xGroup = new THREE.Group();
    const material = new LineMaterial(
        { color: 0xff0000, 
        linewidth: 0.005 });
    

    // material.resolution.set(window.innerWidth, window.innerHeight);
    // Create the two crossing lines with Y = 0 so that they lie on the XZ plane.
    const line1Points = new Float32Array([
      -size, 0, -size,
        size, 0,   size,
    ]);
    const geometry1 = new LineGeometry();
    geometry1.setPositions(line1Points);
    
    const line1 = new Line2(geometry1, material);
    
    const line2Points = new Float32Array([
      -size, 0, size,
        size, 0, -size,
    ]);
    const geometry2 = new LineGeometry();
    geometry2.setPositions(line2Points);
    const line2 = new Line2(geometry2, material);
    
    // Add the lines to the group.
    xGroup.add(line1);
    xGroup.add(line2);
    
    // Ensure the group remains in the XZ plane (Y up). 
    // Since all points have Y = 0, no additional rotation is necessary.
    // xGroup.visible = false; // Initially hide the X symbol
    
    return xGroup
  }
}

export { Snapper };
