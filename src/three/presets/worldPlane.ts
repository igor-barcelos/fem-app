import * as THREE from 'three';
import { Plane } from 'three';

//base world plane
const worldPlaneGeometry = new THREE.PlaneGeometry(50, 50, 8, 8);
const worldPlaneMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  color: '#F0EFEE', 
});



const worldPlaneMesh = new THREE.Mesh(worldPlaneGeometry, worldPlaneMaterial);
worldPlaneMesh.rotateX(-Math.PI / 2);
worldPlaneMesh.receiveShadow = true;
worldPlaneMesh.name = 'ground';
//lower ground mesh to avoid clipping wt lines (sen on top ortho view)
worldPlaneMesh.position.y = -0.0015;

const worldPlaneLevel = 0;
const worldPlane = new Plane(new THREE.Vector3(0, 0, 1), worldPlaneLevel);
const worldPlaneHelper = new THREE.PlaneHelper(worldPlane, 1, 0xffff00);

export { worldPlaneMesh, worldPlane, worldPlaneHelper };
