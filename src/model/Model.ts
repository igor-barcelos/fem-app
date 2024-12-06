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
  cube :  THREE.Mesh
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

    const gridFolder = gui.addFolder('Grid');
    gridFolder.add(gridHelper, 'visible').name('Visible')

    gridFolder.open();
    this.scene.add( gridHelper );
    this.addLight()
    this.createTempLines()

    const points  = [-5,0,3, 5,0,3]
    const start = new THREE.Vector3(points[0], points[1], points[2])
    console.log('start', start)
    const end = new THREE.Vector3(points[3], points[4], points[5])
    console.log('end', end)
    const directionVector = end.clone().sub(start)
    
    console.log('directionVector', directionVector)

    const upVector = new THREE.Vector3(0, 1, 0)
    const normalVector = directionVector.clone().cross(upVector).normalize()
    const origin = new THREE.Vector3(0,0,0)

    const originToStart = start.clone().sub(origin)
    const angle = originToStart.angleTo(directionVector)
    console.log('angle', angle)
    const distance = originToStart.length() * Math.sin(angle)
    console.log('distance', distance)

    const projectionOnDirectionVector = directionVector.dot(originToStart) / (directionVector.length() ** 2)
    console.log('projectionOnDirectionVector', projectionOnDirectionVector)
    const AQ = Math.sqrt(originToStart.length() ** 2 - distance ** 2)
    console.log('AQ', AQ)
    const scale = AQ / directionVector.length()
    console.log('scale', scale)
    const alpha = Math.PI / 2 - angle
    console.log('alpha', alpha)
    const deltaX = Math.cos(alpha) * AQ
    const deltaZ = Math.sin(alpha) * AQ
    console.log('deltaX', deltaX)
    console.log('deltaZ', deltaZ)
    const intersectionPoint = new THREE.Vector3(start.x + deltaX, start.y, start.z + deltaZ)
    console.log('intersectionPoint', intersectionPoint)
    const distanceToOrigin = AQ * Math.sin(angle)
    console.log('distanceToOrigin', distanceToOrigin)

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
      // this.snapManager.updatePosition()
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

  createTempLines = () => {
    const group = new THREE.Group();
   
    const positions = [
      -5, 0, 0,  // Point 1: (x=−5, y=0, z=−5)
      5, 0, 0, 
  ];
    const lineGeometry = new LineGeometry();
    lineGeometry.setPositions(positions);
    const line = new Line2(lineGeometry, new LineMaterial({ 
      color: 0x1976d2,
      linewidth: 0.002,
      dashed: true,
      dashSize: 0.2,
      gapSize: 0.2
     }));
    line.computeLineDistances();

    const circleShape = new THREE.Shape();
    circleShape.absarc(0, 0, 0.3, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 0.28, 0, Math.PI * 2, true);
    circleShape.holes.push(holePath);

    const extrudeSettings = {depth: 0.,bevelEnabled: false};

    const circleGeometry = new THREE.ExtrudeGeometry(circleShape, extrudeSettings);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x1976d2 });

    
    const circle1 = new THREE.Mesh(circleGeometry, circleMaterial);
    const circle2 = new THREE.Mesh(circleGeometry, circleMaterial);
    
    // Position circles at line endpoints
    circle1.position.set(-5, 0, 0);
    circle2.position.set(5, 0, 0);
    
    // Rotate circles to face up (lie in XZ plane)
    circle1.rotation.x = -Math.PI / 2;
    circle2.rotation.x = -Math.PI / 2;

    const createTextSprite = (text: string, position: THREE.Vector3) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 64;
      canvas.height = 64;
      if (context) {
          context.strokeStyle = '#000000';
          context.font = '32px Arial';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(text, 32, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(textMaterial);
      sprite.position.copy(position); // Place text exactly at the circle center
      sprite.scale.set(0.5, 0.5, 1); // Adjust size to match circle scale
      return sprite;
  };


  
  const textSprite1 = createTextSprite('A', circle1.position);
  const textSprite2 = createTextSprite('B', circle2.position);


    group.add(line, circle1, circle2, textSprite1, textSprite2);
  
    // Add group to scene

    const lineFolder = gui.addFolder('Line Controls');
    const lineParams = { 
      color: '01976d2', 
      linewidth: 0.005,
      dashed: false,    
      dashSize: 0.2,    
      gapSize: 0.5      
    }; 

    
    lineFolder.addColor(lineParams, 'color').onChange((value: THREE.Color) => {
        // Update line material color
        if (line.material instanceof LineMaterial) {
            line.material.color.set(value);
            line.material.needsUpdate = true; // Ensure update
        }
    });

    lineFolder.add(lineParams, 'linewidth', 0.001, 0.05).onChange((value: number) => {
      if (line.material instanceof LineMaterial) {
          line.material.linewidth = value;
          line.material.needsUpdate = true;
      }
  });

  // Add dashed toggle
  lineFolder.add(lineParams, 'dashed').onChange((value: boolean) => {
      if (line.material instanceof LineMaterial) {
          line.material.dashed = value;
          line.material.needsUpdate = true;
      }
  });

  // Add dash size control
  lineFolder.add(lineParams, 'dashSize', 0.1, 1).onChange((value: number) => {
      if (line.material instanceof LineMaterial && lineParams.dashed) {
          line.material.dashSize = value;
          line.material.needsUpdate = true;
      }
  });

  // Add gap size control
  lineFolder.add(lineParams, 'gapSize', 0.1, 1).onChange((value: number) => {
      if (line.material instanceof LineMaterial && lineParams.dashed) {
          line.material.gapSize = value;
          line.material.needsUpdate = true;
      }
  });

    

    lineFolder.open();

    this.scene.add(group);
    return line;

  }

}

export default Model