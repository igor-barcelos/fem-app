import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Model from '../Model';

export class Camera {
  cam: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  frustumSize: number;
  viewMode : '2d' | '3d'
  orthoCam: THREE.OrthographicCamera;
  perspectiveCam: THREE.PerspectiveCamera;  
  model: Model
  constructor(model: Model) {
    this.model = model
    this.renderer = model.renderer
    // this.cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.viewMode = '2d'
    this.frustumSize = 50
    const aspect = window.innerWidth / window.innerHeight;
    this.orthoCam = new THREE.OrthographicCamera( this.frustumSize * aspect / - 2, this.frustumSize * aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 0.1, 100 );
    this.perspectiveCam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.cam = this.orthoCam;
    this.cam.position.set(0, 10, 0);
    this.controls = new OrbitControls(this.cam, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableRotate = false;
  }


  handleResize() {
    const aspect = window.innerWidth / window.innerHeight;
    
    if(this.cam instanceof THREE.OrthographicCamera) {
      this.cam.left = - this.frustumSize * aspect / 2;
      this.cam.right = this.frustumSize * aspect / 2;
      this.cam.top = this.frustumSize / 2;
      this.cam.bottom = - this.frustumSize / 2;
    }
    else{
      this.cam.aspect = window.innerWidth / window.innerHeight
    }
    this.cam.updateProjectionMatrix();
  }

  handle3dView(){
    this.viewMode = '3d'
    this.model.snapper.disable()
    this.cam = this.perspectiveCam;
    this.controls.dispose();
    this.controls = new OrbitControls(this.cam, this.renderer.domElement);
    this.cam.position.set(20, 30, 20);
    this.controls.enableDamping = true;
    this.controls.enableRotate = true;
    this.cam.layers.enableAll()
  }
  handle2dView(){
    this.viewMode = '2d'
    this.model.snapper.enable()
    this.cam = this.orthoCam
    this.cam.position.set(0, 10, 0)
    this.controls.dispose()
    this.controls = new OrbitControls(this.cam, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableRotate = false;
  }
}
