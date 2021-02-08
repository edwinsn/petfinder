import './assets/css/App.css';
import {Component} from 'react'
import L from 'leaflet';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import connect from './conection' 
class App  extends Component {

  render (){
    let position = [5.5,-73.483];
    let mark = L.icon({
      iconUrl:'data:image/png;base64,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',
      iconSize:[25,30],
      iconAnchor:[15,20],
      popupAnchor:[8,20]
    });

    connect();
    return (

    <div></div>)
    // <div className="App">
    //   <MapContainer className="map" center={position} zoom={13} scrollWheelZoom={false}>
    //     <TileLayer
    //     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //     />
    //     <Marker position={position} icon={mark}>
    //       <Popup>
    //         A pretty CSS3 popup. <br /> Easily customizable.
    //       </Popup>
    //     </Marker>
    // </MapContainer>
    // </div>)

  }
}



export default App;
