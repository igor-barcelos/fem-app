
export enum ToolsId {
  LINE = 'line',
  PLINE = 'pLine',
  POLYGON = 'polygon',
  SELECTOR = 'selector',
  EDITOR = 'editor',
  INSPECTOR = 'inspector',
  CLEANER = 'cleaner',
}

export type ToolsTitle =
  | 'Line'

export interface Tool {
  id: ToolsId;
  title: ToolsTitle;
  isActive: boolean;

}

export const DefTools: Array<Tool> = [
  {
    id: ToolsId.LINE,
    title: 'Line',
    isActive: false,
 
  },

];

