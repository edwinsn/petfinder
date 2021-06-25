import React, { useRef, useState } from 'react'
import { useMap } from 'react-leaflet'
import { Form } from './Form'
import L from 'leaflet'
import { editFrecuences, getFrecuence } from "./GetMarkers";
import { UploadPhoto } from './UploadPhoto'
import { Habitad } from './Habitad'
import './assets/Animal.css'
import axios from 'axios'
import dogIcon from './assets/images/dogIcon.svg'
import catIcon from './assets/images/catIcon.svg'
import sendButtonIcon from './assets/images/SendButton.svg'
import plusIcon from './assets/images/plus.svg'
import closeIcon from './assets/images/closeIcon.svg'
import cameraIcon from './assets/images/cameraIcon.svg'
import { Notifications } from './Notifications'


import firebase from 'firebase/app'
import 'firebase/storage'
import { config } from './config'

firebase.initializeApp(config)
const storage = firebase.storage()


let activeMarker = false

const frecuence = { frecuence: 4 };

export let Animal = (props) => {

    let map = useMap()

    console.log("Animal rerendered")


    let initiailCoords = map.containerPointToLatLng(map.latLngToContainerPoint(map.getCenter()))

    const [options, setOptions] = useState({ active: false, miniature: undefined })
    const file = useRef(undefined)
    const notifications = useRef()
    const updateNotifications = (progress, showProgress, showOutOfRange) => { notifications.current.update(progress, showProgress, showOutOfRange) }
    const type = useRef();


    const markerCoords = useRef({ center: initiailCoords, range: 0 })
    let setMarkerCoords = (newCurrent) => {

        if ((typeof newCurrent) === "function") {
            markerCoords.current = newCurrent(markerCoords.current)
        }
        else {
            markerCoords.current = newCurrent
        }

    }

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
                    type.current = animalType;
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
            type={type.current}
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
                }}
            saveFile={(newFile) => {
                file.current = newFile
                console.log(file.current)
            }}
        />
        <Notifications ref={notifications} />

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
                        }
                            accept="image/*"></input>
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
                        type.current, options.active, frecuence,
                        props.panelDisplay, map, markerCoords.current,
                        updateNotifications, file)
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
    panelDisplay, map, markerCoords,
    updateNotifications, file) {


    if (areoptionsActive) {
        if (markerCoords.range > 400) {
            setTimeout(() => {
                updateNotifications(0, false, false)
            }, 3000)
            updateNotifications(0, false, true)
        }
        else {
            let icon = L.icon({
                iconUrl: type === "dog" ? dogIcon : catIcon,
                iconSize: [38, 38]
            });


            let marker = L.marker(markerCoords.center, {
                icon: icon
            });


            marker.addTo(map)
            const circle = L.circle(markerCoords.center, { radius: markerCoords.range })
            circle.addTo(map);
            activeMarker = false;


            setOptions({ active: false, miniature: undefined });

            try {
                //console.log(file.current)
                if (file.current) {
                    let fileName = markerCoords.center + ""
                    const uploadTask = storage.ref(`images/${fileName}`).put(file.current);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {

                            const progress = Math.round(100 * snapshot.bytesTransferred / snapshot.totalBytes)
                            updateNotifications(progress, true)
                            //console.log(progress)
                            if (progress == 100) {
                                setTimeout(() => { updateNotifications(0, false) }, 400)
                            }

                        },
                        err => {
                            //by some misterious reazon i can't pass more than 3 arguments
                            updateNotifications()
                            marker.removeFrom(map)
                            circle.removeFrom(map)
                        },
                        async () => {
                            let imgurl = await storage
                                .ref("images")
                                .child(fileName)
                                .getDownloadURL()

                            console.log(imgurl)

                            marker.on('click', () => {
                                //console.log(activeMarker)
                                if (!activeMarker) {
                                    let { lat, lng } = marker.getLatLng()
                                    //console.log("oppening")
                                    panelDisplay(lat, lng, { frecuence: getFrecuence(lat + "" + lng), imgurl })
                                }
                            })
                            try {
                                let { status } = await axios.post(process.env.REACT_APP_POINTS_URI, {
                                    coords: markerCoords.center,
                                    type,
                                    frecuence: frecuence.frecuence,
                                    range: markerCoords.range,
                                    imgurl
                                }, config)
                                console.log(status === 200 ? "Dato registrado" : "Error en el envio del punto")
                            } catch (err) {
                                console.log(err)
                            }
                        }
                    )

                    let imgurl = URL.createObjectURL(file.current)

                    marker.on('click', () => {
                        //console.log(activeMarker)
                        if (!activeMarker) {
                            let { lat, lng } = marker.getLatLng()
                            //console.log("oppening")
                            panelDisplay(lat, lng, { frecuence: getFrecuence(lat + "" + lng), imgurl })
                        }
                    })

                }
                else {

                    marker.on('click', () => {
                        //console.log(activeMarker)
                        if (!activeMarker) {
                            let { lat, lng } = marker.getLatLng()
                            //console.log("oppening")
                            panelDisplay(lat, lng, { frecuence: getFrecuence(lat + "" + lng) })
                        }
                    })

                    let { status } = await axios.post(process.env.REACT_APP_POINTS_URI, {
                        coords: markerCoords.center,
                        type,
                        frecuence: frecuence.frecuence,
                        range: markerCoords.range
                    }, config)
                    console.log(status === 200 ? "Dato registrado" : "Error en el envio del punto")

                }


                editFrecuences(frecuence.frecuence,
                    markerCoords.center.lat + "" + markerCoords.center.lng,
                    true)

                file.current = undefined

            } catch (err) {
                console.log(err)
            }
        }
    }
}

function cancelMarker(setOptions) {
    setOptions({ active: false, miniature: undefined })
}