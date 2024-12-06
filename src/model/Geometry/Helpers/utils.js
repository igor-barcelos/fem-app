export const rayCaster = () => {  
  const canvas = document.querySelector('canvas')
  const rect = canvas.getBoundingClientRect();
  const _vec2 = new THREE.Vector2();
  const _vec3 = new THREE.Vector3();

  //raycaster
  const raycaster = new THREE.Raycaster();

  //default trs is 1
  raycaster.params.Line.threshold = 1;
  raycaster.params.Points.threshold = 1;
  _vec2.x = (( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1);
  _vec2.y =  -( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
  raycaster.setFromCamera(_vec2, camera);
}
