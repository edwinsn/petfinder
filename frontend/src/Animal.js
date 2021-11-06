import React, { useState, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { Form } from './Form'
import { editFrecuences } from "./GetMarkers";
import { UploadPhoto } from './UploadPhoto'
import { Habitad } from './Habitad'
import './assets/Animal.css'
import axios from 'axios'
import dogIcon from './assets/images/dogIcon.svg'
import catIcon from './assets/images/catIcon.svg'
import plusIcon from './assets/images/plus .svg'
import closeIcon from './assets/images/closeIcon.svg'
import cameraIcon from './assets/images/cameraIcon.svg'
import userIcon from './assets/images/userIcon.svg'
import petsIcon from './assets/images/petsIcon.svg'
import pointsIcon from './assets/images/points.svg'
import trashIcon from './assets/images/trashIcon.svg'
import sendIcon from './assets/images/sendIcon.svg'
import { useDispatch } from 'react-redux'
import { showNotifications } from "./features/notificationsSlice"
import { deactivate } from './features/editingSlice';
import store from './store'
import { storage } from './fire'
import { addBackup } from './features/recoverSlice';
import {open} from './features/panelSlice'


let activeMarker = false
let lastMarkAdded = undefined
let lastCircleAdded = undefined
let markerData = {}
let updateNotifications

const frecuence = { frecuence: 4 };

export let Animal = (props) => {

    let map = useMap()


    let { defaultMarkerData, editing, setEditing, panes } = props

    defaultMarkerData = defaultMarkerData ? defaultMarkerData : {}

    markerData = markerData._id === defaultMarkerData._id ? markerData : { ...defaultMarkerData }
    markerData.coords = markerData.coords || map.getCenter()
    markerData.range = markerData.range ? markerData.range : 178
    markerData.frecuence = markerData.frecuence ? markerData.frecuence : 3

    //console.log(markerData.defaultMarkerData)

    const [options, setOptions] = useState({ active: editing, miniature: undefined })
    const [uploadPhotoWindow, togleUploadPhotoWindow] = useState(undefined)

    let setMiniature = (miniature) => {
        console.log("setting miniture")
        setOptions((pre) => {
            return { active: pre.active, miniature }
        })
    }

    let setMarkerCoordsandRange = (newCurrent) => {

        if ((typeof newCurrent) === "function") {
            let newData = newCurrent({ coords: markerData.coords, range: markerData.range })
            markerData.coords = newData.coords
            markerData.range = newData.range

        }
        else {
            markerData.coords = newCurrent.coords
            markerData.range = newCurrent.range
        }

    }

    let dispatch = useDispatch()

    useEffect(() => {

        updateNotifications = (progress, showProgress, showOutOfRange, noEditable, withoutConnection) => {
            dispatch(showNotifications({ progress, showProgress, showOutOfRange, noEditable, withoutConnection }))
        }

        window.onkeydown = (ev) => {
            if (ev.key === "Escape") {
                console.log("escape")
                cancelMarker(setOptions, markerData, activeMarker, map, setEditing, panes, props.open)
                if (store.getState().editing.value) {
                    dispatch(deactivate())
                }
            }
        }

        store.subscribe(() => {
            if (!store.getState().editing.value && !editing) {
                console.log("cancelling")
                cancelMarker(setOptions, markerData, options.active, map, setEditing, panes, props.open, !store.getState().notifications.withoutConnection)
            }
        })

    }, [])


    let typesOfAnimals = ["dog", "cat"];
    const animalList = typesOfAnimals.map(
        (animalType) => (
            <div
                key={animalType}
                className={[animalType + "Option circular"]}>
                <img
                    src={animalType == "dog" ? dogIcon : catIcon}
                    draggable={false}

                    onClick={() => {
                        if (activeMarker) { map.removeLayer(activeMarker) }
                        markerData.type = animalType;
                        markerData.coords = map.getCenter()
                        activeMarker = true
                        setOptions({ active: true, miniature: undefined })
                    }
                    }>
                </img>
            </div>
        )
    );


    return (
        <div className="Animal">

            <Habitad
                habitadVisible={options.active || editing}
                markerData={markerData}
                setMarkerCoords={setMarkerCoordsandRange}
            />

            {(!editing && !options.active) &&
                <div className="menu">
                    <>
                        <div className="animalOptions">
                            {animalList}
                        </div>
                        <img alt="Report an animal living in the street"
                            className="selector"
                            src={plusIcon}
                        />
                    </>
                </div>}
            {(options.active || editing) &&
                <div className="optionsContainer"

                >

                    <UploadPhoto
                        show={uploadPhotoWindow && options.active}
                        file={uploadPhotoWindow}
                        closeWindow={() => { togleUploadPhotoWindow(undefined) }}
                        setMiniature={setMiniature}
                        saveFile={(newFile) => {
                            markerData.file = newFile
                        }}
                    />

                    <form className="options"
                        onSubmit={(ev) => {
                            ev.preventDefault()
                            if (options.active || editing) {

                                sendPoint(setOptions, props.panelDisplay, map,
                                    updateNotifications, ev, props.userid,
                                    props.editing, setEditing, markerData, panes, options, props.open);
                            }
                        }}

                        onMouseEnter={() => { map.dragging.disable() }}
                        onMouseLeave={() => { map.dragging.enable() }}
                        onTouchStart={() => { map.dragging.disable() }}
                        onTouchEnd={() => { map.dragging.enable() }}
                    >
                        <div id="moreOptionsContainer" className="hide-scroll">

                            <div className="moreOptions">
                                <div>
                                    <label for="description">Descripción</label>
                                    <div>
                                        <img src={petsIcon} alt="descripción" className="petsIcon icon" />
                                        <textarea
                                            id="description"
                                            type="text" defaultValue={markerData.description}></textarea>
                                    </div>
                                </div>
                                <div className="contactContainer">
                                    <label for="contact">Contacto</label>
                                    <div>
                                        <img className="userIcon icon" src={userIcon}></img>
                                        <input id="contact" type="text" defaultValue={markerData.contact}></input>
                                    </div>
                                </div>
                                <div>
                                    <div>¿Cuantas veces le has visto?</div>
                                    <Form display="block" frecuence={frecuence} defaultValue={markerData.frecuence} setFrecuence={(f) => { markerData.frecuence = f }} />
                                </div>

                                <label className="cameraIconContainer">
                                    <label
                                        className="cameraIcon"
                                        alt="add a picture">

                                        <img src={options.miniature ? options.miniature : cameraIcon} alt="añade una imagen del animal" />
                                        <input type="file" onChange={(ev) => {
                                            let actualImg = ev.target.files[0]
                                            markerData.file = actualImg
                                            togleUploadPhotoWindow(actualImg)
                                            setOptions(pre => { return { active: true, miniature: pre.miniature } })
                                        }
                                        }
                                            accept="image/*"></input>
                                    </label>
                                    <span>Añade una foto</span>
                                </label>

                            </div>
                            <span><img src={pointsIcon} /></span>

                        </div>

                        <div className="mainOptions">
                            <label className="circular sendIcon">
                                <input type="submit" value=""></input>
                                <img src={sendIcon} alt="enviar" />
                            </label>
                            <img src={closeIcon}
                                alt="cancelar"
                                className="cancelMarker circular"
                                onClick={() => {
                                    cancelMarker(setOptions, markerData, options.active, map, setEditing, panes, props.open)
                                }
                                } />
                            {editing &&
                                <img src={trashIcon}
                                    alt="Eliminar"
                                    className="circular"
                                    onClick={async () => {
                                        try {
                                            props.setEditing(false)
                                            cancelMarker(setOptions, markerData, true, map, false, panes, props.open)
                                            let { data } = await axios.delete(process.env.REACT_APP_POINTS_URI, { data: { _id: markerData._id, userid: props.userid } })
                                            let marker = defaultMarkerData
                                            marker._id = data._id
                                            marker.lat = defaultMarkerData.coords.lat
                                            marker.lng = defaultMarkerData.coords.lng
                                            marker.coords = undefined
                                            marker.defaultMarkerData = undefined
                                            //console.log(marker)
                                            dispatch(addBackup(Object.assign({}, marker)))
                                        } catch (e) {
                                            updateNotifications(false, false, false, false, true)
                                            setTimeout(() => { updateNotifications() }, 2000)
                                            console.log("256")
                                            console.log(e)
                                        }
                                    }
                                    }
                                />
                            }
                        </div>

                    </form>
                </div>
            }

        </div >
    )
}

async function sendPoint(setOptions, panelDisplay, map,
    updateNotifications, ev, userid,
    editing, setEditing, markerData, panes, options, open) {


    if (setEditing) setEditing({ active: false })

    map.dragging.enable()

    let newdescription = ev.target[0].value
    let newcontact = ev.target[1].value
    // error
    //console.log(newdescription)
    markerData.description = newdescription
    markerData.contact = newcontact ? newcontact : markerData.contact
    markerData.userid = userid

    if (markerData.range > 400) {
        setTimeout(() => {
            updateNotifications(0, false, false)
        }, 3000)
        updateNotifications(0, false, true)
    }
    else {

        activeMarker = false;

        setOptions({ active: false, miniature: undefined });

        try {

            let localimgurl

            if (markerData.file) {
                let { lat, lng } = markerData.coords
                let fileName = `LatLng(${lat}, ${lng})${markerData.file.name}`

                const uploadTask = storage.ref(`images/${fileName}`).put(markerData.file);


                uploadTask.on(
                    "state_changed",
                    (snapshot) => {

                        const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes)
                        updateNotifications(progress, true)
                        //console.log(progress)
                        if (progress == 1) {
                            setTimeout(() => { updateNotifications(0, false) }, 400)
                        }

                    },
                    err => {

                        if (!(err.code === "storage/unauthorized")) {
                            updateNotifications()
                            lastMarkAdded.removeFrom(map)
                            lastCircleAdded.removeFrom(map)
                        }
                    },
                    async () => {
                        let imgurl = await storage
                            .ref("images")
                            .child(fileName)
                            .getDownloadURL()

                        //console.log(lastCircleAdded)
                        lastMarkAdded?.removeFrom?.(map)
                        lastCircleAdded?.removeFrom?.(map)
                        markerData = { ...markerData, imgurl, localimgurl: undefined }
                        addPermanentMark(markerData, panelDisplay,
                            userid, editing, setEditing, map, panes)

                    }
                )

                localimgurl = URL.createObjectURL(markerData.file)
                markerData = { ...markerData, localimgurl }
                addPermanentMark(
                    markerData, panelDisplay,
                    userid, editing, setEditing, map, panes)
            }
            else {

                addPermanentMark(
                    markerData, panelDisplay,
                    userid, editing, setEditing, map, panes)
            }

            editFrecuences(frecuence.frecuence,
                markerData.coords.lat + "" + markerData.coords.lng, true)

            markerData.file = undefined

        } catch (err) {

            //mostrar error de conexion o de repeticion de dato (dato guardado :))
            updateNotifications(false, false, false, false, true)
            cancelMarker(setOptions, markerData, options, map, setEditing, panes, open, true)

            //console.log(err)
        }
    }

}

async function addPermanentMark(markerData, panelDisplay,
    userid, editing, setEditing, map, panes) {

    //console.log(panes)
    addMarkToMap(markerData, map, setEditing, panes, panelDisplay)

    if (!markerData.localimgurl) {

        let data = {
            newlat: markerData.coords.lat,
            newlng: markerData.coords.lng,
            ...markerData,
            userid,
        }

        let res

        try {
            if (!editing) {
                console.log("postin")
                res = await axios.post(process.env.REACT_APP_POINTS_URI, data)//, config)
                //console.log(res.data)
                markerData._id = res.data._id
                lastMarkAdded.removeFrom(map)
                lastCircleAdded.removeFrom(map)
                addMarkToMap(markerData, map, setEditing, panes, panelDisplay)

            } else {
                console.log("updating")
                markerData.defaultMarkerData = undefined
                markerData.defaultMarkerData = Object.assign({}, markerData)
                //console.log(markerData)
                res = await axios.put(process.env.REACT_APP_POINTS_URI, { ...data, relocating: true })//, config)
            }
            console.log(res.status === 200 ? "Dato registrado" : "Error en el envio del punto")
        } catch (err) {
            console.log(err)
            updateNotifications(false, false, false, false, true)
            try {
                lastMarkAdded.removeFrom(map)
                lastCircleAdded.removeFrom(map)
            }
            catch (err) { console.log(err) }
            setTimeout(updateNotifications, 2500)
        }
    }
}

function addMarkToMap(markerData, map, setEditing, panes) {

    //console.log("adding mark")

    if (setEditing) { setEditing({ active: false }) }

    let icon = L.icon({
        iconUrl: markerData.type === "dog" ? dogIcon : catIcon,
        iconSize: markerData.type === "dog" ? [38, 38] : [35, 35]
    });
    let marker = L.marker(markerData.coords, {
        icon: icon, zIndexOffset: 3
    });

    marker.addTo(map)

    const circle = L.circle(markerData.coords, { radius: markerData.range, color: store.getState().editing.value ? "#3BF793" : "#3388FF" })
    circle.addTo(map);

    panes.push({ pane: circle, editable: true })
    //probar sin conexion la ultima marca debe ser eliminada
    lastMarkAdded = marker
    lastCircleAdded = circle

    markerData.defaultMarkerData = markerData.defaultMarkerData ? markerData.defaultMarkerData : { ...markerData }
    markerData.defaultMarkerData.coords = markerData.coords
    markerData.defaultMarkerData.range = markerData.range

    marker.on("click", () => {

        if (!store.getState().editing.value) {
            store.dispatch(open(markerData))
        }
        else {
            circle.removeFrom(map)
            marker.removeFrom(map)
            setEditing({
                active: true,
                markerData
            })
        }
    })

    map.dragging.enable()
}

function cancelMarker(setOptions, markerData, options, map, setEditing, panes, open, error = false) {

    if (options) {
        setOptions({ active: false, miniature: undefined })
        activeMarker = false
    }
    map.dragging.enable()

    if (setEditing && markerData.defaultMarkerData && !error) {
        //console.log("here again", error)
        let aux = { ...markerData }
        aux.defaultMarkerData = undefined
        markerData = markerData.defaultMarkerData
        markerData.defaultMarkerData = aux
        addMarkToMap(markerData, map, setEditing, panes, open)
    }
}