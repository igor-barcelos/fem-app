import { Model } from "../../Model";
import * as THREE from 'three'
import Node from "../Node/Node";
// import { v4 as uuidv4 } from 'uuid';

class Beam {
  model: Model
  id: number
  nodes: Node[]
  label: string
  index: number
  mesh: THREE.Mesh
  constructor(model: Model, label: string, nodes: Node[]){
    this.model = model
    this.id = (Date.now() % 0x80000000)
    this.nodes = nodes
    this.label = label
    this.index = 0
    this.init()
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshStandardMaterial({ color: 0x888888 }))
  }

  init = () => {
    const lastBeam = this.model.beams[this.model.beams.length - 1]
    if(lastBeam) {
      this.index = lastBeam.index + 1
      this.label = `Beam ${this.index}`
    }
    else {
      this.index = 1
      this.label = `Beam ${this.index}`
    }
  }

  startDrawMode = () => {
    this.model.drawTool.start('Beam')
  }

  create = () => {
    
    const start =  new THREE.Vector3(this.nodes[0].x, this.nodes[0].y, this.nodes[0].z)
    const end = new THREE.Vector3(this.nodes[1].x, this.nodes[1].y, this.nodes[1].z)

    console.log('START', start)
    console.log('END', end)

    // Compute direction and length
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();

    // Create beam geometry along X-axis, centered at origin
    const width  = 0.2;
    const height = 0.3;
    const geometry = new THREE.BoxGeometry(length, height, width);

    // Create material and mesh
    const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.model.scene.add(this.mesh);

    // Compute midpoint
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    // Normalize direction for orientation
    direction.normalize();

    // Align beam’s +X axis with the direction vector
    const xAxis = new THREE.Vector3(1, 0, 0);
    this.mesh.quaternion.setFromUnitVectors(xAxis, direction);

    // Position the beam at the midpoint
    this.mesh.position.copy(midpoint);
    const uuid = this.mesh.uuid
    this.mesh.layers.set(this.model.layer)
    // console.log('mesh', mesh)
  }

} 

export default Beam