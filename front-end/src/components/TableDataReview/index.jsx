import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, MenuItem, Select, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';

function EnhancedTable({ token, dataSource }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sentiment, setSentiment] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [buttonVisibility, setButtonVisibility] = useState({});

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
        sentiment: item.sentimentoPredito === '2' ? 'Positive' : item.sentimentoPredito === '1' ? 'Neutral' : 'Negative',
        geolocationLat: item.geolocationLat,
        geolocationLng: item.geolocationLng,
        geolocationState: item.geolocationState,
        geolocation: item.geolocation,
        reviewCreationDate: new Date(item.reviewCreationDate).toLocaleDateString(),
        creationdate: new Date(item.creationdate).toLocaleDateString(),
        classifier: item.classifier
      }));

      formattedRows.sort((a, b) => a.id - b.id);

      let visibilityInit = {};
      formattedRows.forEach(row => {
        if (row.classifier === 0) {
          visibilityInit[row.id] = { showThumbUp: false, showThumbDown: true };
        } else if (row.classifier === 1) {
          visibilityInit[row.id] = { showThumbUp: true, showThumbDown: false };
        } else {
          visibilityInit[row.id] = { showThumbUp: true, showThumbDown: true };
        }
      });

      setRows(formattedRows);
      setButtonVisibility(visibilityInit);
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

  const handleThumbUpClick = async (id) => {
    const buttonState = buttonVisibility[id];
    if (buttonState && !buttonState.showThumbDown) {
      try {
        await axios.post(`http://localhost:8080/graphics/review/classifier/${id}`, { classifier: null }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchData(token, dataSource);
      } catch (error) {
        console.log("An error occurred:", error);
      }
    } else {
      setButtonVisibility(prev => ({ ...prev, [id]: { ...prev[id], showThumbDown: false } }));

      try {
        await axios.post(`http://localhost:8080/graphics/review/classifier/${id}`, { classifier: 1 }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("LIKE");
        fetchData(token, dataSource);
      } catch (error) {
        console.log("An error occurred:", error);
      }
    }
  };

  const handleThumbDownClick = async (row) => {
    const buttonState = buttonVisibility[row.id];
    if (buttonState && !buttonState.showThumbUp) {
      try {
        await axios.post(`http://localhost:8080/graphics/review/classifier/${row.id}`, { classifier: null }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchData(token, dataSource);
      } catch (error) {
        console.log("An error occurred:", error);
      }
    } else {
      setSelectedRow(row);
      setSentiment(row.sentiment);
      setOpen(true);
    }
  };

  const handleExportCSV = () => {
    const sanitizedRows = rows.map(row => {
      const sanitizedRow = {};
      for (const key in row) {
        if (key !== 'classifier') {
          if (typeof row[key] === 'string') {
            sanitizedRow[key] = row[key].replace(/\n/g, '');
          } else {
            sanitizedRow[key] = row[key];
          }
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

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setSentiment('');
  };

  const handleSave = async () => {
    if (sentiment === selectedRow.sentiment) {
      setSnackbarMessage(`Cannot update to the same sentiment: ${sentiment}`);
      setSnackbarOpen(true);
      return;
    }

    const sentimentMap = {
      'Negative': 0,
      'Neutral': 1,
      'Positive': 2
    };

    const sentid = sentimentMap[sentiment];

    try {
      await axios.put(`http://localhost:8080/graphics/update/${selectedRow.id}/${sentid}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      await axios.post(`http://localhost:8080/graphics/review/classifier/${selectedRow.id}`, { classifier: 0 }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setRows(rows.map(row => row.id === selectedRow.id ? { ...row, sentiment } : row));
      setButtonVisibility(prev => ({ ...prev, [selectedRow.id]: { ...prev[selectedRow.id], showThumbUp: false } }));

      setSnackbarMessage(`Sentiment for row ID ${selectedRow.id} updated.`);
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/graphics/review/${selectedRow.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRows(rows.filter(row => row.id !== selectedRow.id));
      setConfirmOpen(false);
      handleClose();
    } catch (error) {
      console.log("An error occurred:", error);
      setConfirmOpen(false);
    }
  };

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
                  <TableCell key={idx} align={idx > 1 ? 'right' : 'left'} style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                    {key === 'classifier' ? (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {buttonVisibility[row.id]?.showThumbUp && (
                          <IconButton onClick={() => handleThumbUpClick(row.id)} aria-label="thumbs up">
                            <ThumbUpIcon style={{ color: '#299D00' }} />
                          </IconButton>
                        )}
                        {buttonVisibility[row.id]?.showThumbDown && (
                          <IconButton onClick={() => handleThumbDownClick(row)} aria-label="thumbs down">
                            <ThumbDownIcon style={{ color: '#FF5151' }} />
                          </IconButton>
                        )}
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          borderRadius: 5,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
            <strong>Update Sentiment</strong>
          </Typography>
          <Typography id="modal-modal-description" variant="subtitle1" component="h4" align="center">
            Select the correct sentiment for this comment:
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              displayEmpty
              style={{ marginRight: '10px', minWidth: '150px', height: '40px' }}
              color='success'
            >
              <MenuItem value="" disabled>Select sentiment</MenuItem>
              <MenuItem value="Positive">Positive</MenuItem>
              <MenuItem value="Negative">Negative</MenuItem>
              <MenuItem value="Neutral">Neutral</MenuItem>
            </Select>
            <Button
              onClick={handleSave}
              variant="outlined"
              sx={{ borderRadius: 5 }}
              style={{ backgroundColor: '#11BF4E', color: '#FFFFFF', height: '40px' }}
            >
              Update
            </Button>
          </div>
          <Divider style={{ margin: '20px 0', position: 'relative' }}>
            <Typography
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: theme.palette.background.paper,
                padding: '0 10px'
              }}
            >
              or
            </Typography>
          </Divider>
          <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
            <strong>Delete Row</strong>
          </Typography>
          <Typography id="modal-modal-description" variant="subtitle1" component="h4" align="center">
            If you want to remove this record from the database:
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button
              onClick={handleConfirmOpen}
              variant="outlined"
              sx={{ borderRadius: 5 }}
              style={{ backgroundColor: '#FF5151', color: '#FFFFFF', height: '40px' }}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} style={{ color: theme.palette.error.main }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} style={{ color: theme.palette.success.main }} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default EnhancedTable;
