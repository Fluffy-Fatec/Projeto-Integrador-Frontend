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
    <Paper style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Container for Header */}
      <div style={{ padding: '20px', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 20}}>
          Sentiment Table
        </Typography>
      </div>

      {/* Table Container */}
      <TableContainer style={{ flex: 1 }}>
        <Table stickyHeader>
          {/* Table Head (Header Row) */}
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5', color: theme.palette.mode === 'dark' ? '#fff' : 'inherit', position: 'sticky', top: 0, zIndex: 1 }}>Message</TableCell>
              <TableCell align="right" style={{ backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5', color: theme.palette.mode === 'dark' ? '#fff' : 'inherit', position: 'sticky', top: 0, zIndex: 1 }}>Score</TableCell>
              <TableCell align="right" style={{ backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5', color: theme.palette.mode === 'dark' ? '#fff' : 'inherit', position: 'sticky', top: 0, zIndex: 1 }}>Sentiment</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.message}</TableCell>
                <TableCell align="right">{row.score}</TableCell>
                <TableCell align="right">{row.sentiment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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

export default EnhancedTable;
