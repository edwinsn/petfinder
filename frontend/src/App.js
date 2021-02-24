import React, {useState} from 'react';
import { MapContainer, TileLayer } from "react-leaflet";
import Search from "./Search";
import './assets/App.css';
import {Animal} from './Animal'


export const App = () => {


  return (
    <div >
    <MapContainer  id="map" style={{"zIndex":0}} center={{ lat: 51.5287718, lng: -0.2416804 }} zoom={6} zoomControl={false}>
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

function getMarkers(){
  let url = "/database"
 let {data, status} = axios.get(url) 

   if(status==200){

    data.forEach(marker => {
      let marker = L.marker(marker.coords,{ icon:marker.type=="dog"?dogIcon:catIcon});
      marker.addTo(map)
      });
   }
}