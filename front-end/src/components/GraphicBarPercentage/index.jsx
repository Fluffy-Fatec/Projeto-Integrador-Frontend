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

function App({ token, endDate, startDate, selectedDataSource }) {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

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

      const chartData = [];
      const chartSeriesData = [
        { name: 'Positive', data: [] },
        { name: 'Negative', data: [] },
        { name: 'Neutral', data: [] }
      ];

      for (const state in stateData) {
        const { positives, negatives, neutrals, total } = stateData[state];
        const positivePercentage = (positives / total) * 100;
        const negativePercentage = (negatives / total) * 100;
        const neutralPercentage = (neutrals / total) * 100;
        chartData.push(state);
        chartSeriesData[0].data.push(positivePercentage);
        chartSeriesData[1].data.push(negativePercentage);
        chartSeriesData[2].data.push(neutralPercentage);
      }

      setChartOptions({
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 0,
            horizontal: true,
            barHeight: '80%',
          }
        },
        xaxis: {
          categories: chartData,
          style: {
            color: '#888888'
          }
        },
        legend: {
          position: 'bottom',
          offsetY: 10
        },
        title: {
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'Segoe UI',
            color: '#888888'
          },
        },
        colors: ['#06d6a0', '#ef476f', '#ffd166'],
        dataLabels: {
          enabled: false
        }
      });

      setChartSeries(chartSeriesData);
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
    const data = chartSeries[0].data.map((_, index) => ({
      state: chartOptions.xaxis.categories[index],
      positive: chartSeries[0].data[index],
      negative: chartSeries[1].data[index],
      neutral: chartSeries[2].data[index]
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'chart.csv');
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
          <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', marginLeft: "10px" }}>Sentiment by State</Typography>
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
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
        />
      </div>
    </>
  );
}

export default App;
