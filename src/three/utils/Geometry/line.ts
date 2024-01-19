
import * as THREE from 'three';
function getLineMeanPoint ( line : THREE.Line) {
  const linePoints = line.geometry.attributes.position.array;
  
  const [x1,y1,z1] = linePoints.slice(0,3)
  const [x2,y2,z2] = linePoints.slice(3,6)
  const meanPoint = {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
    z: (z1 + z2) / 2,
  };
  
  return meanPoint

}

function getLineLength (line : THREE.Line){
  const linePoints = line.geometry.attributes.position.array;
  const [x1,y1,z1] = linePoints.slice(0,3)
  const [x2,y2,z2] = linePoints.slice(3,6)
  const lineLength = Math.sqrt( (x2-x1) ** 2 + (y2-y1) ** 2 + (z2-z1) ** 2 )

  return lineLength
  

}

function getLineRotation (line : THREE.Line){
  const linePoints = line.geometry.attributes.position.array;
  const lineLength = getLineLength(line)
  const [x1,y1,z1] = linePoints.slice(0,3)
  const [x2,y2,z2] = linePoints.slice(3,6)
  const lineVector = new THREE.Vector3(x2-x1, y2-y1, z2-z1)
  
  const xVector  = new THREE.Vector3(1,0,0)
  const yVector  = new THREE.Vector3(0,1,0)
  const zVector  = new THREE.Vector3(0,0,1)

  const crossX = new THREE.Vector3()
  const crossY = new THREE.Vector3()
  const crossZ = new THREE.Vector3()

  
  crossX.crossVectors(lineVector, xVector)
  crossY.crossVectors(lineVector, yVector)
  crossZ.crossVectors(lineVector, zVector)

  const cosGamma = lineVector.dot(xVector) / (lineLength * 1 )
  const cosTheta = lineVector.dot(yVector) / (lineLength * 1 )
  const cosAlpha = lineVector.dot(zVector) / (lineLength * 1 )

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const deltaZ  = z2 - z1;

  // const gamma = Math.atan2( deltaY , deltaX) // inclination to x - axis in rad 
  // const thetha = Math.PI / 2 - gamma // inclination to y - axis in rad
  // const alpha = Math.atan2(deltaX, deltaZ) // // inclination to z - axis in rad

  
  const gamma = Math.acos(cosGamma) // inclination to x - axis in rad 
  const thetha = Math.acos(cosTheta)  // inclination to y - axis in rad
  const alpha = Math.acos(cosAlpha)  // // inclination to z - axis in rad

  return ({ x : gamma , y : thetha , z : alpha}) 
  

}

export {
  getLineMeanPoint,
  getLineLength,
  getLineRotation,
}