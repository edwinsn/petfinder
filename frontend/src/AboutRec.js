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


    return <div className={"about"} style={{ backgroundColor: visible ? "white" : undefined }}>

        {visible &&
            <div className="info">
                <p>Encuentra y reporta animales <span><img src={animalsIcon}></img></span> en la calle</p>
                <ul >
                    <li>Agrega un registro dando click en <span className="plus bolder">+</span></li>
                    <li>Arrastra la marca que agregaste </li>
                    <li>Puedes ajustar el <span className="green bolder">área</span> y subir una <span className="blue">foto</span></li>
                </ul>
            </div>}

        {
            !visible && <>
                <div className="infoIcon">i</div>
                <div className="info hide">
                    <p>Encuentra y reporta animales <span><img src={animalsIcon}></img></span>en la calle</p>
                    <ul >
                        <li>Agrega un registro dando click en <span className="plus bolder">+</span></li>
                        <li>Arrastra la marca que agregaste </li>
                        <li>Puedes ajustar el <span className="green bolder">área</span> y subir una <span className="blue">foto</span></li>
                    </ul>
                </div></>
        }
    </div>
}
