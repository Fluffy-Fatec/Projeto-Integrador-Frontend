import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { useTheme } from '@mui/material/styles';

function EnhancedTable({ token, dataSource }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (token && dataSource) {
      fetchData(token, dataSource);
    }
  }, [token, dataSource]);

  const fetchData = async (token, dataSource) => {
    try {
      const response = await axios.get(`http://localhost:8080/graphics/datasource/list/${dataSource}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const formattedRows = response.data.map(item => ({
        id: item.id,
        message: item.reviewCommentMessage,
        score: item.reviewScore,
        sentiment: item.sentimentoPredito === '1' ? 'Positive' : 'Negative',
        geolocationLat: item.geolocationLat,
        geolocationLng: item.geolocationLng,
        geolocationState: item.geolocationState,
        geolocation: item.geolocation,
        reviewCreationDate: new Date(item.reviewCreationDate).toLocaleDateString(),
        creationdate: new Date(item.creationdate).toLocaleDateString()
      }));

      setRows(formattedRows);
    } catch (error) {
      console.log("An error occurred:", error);
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
    <Paper style={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <TableContainer style={{ height: 'calc(100vh - 120px)', maxHeight: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                'ID', 'Message', 'Score', 'Sentiment', 'Geolocation Lat',
                'Geolocation Lng', 'Geolocation State', 'Geolocation',
                'Review Creation Date', 'Creation Date'
              ].map((header, index) => (
                <TableCell
                  key={index}
                  align={index > 1 ? 'right' : 'left'}
                  style={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                    color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                    wordWrap: 'break-word', // Permite que o texto quebre em várias linhas
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((cell, idx) => (
                  <TableCell
                    key={idx}
                    align={idx > 1 ? 'right' : 'left'}
                    style={{ maxWidth: '200px', wordWrap: 'break-word' }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
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
      />
    </Paper>
  );
}

export default EnhancedTable;
