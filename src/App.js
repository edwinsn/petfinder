import React, {useState} from 'react';
import { MapContainer, TileLayer } from "react-leaflet";
import Search from "./Search";
import './assets/App.css';
import {Animal} from './Animal'


export const App = () => {


  return (
    <div id="mydiv">
    <MapContainer style={{"zIndex":0}} center={{ lat: 51.5287718, lng: -0.2416804 }} zoom={6} zoomControl={false}>
      <TileLayer
        attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
      >
      </TileLayer>
      <Search />
      <Animal />
    </MapContainer>
    </div>
  );
};