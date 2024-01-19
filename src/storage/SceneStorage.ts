import { makeAutoObservable } from 'mobx';
import * as THREE from 'three';
import { toJS } from 'mobx';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const nodeColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID',   flex: 1,},
  { field: 'x', headerName: 'x',     flex: 1, },
  { field: 'y', headerName: 'y',     flex: 1, },

];

export type NodeDataTable = {
  columns : GridColDef[]
  rows : Array<Object>
}

export class SceneStorage {
  nodeDataTable : NodeDataTable
  constructor() {
    this.nodeDataTable = { columns: nodeColumns, rows: [] };
    makeAutoObservable(this);
  }


  addNode = (node: THREE.Object3D) => 
  {
    const nodePosition = node.position
    this.nodeDataTable.rows.push
    (
    {
      id : node.uuid, 
      x : nodePosition.x, 
      y : nodePosition.y,
    }
    )
  };
  
  
}

export const sceneStorage = new SceneStorage()
