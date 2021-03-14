import React, {Component} from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents} from "react-leaflet";
import L from 'leaflet'
import Search from "./Search";
import './assets/App.css';
import {Animal} from './Animal'
import {Panel} from './Panel'
import {About} from './About'
import axios from 'axios'
import dogIcon from './assets/images/dogIcon.png'
import catIcon from './assets/images/catIcon.png'


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
          <MapContainer id="map" style={{"zIndex":0}} center={{ lat: 5.533, lng: -73.367}} zoom={16} zoomControl={false}>
            <TileLayer
              attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
              url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}>
            </TileLayer>
            <Search className="search"/>
            <Animal panelDisplay={this.openPanel}/>
            <GetMarkers  open={this.openPanel} />     
            <About className="about"></About> 
          </MapContainer>
        </div>
      <Panel ref={this.child}/>
      </div>
    );
  }
}


let GetMarkers = React.memo((props)=>{

 console.log("Get markers rendered")

  let map = useMap ();
  map.locate()

  useMapEvents({
    locationfound(e) {
      map.panTo(e.latlng, map.getZoom())
    }
  })
 
  axios.get(process.env.REACT_APP_POINTS_URI+"/database").then((res)=>{
      if(res.status===200){

      res.data.forEach(marker => {

        var icon = new L.Icon({
        iconUrl: marker.type==="dog"?dogIcon:catIcon,

        iconSize: [35, 35]
        })

        let newmarker = L.marker({lat:marker.lat,lng:marker.lng},{icon});
        newmarker.addTo(map)
        newmarker.on("click",()=>{
          props.open(marker.lat, marker.lng, marker.deprecated_level)
        })
      });
      }else{
        console.log("Db error")
      } 
    }
  )
   return null
}
)