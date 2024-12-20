import { Model } from "../../Model";
import * as THREE from 'three'
class Beam {
  model: Model
  constructor(model: Model){
    this.model = model
  }

  startDrawMode = () => {
    this.model.drawTool.start('Beam')
  }

  create = (points: Float32Array) => {
    const start = new THREE.Vector3(points[0], points[1], points[2])
    const end = new THREE.Vector3(points[3], points[4], points[5])

    // Compute direction and length
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();

    // Create beam geometry along X-axis, centered at origin
    const width  = 0.2;
    const height = 0.3;
    const geometry = new THREE.BoxGeometry(length, height, width);

    // Create material and mesh
    const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const mesh = new THREE.Mesh(geometry, material);
    this.model.scene.add(mesh);

    // Compute midpoint
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    // Normalize direction for orientation
    direction.normalize();

    // Align beam’s +X axis with the direction vector
    const xAxis = new THREE.Vector3(1, 0, 0);
    mesh.quaternion.setFromUnitVectors(xAxis, direction);

    // Position the beam at the midpoint
    mesh.position.copy(midpoint);
    const uuid = mesh.uuid

    // console.log('mesh', mesh)
  }

} 

export default Beam