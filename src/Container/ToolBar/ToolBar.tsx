import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './toolBar.css'
import { faArrowTrendUp, faCube } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { 
  toolsModel,
  cameraModel,
  gridModel,
  groundModel} from '../../three/models';
import { ToolsId } from '../../shared/types/tools';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
// import { cameraController } from '../../three/controllers';
const ToolBar = observer(() => {

  const updateCamera = (plane : String) => {
    cameraModel.setPlane(plane)
    gridModel.setPlane(plane)
    groundModel.setPlane(plane)
  }
  
  return(
    <div className='toolbar-container'>
      <div className="toolbar-icon-container" style={{backgroundColor: toolsModel.tools.find(tool => tool.id === ToolsId.LINE)?.isActive? 'green' : '#007bff'    }} >
        <FontAwesomeIcon icon={faArrowTrendUp}  className="toolbar-icon"  onClick={() => toolsModel.toggleToolActive(ToolsId.LINE)}/>
      </div>
      {/* <div className="toolbar-icon-container">
        <FontAwesomeIcon icon={faScrewdriverWrench}  id = "snap-button" className="toolbar-icon" />
      </div>
      <div className="toolbar-icon-container">
        <FontAwesomeIcon icon={faGear}  className="toolbar-icon" />
      </div> */}
      <div className="toolbar-icon-container">
        XY
        <FontAwesomeIcon icon={faCube}  className="toolbar-icon"  onClick={() => updateCamera('XY')}/>
      </div>
      <div className="toolbar-icon-container">
        XZ
        <FontAwesomeIcon icon={faCube}  className="toolbar-icon" onClick={() => updateCamera('XZ')}/>
      </div>
      <div className="toolbar-icon-container">
        ZY
        <FontAwesomeIcon icon={faCube}  className="toolbar-icon" onClick={() => updateCamera('YZ')}/>
      </div>
      <div className="toolbar-icon-container" onClick={() => updateCamera('3D')}>
        3D
        <FontAwesomeIcon icon={faCube}  className="toolbar-icon" />
      </div>
    </div>
      
  )
})

export default ToolBar;