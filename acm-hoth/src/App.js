//import logo from './logo.svg';
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

  // Create constants to use in getIso()
  const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
  const profile = 'cycling'; // Set the default routing profile
  const minutes = 10; // Set the default duration
  // console.log(mapContainer)

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

    map.current.on('load', () => {
      // When the map loads, add the source and layer
      map.current.addSource('iso', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
    
      map.current.addLayer(
        {
          id: 'isoLayer',
          type: 'fill',
          // Use "iso" as the data source for this layer
          source: 'iso',
          layout: {},
          paint: {
            // The fill color for the layer is set to a light purple
            'fill-color': '#5a3fc0',
            'fill-opacity': 0.3
          }
        },
        'poi-label'
      );
    
      // Make the API call
      getIso();
    });
  }, []);

  





   // Create a function that sets up the Isochrone API query then makes an fetch call
   async function getIso() {
    const query = await fetch(
      `${urlBase}${profile}/${lng},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const data = await query.json();
    map.current.getSource('iso').setData(data);
  }


  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setZoom(map.current.getZoom().toFixed(2));
    // console.log(map.current.getCenter())
    // getIso();
    });

    // map.current.on('click', (e) => {
    //   getIso();
    //   });
    
  }, [lat, lng]);


  return (
    <div>
    <div className="sidebar">
    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
    <div ref={mapContainer} className="map-container" />
    <button onClick={()=>{getIso()}}>How Long Walk?fvf</button>
    {/* <div ref={map}/> */}
    </div>
  );
}

export default App;
