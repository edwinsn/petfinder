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
import refugeIcon from './assets/images/refugeIcon.svg'

//of-on icon 
let markersLoadedCoords = [{ coordinates: "0" }]
let markersLoaded = []
let refugesLoaded = ["0"]
let panes = []
let prevUserid = false
let previousCircle

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
    //getp(map, props, setEditing, updateNotifications)

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
            color: store.getState().editing.value ? '#3BF793' : "#3388FF"
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
  //console.log("...")
  let { _northEast, _southWest } = map.getBounds()

  let lowerlat = 1.1 * _southWest.lat - Math.abs(0.1 * _northEast.lat)
  let upperlat = 1.1 * _northEast.lat - 0.1 * _southWest.lat
  let diff = Math.abs(_northEast.lng - _southWest.lng) < Math.abs(_southWest.lng + _northEast.lng) ?
    Math.abs(_northEast.lng - _southWest.lng) : Math.abs(_southWest.lng + _northEast.lng)
  let lowerlng = _southWest.lng - 0.1 * diff
  let upperlng = _northEast.lng + 0.1 * diff

  let coordsLoaded = Object.keys(markersLoadedCoords)

  getRefuges(map.getCenter(), map.distance(_northEast, _southWest) / 2, map)

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
        iconSize: [38, 38]
      })

      let catIconM = new L.icon({
        iconUrl: catIcon,
        iconSize: [35, 35]
      })

      let editing = store.getState().editing.value

      //      console.log(res.data)
      res.data.forEach((marker) => {

        let newmarker = L.marker({ lat: marker.lat, lng: marker.lng },
          { icon: marker.type === "dog" ? dogIconM : catIconM,zIndexOffset:2 });
        newmarker.addTo(map)

        let circle
        let editable = marker.userid === props.userid && editing
        let color = editable ? '#3BF793' : "#3388FF"
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
            previousCircle?.setStyle({
              color: '#3388FF'
            })
            circle.setStyle({
              color: '#2914CC',
              fillColor: '#3388FF'
            })
            previousCircle = circle
            props.open(marker.lat, marker.lng,
              {
                frecuence: markersLoadedCoords[marker.lat + "" + marker.lng].frecuence,
                imgurl: marker.imgurl ? marker.imgurl : marker.type == "dog" ? dogIcon : catIcon,
                description: marker.description,
                contact: marker.contact,
                unpaintCircle: () => {
                  previousCircle?.setStyle({
                    color: '#3388FF'
                  })
                }
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

let getRefuges = async ({ lat, lng }, radius, map) => {

  let refugeI = new L.icon({
    iconUrl: refugeIcon,
    iconSize: [38, 38]
  })

  try {
    let { data } = await axios.get(process.env.REACT_APP_POINTS_URI + "refuges", {
      params: {
        lat,
        lng,
        radius,
        refugesLoaded
      }
    })
    data.forEach(refuge => {

      refugesLoaded.push(refuge.lat + "" + refuge.lng)
      let newmarker = L.marker({ lat: refuge.lat, lng: refuge.lng },
        {
          icon: refugeI,
          iconSize: [38, 38]
        });
      newmarker.bindPopup(
        `<b>${refuge.name}</b><br/><br />
        <div class="lds-ring">
          <div style={{ borderColor: color }}></div><div></div><div></div><div></div>
        </div>`)

        .on('popupopen', function (popup) {
          axios.get(process.env.REACT_APP_POINTS_URI + "refugeDatails", {
            params: { _id: refuge._id }
          })
            .then((res) => {
              popup.popup.setContent(
                `<b class="red">${refuge.name}</b><br/>
                ${res.data.formatted_address ?
                  `<b>Direccion:</b><br />${res.data.formatted_address}<br />` : ""
                }
                ${res.data.formatted_phone_number ?
                  `<b>Telefono:</b><br />${res.data.formatted_phone_number}<br />` : ""
                }
                ${res.data.website ?
                  `<b>Sitio web:</b><br />${res.data.website}` : ""
                }`
              )
            })
        })
      newmarker.addTo(map)
    });
  }
  catch (err) {
    console.log(err)
  }
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