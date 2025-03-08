import * as THREE from 'three'

class Light {
  scene : THREE.Scene
  enabled : boolean
  object : THREE.DirectionalLight
  set setupEvent(enabled : boolean) {
    if (enabled) {
      this.object.position.set(5, 50, 7.5);
      this.scene.add(this.object)
    }
  }
  constructor(scene : THREE.Scene) {
    this.object = new THREE.DirectionalLight(0xffffff, 1)
    this.scene = scene
    this.enabled = true
    this.setupEvent = true
  } 
}

export default Light
