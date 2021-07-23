import axios from 'axios'
import dogIcon from './assets/images/dogIcon.svg'
import catIcon from './assets/images/catIcon.svg'
import { useMap } from "react-leaflet";
import L from 'leaflet'
import { Animal } from './Animal'
import { useEffect, useState } from 'react';
import store from './store'
import { useDispatch } from 'react-redux'
import { showNotifications } from "./features/notificationsSlice"

//of-on icon 
let markersLoadedCoords = [{ coordinates: "0" }]
let markersLoaded = []
let panes = []
let prevUserid = false

export let GetMarkers = (props) => {

  //console.log("Get markers render")


  let map = useMap();
  let [editing, setEditing] = useState({ active: false, type: "dog", coords: { lat: false, lng: false } })

  let dispatch = useDispatch()
  const updateNotifications = (noEditable, withoutConnection) => {
    dispatch(showNotifications({ noEditable, withoutConnection }))
  }

  if (prevUserid != props.userid) {
    prevUserid = props.userid
    //console.log("updating marks")
    markersLoadedCoords = [{ coordinates: "0" }]
    getp(map, props, setEditing, updateNotifications)
    for (let i = 0; i < markersLoaded.length; i++) {
      markersLoaded[i].removeFrom(map)
      panes[i].pane.removeFrom(map)
    }
  }

  useEffect(() => {

    map.locate({ setView: true, maxZoom: 16 })
    getp(map, props, setEditing, updateNotifications)

    map.on('locationfound', (e) => {

      getp(map, props, setEditing, updateNotifications)
    })

    map.on('dragend', () => {
      getp(map, props, setEditing, updateNotifications)
    })
    map.on('zoomend', () => {
      if (map.getZoom() < actualZoom) {
        getp(map, props, setEditing, updateNotifications)
        actualZoom = map.getZoom()
      }
    }
    )
    store.subscribe(() => {
      //console.log(store.getState().editing.value)
      //console.log(panes)
      //console.log("...")
      for (let i = 0; i < panes.length; i++) {

        if (panes[i].editable) {
          //          console.log(panes[i].pane.setStyle)
          panes[i].pane.setStyle({
            color: store.getState().editing.value ? '#ffab2e79' : "#3388FF"
          });
        }
      }

    })
  }, [])


  //hacer las peticiones solo en zoomout
  let actualZoom = map.getZoom()

  return (
    <Animal editing={editing.active}
      setEditing={setEditing}
      userid={props.userid}
      panelDisplay={props.open}
      open={props.open}
      panes={panes}
      defaultMarkerData={editing.markerData}
    />)

}

let getp = (map, props, setEditing, updateNotifications) => {
  console.log("...")
  let { _northEast, _southWest } = map.getBounds()

  let lowerlat = 1.1 * _southWest.lat - Math.abs(0.1 * _northEast.lat)
  let upperlat = 1.1 * _northEast.lat - 0.1 * _southWest.lat
  let diff = Math.abs(_northEast.lng - _southWest.lng) < Math.abs(_southWest.lng + _northEast.lng) ?
    Math.abs(_northEast.lng - _southWest.lng) : Math.abs(_southWest.lng + _northEast.lng)
  let lowerlng = _southWest.lng - 0.1 * diff
  let upperlng = _northEast.lng + 0.1 * diff

  let coordsLoaded = Object.keys(markersLoadedCoords)
  axios.get(process.env.REACT_APP_POINTS_URI, {
    params: {
      lowerlat,
      upperlat,
      lowerlng,
      upperlng,
      markersLoaded: coordsLoaded,
      userid: props.userid
    }
  }).then((res) => {
    if (res.status === 200) {
      //console.log("ok")
      let dogIconM = new L.icon({
        iconUrl: dogIcon,
        iconSize: [35, 35]
      })

      let catIconM = new L.icon({
        iconUrl: catIcon,
        iconSize: [35, 35]
      })

      let editing = store.getState().editing.value

      //      console.log(res.data)
      res.data.forEach((marker) => {

        let newmarker = L.marker({ lat: marker.lat, lng: marker.lng },
          { icon: marker.type === "dog" ? dogIconM : catIconM });
        newmarker.addTo(map)

        let circle
        let editable = marker.userid === props.userid && editing
        let color = editable ? '#ffab2e79' : "#3388FF"
        if (marker.range) {
          circle = L.circle({ lat: marker.lat, lng: marker.lng }, {
            radius: marker.range,
            color
          })
          circle.addTo(map);
        }
        else {
          circle = L.circle({ lat: marker.lat, lng: marker.lng }, { radius: 100, color })
          circle.addTo(map);
        }
        panes.push({ pane: circle, editable: marker.userid == props.userid })
        markersLoaded.push(newmarker)
        //console.log(panes)

        newmarker.on("click", () => {

          if (!store.getState().editing.value) {
            props.open(marker.lat, marker.lng,
              {
                frecuence: markersLoadedCoords[marker.lat + "" + marker.lng].frecuence,
                imgurl: marker.imgurl ? marker.imgurl : marker.type == "dog" ? dogIcon : catIcon,
                description: marker.description,
                contact: marker.contact
              })
          }
          else if (marker.userid != props.userid) {
            updateNotifications(true)
            setTimeout(() => {
              updateNotifications(false)
            }, 2500)
          }
          else {
            //console.log(marker)
            circle.removeFrom(map)
            newmarker.removeFrom(map)
            setEditing({
              active: true,

              markerData: {
                type: marker.type,
                defaultMarkerData: {
                  type: marker.type,
                  coords: { lat: marker.lat, lng: marker.lng },
                  range: marker.range,
                  frecuence: marker.frecuence,
                  imgurl: marker.imgurl,
                  description: marker.description,
                  contact: marker.contact,
                  range: marker.range ? marker.range : 100,
                  _id: marker._id

                },
                coords: { lat: marker.lat, lng: marker.lng },
                frecuence: marker.frecuence,
                imgurl: marker.imgurl,
                description: marker.description,
                contact: marker.contact,
                range: marker.range ? marker.range : 100,
                _id: marker._id
              }
            })
            //console.log(editing)
          }
        })
        markersLoadedCoords[marker.lat + "" + marker.lng] = { frecuence: marker.frecuence }
      }
      );
    } else {
      console.log("Db error")
    }
  }).catch((err) => {
    //console.log(err)
    updateNotifications(false, true)
    setTimeout(() => { updateNotifications() }, 3000)
    console.log("Network error")
  })

}

export let editFrecuences = (frecuence, coords, newMark = false) => {
  frecuence = frecuence >= 5 ? 5 : frecuence
  if (newMark) {
    frecuence = frecuence > 10 ? 10 : frecuence
    markersLoadedCoords[coords] = { frecuence: frecuence }
  }
  else {
    markersLoadedCoords[coords].frecuence = frecuence
  }
}
export let getFrecuence = (coords) => {
  return markersLoadedCoords[coords].frecuence
}