import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const DataGrid = ({ rows, columns, pageSize = 5 }) => {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MuiDataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[pageSize]}
        rowsPerPage={pageSize}
        autoHeight
        disableSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none'
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      />
    </Box>
  );
};

export default DataGrid;
