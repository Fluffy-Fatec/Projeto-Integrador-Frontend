import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TableReview from '../TableDataReview';

const Item = styled(Paper)(({ theme, darkMode }) => ({
  backgroundColor: darkMode ? '#333' : '#FFF',
  overflow: 'auto',
}));

const CustomButton = styled(Button)(({ darkMode }) => ({
  marginBottom: '10px',
  backgroundColor: 'transparent',
  color: '#299D00',
  justifyContent: 'flex-start',
  width: 'auto',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#EAEAEA',
    borderRadius: '10px',
  },
}));

const CustomComponent = ({ darkMode, token }) => {
  const [activeTable, setActiveTable] = useState('');
  const [dataSourceOptions, setDataSourceOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [processing, setProcessing] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSave = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        setProcessing(true);

        const response = await axios.post(
          'http://localhost:8080/graphics/upload',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('Arquivo enviado com sucesso:', response.data);
        setMessage('Dados inseridos com sucesso!');
        setSeverity('success');
        fetchData();
      } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
        setMessage('Erro! Não foi possível inserir os dados.');
        setSeverity('error');
      } finally {
        setSnackbarOpen(true);
        setProcessing(false);
      }
    }
    handleClose();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/graphics/datasource', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Dados da API:', response.data);
      const sortedData = response.data.sort((a, b) => a.localeCompare(b));
      setDataSourceOptions(sortedData);
      setActiveTable(sortedData[0] || '');
    } catch (error) {
      console.error('Erro ao buscar fontes de dados:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleButtonClick = (tableName) => {
    setActiveTable(tableName);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container style={{ marginLeft: '20px' }}>
        <Grid item xs={2} sm={2} style={{ marginTop: '64px', flexBasis: '250px', backgroundColor: darkMode ? '#111' : '#FFF', padding: '20px', borderRight: '1px solid #ccc' }}>
          <CustomButton darkMode={darkMode} onClick={handleOpen}>
            + New
          </CustomButton>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            dataSourceOptions.map((source, index) => (
              <Button
                key={index}
                onClick={() => handleButtonClick(source)}
                fullWidth
                style={{
                  marginBottom: '10px',
                  backgroundColor: activeTable === source ? (darkMode ? '#555' : '#ccc') : (darkMode ? '#111' : '#FFF'),
                  justifyContent: 'flex-start',
                  border: 'none',
                  borderColor: darkMode ? '#555' : '#ccc',
                  color: darkMode ? '#FFF' : '#000'
                }}
              >
                {source}
              </Button>
            ))
          )}
        </Grid>
        <Grid item xs={10} sm={10} style={{ backgroundColor: darkMode ? '#111' : '#FFF', color: darkMode ? '#FFF' : '#000', padding: '25px', marginTop: '64px' }}>
          {activeTable && (
            <Item darkMode={darkMode}>
              <TableReview darkMode={darkMode} token={token} dataSource={activeTable} />
            </Item>
          )}
        </Grid>
      </Grid>
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
            <strong>Insert New Data Source</strong>
          </Typography>
          <Typography id="modal-modal-description" variant="subtitle1" component="h4" align="center">
            Select the file to upload new data:
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              startIcon={<AttachFileIcon />}
              sx={{ borderRadius: 2 }}
              style={{ backgroundColor: '#dddddd', color: '#000000', height: '40px', marginBottom: '10px' }}
            >
              Select file
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
            <Typography variant="subtitle2" style={{ marginBottom: '10px', color: '#787878' }}>
              File Name: {selectedFile ? selectedFile.name : 'No file selected'}
            </Typography>
            <Button
              onClick={handleSave}
              variant="outlined"
              startIcon={<FileUploadIcon />}
              sx={{ borderRadius: 5 }}
              style={{ backgroundColor: '#11BF4E', color: '#FFFFFF', height: '40px' }}
            >
              Upload
            </Button>
            {processing && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                <CircularProgress size={24} sx={{ marginRight: '10px' }} />
                <Typography variant="body2">
                  Processing...
                </Typography>
              </Box>
            )}
          </div>
        </Box>
      </Modal>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomComponent;
