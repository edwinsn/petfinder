//done: set undragable the marker one in sended
//done: delete last marker if added new one before sending
import {useState} from 'react'
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

export function Animal(){

    const [reportIcon,reportIconchange] = useState(plusIcon);
    const [coordinates,changeCoordinates] = useState();
    const [type, changeType] = useState();

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
                    addMark(reportIconchange, map, animalType, changeCoordinates, ev)
                    }
                }
                onClick={()=>{
                    changeFormDisplay("block")
                    changeType(animalType);
                    addMark(reportIconchange, map, animalType, changeCoordinates)
                    }
                }>
                    </div>
 
        )
    );

    return (<div className="reportMenu">
            <Form display={formDisplay}/>
            <div className="menu"
                 onMouseEnter={()=>{map.dragging.disable()}}
                 onMouseLeave={()=>{map.dragging.enable()}}>
                <div className="options">
                 {animalList}
                </div>
                <img  
                        className="selector" 
                        onClick={()=>{sendPoint(reportIconchange, coordinates, changeCoordinates, type, changeFormDisplay)}} 
                        src={reportIcon}
                />
            </div>    
            </div>        
        )
}

function printCoords(ev, map){
  let latlng = map.mouseEventToLatLng(ev);
  map.panTo( new L.latLng(0,0))
  console.log(latlng);
  console.log("center at:")
  console.log(map.getCenter())
}
 
function addMark(reportIconchange, map, type, changeCoordinates, ev={clientX:false}){

    if(activeMarker){map.removeLayer(activeMarker)}

    let icon = L.icon({
        iconUrl: type=="dog"?dogIcon:catIcon,
        iconSize:     [38, 38]
    });
    let coordinates = ev.clientX? map.mouseEventToLatLng(ev) : (ev.screenX? map.containerPointToLatLng([ev.screenX-10,ev.screenY-110]):map.getCenter());
    
    let marker = L.marker(coordinates,{draggable:'true', icon: icon});
    changeCoordinates(coordinates)

    marker.on('dragend',()=>{
        changeCoordinates(marker.getLatLng())
        })
    marker.addTo(map)
    reportIconchange(sendButtonIcon)
    activeMarker = marker
    }

function sendPoint(sendBackgorundchange, coordinates, changeCoordinates, type, changeFormDisplay){
    if(coordinates){
        sendBackgorundchange(plusIcon);
        console.log(coordinates)
        // axios.post(process.env.POINTS_URI,{coords:coordinates,type})
        changeCoordinates(false)
        activeMarker.dragging.disable()
        changeFormDisplay("none")
        activeMarker = false;

        }
}