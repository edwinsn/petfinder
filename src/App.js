import React, {Component} from 'react';
import { MapContainer, TileLayer, ZoomControl} from "react-leaflet";
import Search from "./Search";
import './assets/App.css';
import {Animal} from './Animal'
import {Panel} from './Panel'
import {About} from './About'
import {GetMarkers} from './GetMarkers'



export class App extends Component{

  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.openPanel=this.openPanel.bind(this)
  }

  openPanel(lat,lng,deprecated_level){
    this.child.current.open(lat, lng, deprecated_level);
  }

  render(){
    console.log("App rendered")

    return (
      <div >
        <div>
          <MapContainer className="mapp" id="map" style={{"zIndex":0}} center={{ lat: 5.533, lng: -73.367}} zoom={16} zoomControl={false}>
            <TileLayer
              attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
              url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}>
            </TileLayer>
            <ZoomControl position="bottomleft" />
            <Search className="search"/>
            <Animal panelDisplay={this.openPanel}/>   
            <GetMarkers open={this.openPanel}/>
            <About className="about"></About> 
          </MapContainer>
        </div>
      <Panel ref={this.child}/>
      </div>
    );
  }
}