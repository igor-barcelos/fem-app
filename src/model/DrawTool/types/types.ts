export enum ToolsId {
  LINE = 'line',
  AXES = 'axes',
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

export const styles = {
  [ToolsId.LINE]: {
    color: '#FF0000', // Red for lines
    lineWidth: 2,
    dashSize: 10,
    gapSize: 5,
  },
  [ToolsId.PLINE]: {
    color: '#00FF00', // Green for polylines
    lineWidth: 1.5,
    dashSize: 10,
    gapSize: 5,
  },
  [ToolsId.POLYGON]: {
    color: '#0000FF', // Blue for polygons
    lineWidth: 1,
    dashSize: 10,
    gapSize: 5,
  },
  [ToolsId.SELECTOR]: {
    color: '#FFA500', // Orange for selection
    lineWidth: 0.5,
    dashSize: 10,
    gapSize: 5,
  },
  [ToolsId.EDITOR]: {
    color: '#800080', // Purple for editor
    lineWidth: 2,
    dashSize: 10,
    gapSize: 5,
  },
  [ToolsId.INSPECTOR]: {
    color: '#00FFFF', // Cyan for inspector
    lineWidth: 1,
    dashSize: 10,
    gapSize: 5,
  },
  [ToolsId.CLEANER]: {
    color: '#808080', // Gray for cleaner
    lineWidth: 1,
    dashSize: 10,
    gapSize: 5,
  },
  [ToolsId.AXES]: {
    color: '#000000', // Black for axes
    lineWidth: 0.003,
    dashSize: 0.05, 
    gapSize: 0.05 
  },
};