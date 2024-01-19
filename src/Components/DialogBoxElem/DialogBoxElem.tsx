import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import DataTableElem from '../DataTableElem/DataTableElem';

interface DialogBoxProps {
    dialogContent: any;
    handleClickOpen: () => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
  



export default function DialogBoxElem({ dialogContent , handleClickOpen, open, setOpen}: DialogBoxProps ) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div  >
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open DataGrid Dialog
      </Button> */}
      <Dialog 
      open={open} 
      onClose={handleClose} 
      hideBackdrop={true}
      // disableBackdropClick
      disableAutoFocus
      disableScrollLock
      maxWidth="md" 
      fullWidth 
     
      > 
        <DialogTitle>Nodes</DialogTitle>
        <DialogContent>
          <div style={{ height: 400, width: '100%' }}>
            {dialogContent}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
