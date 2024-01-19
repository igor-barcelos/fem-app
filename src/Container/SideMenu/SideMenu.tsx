import React, { useState } from 'react';
import './style.css'
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import DataTableElem from '../../Components/DataTableElem/DataTableElem';
import ListElem from '../../Components/ListElem/ListElem';
import DialogBoxElem from '../../Components/DialogBoxElem/DialogBoxElem';
import { sceneStorage } from '../../storage/SceneStorage';

const SideScreen = observer(() => {

  const nodeDataTable = sceneStorage.nodeDataTable;
  console.log("node data", toJS(nodeDataTable))
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  
  return(
    <div  className="sideScreen-container">
      <ListElem onClickItem={handleClickOpen} />
      
      {open &&
      <DialogBoxElem 
        dialogContent={DataTableElem({rows : nodeDataTable.rows , columns : nodeDataTable.columns})} 
        handleClickOpen={handleClickOpen} 
        open={open} 
        setOpen={setOpen}
      />
      }
    </div>
      
  )
})

export default SideScreen;