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
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';

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
        creationdate: new Date(item.creationdate).toLocaleDateString(),
        classifier: item.id
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

  const handleThumbUpClick = (id) => {
    console.log(`Row ID: ${id}`);
  };

  const handleThumbDownClick = (id) => {
    console.log(`Row ID: ${id}`);
  };

  const handleExportCSV = () => {
    const sanitizedRows = rows.map(row => {
      const sanitizedRow = {};
      for (const key in row) {
        if (typeof row[key] === 'string') {
          sanitizedRow[key] = row[key].replace(/\n/g, '');
        } else {
          sanitizedRow[key] = row[key];
        }
      }
      return sanitizedRow;
    });
    
    const csv = Papa.unparse(sanitizedRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${dataSource}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper style={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        <FontAwesomeIcon icon={faFileCsv} onClick={handleExportCSV} style={{ cursor: 'pointer', color: '#888888', fontSize: '20px' }} />
      </div>
      <TableContainer style={{ height: 'calc(100vh - 120px)', maxHeight: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                'ID', 'Message', 'Score', 'Sentiment', 'Geolocation Lat',
                'Geolocation Lng', 'Geolocation State', 'Geolocation',
                'Review Creation Date', 'Creation Date', 'Classifier'
              ].map((header, index) => (
                <TableCell
                  key={index}
                  align={index > 1 ? 'right' : 'left'}
                  style={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                    color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                    wordWrap: 'break-word',
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
                {Object.keys(row).map((key, idx) => (
                  <TableCell
                    key={idx}
                    align={idx > 1 ? 'right' : 'left'}
                    style={{ maxWidth: '200px', wordWrap: 'break-word' }}
                  >
                    {key === 'classifier' ? (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton onClick={() => handleThumbUpClick(row.id)} aria-label="thumbs up">
                          <ThumbUpIcon style={{ color: '#299D00' }} />
                        </IconButton>
                        <IconButton onClick={() => handleThumbDownClick(row.id)} aria-label="thumbs down">
                          <ThumbDownIcon style={{ color: '#FF5151' }} />
                        </IconButton>
                      </div>
                    ) : (
                      row[key]
                    )}
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
