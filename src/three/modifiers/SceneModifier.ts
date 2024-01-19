// import { cube, worldPlaneHelper, worldPlaneMesh } from 'three/presets';
// import { SceneObjsWatcher } from './SceneObjsWatcher';
import * as THREE from 'three';
import { getRectangularMesh } from '../utils/Geometry/rectangle';
export class SceneModifier {
  scene: THREE.Scene;
  // objWatcher: SceneObjsWatcher;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    // this.objWatcher = new SceneObjsWatcher();
  }

  addObj = (object: THREE.Object3D) => {
    this.scene.add(object);
  };

  addObjs = (...objects: Array<THREE.Object3D>) => {
    this.scene.add(...objects);
  };

  addNode = (node: THREE.Vector3) => {
    const nodeObj = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    nodeObj.position.copy(node);
    this.scene.add(nodeObj);

    return nodeObj
  };
  

  //TODO join with addObj
  addUtilObjs = (objs: Array<THREE.Object3D>) => {
    this.scene.add(...objs);
  };

  removeObj = (object: THREE.Object3D) => {
    // this.objWatcher.onObjRemoved(object);
    this.scene.remove(object);
  };

  removeObjs = (...objects: Array<THREE.Object3D>) => {
    // this.objWatcher.onObjRemoved(object);
    this.scene.remove(...objects);
  };

  addMesh = (points : THREE.TypedArray) => {
    // this should be in the controller, only receive mesh here
    console.log("add mesh")
    const geometry = new THREE.BufferGeometry();
    const meshData = getRectangularMesh(points)

    
    geometry.setAttribute('position', new THREE.BufferAttribute(meshData.vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(meshData.indices, 1));
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    };
}
