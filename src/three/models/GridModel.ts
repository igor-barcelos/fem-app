
import { makeAutoObservable } from 'mobx';

export class GridModel {
  plane: String;
  constructor() {
    this.plane = '';
    
    makeAutoObservable(this);
  }

  setPlane = (plane : String) => {
    this.plane = plane
  };

 
}

export const gridModel = new GridModel();
