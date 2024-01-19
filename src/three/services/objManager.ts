import { SceneModifier } from "../modifiers/SceneModifier";
import * as THREE from 'three';
import { DefMaterials } from "../../shared/materials/materials";
import { sceneStorage } from "../../storage/SceneStorage";
import { SceneController } from "../controllers/SceneController";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { TagsManager } from "./tagsManager";
import { getLineMeanPoint } from "../utils/Geometry/line";
import { getLineLength } from "../utils/Geometry/line";
import { getLineRotation } from "../utils/Geometry/line";
export class _ObjManager {

  sceneModifier: SceneModifier;
  currentTempLine : THREE.Line;
  sceneController : SceneController;
  tagsManager : TagsManager
  constructor(modifier: SceneModifier, controller : SceneController) 
	{
    this.sceneModifier = modifier;
    this.sceneController = controller;
    this.currentTempLine = new THREE.Line()
    this.tagsManager = new TagsManager(
      this.sceneModifier);
  }

	initTempLine = (points: Array<THREE.Vector3>) => {
		

		const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const materialProps = DefMaterials.find(material => material.id === "TEMPLINE")?.properties;
    const material = new THREE.LineDashedMaterial(materialProps);
    const line = new THREE.Line( geometry, material)
  	line.computeLineDistances();
		this.sceneModifier.addObj(line)
    this.currentTempLine = line
    this.tagsManager.init(this.currentTempLine)
    this.tagsManager.initContainers()

  };

  updTempLine(pointerCoords: THREE.Vector3)
  {
    const linePoints = this.currentTempLine.geometry.attributes.position.array
    linePoints[3] = pointerCoords.x; // Set the new X-coordinate
    linePoints[4] =  pointerCoords.y; // Set the new Y-coordinate
    this.currentTempLine.geometry.attributes.position.needsUpdate = true;
    this.tagsManager.updLineLengthTag()
    
  }

  removeTempLine()
  {
  
    this.sceneModifier.removeObj(this.currentTempLine)
    this.tagsManager.removeLineLengthTag()
  }

  createLine(toolState : number)
  {
    const points = this.currentTempLine.geometry.attributes.position.array;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const materialProps = DefMaterials.find(material => material.id === "LINE")?.properties;
    const material = new THREE.LineBasicMaterial(materialProps);
    const line = new THREE.Line(geometry, material);
    const lineLength = getLineLength(line)
    const meanPoint = getLineMeanPoint(line)

    const boxGeometry = new THREE.BoxGeometry( 0.5, lineLength, 0.5 ); 
    const boxMaterial = new THREE.MeshStandardMaterial( {  color: 0xc3c3c3, wireframe: false,} ); 
    const cube = new THREE.Mesh( boxGeometry, boxMaterial );
    
    cube.castShadow = true;
    const rotation = getLineRotation(line)

    cube.position.x = meanPoint.x
    cube.position.y = meanPoint.y
    cube.position.z = meanPoint.z

    console.log('rotation', rotation)
    console.log('line', line)
    
    const xAxis = new THREE.Vector3(1, 0, 0)
    const yAxis = new THREE.Vector3(0, 1, 0);
    const zAxis = new THREE.Vector3(0, 0, 1);
   
    this.sceneModifier.addObj(line)
    this.sceneModifier.addObj( cube );
    cube.setRotationFromAxisAngle(zAxis, Math.PI - rotation.y )
    // cube.setRotationFromAxisAngle(zAxis, rotation.y )

    console.log('cube', cube)
    // cube.rotation.x = rotation.x
    // cube.rotation.y = rotation.y
    // cube.rotation.z = rotation.x
    this.sceneController.pickableObjects.push()
    const coorArray = this.currentTempLine.geometry.attributes.position.array

    const firstNode  = new THREE.Vector3(coorArray [0], coorArray [1], coorArray [2],) 
    const secondNode  = new THREE.Vector3(coorArray [3], coorArray [4], coorArray [5],) 
    
    if(toolState === 2 )
    {
      this.createNode(firstNode)
      this.createNode(secondNode)
    }
    else if(toolState === 3) 
    {
      this.createNode(secondNode)
    }
    
    this.removeTempLine()    
  }

  createNode( node: THREE.Vector3) 
  { 
    const newNode = this.sceneModifier.addNode(node)
    sceneStorage.addNode(newNode)

  }


}


