export enum ToolsId {
  LINE = 'line',
  AXES = 'axes',
}

export type ToolsTitle =
  | 'Line'

export interface Tool {
  // id: ToolsId;
  // title: ToolsTitle;
  // isActive: boolean;
  start: (type: String) => void;
  dispose: () => void;
  type: String;

}

export const styles = {
  Beam: {
    color: '#FF0000', // Red for lines
    lineWidth: 2,
    dashSize: 10,
    gapSize: 5,
  },
  Axis: {
    color: '#000000', // Black for axes
    lineWidth: 0.003,
    dashSize: 0.05, 
    gapSize: 0.05 
  },

};