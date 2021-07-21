import { useState } from 'react'
import './assets/form.css'


export function Form(props) {


    let [frecuence0, setActive0] = useState(0 < props.defaultValue)
    let [frecuence1, setActive1] = useState(1 < props.defaultValue)
    let [frecuence2, setActive2] = useState(2 < props.defaultValue)
    let [frecuence3, setActive3] = useState(3 < props.defaultValue)
    let [frecuence4, setActive4] = useState(5 < props.defaultValue)

    const setActiveFrecuences = [setActive0, setActive1, setActive2, setActive3, setActive4]


    let listOfFrecuences = []

    let active = [frecuence0, frecuence1, frecuence2, frecuence3, frecuence4]

    for (let i = 0; i < 5; i++) {
        listOfFrecuences.push(
            <div
                key={i}
                style={{ background: active[i] ? "#3B72E1" : "#E3E3E3" }}
                onClick={() => {
                    selectFrecuence(i, props.frecuence, setActiveFrecuences)
                    props.setFrecuence(i + 1)
                }}></div>
        )
    }

    return (
        <div className="form" style={{ display: props.display }}>
            <div className="frecuences" >
                {listOfFrecuences}
            </div>
        </div>)

}

function selectFrecuence(i, setFrecuence, setActiveFrecuences) {

    setFrecuence["frecuence"] = i + 1
    setActiveFrecuences.forEach((active, index) => {
        active(i < index ? false : true)
    });

}