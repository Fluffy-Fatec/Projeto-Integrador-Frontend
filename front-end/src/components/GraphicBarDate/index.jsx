import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Chart from "react-apexcharts";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFileImage } from "@fortawesome/free-solid-svg-icons";
import domToImage from "dom-to-image";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export function App({ token, startDate, endDate, selectedSent, selectedDataSource }) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null); 

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

  const handleExportJpgClick = () => {
    if (chartRef.current) {
      domToImage.toJpeg(chartRef.current, { quality: 0.95, bgcolor: '#ffffff' })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'chart.jpg';
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Erro ao exportar gráfico para JPG:', error);
          setError('Erro ao exportar gráfico para JPG.');
        });
    }
  };

  const handleExportCsvClick = () => {
    const data = Object.entries(chartData).map(([origin, counts]) => ({
      origin,
      positive: counts.positive,
      negative: counts.negative,
      neutral: counts.neutral
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'chart.csv');
  };

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false // Adiciona esta linha para remover o menu do gráfico
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
        text: 'Data source',
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
