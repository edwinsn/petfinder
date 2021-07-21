import closeIcon from './assets/images/closeIcon.svg'
import './assets/feedBack.css'
import { useRef, useState } from 'react'
import axios from 'axios'
import { LoadingCircles } from './Loading'
import { setOptions } from 'leaflet'
import { useDispatch } from 'react-redux'
import { showNotifications } from "./features/notificationsSlice"


export const FeedBack = (props) => {


    const [options, setOptions] = useState({ isSlow: false, isConfuse: false })
    const [loading, setLoading] = useState(false)


    let dispatch = useDispatch()
    const updateNotifications = (feedBack, withoutConnection) => {

        dispatch(showNotifications({ feedBack, withoutConnection }))
    }
    const resetOptions = () => {
        setOptions({ isSlow: false, isConfuse: false })
        setLoading(false)
    }


    return (
        <form onSubmit={(ev) => { sendFeedBack(ev, options.isSlow, options.isConfuse, setLoading, updateNotifications, resetOptions) }} className="emergentContainer feedBackContainer">
            <div onClick={props.close} className="background"></div>

            <div className="emergentWindow feedBack">
                <img src={closeIcon} className="closeIcon" onClick={props.close} />
                <p className="title">Ayudanos a mejorar!</p>
                <p>Envianos tus Sugerencias</p>
                <div className="suggestionsBtns">

                    <div className={options.isSlow ? "activeSuggestion" : ""}
                        onClick={() => {

                            setOptions((pre) => {
                                return { isConfuse: pre.isConfuse, isSlow: !pre.isSlow }
                            })
                        }}>Es lenta la página?</div>
                    <div className={options.isConfuse ? "activeSuggestion" : ""}
                        onClick={() => {
                            setOptions((pre) => {
                                return { isConfuse: !pre.isConfuse, isSlow: pre.isSlow }
                            })
                        }}>Es la interfaz confusa?</div>
                </div>

                <div className="moresuggestions">
                    <textarea placeholder="Sugerencias"></textarea>
                </div>
                <div className="sendDiv">
                    {loading ? <LoadingCircles /> : <input type="submit" value="Enviar" />}
                </div>

            </div>
        </form>
    )
}

let sendFeedBack = async (ev, isSlow, isConfuse, setLoading, updateNotifications, resetOptions) => {

    ev.preventDefault()
    let moreSuggestions = ev.target[0].value
    setLoading(true)
    try {
        let { status } = await axios.post(process.env.REACT_APP_POINTS_URI + "/feedBack", {
            isSlow,
            isConfuse,
            moreSuggestions

        })
        console.log(status === 200 ? "Dato registrado" : "Error en el envio de la información")
        resetOptions()
        ev.target[0].value = ""
        updateNotifications(true, false)
        setLoading(false)
        setTimeout(() => {
            updateNotifications(false, false)
        }, 2000)
    } catch (err) {
        //console.log(err)
        updateNotifications(false, true)
        setLoading(false)
        setTimeout(() => {
            updateNotifications(false, false)
        }, 2000)
    }
}