import { Typography } from "@mui/material";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

function GeographicGraph({ token, startDate, endDate, selectedSent }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colorAxisColors, setColorAxisColors] = useState(['red', 'green']); // Cores padrão

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (!token) {
          setError('Token de autenticação não encontrado.');
          setLoading(false);
          return;
        }
        const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
        const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

        let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;
        
        if (selectedSent !== '') {
          url += `&sentimentoPredito=${selectedSent}`;
        }

        const response = await axios.get(url);

        const filteredData = response.data.filter(item => {
          const lat = parseFloat(item.geolocationLat);
          const lng = parseFloat(item.geolocationLng);
          return lat >= -56.0 && lat <= 12.0 && lng >= -81.0 && lng <= -34.0;
        });

        const chartData = filteredData.map(item => [
          parseFloat(item.geolocationLat),
          parseFloat(item.geolocationLng),
          parseInt(item.sentimentoPredito)
        ]);

        chartData.unshift(["Latitude", "Longitude", "Sentimento"]);
        setData(chartData);
        setError(null);

        let colorAxisColors = [];
        switch (selectedSent) {
          case '0':
            colorAxisColors = ['red'];
            break;
          case '1':
            colorAxisColors = ['green'];
            break;
          case '2':
            colorAxisColors = ['yellow'];
            break;
          default:
            colorAxisColors = ['red', 'green'];
        }
        setColorAxisColors(colorAxisColors);
      } catch (error) {
        setError('Erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, startDate, endDate, selectedSent]);

  const handleChartSelect = ({ chartWrapper }) => {
    const chart = chartWrapper.getChart();
    const selection = chart.getSelection();
    if (selection.length === 0) return;
    const region = data[selection[0].row + 1];
  };

  return (
    <>
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 20 }}>Sentiment Map</Typography>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography>Error: {error}</Typography>}
      {!loading && !error && (
        <Chart
          chartType="GeoChart"
          width="100%"
          height="100%"
          style={{ marginTop: '-80px' }}
          data={data}
          chartEvents={[
            {
              eventName: 'select',
              callback: handleChartSelect
            }
          ]}
          options={{
            sizeAxis: { minValue: 0, maxValue: 100 },
            region: '005',
            displayMode: 'markers',
            colorAxis: { colors: colorAxisColors }, 
            zoomLevel: 5,
            magnifyingGlass: { enable: true },
            dataLabels: true,
            backgroundColor: 'transparent',
          }}
        />
      )}
    </>
  );
}

export default GeographicGraph;
