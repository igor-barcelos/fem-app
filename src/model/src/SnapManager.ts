import * as THREE from 'three';

class SnapManager {
  constructor(scene : THREE.Scene) {}
  snapToGrid = (pointerCoords: THREE.Vector3, gridSize : number ): THREE.Vector3 => {
    
    // Replace 'active' with your logic to determine if snapping is active
    const newCoords = new THREE.Vector3().copy(pointerCoords);
    // Replace 'precision' with the actual value you're using for precision
    const precision = 0.00; // For example

    //declaration of function which calculates new values and returns them
    const getCoordByOriginAndGridSize = (coord: number, gridSize: number): number => {
      if (gridSize < 1) {
        return Math.round(coord * 2) / 2;
      } else return Math.round(coord / gridSize) * gridSize;
    };

    
    //calling this function and assigning new values to respective properties
    newCoords.x = getCoordByOriginAndGridSize(newCoords.x, gridSize);
    newCoords.z = getCoordByOriginAndGridSize(newCoords.z, gridSize);
    // console.log("gridPoints",pointerCoords, newCoords)
    const distanceToCurrent = pointerCoords.distanceTo(newCoords);

    // Update your snapOptions or any relevant variables here
    // this.snapOptions!.grid.snappedCoords = newCoords;
    // this.snapOptions!.grid.distToOrigin = distanceToCurrent;

    return newCoords;
  };

  snapObject( snapType : string)
  {
    switch(snapType)
    {
      case "grid":
        const circleShape = new THREE.Shape();
        circleShape.absarc(0, 0, 0.2, 0, Math.PI * 2, false);
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, 0.15, 0, Math.PI * 2, true);
        circleShape.holes.push(holePath);

        const extrudeSettings = {depth: 0.,bevelEnabled: false};

        const circleGeometry = new THREE.ExtrudeGeometry(circleShape, extrudeSettings);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        circleGeometry.rotateX(-Math.PI / 2)
        const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
        

        return circleMesh  
    }

  }
}

export { SnapManager };
