import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, useTheme } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function DataTable({ token }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  const fetchData = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/auth/log/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const formattedRows = response.data.map(item => ({
        id: item.usuario.id,
        name: item.usuario.name,
        registro: item.registro,
        creationDate: new Date(item.creationDate).toLocaleString()
      }));

     
      setRows(formattedRows.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  return (
    <Paper style={{width: '74vw', display: 'flex', flexDirection: 'column' }}>
      <TableContainer style={{ flex: 1 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5', color: theme.palette.mode === 'dark' ? '#fff' : 'inherit', position: 'sticky', top: 0, zIndex: 1 }}>ID</TableCell>
              <TableCell align="left" style={{ backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5', color: theme.palette.mode === 'dark' ? '#fff' : 'inherit', position: 'sticky', top: 0, zIndex: 1 }}>Usuario</TableCell>
              <TableCell align="left" style={{ backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5', color: theme.palette.mode === 'dark' ? '#fff' : 'inherit', position: 'sticky', top: 0, zIndex: 1 }}>Registro</TableCell>
              <TableCell align="left" style={{ backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5', color: theme.palette.mode === 'dark' ? '#fff' : 'inherit', position: 'sticky', top: 0, zIndex: 1 }}>Creation Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.registro}</TableCell>
                  <TableCell align="left">{row.creationDate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">Carregando...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ borderTop: `1px solid ${theme.palette.divider}`, marginTop: 'auto' }}
      />
    </Paper>
  );
}

export default DataTable;
