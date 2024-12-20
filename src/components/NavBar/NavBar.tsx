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

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'white',
          marginBottom: '5px'
        }}
        elevation={3}
      >
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ color: 'black' }}
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'center',
            gap: 4
          }}>
            <IconButton sx={{ color: 'black' }} onClick={() => handleToolClick('cursor')}>
              <CursorIcon />
            </IconButton>
            {/* <IconButton sx={{ color: 'black' }} onClick={() => handleToolClick('line')}>
              <LineIcon />
            </IconButton> */}
            <IconButton sx={{ color: 'black' }} onClick={() => handleToolClick('axes')}>
              <MergeIcon />
            </IconButton>
            <IconButton 
              sx={{ color: 'black' }}
              onClick={handleToolsClick}
              aria-controls="tools-menu"
              aria-haspopup="true"
            >
              <ToolsIcon />
            </IconButton>
            <IconButton sx={{ color: 'black' }} onClick={() => handleToolClick('help')}>
              <HelpIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
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
      </Drawer>
    </>
  );
};

export default NavBar;
