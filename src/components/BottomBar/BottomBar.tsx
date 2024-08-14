
// import * as OBC from "@thatopen/components"
// import * as OBF from "@thatopen/components-front"
// import * as BUI from "@thatopen/ui"
// import { drawTypeSignal } from "../../model/src/Signals/Modelling";

// BUI.Manager.init();

// export const DrawingToolBar = BUI.Component.create<BUI.PanelSection>(() => {

//   const onStartLine = () => {
//     drawTypeSignal.value = "Line"
//   }

//   const onEndLine = () => {
    
//   }

//   return BUI.html`
//       <bim-toolbar-section label="Drawing" icon="ph:cursor-fill">
//         <bim-button @click=${onStartLine} label="Line" icon="tabler:line" tooltip-title="Line" tooltip-text="Line"></bim-button>
//         <bim-button  label="Line" icon="tabler:square" tooltip-title="Surface" tooltip-text="Surface"></bim-button>
//         <bim-button label="Circle" icon="tabler:circle" tooltip-title="Circle" tooltip-text="Line"></bim-button>
//       </bim-toolbar-section> 
//     `
// });



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
import Grid from '@mui/material/Grid';
const ToolBar = styled(Stack)<StackProps>(({ theme }) => ({
  backgroundColor:'black',
  borderRadius:'10%',
  marginBottom : '1rem',
  '& .MuiIconButton-root':{
    // backgroundColor : 'red'
  }
}));

const onDrawStart = (drawType : String ) => {
  
}

export default function BottomBar() {
  return (
    <Stack direction="row" spacing={2} style={{marginBottom:'1rem'}}>
      <ToolBar direction="row">
        <Tooltip title='Line' arrow>
          <IconButton  >
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