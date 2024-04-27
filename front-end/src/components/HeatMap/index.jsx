import React, { useEffect, useState } from 'react';

const MapComponent = () => {
  const [heatMapData, setHeatMapData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/graphics/list')
      .then(response => response.json())
      .then(data => {
        const newData = data.map(item => ({
          location: new google.maps.LatLng(parseFloat(item.geolocationLat), parseFloat(item.geolocationLng)),
          weight: parseFloat(item.reviewScore)
        }));
        setHeatMapData(newData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBT-XPf587QgEzoVCHPBFgLwM0_vfPRS34&libraries=visualization&callback=initMap&loading=async`;
    script.async = true;
    window.initMap = initMap; // Definir a função globalmente
    document.body.appendChild(script);

    // Limpeza do script quando o componente é desmontado
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initMap = () => {
    // Altere as coordenadas para o centro do Brasil
    const centerOfBrazil = new google.maps.LatLng(-14.235004, -51.92528);

    const map = new google.maps.Map(document.getElementById('map'), {
      center: centerOfBrazil,
      zoom: 4, // Ajuste o zoom conforme necessário
      mapTypeId: 'satellite'
    });

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatMapData
    });
    heatmap.setMap(map);
  };

  return (
    <div id="map" style={{ width: '100%', height: '550px' }}>
      {/* Você pode adicionar qualquer conteúdo aqui que deseja renderizar abaixo do mapa */}
    </div>
  );
};

export default MapComponent;
