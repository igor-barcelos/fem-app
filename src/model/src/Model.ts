import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import TWEEN from '@tweenjs/tween.js'
import { worldPlane } from "./worldPlane";
import { SnapManager } from "./SnapManager";
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
  private pointerCoords: THREE.Vector3;  
  worldPlane : THREE.Plane;
  snapManager : SnapManager
  cube :  THREE.Mesh

  set setupEvent(enabled: boolean) {
    if (enabled) {
      window.addEventListener("resize", this.onResize);
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
    this.snapManager = new SnapManager(this.scene)


    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc3c3c3,
      wireframe: false,
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add( this.cube );

  }

  init()
  {
    this.container = document.getElementById('app-container') as HTMLDivElement
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container.appendChild( this.renderer.domElement )
    this.camera.position.z = 5
    this.scene.background = new THREE.Color("#FFFFFF")
    this.cameraControls.enableDamping = true
    const size = 50;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper( size, divisions, new THREE.Color(0x424242) );
    this.scene.add( gridHelper );
    // this.addCube()
    this.addLight()
    const canvas = document.querySelector('canvas')
    this.startPointerCoordsUpd(canvas!, this.worldPlane , this.camera)
  }

  private onResize = () => 
  {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  private update = () => {
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
    this.cameraControls.update()
    requestAnimationFrame(this.update);
  }
  public dispose = () => {
    this.container.removeChild(this.renderer.domElement)
  }
  public addCube = () => {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc3c3c3,
      wireframe: false,
    });

    const cube = new THREE.Mesh(geometry, material);
    this.scene.add( cube );

  }
  public addLight= () => {
    const ambientLight = new THREE.AmbientLight(0xE6E7E4, 1)
    const directionalLight = new THREE.DirectionalLight(0xF9F9F9, 0.75)
    directionalLight.position.set(10, 50, 10)
    this.scene.add(ambientLight, directionalLight)
  } 
  
   
  startPointerCoordsUpd = (
    canvas : HTMLCanvasElement,
    groundPlane : THREE.Plane,
    camera :  THREE.PerspectiveCamera | THREE.OrthographicCamera,

    ) => {
      
    window.addEventListener('pointermove', (e) => this.updatePointerCoords(e, canvas, groundPlane));
    // this.canvas.addEventListener('click', (e) => this.getObjOnClick(e));
    
  };
  

  updatePointerCoords = (
    event : MouseEvent,
    canvas : HTMLCanvasElement,
    groundPlane : THREE.Plane,
    // camera :  THREE.PerspectiveCamera | THREE.OrthographicCamera,
  ) => 
  { 

    const mouseLoc =  this.getMouseLocation(event, groundPlane, this.camera)
    this.pointerCoords.x = mouseLoc.x;
    this.pointerCoords.y = mouseLoc.y;
    this.pointerCoords.z = mouseLoc.z;

    let snapPosition = this.snapManager.snapToGrid(this.pointerCoords, 1)
    this.cube.position.set( snapPosition.x,  snapPosition.y , snapPosition.z)
    console.log('pointerCoords and snapPosition ' , this.pointerCoords, snapPosition)
  }

  getMouseLocation (
    event : MouseEvent,  
    plane: THREE.Plane, 
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
      
      const canvas = document.querySelector('canvas')
      const rect = canvas!.getBoundingClientRect();
      console.log('canvas', canvas)
      const _vec2 = new THREE.Vector2();
      const _vec3 = new THREE.Vector3();

      //raycaster
      const raycaster = new THREE.Raycaster();

      //default trs is 1
      raycaster.params.Line!.threshold = 1;
      raycaster.params.Points!.threshold = 1;
      _vec2.x = (( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1);
      _vec2.y =  -( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
      raycaster.setFromCamera(_vec2, camera);
  
      raycaster.ray.intersectPlane(this.worldPlane, _vec3);
      return _vec3
  }
}