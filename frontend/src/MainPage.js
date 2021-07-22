import React, { Component } from 'react';
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import Search from "./Search";
import './assets/App.css';
import { Panel } from './Panel'
import { About } from './AboutRec'
import { GetMarkers } from './GetMarkers'
import './assets/mainPage.css'
import { SideBar } from './sideBar';
import userIcon from './assets/images/userIconFilled.svg'
import { Notifications } from './Notifications';

export class MainPage extends Component {

  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.openPanel = this.openPanel.bind(this)
  }

  openPanel(lat, lng, deprecated_level) {
    this.child.current.open(lat, lng, deprecated_level);
  }

  render() {
    //console.log("MainPage rendered")
    //console.log(this.props.useruid)

    return (
      <div style={{ display: this.props.show ? undefined : "none" }}>
        <div>
          <MapContainer className="mapp" id="map" style={{ "zIndex": 0 }} center={{ lat: 5.533, lng: -73.367 }} zoom={16} zoomControl={false}>
            <TileLayer
              attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
              url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}>
            </TileLayer>
            <ZoomControl position="bottomleft" />
            <Search className="search" />
            <GetMarkers open={this.openPanel} userid={this.props.useruid} />
            <About></About>
          </MapContainer>
        </div>
        <Panel ref={this.child} />
        <Notifications />
        {this.props.useruid ?
          <SideBar handleLogout={this.props.handleLogout} />
          :
          <div className="loginBtnContainer" onClick={this.props.showLogin}>
            <img className="loginBtn" src={userIcon} />
          </div>
        }
      </div>

    )

  }
}