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
import { Typography } from "@mui/material";

function EnhancedTable({ token }) {
  const theme = useTheme(); // Obtém o tema atual do Material-UI
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
      const response = await axios.get('http://localhost:8080/graphics/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const formattedRows = response.data.map(item => ({
        message: item.reviewCommentMessage,
        score: item.reviewScore,
        sentiment: item.sentimentoPredito === '1' ? 'Positive' : 'Negative'
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
    <TableContainer component={Paper}>
      <Table>
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 22 }}>Sentiment Table</Typography>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: theme.palette.mode === 'dark' ? '#fff' : 'inherit' }}>Message</TableCell>
            <TableCell align="right" style={{ color: theme.palette.mode === 'dark' ? '#fff' : 'inherit' }}>Score</TableCell>
            <TableCell align="right" style={{ color: theme.palette.mode === 'dark' ? '#fff' : 'inherit' }}>Sentiment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
            <TableRow key={index}>
              <TableCell style={{ color: theme.palette.mode === 'dark' ? '#fff' : 'inherit' }}>{row.message}</TableCell>
              <TableCell align="right" style={{ color: theme.palette.mode === 'dark' ? '#fff' : 'inherit' }}>{row.score}</TableCell>
              <TableCell align="right" style={{ color: theme.palette.mode === 'dark' ? '#fff' : 'inherit' }}>{row.sentiment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ color: theme.palette.mode === 'dark' ? '#fff' : 'inherit' }}
        />
      </Table>
    </TableContainer>
  );
}

export default EnhancedTable;
