import {useState} from 'react'
import './assets/form.css'


export  function Form(props) {


    let [frecuence0, setActive0] = useState(true)
    let [frecuence1, setActive1] = useState(true)
    let [frecuence2, setActive2] = useState(true)
    let [frecuence3, setActive3] = useState(false)
    let [frecuence4, setActive4] = useState(false)
     
    const setActiveFrecuences = [setActive0, setActive1, setActive2, setActive3, setActive4]

    let listOfFrecuences = []

    let active = [frecuence0, frecuence1, frecuence2, frecuence3, frecuence4]

    for (let i=0;i<5;i++){
        listOfFrecuences.push(
            <div 
            key={i} 
            style={{background:active[i]?"#3B72E1":"#E3E3E3"}}
            onClick={()=>{
                selectFrecuence( i, props.frecuence, setActiveFrecuences ) 
            }}></div>
            )
    }

    return (
        <div className="form" style={{display:props.display}}> 
        <p>¿Cuantas veces le has visto?</p>  
            <div className="frecuences" >
              {listOfFrecuences}
            </div>
            </div>)

}

function selectFrecuence(i, setFrecuence, setActiveFrecuences){
    
    setFrecuence["frecuence"]=i+1
    setActiveFrecuences.forEach((active, index) => {
        active(i<index?false:true)
    });
    
}