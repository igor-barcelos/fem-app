import React, { Component } from 'react'
import { getMouseLocation , getObjByPointer } from '../utils/utils';
import { PointerCoords } from '../../shared/types/scene';
import { SceneModifier } from '../modifiers/SceneModifier';
import * as THREE from 'three';

export class SceneController  {
  private pointerCoords: PointerCoords;  
  canvas : HTMLCanvasElement
  sceneModifier : SceneModifier
  rayCaster : THREE.Raycaster
  scene : THREE.Scene
  camera : THREE.PerspectiveCamera
  selectedObject : THREE.Line
  pickableObjects: Array<THREE.Mesh> 

  constructor(scene : THREE.Scene , camera : THREE.PerspectiveCamera )
  {

    this.scene = scene
    this.camera = camera
    this.canvas = document.getElementById('three-canvas') as HTMLCanvasElement;
    this.sceneModifier = new SceneModifier(scene)
    this.pointerCoords =  { x: 0.0, y: 0.0, z: 0.0 };
    this.rayCaster = new THREE.Raycaster()
    this.selectedObject = new THREE.Line()
    this.pickableObjects = []
    
   
    
  }
  
  startPointerCoordsUpd = (
    canvas : HTMLCanvasElement,
    groundPlane : THREE.Plane,
    camera :  THREE.PerspectiveCamera | THREE.OrthographicCamera,

    ) => {
      
    this.canvas.addEventListener('pointermove', (e) => this.updatePointerCoords(e, canvas, groundPlane, camera));
    this.canvas.addEventListener('click', (e) => this.getObjOnClick(e));
    
  };
  

  updatePointerCoords = (
    event : MouseEvent,
    canvas : HTMLCanvasElement,
    groundPlane : THREE.Plane,
    camera :  THREE.PerspectiveCamera | THREE.OrthographicCamera,
  ) => 
  { 

    const mouseLoc = getMouseLocation(event, canvas, groundPlane, camera)
    this.pointerCoords.x = mouseLoc.x;
    this.pointerCoords.y = mouseLoc.y;
    this.pointerCoords.z = mouseLoc.z;
  }

  getObjOnClick = (
    event : MouseEvent,
  ) => 
  {
    const selectedObj = getObjByPointer(this.scene, event,this.canvas, this.camera)
    if(selectedObj){
      // selectedObj.material.color.set( 0xff0000 );
      console.log("selectedObj", selectedObj)
    }
      
  } 

  
  // highlightObjects = (object: THREE.Line) => {
  //   // Check if the line has a material
  //   if (object.material && object.material.color) {
  //     // Create a new color
  //     const newColor = new THREE.Color("red");
  
  //     // Update the color of the material
  //     object.material.color = newColor;
  //   } else {
  //     console.error("Line does not have a material");
  //   }
  // };

  }

  

