
import React, {useRef, useEffect} from "react"
import ToolBar from "./ToolBar/ToolBar"
import './style.css'
import ThreeScene from "./ThreeScene/ThreeScene";
import NavBar from "../Components/NavBar/NavBar";
import { observer } from 'mobx-react-lite';
import SideMenu from "./SideMenu/SideMenu";
import { sceneStorage } from "../storage/SceneStorage";
import { toJS } from "mobx";
const AppContainer =  observer(() => {
  
  return  (
      <div id="app-container" className="app-container">
        <NavBar/>
        <SideMenu/>
        <ThreeScene/>
        <ToolBar/>  
      </div>
    
    )
})

export default AppContainer;