
import { Tool, ToolsId } from '../../shared/types/tools';
import { SceneModifier } from '../modifiers/SceneModifier';
import { SceneController } from './SceneController';
import { ToolsModel } from '../models/ToolsModel';
import { LineTool } from '../tools/Line';
import { autorun, reaction, toJS } from 'mobx';
export class ToolsController {
  
  tools: {
    [K in ToolsId]?: LineTool ;
  };
  // cleaner: Cleaner;
  currentToolId: ToolsId | undefined;

  currentCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  currentPlane: THREE.Plane;
  toolsModel: ToolsModel;

  constructor(
    activeElement: HTMLCanvasElement,
    sceneController : SceneController,
    sceneModifier: SceneModifier,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    plane: THREE.Plane,
    toolsModel: ToolsModel,
  ) 
  {
    
    this.toolsModel = toolsModel;
    this.currentToolId = undefined;
    this.currentCamera = camera;
    this.currentPlane = plane;

    this.tools = {
      line: new LineTool(activeElement, 0, this.currentPlane, sceneController , sceneModifier, this.currentCamera),
    
    };

    this._storeSubscribe()

  }

  startToolCont = (
    tool: Tool,
    // currentLayer: ILayer,
    groundPlane: THREE.Plane,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  ) => {
    this.tools[tool.id]?.start(camera, groundPlane);

    // document.body.style.cursor = instr.activeCursor;
    window.addEventListener('keydown', this.onExit);
  };

  private _storeSubscribe = () => {
    //for cont instruments: draw, select
    reaction(
      () => this.toolsModel.tools.find((i) => i.isActive),
      (curActive : any) => {
        // if (prevActive) this.stopInstrCont(prevActive.id);
        if (curActive) {
          this.startToolCont(curActive,  this.currentPlane, this.currentCamera);
        }
      }
    );
  }

  onExit = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      const activeTool = this.toolsModel.tools.find(
        (i) => i.isActive 
      );
      if (activeTool) {
        this.toolsModel.toggleToolActive(activeTool.id);
        window.removeEventListener('keydown', this.onExit);
      }
    }
  };



}
