import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';

import "./mapbox-gl-geocoder.css";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiYmVua3dpZXJzbWEiLCJhIjoiY2xldnF2NnlmMDR4YzNyczNxMGRpbGtiZiJ9.45KQhC5Gq8OxIMwzaUxSLg';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-118.16);
  const [lat, setLat] = useState(34.05);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [lng, lat],
    zoom: zoom,
    });
    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.addControl(
      new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      style: 'mapbox://styles/mapbox/streets-v12'
      })
    );
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

  return (
    <div>
    <div className="sidebar">
    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
    <div ref={mapContainer} className="map-container" />
    {/* <div ref={map}/> */}
    </div>
  );
}

export default App;
