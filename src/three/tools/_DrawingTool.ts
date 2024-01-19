import * as THREE from 'three';
import { SceneModifier } from '../modifiers/SceneModifier';
import { _ObjManager } from '../services/objManager';
import { ToolsController } from '../controllers/ToolsController';
import { SceneController } from '../controllers/SceneController';
// import { ILayer } from 'shared/types/layers';
// import type { InstrumentsHelpersModel } from 'three/shared';

// import { SnapManager, TagsManager } from './managers';
// import { ObjManagerFactory, _ObjManagerFX, _ObjManagerMain } from 'three/services';

//SUPERCLASS FOR DRAWING TOOLS
export class _DrawingTool {
  toolState: number;
  canvas: HTMLCanvasElement;
  rect: DOMRect;
  currentCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null;
  currentPlane: THREE.Plane | null;
  currentPointerCoord: THREE.Vector3;
  objCoords: Array<number>;
  objManager: _ObjManager;

  constructor(canvas: HTMLCanvasElement, sceneController : SceneController, sceneModifier: SceneModifier, ) {
    this.canvas = canvas;
    this.rect = canvas.getBoundingClientRect();
    this.toolState = 0; //state from 0 to 3
    this.currentCamera = null;
    this.currentPlane = null;
    this.currentPointerCoord = new THREE.Vector3();
    this.objCoords = [];
    this.objManager = new _ObjManager(sceneModifier, sceneController)

  }

  //START METHOD
  start(camera: typeof this.currentCamera, plane: typeof this.currentPlane,) {
    this.toolState = 1;
    this.currentCamera = camera;
    this.currentPlane = plane;
  }


  protected _resetLoop(isDisgraceful?: boolean) {
    this.toolState = 1;

  }

  //STOP METHOD
  stop() {
    this.toolState = 0;

  }
}
