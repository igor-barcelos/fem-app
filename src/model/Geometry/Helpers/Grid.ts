import Model from "../../Model"
import * as THREE from "three"
class Grid {
  model: Model
  enabled: boolean

  set setupEvent(enabled: boolean) {
    if (enabled) {
      this.setGrid()
    }
  }
  constructor(model: Model){
    this.model = model
    this.enabled = true
  }

  setGrid = () => {
    const size = 50;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper( size, divisions, new THREE.Color(0x424242) );
    this.model.scene.add( gridHelper );
  }
  
}

export default Grid