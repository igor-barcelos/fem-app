import { worldPlaneMesh } from "../presets";
import { SceneModifier } from "../modifiers/SceneModifier";
import { GroundModel } from "../models";
import {reaction} from 'mobx';
export class GroundController {
  ground : THREE.Mesh
  sceneModifier : SceneModifier
  groundModel : GroundModel
  constructor( sceneModifier : SceneModifier , groundModel : GroundModel ) {
    this.ground = worldPlaneMesh
    this.sceneModifier = sceneModifier
    this.groundModel = groundModel
    this._storeSubscribe()
  }

  init = ( 
  ) =>  {
    this.sceneModifier.addObj(this.ground)
    console.log('ground',this.ground)
  }

  rotate = (
    plane : String
  ) => {

    switch (plane) {
      case 'XY':
        this.ground.rotation.x =  0  ;  
        this.ground.rotation.y =  0;
        this.ground.rotation.z =  0;
        
        this.ground.position.x = 0;
        this.ground.position.y = 0;
        this.ground.position.z = -0.01;

        console.log('ground',this.ground)
        break;
      case 'XZ':
        this.ground.rotation.x =  - Math.PI / 2;
        this.ground.rotation.y =  0;
        this.ground.rotation.z =  0;

        this.ground.position.x = 0;
        this.ground.position.y = -0.015;
        this.ground.position.z = 0
        break;
      case 'YZ':
        this.ground.rotation.x =  0;
        this.ground.rotation.y =  Math.PI / 2  ;
        this.ground.rotation.z =  0;

        this.ground.position.x = -0.015;
        this.ground.position.y = 0;
        this.ground.position.z = 0
        break;  
      case '3D':
        this.ground.rotation.x =  - Math.PI / 2 ;
        this.ground.rotation.y =  0;
        this.ground.rotation.z =  0;

        this.ground.position.x = 0;
        this.ground.position.y = -0.015;
        this.ground.position.z = 0
        
        break;  
      default:
        break;
    }
  }

  private _storeSubscribe = () => {
    reaction(
      () => this.groundModel.plane,
      (plane : String) => {
        this.rotate(plane)
      }
    );
  }

}