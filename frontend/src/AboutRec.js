import { useEffect, useState } from 'react'
import './assets/AboutRec.css'
import animalsIcon from './assets/images/animalsIcon.png'

export function About() {

    const [visible, togleVisible] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            togleVisible(false)
        }, 5000)
    }, [])

    return (
        <div id={"about"} className="rounded" style={{ backgroundColor: visible ? "white" : undefined }}>

            {!visible && <div id="infoIcon" className="bolder white">i</div>}
            <div className={visible ? "" : "hide"} id="info">
                <p>Encuentra y reporta y atuda animales <span><img src={animalsIcon}></img></span> en la calle</p>
                <ul >
                    <li>Agrega un registro dando click en <span className="blue bolder">+</span></li>
                    <li>Arrastra la marca que agregaste </li>
                    <li>Ajusta el <span className="green bolder">área</span> de residencia</li>
                    <li>Puedes incluir una <span className="blue">foto </span>y otros datos </li>
                </ul>
            </div>

        </div>)
}
