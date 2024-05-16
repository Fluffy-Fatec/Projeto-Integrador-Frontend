import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Typography, Grid, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFileImage } from "@fortawesome/free-solid-svg-icons";
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const GoogleMap = ({ token, startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const url = constructApiUrl(startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource);
      const response = await axios.get(url);
      const data = response.data;
      const newHeatmapData = data.map(item => ({
        lat: parseFloat(item.geolocationLat).toFixed(3),
        lng: parseFloat(item.geolocationLng).toFixed(3),
        sentiment: item.sentimentoPredito
      }));
      setHeatmapData(newHeatmapData);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
        const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';
        let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

        if (selectedSent !== '') {
          url += `&sentimentoPredito=${selectedSent}`;
        }

        if (selectedState !== '') {
          url += `&state=${selectedState}`;
        }

        if (selectedCountry !== '') {
          url += `&country=${selectedCountry}`;
        }

        if (selectedDataSource !== '') {
          url += `&datasource=${selectedDataSource}`;
        }

        const response = await axios.get(url);
        const data = response.data;
        const newHeatmapData = data.map(item => ({
          lat: parseFloat(item.geolocationLat).toFixed(3),
          lng: parseFloat(item.geolocationLng).toFixed(3),
          sentiment: item.sentimentoPredito
        }));
        setHeatmapData(newHeatmapData);

      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    if (token && startDate && endDate) {
      fetchData();
    }
  }, [token, startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource]);

  useEffect(() => {
    if (heatmapData.length > 0) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBT-XPf587QgEzoVCHPBFgLwM0_vfPRS34&libraries=visualization&loading=async&callback=initMap`;
      script.async = true;
      window.initMap = () => {
        const newMap = new window.google.maps.Map(document.getElementById('map'), {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          mapTypeId: 'satellite'
        });
        setMap(newMap);
        if (heatmapData.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          heatmapData.forEach(coord => {
            bounds.extend({ lat: coord.lat, lng: coord.lng });
          });
          newMap.fitBounds(bounds);
          const heatmap = new window.google.maps.visualization.HeatmapLayer({
            data: heatmapData.map(coord => new window.google.maps.LatLng(coord.lat, coord.lng)),
            map: newMap
          });
        }
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [heatmapData]);

  const handleExportJpgClick = () => {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      html2canvas(mapElement, { useCORS: true, backgroundColor: '#ffffff' })
        .then((canvas) => {
          canvas.toBlob((blob) => {
            saveAs(blob, 'heatmap.jpg');
          }, 'image/jpeg', 0.95);
        })
        .catch((error) => {
          console.error('Erro ao exportar mapa para JPG:', error);
        });
    }
  };

  const handleExportCsvClick = () => {
    const csvData = heatmapData.map((coord) => ({
      Latitude: coord.lat,
      Longitude: coord.lng,
      Sentiment: coord.sentiment
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'heatmap.csv');
  };

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', marginLeft: "10px" }}>
            Review Heatmap
          </Typography>
        </Grid>
        <Grid item xs={0.7}>
          <IconButton onClick={handleExportCsvClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }}>
            <FontAwesomeIcon icon={faFileCsv} />
          </IconButton>
        </Grid>
        <Grid item xs={0.7}>
          <IconButton onClick={handleExportJpgClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }}>
            <FontAwesomeIcon icon={faFileImage} />
          </IconButton>
        </Grid>
      </Grid>
      <br />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div id="map" style={{ width: '100%', height: '80%' }}></div>
      )}
    </>
  );
};

export default GoogleMap;
