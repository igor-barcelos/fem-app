
import React, { useEffect, useState } from 'react';
import { Scene } from '../../three/scene/Scene';
import { 
  sceneModel,
  toolsModel,
  gridModel,
  cameraModel,
  groundModel} from '../../three/models';
import { sceneStorage } from '../../storage/SceneStorage';
const  ThreeScene = () : React.JSX.Element =>  {
  var scene : Scene;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
  scene = new Scene(
    sceneModel,
    toolsModel,
    sceneStorage,
    gridModel,
    cameraModel,
    groundModel
    )
  // sceneController = new SceneController(scene, toolsState)
  // sceneModifier = new SceneModifer(scene)
  scene.initialize()
  scene.update()
  // sceneController.startPointerCoordsUpd(scene.canvas, scene.groundPlane, scene.camera)


}, [isMounted]); 

 //on Mount
 useEffect(() => {
  setIsMounted(true);
}, []);

return (
    <div>
    </div>
    )

}

export default ThreeScene


