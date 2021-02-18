//to-do set undragable the marker one in sended
//to-do delete last marker if added new one before sending
import {useState} from 'react'
import {useMap} from 'react-leaflet'
import L from 'leaflet'
import './assets/Animal.css'
import axios from 'axios'
import dogIcon from './assets/images/dogIcon.png'
import catIcon from './assets/images/catIcon.png'



export function Animal(){

    const [reportColor,reportColorchange] = useState();
    const [coordinates,changeCoordinates] = useState();
    const [type, changeType] = useState();

    let map = useMap()

    map.on('popupopen', function(e) {
    // find the pixel location on the map where the popup anchor is
    var px = map.project(e.popup._latlng);
   // find the height of the popup container, divide by 2 to centre, subtract from the Y axis of marker location
    px.y -= e.popup._container.clientHeight/2;
    // pan to new center
    map.panTo(map.unproject(px),{animate: true});
});
    

    return (
            <div className="menu" 
                 onDrop={()=>{console.log(":)")}}
                 onMouseEnter={()=>{map.dragging.disable()}}
                 onMouseLeave={()=>{map.dragging.enable()}}>
                <div className="options">
                    <div
                    className = "dogOption"
                    draggable="true"
                    onDragEnd={(ev)=>{
                        addMark(reportColorchange, map, "dog", changeCoordinates, ev)
                        }
                    }
                    onClick={()=>{
                        changeType("dog");
                        addMark(reportColorchange, map, "dog", changeCoordinates)
                        }
                    }>
                    </div>
                    <div
                    className = "catOption"
                    draggable="true"
                    onDragEnd={(ev)=>{
                        addMark(reportColorchange, map, "cat", changeCoordinates, ev)
                        }
                    }
                    onClick={()=>{
                        changeType("cat");
                        addMark(reportColorchange, map, "cat", changeCoordinates)
                        }}>
                    </div>
                </div>
                <div    className="selector" 
                        onClick={()=>{sendPoint(reportColorchange, coordinates, changeCoordinates, type)}} 
                        style={{background:reportColor}}>
                </div>
            </div>            
        )
}

function printCoords(ev, map){
  let latlng = map.mouseEventToLatLng(ev);
  map.panTo( new L.latLng(0,0))
  console.log(latlng);
  console.log("center at:")
  console.log(map.getCenter())
}
 
function addMark(reportColorchange, map, type, changeCoordinates, ev={clientX:false}){

    let icon = L.icon({
        iconUrl: type=="dog"?dogIcon:catIcon,
        iconSize:     [38, 38]
    });
    let coordinates = ev.clientX? map.mouseEventToLatLng(ev) : (ev.screenX? map.containerPointToLatLng([ev.screenX-10,ev.screenY-110]):map.getCenter());
    
    let marker = L.marker(coordinates,{draggable:'true', icon: icon});
    changeCoordinates(coordinates)

    marker.on('dragend',()=>{
        changeCoordinates(marker.getLatLng())
        })
    marker.addTo(map)
    reportColorchange("green")

    }

function sendPoint(sendBackgorundchange, coordinates, changeCoordinates, type){
    if(coordinates){
        sendBackgorundchange("white");
        console.log(coordinates)
        // axios.post(process.env.POINTS_URI,{coords:coordinates,type})
        changeCoordinates(false)
        }
}