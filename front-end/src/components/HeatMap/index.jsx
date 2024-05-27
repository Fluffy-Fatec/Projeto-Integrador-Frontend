import { faFileCsv, faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, IconButton, Typography } from "@mui/material";
import axios from 'axios';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import React, { useCallback, useEffect, useState } from 'react';


const GoogleMap = ({
  token,
  startDate,
  endDate,
  selectedSent,
  selectedState,
  selectedCountry,
  selectedDataSource
}) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false); // Estado para controlar a exportação
  const user = localStorage.getItem('username');

  const constructApiUrl = (startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource) => {
    let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(new Date(startDate).toISOString().slice(0, -5) + 'Z')}&endDate=${encodeURIComponent(new Date(endDate).toISOString().slice(0, -5) + 'Z')}`;

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

    return url;
  };

  const fetchData = useCallback(async () => {
    try {
      const url = constructApiUrl(startDate, endDate, selectedSent, selectedState, selectedCountry, selectedDataSource);
      const response = await axios.get(url);
      const data = response.data;
      const newHeatmapData = data.map(item => ({
        lat: parseFloat(item.geolocationLat),
        lng: parseFloat(item.geolocationLng),
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
    if (token && startDate && endDate) {
      setLoading(true);
      fetchData();
    }
  }, [token, startDate, endDate, fetchData]);

  useEffect(() => {
    if (!map) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBT-XPf587QgEzoVCHPBFgLwM0_vfPRS34&libraries=visualization&callback=initMap`;
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
            bounds.extend(coord);
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
        window.initMap = null;
      };
    }
  }, [map, heatmapData]);

  const handleExportJpgClick = async () => {
    if (!exporting) {
      setExporting(true);
      try {
        const mapElement = document.getElementById('map');
        if (mapElement) {
          // Capturar o mapa após o carregamento completo
          const canvas = await html2canvas(mapElement, {
            useCORS: true, // Habilitar CORS para imagens externas
            logging: false, // Desativar logs para melhorar o desempenho
            onclone: (document) => {
              // Esperar até que o mapa esteja totalmente carregado
              return new Promise((resolve) => {
                const checkMapLoaded = () => {
                  if (mapElement.offsetWidth > 0 && mapElement.offsetHeight > 0) {
                    resolve();
                  } else {
                    setTimeout(checkMapLoaded, 100);
                  }
                };
                checkMapLoaded();
              });
            }
          });
          canvas.toBlob((blob) => {
            saveAs(blob, 'Heatmap.jpg');
          });

          // Registrar a exportação no servidor
          await axios.post('http://localhost:8080/graphics/report/log', {
            userName: user,
            graphicTitle: "Heatmap",
            type: "JPEG"
          });

          // Reexibir o mapa após a exportação
          mapElement.style.display = 'block';
        } else {
          console.error('Map element not found.');
        }
      } catch (error) {
        console.error('Error exporting heatmap to JPEG:', error);
      } finally {
        setExporting(false);
      }
    }
  };




  const handleExportCsvClick = async () => {
    if (!exporting) {
      setExporting(true);
      try {
        const csvData = heatmapData.map((coord) => ({
          Latitude: coord.lat,
          Longitude: coord.lng,
          Sentiment: coord.sentiment
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Heatmap.csv');

        await axios.post('http://localhost:8080/graphics/report/log', {
          userName: user,
          graphicTitle: "Heatmap Export",
          type: "CSV"
        });
      } catch (error) {
        console.error('Error exporting heatmap to CSV:', error);
      } finally {
        setExporting(false);
      }
    }
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
        heatmapData.length > 0 && (
          <div id="map" style={{ width: '100%', height: '80%' }}></div>
        )
      )}
    </>
  );
};

export default GoogleMap;
