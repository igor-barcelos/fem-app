
import * as THREE from 'three';
export enum ObjectId {
  LINE = 'line',
  TEMPLINE = 'templine',
}


export interface MaterialProperties {
  color: THREE.Color;
  linewidth?: number;
  scale?: number;
  dashSize?: number;
  gapSize?: number;
  depthTest? : boolean
}

export interface Material {
  id: String;
  properties: MaterialProperties;
}

export const DefMaterials: Array<Material> = [
  {
    id: "TEMPLINE",
    properties: 
    {
    color: new THREE.Color( 0xfa1605 )
    },
   
  },
  {
   id: "LINE",
    properties: 
    {
    color: new THREE.Color( 0x000000 )
    },
  }

];
  
  