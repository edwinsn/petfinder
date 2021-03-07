//done: set undragable the marker one in sended
//done: delete last marker if added new one before sending
import React, {useState} from 'react'
import {useMap} from 'react-leaflet'
import L from 'leaflet'
import './assets/Animal.css'
import axios from 'axios'
import dogIcon from './assets/images/dogIcon.png'
import catIcon from './assets/images/catIcon.png'
import sendButtonIcon from './assets/images/SendButton.svg'
import plusIcon from './assets/images/plus.svg'

import {Form} from './Form'

let activeMarker = false

export let Animal=React.memo((props)=>{
    console.log("animal rerenderes")
    const [reportIcon,reportIconchange] = useState(plusIcon);
    const [coordinates,changeCoordinates] = useState();
    const [type, changeType] = useState();
    const frecuence = {frecuence:1};

    let map = useMap()


    const [formDisplay, changeFormDisplay] = useState("none") 


    let typesOfAnimals = ["dog","cat"];
    const animalList = typesOfAnimals.map(
        (animalType)=>(
            <div
                key={animalType}
                className = {animalType+"Option"}
                draggable={true}
                onDragEnd={(ev)=>{
                    changeFormDisplay("block")
                    changeType(animalType);
                    addMark(reportIconchange, map, animalType, changeCoordinates, props.panel, props.panelDisplay, props.changeProb, ev)
                    }
                }
                onClick={()=>{
                    changeFormDisplay("block")
                    changeType(animalType);
                    addMark(reportIconchange, map, animalType, changeCoordinates, props.panel, props.panelDisplay,props.changeProb)
                    }
                }>
                    </div>
 
        )
    );

    return (<div className="reportMenu">
            <Form display={formDisplay} frecuence = {frecuence}/>
            <div className="menu"
                 onMouseEnter={()=>{map.dragging.disable()}}
                 onMouseLeave={()=>{map.dragging.enable()}}>
                <div className="options">
                 {animalList}
                </div>
                <img    alt="Report a Dog"
                        className="selector" 
                        onClick={()=>{sendPoint(reportIconchange, coordinates, changeCoordinates, type, changeFormDisplay, frecuence)}} 
                        src={reportIcon}
                />
            </div>    
            </div>        
        )
}
)
 
function addMark(reportIconchange, map, type, changeCoordinates, panel, panelDisplay, changeProb, ev={clientX:false}){
 

    if(activeMarker){map.removeLayer(activeMarker)}

    let icon = L.icon({
        iconUrl: type==="dog"?dogIcon:catIcon,
        iconSize:     [38, 38]
    });
    let coordinates = ev.clientX? map.mouseEventToLatLng(ev) : (ev.screenX? map.containerPointToLatLng([ev.screenX-10,ev.screenY-110]):map.getCenter());
    
    let marker = L.marker(coordinates,{draggable:'true', icon: icon});
    changeCoordinates(coordinates)

    marker.on('dragend',()=>{
        changeCoordinates(marker.getLatLng())
        })
    marker.on('click',(e)=>{
        let {lat,lng} = coordinates
        panelDisplay(lat, lng, 1)

    })
//actualizar el estado dentro una marca rerenderiz la pagina principal
    marker.addTo(map)
    reportIconchange(sendButtonIcon)
    activeMarker = marker
    }

async function sendPoint(sendBackgorundchange, coordinates, changeCoordinates, type, changeFormDisplay, frecuence){
    if(coordinates){
        sendBackgorundchange(plusIcon);
        console.log(process.env.REACT_APP_POINTS_URI)
        changeCoordinates(false)
        activeMarker.dragging.disable()
        changeFormDisplay("none")
        activeMarker = false;
        console.log(process.env.REACT_APP_POINTS_URI)
      //  let {data,status}=await axios.post(process.env.REACT_APP_POINTS_URI,{coords:coordinates, type, frecuence})
      //  console.log(data+"---"+status)

        }
}