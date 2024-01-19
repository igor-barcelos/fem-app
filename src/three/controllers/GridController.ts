
import * as THREE from 'three';
import { SceneModifier } from "../modifiers/SceneModifier";
import {reaction} from 'mobx';
import { GridModel } from "../models";
export class GridController {
  grid : THREE.GridHelper
  sceneModifier : SceneModifier
  gridModel : GridModel
  constructor( sceneModifier : SceneModifier , gridModel : GridModel) {
    this.grid = new THREE.GridHelper(50, 50, 0x4aa8ff, 0xc3c3c3);
    this.sceneModifier = sceneModifier
    this.gridModel = gridModel
    this._storeSubscribe()
  }

  init = ( 
  ) =>  {
    this.grid.renderOrder = 1;
    this.grid.position.y = 0;
    this.grid.position.x = 0;
    this.grid.position.z = -0.01;
    this.sceneModifier.addObj(this.grid)
  }

  rotate = (
    plane : String
  ) => {

    switch (plane) {
      case 'XY':
        this.grid.rotation.x =  Math.PI / 2;
        this.grid.rotation.y =  0;
        this.grid.rotation.z =  0;
        break;
      case 'XZ':
        this.grid.rotation.x =  0;
        this.grid.rotation.y =  0;
        this.grid.rotation.z =  0;
        break;
      case 'YZ':
        this.grid.rotation.x =  0;
        this.grid.rotation.y =  0;
        this.grid.rotation.z =  Math.PI / 2;
        break;  
      case '3D':
        this.grid.rotation.x =  0;
        this.grid.rotation.y =  0;
        this.grid.rotation.z =  0;
        break;  
      default:
        break;
    }
  }

  private _storeSubscribe = () => {
    reaction(
      () => this.gridModel.plane,
      (plane : String) => {
        this.rotate(plane)
      }
    );
  }

}