import { useState, useEffect } from "react"
import './assets/sideBar.css'
import * as FaIcons from 'react-icons/fa'
import closeIcon from './assets/images/closeIcon.svg'
import modifyIcon from './assets/images/modifyIcon.svg'
import infoIcon from './assets/images/infoIcon.svg'
import dbIcon from './assets/images/dbIcon.svg'
import logoutIcon from './assets/images/logoutIcon.svg'
import feedBackIcon from './assets/images/feedBackIcon.svg'
import btrashIcon from './assets/images/bluetrashicon.svg'
import deployIcon from './assets/images/deployIcon.svg'
import { AboutWindow } from './AboutWindow'
import { FeedBack } from "./feedBack"
import download from 'downloadjs'
import { useSelector, useDispatch } from 'react-redux'
import { activate, deactivate } from './features/editingSlice'
import { hideNotifications, showNotifications } from "./features/notificationsSlice"
import { PointBu } from "./pointBU"
import Switch from "react-switch";
import axios from 'axios'
import store from './store'
import { point } from "leaflet"

let prevPointDeleted = false

export const SideBar = (props) => {

    const [show, setShow] = useState(false)
    const [showAboutW, setShowAboutW] = useState(false)
    const [showFeedBack, setShowFeedBack] = useState(false)
    const [paperBin, setPaperBin] = useState(false)
    const [backup, setBackup] = useState()
    const editing = useSelector(state => {
        //console.log("..")
        return state.editing.value
    })
    const dispatch = useDispatch()


    let getBackup = async () => {
        try {
            let { data } = await axios.get(process.env.REACT_APP_POINTS_URI + "backup", {
                params: {
                    userid: props.userid
                }
            })
            let points = data.map((mark) => <PointBu mark={mark} key={Math.random()} />)
            if (!points.length) setBackup(<p>Papelera vacia</p>)
            else setBackup(points)


        } catch (e) {
            setBackup(<p>Papelera vacia</p>)
        }
    }

    store.subscribe(async () => {
        if (store.getState().backup.value.pointDeleted && store.getState().backup.value.pointDeleted._id !== prevPointDeleted) {
            console.log("getting backup")
            //console.log(store.getState().backup.value.pointDeleted)
            setBackup(prev => [...prev, <PointBu mark={store.getState().backup.value.pointDeleted} key={Math.random()} />])
            prevPointDeleted = store.getState().backup.value.pointDeleted._id
        }
    })

    useEffect(async () => {
        getBackup()
    }, [])

    return (
        <div id="sidebarContainer" className="justify-center align-center">
            {showAboutW && <AboutWindow close={() => { setShowAboutW(false) }} />}
            {showFeedBack && <FeedBack close={() => { setShowFeedBack(false) }} />}
            <FaIcons.FaBars style={{ height: "80%", width: "40%", minWidth: "30px", color: "rgb(44, 44, 44)", cursor: "pointer" }} onClick={() => { setShow(!show) }} />

            {show && <div className="closeSection fullScreen" onClick={() => { setShow(false) ; setPaperBin(false)}}></div>}
            <div id="sidebar" className={show ? " active" : ""}>
                <img src={closeIcon} className="closeIcon" onClick={() => { setShow(false) ; setPaperBin(false)}} />
                <div className="items">
                    {<div
                        onClick={!editing ?
                            () => {
                                dispatch(activate())
                                setTimeout(() => {
                                    dispatch(showNotifications({ editInstructions: true }))
                                }, 500)
                                setTimeout(() => {
                                    dispatch(hideNotifications())
                                }, 3000)
                                setTimeout(() => {
                                    setShow(false)
                                }, 500)
                            } :
                            () => { dispatch(deactivate()) }}>
                        <img src={modifyIcon} />
                        <p >Modo edición</p> <Switch
                            onChange={() => { }}
                            className="switch"
                            offColor="#CFCDC9"
                            onColor="#73f27e"
                            checked={editing} />
                    </div>}
                    <div className="paperbin"
                        onClick={() => { setPaperBin(!paperBin) }}
                    >
                        <img src={btrashIcon} />
                        <p>Papelera</p>
                        <img src={deployIcon} className={paperBin ? "relative turn" : "relative return"} />
                    </div>

                    <div className={paperBin ? "backupInfo column" : "backupInfo column inactive"}
                        style={paperBin ? { height: "30vh" } : undefined}
                    >
                        {backup}
                    </div>

                    <div onClick={() => { getDb(dispatch) }}>
                        <img src={dbIcon} />
                        <p>Base de Datos</p>
                    </div>
                    <div onClick={() => {
                        setShow(false)
                        setShowAboutW(true)
                    }}>
                        <img src={infoIcon} />
                        <p>Acerca de</p>
                    </div>
                    <div onClick={() => {
                        setShowFeedBack(true)
                        setShow(false)
                    }}>
                        <img src={feedBackIcon} />
                        <p>Sugerencias</p>
                    </div>

                    <div onClick={() => {
                        props.handleLogout()
                        dispatch(deactivate())
                    }}>
                        <img src={logoutIcon} />
                        <p>Salir</p>
                    </div>
                </div>
            </div>
        </div >
    )
}
let getDb = async (dispatch) => {
    //send only the lat, lng, fre, and type data
    try {
        let res = await fetch(process.env.REACT_APP_POINTS_URI + "database")
        const blob = await res.blob();
        download(blob, 'database.cvs');
    } catch (err) {
        dispatch(showNotifications({ withoutConnection: true }))
        setTimeout(() => { dispatch(showNotifications({ withoutConnection: false })) }, 2000)
    }
}