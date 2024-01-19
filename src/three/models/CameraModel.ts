
import { makeAutoObservable } from 'mobx';

export class CameraModel {
  plane: String;
  constructor() {
    this.plane = '';
    
    makeAutoObservable(this);
  }

  setPlane = (plane : String) => {
    this.plane = plane
  };

 
}

export const cameraModel = new CameraModel();
