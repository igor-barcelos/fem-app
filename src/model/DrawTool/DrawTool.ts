import { Model } from '../Model';
import { Line } from './Line';

export default class DrawTool{
  enabled = true;
  toolState: number;
  model : Model
  constructor(model : Model) { 
    this.model = model
    this.toolState = 1; //state from 0 to 3
    this.setupEvents(true)
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape"){
      console.log('turnning off draw tool')
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
  start() {
    this.toolState = 1;
    const line = new Line(this.model)
    line.start()
  }
  
  protected _resetLoop() {
    this.toolState = 1;

  }

  stop() {
    this.toolState = 0
  }
}

