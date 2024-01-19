
import { makeAutoObservable } from 'mobx';
import { Tool, ToolsId } from '../../shared/types/tools';
import { DefTools } from '../../shared/types/tools';

export class ToolsModel {
  tools: Array<Tool>;
  constructor() {
    this.tools = DefTools;
    
    makeAutoObservable(this);
  }

  /*   top lvl instrument */
  get currentInstrument() {
    const activeInstr = this.tools.find((el) => el.isActive);
    // const activeInstr = this.tools.find((el) => el.isActive && el.lvl === 'top');
    if (activeInstr) {
      return activeInstr;
    } else return null;
  }

  toggleToolActive = (toolId: ToolsId) => {
    const tool = this._getTool(toolId);
    if (!tool) return;
    
    tool.isActive = !tool.isActive;
    // console.log("tools", this.tools[0].isActive)
  };

  
  _getTool = (toolId: ToolsId) => {
    const toolData = this.tools.find((el) => {
      return el.id === toolId;
    });
    return toolData ? toolData : null;
  };

  
}

export const toolsModel = new ToolsModel();
