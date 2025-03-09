import * as THREE from "three";
import { Snapper } from "./Geometry/Helpers/Snapper";
import Selector from "./Geometry/Helpers/Selector";
import { ViewportGizmo } from "three-viewport-gizmo";
import DrawTool from "./DrawTool/DrawTool";
import Axes from "./Geometry/Helpers/Axes";
import Node from "./Elements/Node/Node";
import Beam from "./Elements/Beam/Beam";
import { Camera } from "./Camera";
import GridHelper from "./Geometry/Helpers/GridHelper";
import Light from "./Light/Light"
import Column from "./Elements/Column/Column";
import Levels from "./Geometry/Levels/Levels";

export type PointerCoords = {
  x: number;
  y: number;
  z: number;
};

export type Level = {
  value: number;
  label: string;
}

export class Model {
  enabled = true 
  public scene = new THREE.Scene()
  public camera : Camera
  public renderer =  new THREE.WebGLRenderer();
  public container !: HTMLDivElement
  pointerCoords: THREE.Vector3;  
  worldPlane : THREE.Plane;
  snapper : Snapper
  selector : Selector
  gizmo : ViewportGizmo
  drawTool : DrawTool
  canvas : HTMLCanvasElement
  axes : Axes
  nodes : Node[]
  beams : Beam[]
  columns : Column[]
  gridHelper : GridHelper
  layer : number
  light : Light
  levels : Levels
  set setupEvent(enabled: boolean) {
    if (enabled) {
      this.onResize = this.onResize.bind(this);

      this.updatePointerCoords = this.updatePointerCoords.bind(this);

      window.addEventListener("resize", this.onResize);
      window.addEventListener('pointermove', this.updatePointerCoords);
    } else {
      window.removeEventListener("resize", this.onResize);
    }
  }

  constructor() {
    this.camera = new Camera(this)
    this.gridHelper = new GridHelper(this.scene)
    this.light = new Light(this.scene)
    this.update()
    this.init()
    this.setupEvent = true;
    this.pointerCoords =  new THREE.Vector3(0,0,0,)
    this.worldPlane =  new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.snapper = new Snapper(this)
    this.selector = new Selector(this); 
    this.drawTool = new DrawTool(this)
    this.axes = new Axes(this)  
    this.canvas = document.querySelector('canvas') as HTMLCanvasElement
    this.levels = new Levels(this)
    this.gizmo = new ViewportGizmo(this.camera.cam, this.renderer, {  placement: "bottom-right",});
    this.gizmo.attachControls(this.camera.controls);
    this.nodes = []
    this.beams = []
    this.columns = []
    this.layer = 0

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    // 2. Create a vertical gradient from white at the bottom to blue at the top
    const gradient = context!.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue at the top
    gradient.addColorStop(1, '#ffffff'); // White at the bottom

    // 3. Fill the canvas with the gradient
    context!.fillStyle = gradient;
    context!.fillRect(0, 0, canvas.width, canvas.height);

    // 4. Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    this.scene.background = texture;
    this.axes.setMockAxes()
    this.createMockElements()
    this.camera.handle3dView()
  }

  init()
  {
    this.container = document.getElementById('app-container') as HTMLDivElement
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container?.appendChild( this.renderer.domElement )
    this.scene.background = new THREE.Color("#FFFFFF")
  }

  private onResize = () => 

  {
    this.camera.handleResize()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.gizmo.update()
  }

  private update = () => {
    this.camera.cam.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera.cam);
    this.camera.controls.update()
    requestAnimationFrame(this.update);
    this.gizmo?.render()
  }

  public dispose = () => {
    function removeObjWithChildren(obj : any) {
      if (obj.children.length > 0) {
        for (var x = obj.children.length - 1; x >= 0; x--) {
          removeObjWithChildren(obj.children[x])
        }
      }
      if (obj.isMesh) {
        obj.geometry.dispose();
        if( Array.isArray(obj.material)){
          for(let i = 0; i < obj.material.length; i++){
            obj.material[i].dispose()
          }
        }else{
          obj.material.dispose();
        }
      }
      if (obj.parent) {
        obj.parent.remove(obj)
      }
    }
    this.scene.traverse(function(obj) {
      removeObjWithChildren(obj)
    });
    this.container.removeChild(this.renderer.domElement)
    this.selector.dipose()
    this.removeListeners()
    this.removeGui()
  }
  public removeListeners = () => { 
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('pointermove', this.updatePointerCoords)
  }
  
  updatePointerCoords = (event : MouseEvent) => 
  { 

    const mouseLoc =  this.getMouseLocation(event)
    this.pointerCoords.x = mouseLoc.x;
    this.pointerCoords.y = mouseLoc.y;

    if(this.snapper.enabled){
      this.snapper.updatePosition()
    }
  }

  getMouseLocation ( event : MouseEvent ) {
      
      const canvas = document.querySelector('canvas')
      const rect = canvas!.getBoundingClientRect();
      const _vec2 = new THREE.Vector2();
      _vec2.x = (( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1);
      _vec2.y =  -( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

      return _vec2
  }
  removeGui () {
    const guiElement = document.querySelector('.lil-gui') as HTMLElement
    if(guiElement){
      guiElement.remove()
    }
  }

  createBeam(){

    const beamLength = 5.0;   // length along Z-axis
    const beamHeight = 0.3;   // along Y-axis
    const beamWidth  = 0.2;   // along X-axis
    
    // Number of segments to allow deformation
    const lengthSegments = 50;
    
    // Create the beam geometry
    // BoxBufferGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
    // We'll say: width = beamWidth (X), height = beamHeight (Y), depth = beamLength (Z)
    // And we subdivide along the Z-axis (depthSegments) to get a smooth deformation.
    const beamGeometry = new THREE.BoxGeometry(
      beamWidth,
      beamHeight,
      beamLength,
      1, // widthSegments
      1, // heightSegments
      lengthSegments // depthSegments
    );
    
    // Create a material that supports vertex colors for the heat map
    // const beamMaterial = new THREE.MeshStandardMaterial({ 
    //   vertexColors: true,
    //   roughness: 0.9,
    //   metalness: 0.0
    // });

    const beamMaterial = new THREE.MeshBasicMaterial({ 
      vertexColors: true
      
    });
    
    const beamMesh = new THREE.Mesh(beamGeometry, beamMaterial);
    beamMesh.layers.set(this.layer)
    this.scene.add(beamMesh);
    
    // Position the beam so that it goes from z=0 to z=5, with the midpoint at 2.5
    // By default the beam is centered at z=0 (from -2.5 to +2.5).
    // Let's shift it so start is at 0 and end is at 5.
    {
      const positionAttr = beamGeometry.attributes.position;
      for (let i = 0; i < positionAttr.count; i++) {
        const z = positionAttr.getZ(i);
        positionAttr.setZ(i, z + beamLength / 2); // shift from [-2.5,2.5] to [0,5]
      }
      positionAttr.needsUpdate = true;
    }
    
    // --------------------------------------
    // Compute and Apply Deformation
    // --------------------------------------
    // We'll use a simple parabolic deflection curve. For example, for a simply supported
    // beam with uniform load, deflection can be approximated by a parabolic function:
    // w(z) = deltaMax * (4*(z/L)*(1 - z/L)), where L=length, z in [0,L]
    
    // Maximum displacement at midspan:
    const deltaMax = 0.5; // arbitrary value, 5 cm for demonstration
    const L = beamLength;
    
    const positionAttr = beamGeometry.attributes.position;
    const vertexCount = positionAttr.count;
    
    // Array to store displacement at each vertex
    const displacements = new Float32Array(vertexCount);
    
    // Calculate deflection and modify vertices
    for (let i = 0; i < vertexCount; i++) {
      const x = positionAttr.getX(i);
      const y = positionAttr.getY(i);
      const z = positionAttr.getZ(i); // now z is in [0,L]
    
      // Compute deflection: a parabola peaking at midspan z = L/2
      // w(z) = deltaMax * 4*(z/L)*(1 - z/L)
      const zRatio = z / L;
      const w = deltaMax * 4 * zRatio * (1 - zRatio);
    
      // Move vertex down by w
      positionAttr.setXYZ(i, x, y - w, z);
    
      // Store displacement (absolute value)
      displacements[i] = w;
    }
    
    // Update geometry after deformation
    positionAttr.needsUpdate = true;
    beamGeometry.computeVertexNormals();
    
    // --------------------------------------
    // Create Heat Map Based on Displacements
    // --------------------------------------
    const colors = new Float32Array(vertexCount * 3);
    beamGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Normalize displacement values for [0,1] range
    const minDisplacement = Math.min(...displacements);
    const maxDisplacement = Math.max(...displacements);
    const displacementRange = maxDisplacement - minDisplacement || 1;

    console.log("minDisplacement:", minDisplacement, "maxDisplacement:", maxDisplacement);
    
    // for (let i = 0; i < vertexCount; i++) {
    //   const disp = displacements[i];
    //   console.log("disp: ", disp);
    //   const t = (disp - minDisplacement) / displacementRange; // normalized [0,1]
    
    //   const r = t;
    //   const g = 0.0;
    //   const b = 1.0 - t;
    //   colors[i * 3 + 0] = r;
    //   colors[i * 3 + 1] = g;
    //   colors[i * 3 + 2] = b;
    // }
    // beamGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    // beamGeometry.attributes.color.needsUpdate = true;

  }

  handleLevelChange(level: Level) {
    if(this.camera.viewMode === '3d') {
      this.camera.handle2dView()
      this.gridHelper.show()
    }
    const elevation = level.value
    this.worldPlane.constant = -elevation
    this.gridHelper.grid.position.y = elevation -0.005
    this.layer = this.levels.items.findIndex(l => l.value === level.value)
    this.snapper.snap?.layers.set(this.layer)
    this.gridHelper.grid.layers.set(this.layer)
    this.axes.setLayer(this.layer)
    this.camera.cam.layers.set(this.layer)
    this.light.object.layers.set(this.layer)

  }
  createMockElements() {


    const dir = new THREE.Vector3( 0, -1, 0 );

    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    const beamLength = 3
    for(let i = 0; i < 10; i++) {

      const origin = new THREE.Vector3( (beamLength /10) * i, 4.5, 0 );
      const length = 1;
      const hex = 0xff0000;

      const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
      this.scene.add( arrowHelper );
    }
    const  node1 = new Node(this, new THREE.Vector3(0,3,0))
    const  node2 = new Node(this, new THREE.Vector3(beamLength,3,0))

    const  node3 = new Node(this, new THREE.Vector3(0,0,0))
    const  node4 = new Node(this, new THREE.Vector3(3,0,0))

    
    this.nodes.push(node1, node2, node3, node4)

    const beam = new Beam(this, 'Beam 1', [node1, node2])
    const column1 = new Column(this, 'Column 1', [node1, node3])
    const column2 = new Column(this, 'Column 2', [node2, node4])

    beam.create()
    column1.create()
    column2.create()
    this.beams.push(beam)
    this.columns.push(column1, column2)
  }
}


export default Model