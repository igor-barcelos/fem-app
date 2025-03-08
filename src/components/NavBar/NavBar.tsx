import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  NearMe as CursorIcon,
  Timeline as LineIcon,
  MultilineChart as AxesIcon,
  Build as ToolsIcon,
  Help as HelpIcon,
  Merge as MergeIcon
} from '@mui/icons-material';

import { useModel } from '../../model/Context';
import { CiSearch } from "react-icons/ci";
import { IoIosSearch , IoMdHelpCircle } from "react-icons/io";
import { IoApps } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

import { GiMaterialsScience, GiPencilRuler } from "react-icons/gi";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import {
  TbRulerMeasure,
  TbDimensions,
  TbLine,
  TbRectangle,
  TbCircle,
  TbPolygon,
} from "react-icons/tb"; // Tabler icons - minimalistic style

import {
  FaDraftingCompass
} from "react-icons/fa"; // Font Awesome icons

import {
  MdArchitecture,
} from "react-icons/md"; // 

import Select from '../Select/Select';
const NavBar = () => {
  const model = useModel()
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toolsAnchorEl, setToolsAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>('');

  const handleToolClick = (toolName: string) => {
    setSelectedTool(toolName)
    if(model!.drawTool.state != 0){
      model!.drawTool.stop()
      return
    }
    else if(toolName === 'axes') {
      model!.axes.startDrawMode()
    }
  };

  const handleToolsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setToolsAnchorEl(event.currentTarget);
    setSelectedTool('tools');
  };

  const handleToolsClose = () => {
    setToolsAnchorEl(null);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <List>
      <ListItem button>
        <ListItemIcon>
          <CursorIcon />
        </ListItemIcon>
        <ListItemText primary="Select" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <LineIcon />
        </ListItemIcon>
        <ListItemText primary="Line" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AxesIcon />
        </ListItemIcon>
        <ListItemText primary="Axes" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <ToolsIcon />
        </ListItemIcon>
        <ListItemText primary="Tools" />
      </ListItem>
    </List>
  );

  const mockLevels = [
    { value: 0, label: 'Level 1' },
    { value: 3, label: 'Level 2' },
    { value: 6, label: 'Level 3' },
  ];
  const [levels, setLevels] = useState(mockLevels);
  const [selectedLevel, setSelectedLevel] = useState(0);



  const handleChange = (event: any) => {
    const level = event.target.value;
    const selectedLevel = levels.find(l => l.value === level);
    setSelectedLevel(level);
    model!.handleLevelChange(selectedLevel!);
  };

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'white',
          marginBottom: '5px',
        }}
        elevation={3}
      >
        <Toolbar variant="regular"sx={{
          borderCollapse: 'collapse',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'  // Add this line
        }}>

          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'left',
            gap: 2,
            alignItems: 'center',
          }}>
            <IconButton sx={{ color: 'black' }}>
              <GiMaterialsScience />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ 
              borderColor: 'rgba(0, 0, 0, 0.12)',  // Make the color more visible
              borderRightWidth: 1,                  // Increase border width
              height: '24px',                       // Adjust height
              margin: 'auto 0'                      // Center vertically
            }} />

            <Typography 
              variant="h6" 
              sx={{ 
                color: 'black',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 600
              }}
            >
              FEM App
            </Typography>
          </Box>
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'right',
            gap: 2
          }}>
            <IconButton sx={{ color: 'black' }} >
              <IoIosSearch />
            </IconButton>
            {/* <IconButton sx={{ color: 'black' }} onClick={() => handleToolClick('line')}>
              <LineIcon />
            </IconButton> */}
            <IconButton sx={{ color: 'grey' }} >
              <IoMdHelpCircle />
            </IconButton>
            <IconButton 
              sx={{ color: 'black' }}
            >
              <IoApps />
            </IconButton>
            <IconButton sx={{ color: 'black' }} >
              <FaUserCircle />
            </IconButton>
          </Box>
        </Toolbar>
        <Toolbar variant="dense"> 
        <Box sx={{
           flexGrow: 1 ,  gap: 4,
           display: 'flex',
           justifyContent: 'left',
           alignItems: 'center',
           }}>
            <IconButton sx={{ color: 'black' }}>
              <GiPencilRuler size={24} />
            </IconButton>
            <IconButton sx={{ color: 'black' }}>
              <TbRulerMeasure size={24} />
            </IconButton>
            <IconButton sx={{ color: 'black' }}>
              <TbLine size={24} />
            </IconButton>
            <IconButton sx={{ color: 'black' }}>
              <TbRectangle size={24} />
            </IconButton>
            <IconButton sx={{ color: 'black' }}>
              <TbCircle size={24} />
            </IconButton>
            <IconButton sx={{ color: 'black' }}>
              <TbPolygon size={24} />
            </IconButton>
            <IconButton sx={{ color: 'black' }}>
              <TbDimensions size={24} />
            </IconButton>
            <IconButton sx={{ color: 'black' }}>
              <FaDraftingCompass size={24} />
            </IconButton>
            <IconButton sx={{ color: 'black' }}>
              <MdArchitecture size={24} />
            </IconButton>
            <Select onChange={handleChange} list={levels} />
          </Box>
        </Toolbar>
      </AppBar>

      {/* <Menu
        id="tools-menu"
        anchorEl={toolsAnchorEl}
        open={Boolean(toolsAnchorEl)}
        onClose={handleToolsClose}
      >
        <MenuItem onClick={handleToolsClose}>Tool 1</MenuItem>
        <MenuItem onClick={handleToolsClose}>Tool 2</MenuItem>
        <MenuItem onClick={handleToolsClose}>Tool 3</MenuItem>
      </Menu>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer> */}
    </>
  );
};

export default NavBar;
