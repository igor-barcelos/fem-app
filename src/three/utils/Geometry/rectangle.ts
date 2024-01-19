function getRectangularMesh ( centerLine : THREE.TypedArray) 
{
  console.log("centerLine", centerLine)
  const b = 0.2;
  const x0 = centerLine[0]
  const y0 = centerLine[1]

  const xi = centerLine[3]
  const yi = centerLine[4]

  const deltaY = yi - y0
  const deltaX = xi - x0

  const lineInclination = Math.atan(deltaY/deltaX) 
  const PI = Math.PI
  const theta = PI/2 - lineInclination
  
  const vertices = new Float32Array([
      x0 - b * Math.cos(theta), y0 + b * Math.sin(theta), 0,  
      x0 + b * Math.cos(theta), y0 - b * Math.sin(theta), 0,  
      xi + b * Math.cos(theta), yi - b * Math.sin(theta), 0,
      xi - b * Math.cos(theta), yi + b * Math.sin(theta), 0,
    ]);

  // Define the indices to form two triangles
  const indices = new Uint32Array([0, 1, 2, 0, 2, 3]);

  return (
    {
    vertices : vertices,
    indices : indices
  }
  )
}

export {getRectangularMesh}