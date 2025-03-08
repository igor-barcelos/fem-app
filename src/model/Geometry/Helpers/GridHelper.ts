import * as THREE from "three"

class GridHelper{
  enabled: boolean
  scene : THREE.Scene
  grid : THREE.GridHelper
  set setupEvent(enabled: boolean) {
    if (enabled) {
      this.scene.add( this.grid );
      this.grid.position.y = -0.005
    } else {
      this.scene.remove( this.grid );
    }
  }


  constructor(scene : THREE.Scene){
    this.enabled = true
    this.grid = new THREE.GridHelper( 50, 50, new THREE.Color(0x424242), new THREE.Color(0xD7D7D7) );
    this.scene = scene
    this.setupEvent = true;
  }

  hide(){
    this.grid.visible = false
  }

  show(){
    this.grid.visible = true
  }
}



export default GridHelper ;