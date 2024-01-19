import { makeAutoObservable, toJS } from 'mobx';
import { PointerCoords } from '../../shared/types/scene';
import { Vector3 } from 'three';

export class SceneModel {
  private _isFetchingPointerCoords: boolean;
  currentPointerCoordsGlobal: PointerCoords;
  readonly baseDirection: Vector3;
  
  constructor() {
    this._isFetchingPointerCoords = true;
    this.currentPointerCoordsGlobal = {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    };

    this.baseDirection = new Vector3(1, 0, 0);

    makeAutoObservable(this);
  }



  setPointerCoords = (coords: PointerCoords) => {
    this.currentPointerCoordsGlobal.x = coords.x;
    this.currentPointerCoordsGlobal.y = coords.y;
    this.currentPointerCoordsGlobal.z = coords.z;
  };


}

export const sceneModel = new SceneModel();
