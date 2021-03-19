import React, {useState} from 'react'
import {useMap} from 'react-leaflet'
import {Form} from './Form'
import L from 'leaflet'
import './assets/Animal.css'
import axios from 'axios'
import dogIcon from './assets/images/dogIcon.svg'
import catIcon from './assets/images/catIcon.svg'
import sendButtonIcon from './assets/images/SendButton.svg'
import plusIcon from './assets/images/plus.svg'
import closeIcon from './assets/images/closeIcon.svg'
import activeDog from './assets/images/activeDog.svg'
import activeCat from './assets/images/activeCat.svg'   


let activeMarker = false
let markSendit = false
let markerActive = false

export let Animal=React.memo((props)=>{
    console.log("animal rerendered")
    const [reportIcon,reportIconchange] = useState(plusIcon);
    const [coordinates,changeCoordinates] = useState();
    const [type, changeType] = useState();
    const [formDisplay, changeFormDisplay] = useState("none") 
    const [showCancel, changeShowCancel] = useState(false)
    const frecuence = {frecuence:1};


    let map = useMap()


    let typesOfAnimals = ["dog","cat"];
    const animalList = typesOfAnimals.map(
        (animalType)=>(
            <img
                src={animalType=="dog"?dogIcon:catIcon}
                key={animalType}
                className = {[animalType+"Option"]}

                draggable={true}
                onDragEnd={(ev)=>{
                    changeFormDisplay("block")
                    changeType(animalType);
                    addMark(reportIconchange, map, animalType, changeCoordinates, props.panelDisplay, ev)
                    changeShowCancel(true)  
                }
                }
                onClick={()=>{
                    changeFormDisplay("block")
                    changeType(animalType);
                    addMark(reportIconchange, map, animalType, changeCoordinates, props.panelDisplay)
                    changeShowCancel(true)    
                }
                }>
            </img>
        )
    );

    return (<div className="Animal">
            <Form display={formDisplay} frecuence = {frecuence}/>
            <div className="menu">
                {!showCancel&&
                <div className="options">
                    {animalList}
                </div>}
                {showCancel&&<img src={closeIcon} alt="Cancel Mark" className="cancelMarker" onClick={()=>{cancelMarker(changeShowCancel, changeFormDisplay, reportIconchange)}} />}
                <img    alt="Report an animal living in the street"
                        className="selector"
                        onClick={()=>{
                            sendPoint(reportIconchange, coordinates, type, changeFormDisplay, frecuence, changeShowCancel)}} 
                        src={reportIcon}
                />
            </div>    
            </div>        
        )
}
)
 
function addMark(reportIconchange, map, type, changeCoordinates, panelDisplay, ev={clientX:false}){
 
    markSendit=false
    markerActive=true
    if(activeMarker){map.removeLayer(activeMarker)}

    let icon = L.icon({
        iconUrl: type==="dog"?activeDog:activeCat,
        iconSize:     [38, 38]
    });
    let coordinates = ev.clientX? map.mouseEventToLatLng(ev) : (ev.screenX? map.containerPointToLatLng([ev.screenX-10,ev.screenY-110]):map.getCenter());
    
    let marker = L.marker(coordinates,{draggable:'true', icon: icon});
    changeCoordinates(coordinates)

    marker.on('dragend',()=>{
        changeCoordinates(marker.getLatLng())
        })
        
    marker.on('click',(e)=>{
        if(markSendit){
        let {lat,lng} = coordinates
        panelDisplay(lat, lng, 1)
        }
    })

    marker.addTo(map)
    reportIconchange(sendButtonIcon)
    activeMarker = marker
    }

async function sendPoint(changesendBackgorund, coordinates, type, changeFormDisplay, frecuence, changeShowCancel){

    if(markerActive){
        let icon = L.icon({
        iconUrl: type==="dog"?dogIcon:catIcon,
        iconSize:     [38, 38]
        });
        activeMarker.setIcon(icon)
        activeMarker.dragging.disable()
        activeMarker = false;
        changesendBackgorund(plusIcon);
        changeFormDisplay("none")
        changeShowCancel(false)
        let {status}=await axios.post(process.env.REACT_APP_POINTS_URI,{coords:coordinates, type, frecuence:frecuence.frecuence})
        console.log(status===200?"Dato registrado":"Error en el envio del punto")
        markSendit=true
        markerActive=false
        }
}

function cancelMarker(changeShowCancel,changeFormDisplay, reportIconchange){
    activeMarker.remove()
    changeShowCancel(false)
    changeFormDisplay("none")
    reportIconchange(plusIcon)
    markerActive=false
}