
import { _vec3, _vec2, raycaster } from './common';
import { useDispatch, useSelector } from 'react-redux';
import * as THREE from 'three';

function getMouseLocation (
  event : MouseEvent,  
  canvas : HTMLCanvasElement, 
  plane: THREE.Plane, 
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
    
    const rect = canvas.getBoundingClientRect();
    _vec2.x = (( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1);
    _vec2.y =  -( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
    raycaster.setFromCamera(_vec2, camera);

    raycaster.ray.intersectPlane(plane, _vec3);
    return _vec3
}

function getObjByPointer(
  scene: THREE.Scene,
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
): THREE.Object3D | void {
  event.preventDefault();
 const rect = canvas.getBoundingClientRect();
 const raycaster = new THREE.Raycaster()
 raycaster.params = {
  // Mesh: { threshold: 1 },
  Line: { threshold: 0.1 },
  // LOD: {},
  // Points: { threshold: 1 },
  // Sprite: { threshold: 1 },
  // Line2: { threshold: 25 },
};
  
  _vec2.x =  (( ( event.clientX - rect.left ) / ( rect.width ) ) * 2 - 1);
  _vec2.y = -( ( event.clientY - rect.top ) / ( rect.height) ) * 2 + 1;

  raycaster.setFromCamera(_vec2, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  // let objectInstance: THREE.Line | THREE.Mesh | void;

  if (intersects.length > 0) {
    const object = intersects[0].object;
    // objectInstance = findObjectInstance(object)    
    return object;
  }
  return; 

}

function findObjectInstance(object: THREE.Object3D): THREE.Line | THREE.Mesh | void {
  let foundedObjectInstance: THREE.Line | THREE.Mesh | void = undefined;
  object.traverse((child) => {
    if (child instanceof THREE.Line || child instanceof THREE.Mesh) {
      foundedObjectInstance = child;
      console.log("foundedinstance", foundedObjectInstance);
    }
  });

  return foundedObjectInstance;
}

export {getMouseLocation, getObjByPointer}