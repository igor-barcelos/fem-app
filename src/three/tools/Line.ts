
import { SceneModifier } from '../modifiers/SceneModifier';
import { _DrawingTool } from './_DrawingTool';
import { getMouseLocation } from '../utils/utils';
import { ToolsController } from '../controllers/ToolsController';
import { SceneController } from '../controllers/SceneController';

export class LineTool extends _DrawingTool {
  lineMode: number;
  lineSegments: number;
  groundPlane : THREE.Plane;
  camera : THREE.PerspectiveCamera | THREE.OrthographicCamera
  sceneModifier : SceneModifier

  constructor(
    canvas: HTMLCanvasElement,
    drawMode: number,
    plane : THREE.Plane,
    sceneController : SceneController,
    sceneModifier: SceneModifier,
    camera : THREE.PerspectiveCamera | THREE.OrthographicCamera,
  ) 
  {
    super(canvas, sceneController, sceneModifier )
    this.lineMode = drawMode; //0: 2-pt line, 1: polyline
    this.lineSegments = 1;
    this.camera = camera;
    this.groundPlane = plane;
    this.sceneModifier = sceneModifier;
    // this.onExit = onExit
  }


  start = (camera: typeof this.currentCamera, plane: typeof this.currentPlane) => {
    super.start(camera, plane);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('click', this._onDrawClick);
    window.addEventListener('keydown', this._onKey);
  };

  private _onMouseMove = (e: MouseEvent) => {
    const mouseLoc = getMouseLocation(e,this.canvas, this.groundPlane, this.camera);

    if (this.toolState === 1) {
      this.currentPointerCoord = mouseLoc;
    }

    if (this.toolState === 2 ||  this.toolState === 3) {
      this.objManager.updTempLine(this.currentPointerCoord)

    }
  }

  private _onDrawClick = () => {
    //ON FIRST CLICK
    if (this.toolState === 1) {
    const tempLinePoints =  Array(2).fill(this.currentPointerCoord); 
    this.objManager.initTempLine(tempLinePoints)
    this.toolState = 2;
    }
    else if (this.toolState === 2) {
      this.objManager.createLine(this.toolState)
      this.toolState = 1
      const tempLinePoints =  Array(2).fill(this.currentPointerCoord);   
      this.objManager.initTempLine(tempLinePoints)
      this.toolState = 3
    }
    else if(this.toolState === 3)
    {
      this.objManager.createLine(this.toolState)
      const tempLinePoints =  Array(2).fill(this.currentPointerCoord);   
      this.objManager.initTempLine(tempLinePoints)
    }
  };

  
  private _onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      console.log("escape pressed")
      super.stop()
      this.objManager.removeTempLine()
    }
  };
  
}
