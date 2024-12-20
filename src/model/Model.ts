import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { SnapManager } from "./SnapManager";
// import IFCFileHandler from "./Geometry/IFC/IFCFileHandler";
import Selector from "./Geometry/Helpers/Selector";
import GUI from 'lil-gui'
import { ViewportGizmo } from "three-viewport-gizmo";
import DrawTool from "./DrawTool/DrawTool";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineBasicMaterial } from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import Axes from "./Geometry/Helpers/Axes";
const gui = new GUI({
  width: 300,
  title: 'Nice debug UI',
  closeFolders: false,
})

export type PointerCoords = {
  x: number;
  y: number;
  z: number;
};

export class Model {
  enabled = true 
  public scene = new THREE.Scene()
  public camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  public renderer =  new THREE.WebGLRenderer();
  public cameraControls = new OrbitControls(this.camera, this.renderer.domElement)
  public container !: HTMLDivElement
  pointerCoords: THREE.Vector3;  
  // private ifcFileHandler : IFCFileHandler
  worldPlane : THREE.Plane;
  snapManager : SnapManager
  // cube :  THREE.Mesh
  selector : Selector
  gizmo : ViewportGizmo
  drawTool : DrawTool
  canvas : HTMLCanvasElement
  axes : Axes
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
    this.update()
    this.init()
    this.setupEvent = true;
    this.pointerCoords =  new THREE.Vector3(0,0,0,)
    this.worldPlane =  new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.snapManager = new SnapManager(this)
    this.selector = new Selector(this); 
    this.drawTool = new DrawTool(this)
    this.axes = new Axes(this)  
    this.canvas = document.querySelector('canvas') as HTMLCanvasElement
    // const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    // const material = new THREE.MeshStandardMaterial({
    //   color: 0xc3c3c3,
    //   wireframe: false,
    // });

    // this.cube = new THREE.Mesh(geometry, material);
    // // this.scene.add(this.cube)
    // gui.add(this.cube.position, 'x').min(-10).max(10).step(0.01).name('Cube X')
    const guiElement = document.querySelector('.lil-gui') as HTMLElement
    if(guiElement){
      guiElement.style.position = 'absolute'
      guiElement.style.top = '80px'
      guiElement.style.left = '10px'
    }
    this.gizmo = new ViewportGizmo(this.camera, this.renderer, {  placement: "bottom-right",});
    this.gizmo.attachControls(this.cameraControls);
    // this.cameraControls.enableRotate = false
  }

  init()
  {
    this.container = document.getElementById('app-container') as HTMLDivElement
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container?.appendChild( this.renderer.domElement )
    this.camera.position.y = 5
    this.scene.background = new THREE.Color("#FFFFFF")
    this.cameraControls.enableDamping = true
    const size = 50;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper( size, divisions, new THREE.Color(0xe0e0e0), new THREE.Color(0xe0e0e0),  );
    gridHelper.position.y = -0.005
    const gridFolder = gui.addFolder('Grid');
    gridFolder.add(gridHelper, 'visible').name('Visible')

    gridFolder.open();
    this.scene.add( gridHelper );
    this.addLight()
    // this.addCube()
    this.createBeam()
    // this.createTempLines()
  }

  private onResize = () => 
  {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.gizmo.update()
  }
  private update = () => {
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
    this.cameraControls.update()
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
  public addLight= () => {
    const ambientLight = new THREE.AmbientLight(0xE6E7E4, 1)
    const directionalLight = new THREE.DirectionalLight(0xF9F9F9, 1)
    directionalLight.position.set(10, 50, 10)
    this.scene.add(ambientLight, directionalLight)

    // Add some lights
    // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    // this.scene.add(hemiLight);

    // const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    // dirLight.position.set(5, 10, 5);
    // this.scene.add(dirLight);

    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // this.scene.add(ambientLight);
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

    if(this.snapManager.enabled){
      this.snapManager.updatePosition()
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
    const beamMaterial = new THREE.MeshStandardMaterial({ 
      // vertexColors: true,
      roughness: 0.9,
      metalness: 0.0
    });
    
    const beamMesh = new THREE.Mesh(beamGeometry, beamMaterial);
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
    
    for (let i = 0; i < vertexCount; i++) {
      const disp = displacements[i];
      const t = (disp - minDisplacement) / displacementRange; // normalized [0,1]
    
      // Simple color map: blue at low displacement, red at high displacement
      // t=0 -> blue (0,0,1)
      // t=1 -> red (1,0,0)
      const r = t;
      const g = 0.0;
      const b = 1.0 - t;
      
      colors[i * 3 + 0] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
    beamGeometry.attributes.color.needsUpdate = true;

  }

  addCube(){
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }
}

export default Model