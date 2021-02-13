import {useMap} from 'react-leaflet'
import './assets/Animal.css'

let map

export function Animal(){
    map = useMap()
    return (
            <div className="menu">
                <ul>
                    <li>
                        <a ><i class="fas fa-cat"></i></a>
                    </li>
                    <li>
                        <a ><i class="fas fa-dog"></i></a>
                    </li>
                </ul>
                <a ><i ></i></a>
            </div>
        )

}

function printCoords(ev){
  var latlng = map.mouseEventToLatLng(ev);
  console.log(latlng);
}