import { useEffect, useState } from 'react'
import animalsIcon from './assets/images/animalsIcon.png'
import styled from 'styled-components'


export function About() {

    const [visible, togleVisible] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            togleVisible(false)
        }, 5000)
    }, [])

    return (
        <StyledAbout
            className="rounded centered pointer"
            deployed={visible}
        >
            <InfoIcon id="infoIcon" className="bolder white">i</InfoIcon>
            <Info id="info">
                <p>Encuentra y reporta y atuda animales <span><Img src={animalsIcon}></Img></span> en la calle</p>
                <Ul>
                    <li>Agrega un registro dando click en <span className="blue bolder">+</span></li>
                    <li>Arrastra la marca que agregaste </li>
                    <li>Ajusta el <span className="green bolder">área</span> de residencia</li>
                    <li>Puedes incluir una <span className="blue">foto </span>y otros datos </li>
                </Ul>
            </Info>

        </StyledAbout>)
}

const StyledAbout = styled.div`
    font-style: italic;
    padding: 0 12px;
    font-family: 'Roboto';
    min-width: 0.25cm;
    z-index: 408;
    position: absolute;
    left: 0;
    min-height: 34px;
    margin-top: 45px;
    margin-left: 10px;
    background-color:${props => props.deployed ? "white" : "#3388FF"};
    &:hover {
        background-color: white;
    }
    &:hover #infoIcon {
    display: none;
    }
    &:hover #info{
        display: block;
    }
`

const InfoIcon = styled.div`
    font-size: 19px;
`

const Info = styled.div`
    display: none;
`

const Ul = styled.ul`
    padding-left: 20px;
`

const Img = styled.img`
    height: 2em;
    position: relative;
    top: 0.8em;`