import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID',     flex: 1,},
  { field: 'firstName', headerName: 'First name',     flex: 1, },
  { field: 'lastName', headerName: 'Last name',     flex: 1, },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    flex: 1,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },

];
type DataTableElemProps = {
  rows: Array<Object>;
  columns :  GridColDef[] 
};

export default function DataTableElem( {rows, columns} : DataTableElemProps) {
  return (
    <div style={{ height: 400, width: '100%',  }}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
