
import axios from 'axios'
import dogIcon from './assets/images/dogIcon.svg'
import catIcon from './assets/images/catIcon.svg'
import {useMap} from "react-leaflet";
import L from 'leaflet'

let markersLoaded = [[1,2]]

export let GetMarkers = (props)=>{
    console.log("Get markers render")
  let map = useMap();
  getp(map, props)
  map.on('dragend', ()=>{
        getp(map, props)
     })

  map.on('zoomend', ()=>{
        getp(map, props)
  })
  return null
}

let getp = (map, props)=>{
    let {_northEast, _southWest} = map.getBounds()

    let lowerlat = 1.1*_southWest.lat-Math.abs(0.1*_northEast.lat)
    let upperlat = 1.1*_northEast.lat-0.1*_southWest.lat
    let diff = Math.abs(_northEast.lng-_southWest.lng)<Math.abs(_southWest.lng+_northEast.lng)?Math.abs(_northEast.lng-_southWest.lng):Math.abs(_southWest.lng+_northEast.lng)
    let lowerlng = _southWest.lng-0.1*diff
    let upperlng = _northEast.lng+0.1*diff

    console.log({    
      lowerlat,
      upperlat,
      lowerlng,
      upperlng,diff,lat: _northEast.lng})

    axios.get(process.env.REACT_APP_POINTS_URI,{
      params:{    
      lowerlat,
      upperlat,
      lowerlng,
      upperlng,
      markersLoaded  }}).then((res)=>{
        if(res.status===200){
        console.log("ok")  
        res.data.forEach(marker => {
          console.log({mlat:marker.lat, mlng:marker.lng})
          var icon = new L.Icon({
          iconUrl: marker.type==="dog"?dogIcon:catIcon,

          iconSize: [35, 35]
          })

          let newmarker = L.marker({lat:marker.lat,lng:marker.lng},{icon});
          newmarker.addTo(map)
          newmarker.on("click",()=>{
            props.open(marker.lat, marker.lng, marker.deprecated_level)
          })
          markersLoaded.push(marker.lat+""+marker.lng)
        });
        }else{
          console.log("Db error")
        } 
      })

}