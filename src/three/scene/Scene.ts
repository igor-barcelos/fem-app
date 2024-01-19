
import * as THREE from 'three';
import { SceneModel } from '../models/SceneModel';
import { ToolsModel } from '../models/ToolsModel';
import { SceneStorage } from '../../storage/SceneStorage';
import { _DrawingTool } from '../tools/_DrawingTool';
import {
  SceneController,
  LabelRendererController,
  ToolsController, 
  CameraController,
  GridController,
  GroundController,
} from '../controllers'
import { 
  dirLight, 
  dirLightHelper, 
  hemiLight, 
  worldPlaneMesh, 
  worldPlaneHelper, 
  worldPlane } from '../presets';
import { CameraModel, GridModel, GroundModel } from '../models';

export class Scene  {

    scene: THREE.Scene;
    sceneController : SceneController
    toolsController : ToolsController
    labelRendererController: LabelRendererController
    cameraController : CameraController
    gridController : GridController
    groundController : GroundController
    canvas : HTMLCanvasElement
    camera : THREE.PerspectiveCamera
    renderer : THREE.WebGLRenderer
    clock : THREE.Clock
    //cameraControls :OrbitControls
    groundPlane : THREE.Plane
    storatage : SceneStorage
    drawingTools : _DrawingTool

    constructor(
      sceneModel : SceneModel,
      toolsModel : ToolsModel,
      storage : SceneStorage,
      gridModel : GridModel,
      cameraModel : CameraModel,
      groundModel : GroundModel,
    ) {
      this.scene = new THREE.Scene();
      this.storatage = storage
      this.canvas =  document.getElementById('three-canvas') as HTMLCanvasElement;
      this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight);
      this.sceneController = new SceneController(this.scene, this.camera)
      this.cameraController = new CameraController(cameraModel)
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
      this.clock = new THREE.Clock();
      this.groundPlane = worldPlane

      this.labelRendererController = new LabelRendererController(this.canvas);
      this.toolsController = new ToolsController(
        this.canvas,
        this.sceneController,
        this.sceneController.sceneModifier,
        this.camera,
        this.groundPlane,
        toolsModel
      )

      this.drawingTools = new _DrawingTool(
        this.canvas,
        this.sceneController,
        this.sceneController.sceneModifier,
      )

      this.gridController = new GridController(
        this.sceneController.sceneModifier,
        gridModel
      )

      this.groundController = new GroundController(
        this.sceneController.sceneModifier,
        groundModel
      )

      this.scene.add(dirLight, dirLightHelper, hemiLight);
    }
    
    initialize()
    {
    
    const sizes = {width: 800, height: 600,}
    this.scene.background = new THREE.Color(0xb3deff);
    const axes = new THREE.AxesHelper();
    this.scene.add(axes);
    axes.renderOrder = 1;

    this.scene.add(axes);
    const pixelRat = Math.min(window.devicePixelRatio,2);
    this.renderer.setPixelRatio(pixelRat)
    this.renderer.setSize(sizes.width, sizes.height, false);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setClearColor(0xD5F3FE, 1);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    
    //this.cameraControls.enableRotate = false;
    window.addEventListener('resize', () => this.onWindowResize());

    this.sceneController.startPointerCoordsUpd(this.canvas,this.groundPlane,this.camera)
    this.cameraController.init(this.camera)
    this.gridController.init()
    this.groundController.init()
    // this.scene.add(worldPlaneMesh)
    // this.scene.add(worldPlaneHelper)
  }

  update() 
  {
    this.labelRendererController.renderer.render(this.scene, this.camera);
    // this.cameraControls.update();
    this.cameraController.cameraControls.update()
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.update.bind(this));

  }
  
  onWindowResize(){
    const vpW: number = this.canvas.clientWidth
    const vpH: number = this.canvas.clientHeight
    const aspect = vpW / vpH;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    this.labelRendererController.renderer.setSize(vpW, vpH);
  }
}
  
