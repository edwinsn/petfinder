import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import closeIcon from './assets/images/closeIcon.svg'
import { editFrecuences } from './GetMarkers'
import UserIcon from './assets/images/userIcon.svg'
import frecuenceIcon from './assets/images/frecuenceIcon.svg'
import petsIcon from './assets/images/petsIcon.svg'
import plus from './assets/images/plus .svg'
import minus from './assets/images/minus.svg'
import { LoadingCircles } from './Loading'
import { useSelector, useDispatch } from 'react-redux'
import { close } from './features/panelSlice'
import './assets/Panel.css'

let actualCoords


//llamar a unpaint circle en getmarkers o el propietario de unpaint circle
//mejorar la imposibilidad de aumentar la probabilidad mas de una vez

export let Panel = function () {

  //console.log("Panel rendered")

  const { opened, markerData } = useSelector(state => {
    //console.log("..")
    return state.panel.value
  })

  const { imgurl, coords, contact, description, imgKey, frecuence } = markerData
  const { lat, lng } = coords || { lat: undefined, lng: undefined }
  actualCoords = lat + "" + lng

  const dispatch = useDispatch()

  const [state, setState] = useState({
    loading: false,
    isImgOpen: false,
    imgLoading: true,
    prob: 2 * frecuence
  })

  useEffect(() => {
    setState(prev => { return { ...prev, imgLoading: true } })
  }, [imgurl])

  useEffect(() => {
    setState(prev => { return { ...prev, prob: 2 * frecuence } })
  }, [frecuence])

  let openImg = useCallback(() => {
    if (!state.isImgOpen) {
      setState(prev => { return { ...prev, isImgOpen: true } })
    }
  }, state.isImgOpen)

  let probabilityBars = useMemo(() => {
    let bars = []
    for (let i = 0; i < 10; i++) {
      bars.push(
        <div key={i} style={{ background: i < state.prob ? "#3B72E1" : "#E3E3E3" }}></div>
      )
    }
    return bars
  }, [state.prob])

  const { previousOptio1key, previousOptio2key } = useMemo(() => {
    return { previousOptio1key: Math.random(), previousOptio2key: Math.random() }
  })

  let closePanel = useCallback(() => {
    state?.unpaintCircle?.()
    dispatch(close())
  }, [])

  let decrementProb = useCallback((ev) => {
    if (ev.target.checked) {
      updatedFrecuence(lat, lng, true, setState, frecuence)
    }
  }, [lat, lng, frecuence])

  let incrementProb = useCallback((ev) => {
    if (ev.target.checked) {
      updatedFrecuence(lat, lng, false, setState, frecuence)
    }
  }, [lat, lng, frecuence])

  let onImgCLicked = useCallback(() => {
    setState(prev => { return { ...prev, isImgOpen: false } })
  }, [])

  let onImgLoaded = useCallback(() => {
    setState(prev => { return { ...prev, imgLoading: false } })
  }, [])


  return (
    <div className="panelContainer">

      <div className={opened ? "panel active" : "panel inactive"} >
        <img
          src={closeIcon}
          alt="close"
          id="closePanel"
          className="closeIcon"
          onClick={closePanel} />
        {state.excessOfRevitions &&
          <p className="excess">
            No puedes incrementar o disminuir la probabilidad más de una vez
          </p>}
        {state.updatedFrecuence &&
          <p className="frecuenceUpdated">Dato actualizado!</p>
        }
        <div className="infoContainer justify-center">

          <div className="column">

            <div>
              <div className="verticalCentered align-center">
                <img src={petsIcon} className="petsImg" />
                <span>Descripción</span>
              </div>
              <p>
                {description ? description : "No hay descripción"}
              </p>
            </div>

            <div>
              <div className="verticalCentered align-center">
                <img src={frecuenceIcon} />
                <span>Avistamientos</span>
              </div>
              <div className="probabilityContainer align-center">
                <div className="probabilitybars">
                  {probabilityBars}
                </div>

                <label htmlFor="decrementProb">
                  <input type="radio" name="dep"
                    className="hide"
                    key={previousOptio1key}
                    id="decrementProb"
                    onChange={decrementProb} />
                  <img src={minus} />
                </label>

                <label htmlFor="incrementProb"
                  className="centered"
                >
                  <input type="radio"
                    className="hide"
                    id="incrementProb"
                    name="dep"
                    key={previousOptio2key}
                    onChange={incrementProb} />
                  <img src={plus} />
                </label>
              </div>
            </div>

            <div>
              <div className="verticalCentered align-center">
                <img src={UserIcon} />
                <span>Contacto</span>
              </div>

              <p>
                {contact ? contact : "No hay contacto"}
              </p>
            </div>

          </div>
          <div className={state.isImgOpen ? "fullScreen" : "animalImgcontainer"}>

            {state.isImgOpen &&
              <div className="background emergentContainer"
                onClick={() => { setState({ isImgOpen: false }) }}
              ></div>}

            <div className={(state.isImgOpen ? "deployimg rounded relative align-center justify-center" : "relative nodeployed") + (window.innerHeight > window.innerWidth ? " top" : " center")}>

              {state.isImgOpen &&
                <img className={window.innerHeight > window.innerWidth ? "left closeIcon" : "right closeIcon"}
                  id={"closeimg"}
                  src={closeIcon}
                  onClick={onImgCLicked}
                />}
              <img className={state.isImgOpen ?
                (window.innerHeight > window.innerWidth ? "mobilbigimg" : "animalImg") :
                "animalImg"}
                onClick={openImg}
                src={imgurl ? imgurl : undefined}
                key={imgKey}
                onLoad={onImgLoaded}
              />
              {state.imgLoading && <LoadingCircles />}
            </div>

          </div>
        </div>
      </div>
    </div >
  )
}


let updatedFrecuence = async function (lat = 0, lng = 0, isDeprecated = false, setState, frecuence) {

  if (isDeprecated) {
    setState(prev => { return { ...prev, prob: frecuence <= 1 ? 1 : 2 * frecuence - 1 } })
    editFrecuences(frecuence - 0.5, actualCoords)
  }
  else {
    setState(prev => { return { ...prev, prob: frecuence < 4.5 ? 2 * frecuence + 2 : 10 } })
    editFrecuences(frecuence + 1, actualCoords)
  }

  try {
    await axios.put(process.env.REACT_APP_POINTS_URI, { lat, lng, isDeprecated })
    setState(prev => { return { ...prev, loading: false, updatedFrecuence: true } })
    setTimeout(() => { setState(prev => { return { ...prev, updatedFrecuence: false } }) }, 600)
  } catch (err) {
    console.log(err)
  }
}