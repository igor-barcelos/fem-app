import * as THREE from 'three';
import { Model } from './Model';
class SnapManager {
  // scene : THREE.Scene
  snap : THREE.Mesh | null
  model : Model
  enabled : boolean

  set setupEvent(enabled: boolean) {
    if (enabled) {
      this.addToScene()
      this.updatePosition()
    } else {
    }
  }
  constructor(model : Model) {
    this.model = model
    this.enabled = true
    this.snap = null
    this.setupEvent = true
  }

  addToScene() {
    const circleShape = new THREE.Shape();
    circleShape.absarc(0, 0, 0.1, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 0.08, 0, Math.PI * 2, true);
    circleShape.holes.push(holePath);

    const extrudeSettings = {depth: 0.,bevelEnabled: false};

    const circleGeometry = new THREE.ExtrudeGeometry(circleShape, extrudeSettings);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x9c27b0 });
    circleGeometry.rotateX(-Math.PI / 2)
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    this.model.scene.add(circleMesh)   
    this.snap = circleMesh

  }
  snapToGrid = (pointerCoords: THREE.Vector3, gridSize : number ): THREE.Vector3 => {
    
    const newCoords = new THREE.Vector3().copy(pointerCoords);
    const screenCoords = new THREE.Vector2(pointerCoords.x, pointerCoords.y)
    const worldPosition = this.screenToWorld(screenCoords, this.model.camera)
    const precision = 0.00; // For example

    //declaration of function which calculates new values and returns them
    const getCoordByOriginAndGridSize = (coord: number, gridSize: number): number => {
      if (gridSize < 1) {
        return Math.round(coord * 2) / 2;
      } else {
        return Math.round(coord / gridSize) * gridSize;
      };
    };

    
    //calling this function and assigning new values to respective properties
    newCoords.x = getCoordByOriginAndGridSize(worldPosition.x, gridSize);
    newCoords.y = getCoordByOriginAndGridSize(worldPosition.y, gridSize)
    newCoords.z = getCoordByOriginAndGridSize(worldPosition.z, gridSize);

    const distanceToCurrent = pointerCoords.distanceTo(newCoords);

    // Update your snapOptions or any relevant variables here
    // this.snapOptions!.grid.snappedCoords = newCoords;
    // this.snapOptions!.grid.distToOrigin = distanceToCurrent;

    return newCoords;
  };
  updatePosition()
  
  {
    let snapPosition = this.snapToGrid(this.model.pointerCoords, 1)
    this.snap!.position.set( snapPosition.x,  snapPosition.y , snapPosition.z)
  }
  screenToWorld(screenCoords : THREE.Vector2, camera : THREE.PerspectiveCamera | THREE.OrthographicCamera) {
    const worldPosition = new THREE.Vector3()
    const plane = new THREE.Plane(new THREE.Vector3(0.0, 1.0, 0.0))
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(screenCoords, camera)
    raycaster.ray.intersectPlane(plane, worldPosition)
    return worldPosition
  }
}

export { SnapManager };
