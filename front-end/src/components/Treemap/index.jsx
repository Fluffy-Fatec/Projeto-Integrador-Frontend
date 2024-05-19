import { faFileCsv, faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";
import domToImage from "dom-to-image";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import React, { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";

function App({ token, endDate, startDate, selectedDataSource }) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const user = localStorage.getItem('username');

  const fetchData = async (token) => {
    try {
      const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
      const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

      let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

      if (selectedDataSource !== '') {
        url += `&datasource=${selectedDataSource}`;
      }

      const response = await axios.get(url);

      const stateData = {};

      response.data.forEach(item => {
        const state = item.geolocationState;
        const sentiment = item.sentimentoPredito;

        if (!stateData[state]) {
          stateData[state] = {
            positives: 0,
            negatives: 0,
            neutrals: 0,
            total: 0
          };
        }

        if (sentiment === '2') {
          stateData[state].positives++;
        } else if (sentiment === '0') {
          stateData[state].negatives++;
        } else if (sentiment === '1') {
          stateData[state].neutrals++;
        }

        stateData[state].total++;
      });

      const series = [{
        data: []
      }];

      for (const state in stateData) {
        const { positives, negatives, neutrals, total } = stateData[state];
        const positivePercentage = ((positives / total) * 100).toFixed(2);
        const negativePercentage = ((negatives / total) * 100).toFixed(2);
        const neutralPercentage = ((neutrals / total) * 100).toFixed(2);

        series[0].data.push({ x: state, y: parseFloat(positivePercentage) });
      }

      setChartData({ series });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setError('Erro ao buscar dados da API.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && startDate && endDate) {
      fetchData(token);
    } else {
      setError('Token de autenticação, startDate ou endDate não encontrados.');
      setLoading(false);
    }
  }, [token, startDate, endDate, selectedDataSource]);

  const handleExportJpgClick = async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await domToImage.toJpeg(chartRef.current, { quality: 0.95, bgcolor: '#ffffff' });
        const link = document.createElement('a');
        link.download = 'chart.jpg';
        link.href = dataUrl;
        link.click();
        
        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Sentiment Treemap by State",
          type: "JPEG"
        });
      } catch (error) {
        console.error('Error exporting chart JPEG:', error);
        setError('Error exporting chart JPEG.');
      }
    } else {
      setError('Chart data is incomplete or missing.');
    }
  };
  
  const handleExportCsvClick = async () => {
    if (chartData.series && chartData.series.length > 0 && chartData.series[0].data.length > 0) {
      try {
        const csvData = chartData.series[0].data.map(item => ({
          State: item.x,
          Percentage: item.y
        }));
  
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'sentiment_treemap.csv');
  
        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Sentiment Treemap by State",
          type: "CSV"
        });
      } catch (error) {
        console.error('Error exporting chart data:', error);
        setError('Error exporting chart data.');
      }
    } else {
      setError('No data available to export.');
    }
  };
  
  

  const options = {
    chart: {
      type: 'treemap',
      height: 350,
      toolbar: {
        show: false
      }
    },
    title: {
      text: '',
      align: 'left',
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        fontFamily: 'Segoe UI',
        color: '#888888'
      },
    },
    legend: {
      show: false
    },
    colors: ["#06d6a0"]
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', marginLeft: "10px" }}>Sentiment Treemap by State</Typography>
        </Grid>
        <Grid item xs={0.7}>
          <FontAwesomeIcon icon={faFileCsv} onClick={handleExportCsvClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
        </Grid>
        <Grid item xs={0.7}>
          <FontAwesomeIcon icon={faFileImage} onClick={handleExportJpgClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
        </Grid>
      </Grid>
      <div style={{ marginLeft: '15px' }} ref={chartRef}>
        <Chart
          options={options}
          series={chartData.series}
          type="treemap"
          height="350"
          width="95%"
        />
      </div>
    </>
  );
}

export default App;
