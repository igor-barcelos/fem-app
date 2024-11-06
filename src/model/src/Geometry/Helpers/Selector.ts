import { Model } from '../../Model';
import * as THREE from 'three';

class Selector  {
  enabled: boolean = true
  enableHover : boolean
  enableClick : boolean
  rayCaster : THREE.Raycaster
  model: Model;
  selection : THREE.Mesh | null  
  originalColor : number
  colorOnSelection : number
  colorOnHover : number
  set setupEvent(enabled: boolean) {
    if (enabled) {
      this.onHover = this.onHover.bind(this);
      this.onClick = this.onClick.bind(this);
      window.addEventListener('pointermove', this.onHover);
      window.addEventListener('click', this.onClick);
    } else {
      window.removeEventListener("pointermove", this.onHover);
      window.removeEventListener("click", this.onClick);
    }
  }
  constructor(model : Model){
    this.setupEvent = true; 
    this.model = model;
    this.enableHover = true
    this.enableClick = true
    this.rayCaster = new THREE.Raycaster()
    this.selection = null
    this.originalColor = 0
    this.colorOnSelection = 0
  }
  
  onHover(){ 
    if(this.enableHover){
      const pointer = new THREE.Vector2(this.model.pointerCoords.x, this.model.pointerCoords.y)
      this.rayCaster.setFromCamera(pointer, this.model.camera)
      const meshesArray = [] as THREE.Mesh[]
      this.model.scene.children.forEach(element => this.getMeshes(element, meshesArray))
      // https://github.com/ThatOpen/engine_components/blob/main/packages/front/src/fragments/Highlighter/index.ts
      const intersects = this.rayCaster.intersectObjects( meshesArray, false)
      let materialOnHover = null
      if ( intersects.length > 0 )
      {
        if ( intersects[ 0 ].object != this.selection ) 
        {
          if ( this.selection ){
            materialOnHover = this.selection.material as THREE.MeshBasicMaterial | THREE.MeshLambertMaterial[]
            if(Array.isArray(materialOnHover)){
              materialOnHover[0].color.setHex( this.originalColor );
            }else{
              materialOnHover.color.setHex( this.originalColor );
            }         
          }  
          this.selection = intersects[ 0 ].object as THREE.Mesh;
          materialOnHover = this.selection.material as THREE.MeshBasicMaterial | THREE.MeshLambertMaterial[]
          console.log('SELECTION', this.selection)  

          if(Array.isArray(materialOnHover)){
            this.originalColor = materialOnHover[0].color.getHex();
            materialOnHover[0].color.setHex( 0xffff00 );
          }else{
            this.originalColor = (this.selection.material as THREE.MeshBasicMaterial).color.getHex();
            materialOnHover.color.setHex( 0xffff00 );
          } 
        }
      } 
      else 
      {
        if ( this.selection ) {
          materialOnHover = this.selection.material as THREE.MeshBasicMaterial | THREE.MeshLambertMaterial[]
          if(Array.isArray(materialOnHover)){
            materialOnHover[0].color.setHex( this.originalColor );
          }else{
            materialOnHover.color.setHex( this.originalColor );
        }}
          // (this.selection.material as THREE.MeshBasicMaterial).color.setHex( this.originalColor );
        this.selection = null;
      }
      // if(intersects.length > 0){
      //   if(this.currentSelection != intersects[0].object){
      //     if(intersects[0].object.type  != 'GridHelper'){
      //     this.currentSelection = intersects[0].object as THREE.Mesh
      //     const material = this.currentSelection.material as THREE.MeshBasicMaterial
      //     material.color.setHex( 0xff0000 );
      //     }
      //   }

      //   const objectOnHover = intersects[0].object as THREE.Mesh
      //   if(objectOnHover.type != "GridHelper"){
      //     console.log('object on hover', objectOnHover)
      //   }

      // } 
    }
  }

  onClick(){
    if(this.enableClick){
      const pointer = new THREE.Vector2(this.model.pointerCoords.x, this.model.pointerCoords.y)
      this.rayCaster.setFromCamera(pointer, this.model.camera)
      const meshesArray = [] as THREE.Mesh[]
      // this.model.scene.children.forEach(element => this.getMeshes(element, meshesArray))
      this.model.scene.children.forEach(element => this.getMeshes(element, meshesArray))
      const intersects = this.rayCaster.intersectObjects( meshesArray, false)
      
      console.log('meshesArray', meshesArray)
      console.log('intersects', intersects.length)
      if(intersects.length > 0){
        const objectOnClick = intersects[0].object as THREE.Mesh
        if(objectOnClick.type != "GridHelper"){
          console.log('object on click', objectOnClick)
          // objectOnClick.currentHex = selection.material.emissive.getHex();
          // const material = objectOnClick.material as THREE.MeshLambertMaterial[] || 
          // console.log('material', material)
          // const material = objectOnClick.material as THREE.MeshBasicMaterial
          // console.log('material', material)
          // material.color.setHex( 0xff0000 );
        }
      } 
    }
  }
  dipose(){
    window.removeEventListener('pointermove',this.onHover);
    window.removeEventListener('click',this.onClick);
  }
  getMeshes (object: THREE.Object3D, meshesArray: THREE.Mesh[] = []): THREE.Mesh[]  {
    if (object instanceof THREE.Mesh) {
      meshesArray.push(object);
    } else if (object.children.length > 0) {
      object.children.forEach(child => this.getMeshes(child, meshesArray));
    }
    return meshesArray;
  }
  
}

export default Selector