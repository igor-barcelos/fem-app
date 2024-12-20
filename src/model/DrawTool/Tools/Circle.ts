import { Model } from "../../Model";
import * as THREE from 'three'
export class Circle {
  model : Model
  circle : THREE.Mesh
  constructor(model : Model){
    this.model = model
    this.circle = new THREE.Mesh()
  }


  createCircle = () => {
    
  }

  getCircle = () => {
  
  }

}