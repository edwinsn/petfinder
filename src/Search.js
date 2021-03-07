import { useEffect } from "react";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import {useMap} from 'react-leaflet'
function Search() {

  
    const map = useMap();

    useEffect(()=>{

      const searchControl = new ELG.Geosearch().addTo(map);
      const results = new L.LayerGroup().addTo(map);

      searchControl.on("results", function(data) {
        results.clearLayers();
        for (let i = data.results.length - 1; i >= 0; i--) {
          results.addLayer(L.marker(data.results[i].latlng));
        }
      });
    },[map])
  

    return null;
  
}

//export default Search;
export default Search;