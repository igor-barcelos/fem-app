import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Stack, {StackProps} from '@mui/material/Stack';
import { Tooltip, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import ShowChartTwoToneIcon from '@mui/icons-material/ShowChartTwoTone';
import CropIcon from '@mui/icons-material/Crop';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';
import SettingsIcon from '@mui/icons-material/Settings';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { loadIfcSignal } from '../../model/src/Geometry/IFC/signals';
import { useAppContext } from '../../App';
import { drawTypeSignal } from '../../model/src/Signals/Modelling';

const ToolBar = styled(Stack)<StackProps>(({ theme }) => ({
  backgroundColor:'black',
  borderRadius:'10%',
  marginBottom : '1rem',
  '& .MuiIconButton-root':{
    // backgroundColor : 'red'
  }
}));

const onDrawStart = (drawType : String ) => {
  console.log('CALLING DRAW START', drawType  )
  drawTypeSignal.value = drawType 
}



export default function BottomBar() {
  const { loadingIfc } = useAppContext();
  const uploadIfc = async () => {
    loadingIfc.value = true;
  }
  return (
    <Stack direction="row" spacing={2} style={{marginBottom:'1rem'}}>
      <ToolBar direction="row">
        <Tooltip title ='IFC'>
            <IconButton onClick={uploadIfc}>
              <CloudUploadIcon />
            </IconButton>
          </Tooltip>
      </ToolBar>
      <ToolBar direction="row">
        <Tooltip title='Line' arrow>
          <IconButton onClick={() => onDrawStart('Line')}>
            <ShowChartTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Surface'>
          <IconButton  > 
            <CropIcon  />
          </IconButton>
        </Tooltip>
        <Tooltip title ='Circle'>
          <IconButton >
            <CircleOutlinedIcon  />
          </IconButton>
        </Tooltip>
        <Tooltip title ='Measurements'>
          <IconButton >
            <StraightenIcon  />
          </IconButton>
        </Tooltip>
      </ToolBar>
        
        <ToolBar direction="row">
          
          <Tooltip title ='Settings'>
            <IconButton >
              <SettingsIcon  />
            </IconButton>
          </Tooltip>

          <Tooltip title ='Import File'>
            <IconButton >
              <ImportExportIcon  />
            </IconButton>
          </Tooltip>

        </ToolBar>

    </Stack>

  );
}