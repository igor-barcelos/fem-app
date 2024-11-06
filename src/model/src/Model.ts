import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { effect } from '@preact/signals-react';
import { SnapManager } from "./SnapManager";
// import { loadIfcSignal } from "./Geometry/IFC/signals";
import IFCFileHandler from "./Geometry/IFC/IFCFileHandler";
import Selector from "./Geometry/Helpers/Selector";
import { useAppContext } from "../../App";
import { State } from "../../App";

import ViewCube from "../../helpers/ViewCube/ViewCube";

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
  private ifcFileHandler : IFCFileHandler
  worldPlane : THREE.Plane;
  snapManager : SnapManager
  cube :  THREE.Mesh
  selector : Selector
  state : State
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

  constructor(state : State) {
    this.update()
    this.init()
    this.state = state
    this.setupEvent = true;
    this.pointerCoords =  new THREE.Vector3(0,0,0,)
    this.worldPlane =  new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.snapManager = new SnapManager(this.scene)
    this.selector = new Selector(this); 
    this.ifcFileHandler = new IFCFileHandler(this)
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc3c3c3,
      wireframe: false,
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.addCube()
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
    this.addLight()
    // this.setCubeWithColorMap()
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
  }
  public addCube = () => {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial( { color: 'black'} );

    const cube = new THREE.Mesh(geometry, material);
    this.scene.add( cube );
    cube.position.set( 1, 1, 1 );

    const material2 = new THREE.MeshBasicMaterial( { color: 'red'} );
    const cube2 = new THREE.Mesh(geometry, material2);
    this.scene.add( cube2 );
    cube2.position.set( 2, 2, 2 );
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

    const mouseLoc =  this.getMouseLocation(event, this.worldPlane, this.camera)
    this.pointerCoords.x = mouseLoc.x;
    this.pointerCoords.y = mouseLoc.y;
    this.pointerCoords.z = mouseLoc.z;

    // console.log('pointerCoords', this.pointerCoords)
    // let snapPosition = this.snapManager.snapToGrid(this.pointerCoords, 1)
    // this.cube.position.set( snapPosition.x,  snapPosition.y , snapPosition.z)
    // console.log('pointerCoords and snapPosition ' , this.pointerCoords, snapPosition)
  }

  getMouseLocation (
    event : MouseEvent,  
    plane: THREE.Plane, 
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
      
      const canvas = document.querySelector('canvas')
      const rect = canvas!.getBoundingClientRect();
      const _vec2 = new THREE.Vector2();
      const _vec3 = new THREE.Vector3();

      //raycaster
      // const raycaster = new THREE.Raycaster();

      //default trs is 1
      // raycaster.params.Line!.threshold = 1;
      // raycaster.params.Points!.threshold = 1;
      _vec2.x = (( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1);
      _vec2.y =  -( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
      // raycaster.setFromCamera(_vec2, camera);
  
      // raycaster.ray.intersectPlane(this.worldPlane, _vec3);
      return _vec2
  }

  setCubeWithColorMap()
  {

    // http://zhangwenli.com/blog/2015/06/12/drawing-heatmap-with-html-canvas/
    function getRainbowColor(value : any) {
    // This function maps a value from 0 to 1 to a rainbow color
    const i = (value * 0.85) % 1;
    const rgb = [Math.abs(6 * i - 3) - 1, 2 - Math.abs(6 * i - 2), 2 - Math.abs(6 * i - 4)];
    return `rgb(${Math.round(255 * rgb[0])}, ${Math.round(255 * rgb[1])}, ${Math.round(255 * rgb[2])})`;
    }

    function interpolateColor(lowColor : any , highColor : any, factor  : any) {
      const result = lowColor.slice();
      for (let i = 0; i < 3; i++) {
          result[i] = Math.round(result[i] + factor * (highColor[i] - result[i]));
      }
      return result;
    }

    function pressureToColor(pressure : any, minPressure : any, maxPressure : any) {
        // Normalize the pressure value to a 0-1 range
        const normalizedPressure = (pressure - minPressure) / (maxPressure - minPressure);

        // Define the blue and red colors
        const lowColor = [0, 0, 255];  // RGB for blue
        const highColor = [255, 0, 0]; // RGB for red

        // Interpolate between blue and red based on the normalized pressure
        const color = interpolateColor(lowColor, highColor, normalizedPressure);

        // Convert the color to a CSS-friendly format
        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        // return `rgb(255, 0, 0)`;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 256; 
    canvas.height = 10;
    const pressures =  [
      0, 1.95, 3.8, 5.55, 7.2, 8.75, 10.2, 11.55, 12.8, 13.95,
      15, 15.95, 16.8, 17.55, 18.2, 18.75, 19.2, 19.55, 19.8, 19.95,
      20, 19.95, 19.8, 19.55, 19.2, 18.75, 18.2, 17.55, 16.8, 15.95,
      15, 13.95, 12.8, 11.55, 10.2, 8.75, 7.2, 5.55, 3.8, 1.95,
      0
    ];
    const minPressure = Math.min(...pressures);
    const maxPressure = Math.max(...pressures);

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // for (let x = 0; x < width; x++) {
    //     const value = x / width;
    //     ctx!.fillStyle = getRainbowColor(value);
    //     ctx!.fillRect(x, 0, 1, height);
    // }
    const gradientWidth = width / pressures.length;
    pressures.forEach((pressure, i) => {
        const color = pressureToColor(pressure, minPressure, maxPressure);
        ctx!.fillStyle = color;
        ctx!.fillRect(i * gradientWidth, 0, gradientWidth, height);
    });
    var texture1 = new THREE.CanvasTexture(canvas) 

    const material = new THREE.MeshBasicMaterial({
      color: 0xc3c3c3,
      wireframe: false,
      map: texture1
    });

    const geometry = new THREE.BoxGeometry(4, 0.3, 0.3);
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add( cube );
  }
}

export default Model