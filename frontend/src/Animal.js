import React, { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import { Form } from './Form'
import L from 'leaflet'
import { editFrecuences, getFrecuence } from "./GetMarkers";
import { Habitad } from './Habitad'
import './assets/Animal.css'
import axios from 'axios'
import dogIcon from './assets/images/dogIcon.svg'
import catIcon from './assets/images/catIcon.svg'
import sendButtonIcon from './assets/images/SendButton.svg'
import plusIcon from './assets/images/plus.svg'
import closeIcon from './assets/images/closeIcon.svg'


let activeMarker = false


const frecuence = { frecuence: 4 };

export let Animal = (props) => {

    let map = useMap()

    console.log("Animal rerendered")


    let initiailCoords = map.containerPointToLatLng(map.latLngToContainerPoint(map.getCenter()))

    const [areoptionsActive, togleAreoptionsActive] = useState(false)
    const [type, changeType] = useState();
    const [formDisplay, changeFormDisplay] = useState("none")
    const [markerCoords, setMarkerCoords] = useState({ center: initiailCoords, range: 0 })


    let typesOfAnimals = ["dog", "cat"];
    const animalList = typesOfAnimals.map(
        (animalType) => (
            <img
                src={animalType == "dog" ? dogIcon : catIcon}
                key={animalType}
                className={[animalType + "Option"]}

                draggable={false}

                onClick={() => {
                    changeFormDisplay("block")
                    changeType(animalType);
                    addMark(togleAreoptionsActive, map, setMarkerCoords)
                }
                }>
            </img>
        )
    );


    return (<div className="Animal">
        <div style={{ top: "-50px" }}></div>
        <Form display={formDisplay} frecuence={frecuence} />
        <Habitad
            habitadVisible={areoptionsActive}
            type={type}
            setMarkerCoords={setMarkerCoords} />
        <div className="menu">
            {!areoptionsActive &&
                <div className="options">
                    {animalList}
                </div>
            }
            {areoptionsActive &&
                <img src={closeIcon}
                    alt="Cancel Mark"
                    className="cancelMarker"
                    onClick={() => {
                        cancelMarker(changeFormDisplay, togleAreoptionsActive)
                    }
                    } />
            }
            <img alt="Report an animal living in the street"
                className="selector"
                onClick={() => {
                    sendPoint(togleAreoptionsActive,
                        type, changeFormDisplay,formDisplay, frecuence,
                        props.panelDisplay, map, markerCoords)
                }}
                src={areoptionsActive ? sendButtonIcon : plusIcon}
            />
        </div>
    </div>
    )
}


function addMark(togleAreoptionsActive, map, setMarkerCoords) {

    let center = map.latLngToContainerPoint(map.getCenter())
    if (activeMarker) { map.removeLayer(activeMarker) }

    setMarkerCoords(() => {
        let border = map.containerPointToLatLng({ x: center.x + 75, y: center.y })
        center = map.getCenter()
        let range = map.distance(center, border)
        return {
            center: center,
            range
        }
    })
    togleAreoptionsActive(true)
}

async function sendPoint(togleAreoptionsActive, type,
    changeFormDisplay, formularyDisplay,frecuence,
    panelDisplay, map, markerCoords) {


    if (formularyDisplay==="block") {
        let icon = L.icon({
            iconUrl: type === "dog" ? dogIcon : catIcon,
            iconSize: [38, 38]
        });


        let marker = L.marker(markerCoords.center, {
            icon: icon
        });

        marker.on('click', () => {
            console.log(activeMarker)
            if (!activeMarker) {
                let { lat, lng } = marker.getLatLng()
                console.log("oppening")
                panelDisplay(lat, lng, { frecuence: getFrecuence(lat + "" + lng) })
            }
        })

        marker.addTo(map)
        L.circle(markerCoords.center, { radius: markerCoords.range }).addTo(map);
        activeMarker = false;


        togleAreoptionsActive(false);
        changeFormDisplay("none")
        editFrecuences(frecuence.frecuence,
            markerCoords.center.lat + "" + markerCoords.center.lng,
            true)
        try {
            let { status } = await axios.post(process.env.REACT_APP_POINTS_URI, {
                coords: markerCoords.center,
                type,
                frecuence: frecuence.frecuence,
                range: markerCoords.range
            })
            console.log(status === 200 ? "Dato registrado" : "Error en el envio del punto")

        } catch (err) {
            console.log(err)
        }
    }
}

function cancelMarker(changeFormDisplay, togleAreoptionsActive) {

    changeFormDisplay("none")
    togleAreoptionsActive(false)
}