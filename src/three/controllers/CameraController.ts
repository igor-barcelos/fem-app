import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as THREE from 'three';
import {reaction} from 'mobx';
import { CameraModel } from "../models";
export class CameraController {
 camera : THREE.PerspectiveCamera
 canvas : HTMLCanvasElement
 cameraControls : OrbitControls
 cameraModel : CameraModel

  constructor(cameraModel : CameraModel) {
    this.camera = new THREE.PerspectiveCamera()
    this.canvas = document.getElementById('three-canvas') as HTMLCanvasElement;
    this.cameraControls = new OrbitControls(this.camera, this.canvas);
    this.cameraModel = cameraModel
    this._storeSubscribe()
  }

  init = (
    camera : THREE.PerspectiveCamera, 
  ) =>  {
    this.camera = camera;
    this.cameraControls  = new OrbitControls(this.camera, this.canvas);
    this.camera.position.set(10, 20, 10)

  }

  setPlane = (
    plane : String
  ) => {

    switch (plane) {
      case 'XY':
        this.camera.position.set(0,0,30)
        this.disableRotation()
        break;
      case 'XZ':
        this.camera.position.set(0,30,0)
        this.disableRotation()
        break;
      case 'YZ':
        this.camera.position.set(30,0,0)
        this.disableRotation()
      break;
      case '3D':
        this.camera.position.set(30,30,30)
        this.cameraControls.enableRotate = true;
      break;
      default:
        break;
    }
  }

  disableRotation ()  
  {
    this.cameraControls.enableRotate = false;
  }

  private _storeSubscribe = () => {
    reaction(
      () => this.cameraModel.plane,
      (plane : String) => {
        this.setPlane(plane)
      }
    );
  }
}


//export const cameraController = new CameraController()