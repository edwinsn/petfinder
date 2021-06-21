import React, { useRef, useState } from 'react'
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
import { UploadPhoto } from './UploadPhoto'
import cameraIcon from './assets/images/cameraIcon.svg'

let activeMarker = false

const frecuence = { frecuence: 4 };

export let Animal = (props) => {

    let map = useMap()

    console.log("Animal rerendered")


    let initiailCoords = map.containerPointToLatLng(map.latLngToContainerPoint(map.getCenter()))

    const [options, setOptions] = useState({ active: false, miniature: undefined })
    //use useRef for no rendering data
    const [type, changeType] = useState();
    const [markerCoords, setMarkerCoords] = useState({ center: initiailCoords, range: 0 })
    //
    const [uploadPhotoWindow, togleUploadPhotoWindow] = useState(undefined)
    const [isRangeInvalid, setIsRangeInvalid] = useState(false)


    let typesOfAnimals = ["dog", "cat"];
    const animalList = typesOfAnimals.map(
        (animalType) => (
            <img
                src={animalType == "dog" ? dogIcon : catIcon}
                key={animalType}
                className={[animalType + "Option"]}
                draggable={false}

                onClick={() => {
                    changeType(animalType);
                    addMark(setOptions, map, setMarkerCoords)
                }
                }>
            </img>
        )
    );


    return (<div className="Animal">
        <div style={{ top: "-50px" }}></div>
        <Form display={options.active ? "block" : "none"} frecuence={frecuence} />
        <Habitad
            habitadVisible={options.active}
            type={type}
            setMarkerCoords={setMarkerCoords} />
        <UploadPhoto
            show={uploadPhotoWindow && options.active}
            file={uploadPhotoWindow}
            closeWindow={() => { togleUploadPhotoWindow(undefined) }}
            setMiniature={
                (miniature) => {
                    setOptions((pre) => {
                        return { active: pre.active, miniature }
                    })
                }
            } />
        {isRangeInvalid &&
            <div className="invalidRange">El área verde debe ser menor a 1km</div>
        }
        <div className="menu">
            {!options.active &&
                <div className="animalOptions">
                    {animalList}
                </div>
            }
            {options.active &&
                <div className="options">

                    <label
                        className="cameraIcon"
                        alt="add a picture">

                        <img src={options.miniature ? options.miniature : cameraIcon} at="añade una imagen del animal" />
                        <input type="file" onChange={(ev) => {
                            togleUploadPhotoWindow(ev.target.files[0])
                        }
                        }></input>
                    </label>
                    <img src={closeIcon}
                        alt="Cancel Mark"
                        className="cancelMarker"
                        onClick={() => {
                            cancelMarker(setOptions)
                        }
                        } />
                </div>
            }
            <img alt="Report an animal living in the street"
                className="selector"
                onClick={() => {
                    sendPoint(setOptions,
                        type, options.active, frecuence,
                        props.panelDisplay, map, markerCoords, setIsRangeInvalid)
                }}
                src={options.active ? sendButtonIcon : plusIcon}
            />
        </div>
    </div>
    )
}


function addMark(setOptions, map, setMarkerCoords) {

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
    setOptions({ active: true, miniature: undefined })
}

async function sendPoint(setOptions, type,
    areoptionsActive, frecuence,
    panelDisplay, map, markerCoords, setIsRangeInvalid) {


    if (areoptionsActive) {
        if (markerCoords.range > 1000) {
            setTimeout(()=>{
                setIsRangeInvalid(false)
            },3000)
            setIsRangeInvalid(true)
        }
        else {
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


            setOptions({ active: false, miniature: undefined });
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
}

function cancelMarker(setOptions) {
    setOptions({ active: false, miniature: undefined })
}