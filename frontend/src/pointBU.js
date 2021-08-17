import './assets/pointBU.css'
import dogIcon from './assets/images/dogIcon.svg'
import catIcon from './assets/images/catIcon.svg'
import deployIcon from './assets/images/deployIcon.svg'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { triggerBackup } from './features/recoverSlice'

export let PointBu = (props) => {

    let { type, frecuence, imgurl, description } = props.mark

    const [deployed, setDeployed] = useState(false)
    const [recovered, setRecovered] = useState(false)

    const dispatch = useDispatch()

    let probabilityBars = []
    if (true) {
        for (let i = 0; i < 10; i++) {
            probabilityBars.push(
                <div key={Math.random()} style={{ background: i < frecuence ? "#3B72E1" : "#E3E3E3" }}></div>
            )
        }
    }


    return recovered ? null : (
        <div className={deployed ? "point-bu pointDeployed " : "point-bu nodeployed"}>
            <div
                onClick={() => { setDeployed(true) }}
            >
                <img src={type === "dog" ? dogIcon : catIcon} />
                <div >{description || "Sin descripción"}</div>
            </div>
            {deployed &&
                <div className="aditionalInfo">
                    <div className="probabilitybars">
                        {probabilityBars}
                    </div>
                    {imgurl && <img src={imgurl} />}
                </div>}
            <button
                onClick={() => {
                    dispatch(triggerBackup({ ...props.mark, coords: { lat: props.mark.lat, lng: props.mark.lng } }))
                    setRecovered(true)
                }}
                className={deployed ? "resbtn" : "resbtn"}>Restaurar</button>
            <img className={deployed ? "deployIcon turn" : "deployIcon return"}
                src={deployIcon}
                onClick={() => { setDeployed(!deployed) }}
            />
        </div >
    )
}