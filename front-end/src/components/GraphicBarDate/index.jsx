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

export function App({ token, startDate, endDate, selectedSent, selectedDataSource }) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const user = localStorage.getItem('username');

  const fetchData = async () => {
    try {
      const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
      const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';
      let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

      if (selectedSent !== '') {
        url += `&sentimentoPredito=${selectedSent}`;
      }

      if (selectedDataSource !== '') {
        url += `&datasource=${selectedDataSource}`;
      }

      const response = await axios.get(url);

      const originCounts = {};
      response.data.forEach(item => {
        const origin = item.origin;
        if (!originCounts[origin]) {
          originCounts[origin] = { positive: 0, negative: 0, neutral: 0 };
        }

        const sentiment = item.sentimentoPredito;
        if (sentiment === '2') {
          originCounts[origin].positive++;
        } else if (sentiment === '0') {
          originCounts[origin].negative++;
        } else if (sentiment === '1') {
          originCounts[origin].neutral++;
        }
      });

      setChartData(originCounts);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setError('Erro ao buscar dados da API.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && startDate && endDate) {
      fetchData();
    } else {
      setError('Parâmetros de data ou token faltando.');
      setLoading(false);
    }
  }, [token, startDate, endDate, selectedSent, selectedDataSource]);


  const handleExportJpgClick = async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await domToImage.toJpeg(chartRef.current, { quality: 0.95, bgcolor: '#ffffff' });
        const link = document.createElement('a');
        link.download = 'Sentiment Classification by Source.jpg';
        link.href = dataUrl;
        link.click();

        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Sentiment Classification by Source",
          type: "JPEG"
        });
      } catch (error) {
        console.error('Error logging chart JPEG export:', error);
        setError('Error logging chart JPEG export.');
      }
    } else {
      setError('No chart reference found.');
    }
  };

  const handleExportCsvClick = async () => {
    if (chartData) {
      const data = Object.entries(chartData).map(([origin, counts]) => ({
        origin,
        positive: counts.positive,
        negative: counts.negative,
        neutral: counts.neutral
      }));

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'Sentiment Classification by Source.csv');

      try {
        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Sentiment Classification by Source",
          type: "CSV"
        });
      } catch (error) {
        console.error('Error logging chart CSV export:', error);
        setError('Error logging chart CSV export.');
      }
    } else {
      setError('Chart data is incomplete or missing.');
    }
  };

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    colors: ['#06d6a0', '#ef476f', '#ffd166'],
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    yaxis: {
      title: {
        text: '',
        style: {
          color: '#888888'
        }
      }
    },
    xaxis: {
      categories: ['Positivo', 'Negativo', 'Neutro'],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(0);
        }
      }
    },
    title: {
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        fontFamily: 'Segoe UI',
        color: '#888888',
      },
    },
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
          <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', marginLeft: "10px" }}>Sentiment Classification by Source</Typography>
        </Grid>
        <Grid item xs={0.7}>
          <FontAwesomeIcon icon={faFileCsv} onClick={handleExportCsvClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
        </Grid>
        <Grid item xs={0.7}>
          <FontAwesomeIcon icon={faFileImage} onClick={handleExportJpgClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
        </Grid>
      </Grid>
      <div ref={chartRef}>
        <Chart
          options={options}
          series={Object.entries(chartData).map(([origin, counts]) => ({
            name: origin,
            data: [counts.positive, counts.negative, counts.neutral]
          }))}
          type="bar"
          height={350}
        />
      </div>
    </>
  );
}

export default App;
