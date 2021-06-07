import React from 'react'
import { useMap } from "react-leaflet";
import { Rnd } from "react-rnd";
import './assets/Habitad.css'
import catIcon from './assets/images/activeCat.svg'
import dogIcon from './assets/images/activeDog.svg'

export let Habitad = React.memo(function (props) {

    let map = useMap()
    let { habitadVisible, type, setMarkerCoords } = props
    let width = 150
    let height = 150
    let { x, y } = map.latLngToContainerPoint(map.getCenter())
    x -= width / 2
    y -= height / 2
    let deltax, deltay = 0

    const style = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "solid 1px green",
        borderRadius: "50%",
        zIndex: 5
    };


    console.log("rendering habitad")

    return (
        <div
            style={{ display: habitadVisible ? "block" : "none" }}
            className="markerContainer">
            {habitadVisible && <Rnd
                bounds="parent"
                style={style}
                default={{
                    x,
                    y,
                    width,
                    height
                }}

                onDragStart={() => {
                    map.dragging.disable();
                }}

                onDragStop={(e, ui) => {
                    map.dragging.enable();
                    let height = ui.node.clientHeight
                    let width = ui.node.clientWidth
                    let center = map.containerPointToLatLng({ x: ui.x + width / 2, y: ui.y + height / 2 })
                    let range = map.containerPointToLatLng({ x: ui.x + width, y: ui.y + height })
                    setMarkerCoords(
                        (pre) => {
                            return {
                                center,
                                range
                            }
                        }
                    )

                }}

                onResizeStart={() => {
                    map.dragging.disable();
                }}

                onResizeStop={(e, dir, target) => {
                    map.dragging.enable();
                    deltay = target.clientHeight
                    deltax = target.clientWidth

                    var regex = /[+-]?\d+(\.\d+)?/g;

                    let coords = target.style.transform.match(regex)
                        .map(function (v) { return parseFloat(v); });
                    coords = coords ? coords : [0, 0]
                    x = coords[0] + deltax / 2
                    y = coords[1] + deltay / 2

                    let center = map.containerPointToLatLng({ x, y })

                    x = coords[0] + deltax / 2
                    y = coords[1] + deltay / 2
                    let range = map.containerPointToLatLng({ x, y })
                    setMarkerCoords((prev) => {
                        return {
                            center,
                            range
                        }
                    })


                }}
            >
                <img className="marker" draggable={false} src={type == "dog" ? dogIcon : catIcon}></img>
            </Rnd>}
        </div>
    )
})