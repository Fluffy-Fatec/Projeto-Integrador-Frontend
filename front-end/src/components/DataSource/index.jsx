import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TableReview from '../TableDataReview';

const Item = styled(Paper)(({ theme, darkMode }) => ({
  backgroundColor: darkMode,
  overflow: 'auto',
  overflowY: 'auto',
}));

const CustomComponent = ({ darkMode, token }) => {
  const [activeTable, setActiveTable] = useState('');
  const [dataSourceOptions, setDataSourceOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/graphics/datasource', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Data from API:', response.data);
        setDataSourceOptions(response.data);
        setActiveTable(response.data[0] || '');
      } catch (error) {
        console.error('Error fetching data sources:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleButtonClick = (tableName) => {
    setActiveTable(tableName);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100%' }}>
      <Grid container style={{ minHeight: '100%' }}>
        <Grid item xs={12} sm={3} style={{ marginTop: '35px', maxWidth: '100%', flexBasis: '250px', backgroundColor: darkMode ? '#111' : '#FFF', padding: '20px', borderRight: '1px solid #ccc' }}>
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

        <Grid item xs={12} sm={9} style={{ backgroundColor: darkMode ? '#111' : '#FFF', color: darkMode ? '#FFF' : '#000', padding: '25px' }}>
          <Item darkMode={darkMode}>
            {activeTable && (
              <TableReview darkMode={darkMode} token={token} dataSource={activeTable} />
            )}
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomComponent;
