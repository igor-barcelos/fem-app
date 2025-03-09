import { useEffect } from 'react';
import axios from 'axios'
import { 
  GiIBeam, 
  GiAncientColumns,
  GiDatabase,
  GiPlayButton,
  GiLevelEndFlag
 } from "react-icons/gi";

import { MdOutline3dRotation } from "react-icons/md";
import { Stack, IconButton, Icon } from '@mui/material';
import { useModel } from '../../model/Context';
import { useState } from 'react';
import Table from './Table'
import Beam from '../../model/Elements/Beam/Beam'
// import Levels from '../Levels'
import { Dialog, Drawer } from '@mui/material';

const Elements = () => {
  const model = useModel()
  const [open, setOpen] = useState(false)
  const [nodes, setNodes] = useState([])
  const [members, setMembers] = useState([])
  const [openLevels, setOpenLevels] = useState(false)
  const [viewMode, setViewMode] = useState('2d')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)
  useEffect(() => {
    if(model){
      console.log('model', model)
      model.drawTool.handleBeamDraw = handleBeamDraw
    }
  }, [model])

  const startBeamDraw = () => {
    model.drawTool.start('Beam')
    setSidebarOpen(true)
    setSelectedElement('beam')
  }

  const startColumnDraw = () => {
    model.drawTool.start('Column')
    setSidebarOpen(true)
    setSelectedElement('column')
  }

  const handleTable = () => {
    setOpen(true)
  }

  const onDrawn = () => {
    console.log('UPDATING ELEMENTS TABLE AFTER DRAWING')
  }

  const handleBeamDraw = (beam, toolState) => {

    const beams = model.beams
    const nodes = model.nodes
    setMembers(beams)
    setNodes(nodes)
    console.log('MEMBERS', beams)
  }

  const handleColumnDraw = () => {
    console.log('UPDATING ELEMENTS TABLE AFTER DRAWING COLUMN')
  }

  const runAnalysis = async () => {
    try {
      const nodes = model.nodes.map(node => ({
        id: node.id,
        x: node.x,
        y: node.y,
        z: node.z
      }))
      const members = model.beams.map(beam => ({
        id: beam.id,
        nodei: {id: beam.nodes[0].id, x: beam.nodes[0].x, y: beam.nodes[0].y, z: beam.nodes[0].z},
        nodej: {id: beam.nodes[1].id, x: beam.nodes[1].x, y: beam.nodes[1].y, z: beam.nodes[1].z}
      }))
      console.log('NODES', nodes)


      console.log('MEMBERS', members)
      const data = {
        nodes: nodes,
        members: members
    }

    console.log('DATA', data)
    const res = await axios.post('http://localhost:8000/analysis', data)
    console.log('RUNNING ANALYSIS', res)
    } catch (error) {
      console.error('Error running analysis', error)
    }
  }

  const handle3dView = () => {
    model.camera.handle3dView()
    model.gridHelper.hide()
    setViewMode('3d')
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedElement(null)
  }
  return (
    <>
    <Stack 
    direction="column" 
    spacing={1}
    sx={{
      position: 'absolute',
      left: '10px', // Adjust this value based on your NavBar height
      top: '50%',     // Start at 50% from the top
      transform: 'translateY(-50%)', // Center vertically by moving up half of its height
      zIndex: 1003,
      backgroundColor: '#ffffff', // Transparent white background
      padding: '10px',
      borderRadius: '4px',
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
      '& .MuiIconButton-root': { // Add margin to IconButtons
        margin: '10px 0', // Vertical margin
      }
    }}
  >
    
      <IconButton sx={{color: 'black'}} onClick={startBeamDraw} size='medium'>
        <GiIBeam />
      </IconButton>
      <IconButton sx={{color: 'black'}} onClick={startColumnDraw} size='medium'>
        <GiAncientColumns />
      </IconButton>
      <IconButton sx={{color: 'black'}} onClick={handle3dView} size='medium'> 
        <MdOutline3dRotation />
      </IconButton>
      <IconButton sx={{color: 'black'}} onClick={handleTable} size='medium'>
        <GiDatabase />
      </IconButton>
      <IconButton sx={{color: 'black'}} onClick={() => setOpenLevels(true)} size='medium'>
        <GiLevelEndFlag />
      </IconButton>
      <IconButton sx={{color: 'black'}} onClick={runAnalysis} size='medium'>
        <GiPlayButton />
      </IconButton>

    </Stack>
    <Table open={open} onClose={() => setOpen(false)} nodes={nodes} members={members}/>
    <Dialog 
      open={openLevels} 
      onClose={() => setOpenLevels(false)}
      hideBackdrop={true}
      disableBackdropClick={true}
      disableScrollLock
      disablePortal
      >
      {/* <Levels /> */}
    </Dialog>

      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={closeSidebar}
        hideBackdrop={true} 
        sx={{
          '& .MuiDrawer-paper': {
            width: '300px',
            padding: '20px',
            marginTop: '140px', // Add space for the navbar (adjust this value to match your navbar height)
            marginLeft: '75px', // Add space for the navbar (adjust this value to match your navbar height)
            height: 'calc(100% - 140px)', // Adjust height to account for navbar
            boxSizing: 'border-box',
            backgroundColor: '#ffffff', 
            color: 'black',
          },
        }}
      >
        <h2>{selectedElement === 'beam' ? 'Beam Properties' : 
            selectedElement === 'column' ? 'Column Properties' : 
            'Element Properties'}</h2>
        
        {selectedElement === 'beam' && (
          <div>
            <p>Configure beam properties here</p>
            {/* Add beam-specific form controls here */}
          </div>
        )}
        
        {selectedElement === 'column' && (
          <div>
            <p>Configure column properties here</p>
            {/* Add column-specific form controls here */}
          </div>
        )}
        
        <IconButton 
          onClick={closeSidebar}
          sx={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          X
        </IconButton>
      </Drawer>
    </>

  );
};

export default Elements;

