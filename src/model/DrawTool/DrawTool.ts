import { Model } from '../Model';
import { Line } from './Tools/Line';
import { Tool } from './types';

export default class DrawTool{
  enabled = true;
  state: number;
  model : Model
  activeTool : Tool | null = null
  constructor(model : Model) { 
    this.model = model
    this.state = 0; //state from 0 to 3
    this.setupEvents(true)
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape"){
      console.log('turnning off draw tool')
      this.stop()
    }
  };

  private setupEvents(active: boolean) {
		if(active) {
			window.addEventListener("keydown", this.onKeyDown);
		} else {
			window.removeEventListener("keydown", this.onKeyDown);
		}
	}

    //START METHOD
  start(type: String) {
    this.state = 1;
    const line = new Line(this.model)
    this.activeTool = line
    this.activeTool.start(type)
  }
  
  protected _resetLoop() {
    this.state = 1;

  }

  stop() {
    this.state = 0
    this.activeTool?.dispose()
  }
}

