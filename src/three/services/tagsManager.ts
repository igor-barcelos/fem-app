import { SceneModifier } from "../modifiers/SceneModifier";
import * as THREE from 'three';
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { getLineMeanPoint } from "../utils/Geometry/line";
import { getLineLength } from "../utils/Geometry/line";
export class TagsManager {
  sceneModifier : SceneModifier
  line : THREE.Line
  lineTagContainer : HTMLDivElement
  lineTagObj : CSS2DObject
  constructor(sceneModifer : SceneModifier) 
	{
    this.line = new THREE.Line()
    this.sceneModifier = sceneModifer
    this.lineTagContainer = document.createElement('div');
    this.lineTagObj = new CSS2DObject(this.lineTagContainer)
  }

  init = (
    line : THREE.Line
    ) => {
    this.line = line
  };

  initContainers(){
    const p = document.createElement('p')
    p.textContent = ''
    this.lineTagContainer.appendChild(p)
    this.sceneModifier.addObj(this.lineTagObj)
  }

  updLineLengthTag()
  {
    this.removeLineLengthTag()
    const lineLength = getLineLength(this.line).toFixed(2)
    this.lineTagContainer.getElementsByTagName('p')[0].textContent = lineLength;
    const updatedLineTagObj = new CSS2DObject(this.lineTagContainer)
    this.sceneModifier.addObj(updatedLineTagObj)
    const meanPoint = getLineMeanPoint(this.line)
    updatedLineTagObj.position.set(meanPoint.x , meanPoint.y ,meanPoint.z)
    this.lineTagObj = updatedLineTagObj
		
  }

  removeLineLengthTag()
  {
    this.sceneModifier.removeObj(this.lineTagObj)
  }
  

}


