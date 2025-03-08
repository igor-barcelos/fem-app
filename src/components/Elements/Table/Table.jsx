import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DataGrid from '../../DataGrid/DataGrid';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Table = ({ open, onClose, nodes, members }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const nodeColumns = [
    // { field: 'id', headerName: 'ID', width: 90 },
    // { field: 'index', headerName: 'Index', width: 130 },
    { field: 'label', headerName: 'Label', width: 130 },
    { field: 'x', headerName: 'X', width: 130 },
    { field: 'y', headerName: 'Y', width: 130 },
    { field: 'z', headerName: 'Z', width: 130 }
  ];

  const memberColumns = [
    // { field: 'id', headerName: 'ID', width: 90 },
    // { field: 'nodei', headerName: 'Node I', width: 130 },
    // { field: 'nodej', headerName: 'Node J', width: 130 },
    // { field: 'index', headerName: 'Index', width: 130 },
    { field: 'label', headerName: 'Label', width: 130 },
  ]


  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      hideBackdrop={true}
      disableBackdropClick={true}
      disableScrollLock
      disablePortal
      style={{ pointerEvents: 'none' }}
      PaperProps={{ 
        style: { 
          pointerEvents: 'auto',
          position: 'fixed',
          left: 0,
          top: 0,
          margin: 0,
          borderRadius: '0',
          height: '600px',
          overflow: 'auto'
        } 
      }}
    >
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogTitle>Data Table</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Nodes" {...a11yProps(0)} />
              <Tab label="Elements" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <DataGrid rows={nodes} columns={nodeColumns} pageSize={5} rowsPerPageOptions={[5]} autoHeight disableSelectionOnClick />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DataGrid rows={members} columns={memberColumns} pageSize={5} rowsPerPageOptions={[5]} autoHeight disableSelectionOnClick />  
          </TabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Table;
