
import { makeAutoObservable } from 'mobx';
import { GridModel } from "../models";
export class GroundModel {
  plane: String;
  constructor() {
    this.plane = '';
    
    makeAutoObservable(this);
  }

  setPlane = (plane : String) => {
    this.plane = plane
  };
}

export const groundModel = new GroundModel();
