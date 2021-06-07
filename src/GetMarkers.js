import axios from 'axios'
import dogIcon from './assets/images/dogIcon.svg'
import catIcon from './assets/images/catIcon.svg'
import { useMap, useMapEvents } from "react-leaflet";
import L, { divIcon, Marker } from 'leaflet'

let markersLoaded = [{ coordinates: "0" }]

export let GetMarkers = (props) => {
  console.log("Get markers render")

  let map = useMap();

  map.locate()

  getp(map, props)

  map.on('locationfound', (e) => {

    map.panTo(e.latlng, map.getZoom())
    getp(map, props)
  })

  map.on('dragend', () => {
    getp(map, props)
  })

  //hacer las peticiones solo en zoomout
  let actualZoom = map.getZoom()
  map.on('zoomend', () => {
    if (map.getZoom() < actualZoom) {
      getp(map, props)
      actualZoom = map.getZoom()
    }

  }
  )
  return null
}

let getp = (map, props) => {
  let { _northEast, _southWest } = map.getBounds()

  let lowerlat = 1.1 * _southWest.lat - Math.abs(0.1 * _northEast.lat)
  let upperlat = 1.1 * _northEast.lat - 0.1 * _southWest.lat
  let diff = Math.abs(_northEast.lng - _southWest.lng) < Math.abs(_southWest.lng + _northEast.lng) ?
    Math.abs(_northEast.lng - _southWest.lng) : Math.abs(_southWest.lng + _northEast.lng)
  let lowerlng = _southWest.lng - 0.1 * diff
  let upperlng = _northEast.lng + 0.1 * diff

  let coordsLoaded = Object.keys(markersLoaded)
  axios.get(process.env.REACT_APP_POINTS_URI, {
    params: {
      lowerlat,
      upperlat,
      lowerlng,
      upperlng,
      markersLoaded: coordsLoaded
    }
  }).then((res) => {
    if (res.status === 200) {
      //console.log("ok")
      let dogIconM = new L.icon({
        iconUrl: dogIcon,
        iconSize: [37, 37]
      })

      let catIconM = new L.icon({
        iconUrl: catIcon,
        iconSize: [37, 37]
      })

      res.data.forEach((marker, index) => {


        let newmarker = L.marker({ lat: marker.lat, lng: marker.lng },
          { icon: marker.type === "dog" ? dogIconM : catIconM });
        newmarker.addTo(map)

        newmarker.on("click", () => {
          props.open(marker.lat, marker.lng, { frecuence: markersLoaded[marker.lat + "" + marker.lng].frecuence })
        })
        markersLoaded[marker.lat + "" + marker.lng] = { frecuence: marker.frecuence }
      });
    } else {
      console.log("Db error")
    }
  }).catch((err) => {
    console.log("Network error")
  })

}

export let editFrecuences = (frecuence, coords, newMark = false) => {
  frecuence = frecuence >= 5 ? 5 : frecuence
  if (newMark) {
    frecuence = frecuence > 10 ? 10 : frecuence
    markersLoaded[coords] = { frecuence: frecuence }
  }
  else {
    markersLoaded[coords].frecuence = frecuence
  }
}
export let getFrecuence = (coords) => {
  return markersLoaded[coords].frecuence
}