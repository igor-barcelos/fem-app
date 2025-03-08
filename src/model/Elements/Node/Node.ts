import Model from "../../Model"
import * as THREE from "three"
class Node {
  model: Model
  id: number
  // coordinates: THREE.Vector3
  label: string
  index: number
  x: number
  y: number
  z: number
  constructor(model: Model, coordinates: THREE.Vector3){
    this.model = model
    this.id = (Date.now() % 0x80000000)
    // this.coordinates = coordinates
    this.label = ''
    this.index = 0
    this.x = coordinates.x
    this.y = coordinates.y
    this.z = coordinates.z
    this.init()
  }

  init = () => {
    const lastNode = this.model.nodes[this.model.nodes.length - 1]
    if(lastNode) {
      this.index = lastNode.index + 1
      this.label = `N${this.index}`
    }
    else {
      this.index = 1
      this.label = `N1`
    }
  }
}

export default Node