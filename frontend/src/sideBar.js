import { useState } from "react"
import './assets/sideBar.css'
import * as FaIcons from 'react-icons/fa'
import closeIcon from './assets/images/closeIcon.svg'
import modifyIcon from './assets/images/modifyIcon.svg'
import infoIcon from './assets/images/infoIcon.svg'
import dbIcon from './assets/images/dbIcon.svg'
import logoutIcon from './assets/images/logoutIcon.svg'
import feedBackIcon from './assets/images/feedBackIcon.svg'
import { AboutWindow } from './AboutWindow'

export const SideBar = (props) => {

    const [show, setShow] = useState(false)
    const [showAboutW, setShowAboutW] = useState(false)

    return (
        <div className="sidebarContainer">
            {showAboutW && <AboutWindow close={() => { setShowAboutW(false) }} />}
            <FaIcons.FaBars style={{ height: "80%", width: "40%", minHeight: "30px", color: "rgb(44, 44, 44)", cursor: "pointer" }} onClick={() => { setShow(!show) }} />

            {show && <div className="closeSection" onClick={() => { setShow(false) }}></div>}
            <div className={show ? "sidebar active" : "sidebar"}>
                <img src={closeIcon} className="closeIcon" onClick={() => { setShow(false) }} />
                <div className="items">
                    <div>
                        <img src={modifyIcon} />
                        <p>Modo edición</p>
                    </div>
                    <div>
                        <img src={dbIcon} />
                        <p>Descargar Base de Datos</p>
                    </div>
                    <div onClick={() => {
                        setShow(false)
                        setShowAboutW(true)
                    }}>
                        <img src={infoIcon} />
                        <p>Acerca de</p>
                    </div>
                    <div>
                        <img src={feedBackIcon} />
                        <p>Sugerencias</p>
                    </div>

                    <div>
                        <img src={logoutIcon} />
                        <p onClick={props.handleLogout}>Salir</p>
                    </div>
                </div>
            </div>
        </div>
    )
}