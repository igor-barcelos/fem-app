import { 
  GiIBeam, 
  GiAncientColumns,
 } from "react-icons/gi";

import { MdOutline3dRotation } from "react-icons/md";
import { Stack, IconButton, Icon } from '@mui/material';
import { useModel } from '../../model/Context';

const Elements = () => {
  const model = useModel()

  const handleBeam = () => {
    model.drawTool.start('Beam')
  }

  const handleColumn = () => {
    console.log('draw columns')
  }

  return (
    <Stack 
    direction="column" 
    spacing={1}
    sx={{
      position: 'absolute',
      right: '10px', // Adjust this value based on your NavBar height
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
    
    <IconButton sx={{color: 'black'}} onClick={handleBeam}>
      <GiIBeam size={24}  />
    </IconButton>
    <IconButton sx={{color: 'black'}}>
      <GiAncientColumns size={24} />
    </IconButton>
    <IconButton sx={{color: 'black'}}> 
      <MdOutline3dRotation size={24}/>
    </IconButton>
  </Stack>
  );
};

export default Elements;

