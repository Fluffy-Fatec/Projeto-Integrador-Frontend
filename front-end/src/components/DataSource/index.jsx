import React, { useState } from 'react';
import { Grid, Button, Paper } from '@material-ui/core';
import TableReview from '../TableDataReview';


const AppDataSource = ({ darkMode, token }) => {
  const [activeTable, setActiveTable] = useState(null);

  const sources = [
    { id: 1, name: 'TB_ANALISE_ELETRONICOS' },
    { id: 2, name: 'TB_REVIEW_SENTIMENT' },
    { id: 3, name: 'TB_ANALISE_VIDEOGAME' },
  ];

  const handleButtonClick = (tableName) => {
    setActiveTable(tableName);
  };

  return (
    <Grid container style={{ minHeight: '100vh' }}>
      <Grid item style={{ marginTop:'35px',maxWidth: '250px', backgroundColor: darkMode ? '#111' : '#FFF', padding: '20px', borderRight: '1px solid #ccc' }}>
        {sources.map((source) => (
          <Button
            key={source.id}
            onClick={() => handleButtonClick(source.name)}
            fullWidth
            style={{
              marginBottom: '10px',
              color: darkMode ? '#FFF' : '#000',
              backgroundColor: activeTable === source.name ? (darkMode ? '#555' : '#ccc') : 'transparent',
              justifyContent: 'flex-start',
              border: 'none'
            }}
          >
            {source.name}
          </Button>
        ))}
      </Grid>

      <Grid item xs style={{ backgroundColor: darkMode ? '#111' : '#FFF', color: darkMode ? '#FFF' : '#000', padding: '20px', overflowY: 'auto' }}>
        <Paper>
           {activeTable === 'TB_REVIEW_SENTIMENT' && (
            <TableReview darkMode={darkMode} token={token} tableName={activeTable} />
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AppDataSource;
