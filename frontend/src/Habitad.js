import React, { useEffect } from 'react'
import { useMap } from "react-leaflet";
import { Rnd } from "react-rnd";
import './assets/Habitad.css'
import catIcon from './assets/images/catIcon.svg'
import dogIcon from './assets/images/dogIcon.svg'

let width = 150
let height = 150
let x, y
let recalculateCoords

export let Habitad = React.memo(function (props) {

    useEffect(() => {

        x = windowCenter.x
        y = windowCenter.y

        let previousZoom = map.getZoom()
        recalculateCoords = () => {
            //console.log("recalculating...")
            let coords = map.containerPointToLatLng({ x, y })
            let zoomRatio = 2 ** (previousZoom - map.getZoom())

            setMarkerCoords((pre) => {

                previousZoom = map.getZoom()
                return {
                    coords,
                    range: pre.range * zoomRatio

                }
            })
        }


        map.on('moveend', () => { recalculateCoords() })

    }, [])

    let map = useMap()
    //recalculateCoords()
    let { habitadVisible, setMarkerCoords, markerData } = props

    let windowCenter = map.latLngToContainerPoint(map.getCenter())

    let deltax, deltay = 0

    if (!habitadVisible) {
        x = windowCenter.x
        y = windowCenter.y
    }

    const style = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "solid 3px #37B258",
        backgroundColor: "#37B25845",
        borderRadius: "50%",
        zIndex: 5
    };

    //console.log("rendering habitad")
    let defaultCoords

    try {
        defaultCoords = props.markerData.coords ? map.latLngToContainerPoint(markerData.coords) : {
            x: windowCenter.x,
            y: windowCenter.y
        }
    } catch (err) {
        console.log(err?.code)
        defaultCoords = {
            x: windowCenter.x,
            y: windowCenter.y
        }
        setMarkerCoords(
            (pre) => {
                return {
                    coords: map.getCenter(),
                    range: pre.range
                }
            }
        )
    }



    let defaultRangeInPixels = markerData ? meterstoPixels(markerData.range, map) : 0
    //console.log(markerData)
    width = markerData.range ? defaultRangeInPixels : width
    height = markerData.range ? defaultRangeInPixels : height
    //console.log(width)
    return (
        <div
            style={{ display: habitadVisible ? "block" : "none" }}
            className="markerContainer">
            {habitadVisible && <Rnd
                lockAspectRatio="1"
                bounds="parent"
                style={style}
                default={{
                    x: defaultCoords.x - width / 2,
                    y: defaultCoords.y - height / 2,
                    width,
                    height
                }}
                minWidth="60px"
                minHeight="60px"

                onDragStart={() => {
                    map.dragging.disable();
                }}

                onDragStop={(e, ui) => {
                    map.dragging.enable();
                    let height = ui.node.clientHeight
                    let width = ui.node.clientWidth
                    x = ui.x + width / 2
                    y = ui.y + height / 2

                    let center = map.containerPointToLatLng({ x, y })

                    setMarkerCoords(
                        (pre) => {
                            return {
                                coords: center,
                                range: pre.range
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
                    coords[0] = coords[0] ? coords[0] : 0
                    coords[1] = coords[1] ? coords[1] : 0
                    x = coords[0] + deltax / 2
                    y = coords[1] + deltay / 2


                    let center = map.containerPointToLatLng({ x, y })
                    let border = map.containerPointToLatLng({ x: x + deltax / 2, y })
                    let range = map.distance(center, border)

                    setMarkerCoords((prev) => {
                        return {
                            coords: center,
                            range
                        }
                    })

                }}
            >
                <div className="borderballcontainer">
                    <div id="top" className="borderball"></div>
                    <div id="bottom" className="borderball"></div>
                    <div id="left" className="borderball"></div>
                    <div id="right" className="borderball"></div>

                    <img className="marker" draggable={false} src={props.markerData.type == "dog" ? dogIcon : catIcon}></img>
                </div>
            </Rnd>}
        </div >
    )
})

function meterstoPixels(m, map) {

    if (!m) return undefined
    let mapPixelLength = map.getSize().x
    let mapMetersLength = map.distance({ lng: map.getBounds()._southWest.lng, lat: map.getBounds()._southWest.lat },
        { lng: map.getBounds()._northEast.lng, lat: map.getBounds()._southWest.lat })

    return 2 * m * mapPixelLength / mapMetersLength

}