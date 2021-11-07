import dogIcon from './assets/images/dogIcon.svg'
import catIcon from './assets/images/catIcon.svg'
import deployIconImg from './assets/images/deployIcon.svg'
import { useState, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { triggerBackup } from './features/recoverSlice'
import styled, { css } from 'styled-components'

//optimizar para cuando no hay imagen

export let PointBu = (props) => {

    let { type, frecuence, imgurl, description } = props.mark

    const [deployed, setDeployed] = useState(false)
    const [recovered, setRecovered] = useState(false)

    const dispatch = useDispatch()

    let probabilityBars = useMemo(() => {
        let bars = []
        for (let i = 0; i < 10; i++) {
            bars.push(
                <div key={Math.random()} style={{ background: i < frecuence ? "#3B72E1" : "#E3E3E3" }}></div>
            )
        }
        return bars
    }, [frecuence])

    let toggleDeploy = useCallback(() => {
        setDeployed(prev => !prev)
    }, [])

    let restoreMark = () => {
        dispatch(triggerBackup({ ...props.mark, coords: { lat: props.mark.lat, lng: props.mark.lng } }))
        setRecovered(true)
    }

    return recovered ? null : (
        <DropdownMenu deployed={deployed}>
            <div
                onClick={() => { setDeployed(true) }}
            >
                <img src={type === "dog" ? dogIcon : catIcon} />
                <div >{description || "Sin descripción"}</div>
            </div>
            {deployed &&
                <AditionalInfo>
                    <div className="probabilitybars">
                        {probabilityBars}
                    </div>
                    {imgurl && <AnimalPhoto src={imgurl} />}
                </AditionalInfo>}
            <RestoreBtn
                onClick={restoreMark}
            >Restaurar</RestoreBtn>
            <DeployIcon
                deployed={deployed}
                src={deployIconImg}
                onClick={toggleDeploy}
            />
        </DropdownMenu >
    )
}

let DropdownMenu = styled.div`
    align-items: center;
    display: flex;
    background-color: hsl(0, 0%, 97%);
    transition: height var(--transition-time);
    max-height: 10cm;
    padding: 7px;
    border-radius: 5px;
    margin-bottom: 3px;
    ${props => {
        return props.deployed ?
            css`
            height: 40vh;
            flex-wrap: wrap;
            justify-content: space-evenly;
            &>div:nth-child(1){width:100%}
            `:
            css`
                justify-content: space-evenly;
                height: 7vh;
                white-space: nowrap;`}
    }
}
    &>div {
        display: flex;
        overflow: hidden;
        max-height: 80%;
    &>div>img {
        align-self: center;
    }
    &>div:nth-child(1) {
    flex-grow: 1;
    }
    `

let AditionalInfo = styled.div`
   align-items: center;
    width: 95%;
    display: flex;
    flex-direction: column;
`

let DeployIcon = styled.img`
    animation-fill-mode: forwards;
    animation-duration: 400ms;
    width: 2.8vh;
    margin-left: 5px;
    ${props => {
        return props.deployed ?
            css`
    animation-name: turn;
    `:
            css`   
    animation-name: return;
        `
    }}
`

let AnimalPhoto = styled.img`
    min-height: 20vh ;
    background-color: rgb(219, 219, 219);
    width: 100%;
`

let RestoreBtn = styled.button`
    background-color: transparent;
    border: 3px solid green;
    color: green;
    cursor: pointer;
    border-radius: var(--border-radius);
    `