import {Component} from 'react'
import './assets/Panel.css'
import axios from 'axios'
import closeIcon from './assets/images/closeIcon.svg'
import {editFrecuences} from './GetMarkers'

let actualCoords
let actualFrecuence
let previousOptio1key
let previousOptio2key

export class Panel extends Component{

  constructor(props){
    super(props)
    this.state={
      display:"none",
      prob:"10",
      lat:0,
      lng:0,
      loading:false
    }
    this.updatedFrecuence=this.updatedFrecuence.bind(this)
    this.open=this.open.bind(this)
    this.isDeprecated=false
  }
  
  render(){

  console.log("Panel rendered")

  let probabilityBars = []
  for(let i=0;i<10;i++){
    probabilityBars.push(
        <div key={i} style={{background:i<this.state.prob?"#3B72E1":"#E3E3E3"}}></div>
    )
    }
  return( 
    <div className="panel" style={{display:this.state.display}}>
      <img
          src={closeIcon} 
          alt="close"
          className="close" 
          onClick={
             ()=>{
              this.setState({
                display:"none"
              })

            }
             }/>
      <div className="container">
        <div className="probabilitytext">La probabilidad es:</div>
             <div className="probabilitybars">
               {probabilityBars}
             </div>
        <p><input type="radio" name="dep" 
        key={previousOptio1key}
        onChange={(ev)=>{
          if(ev.target.checked){
              this.isDeprecated=true
              this.setState({
                prob:actualFrecuence<=1?1:2*actualFrecuence-1
              })
          }
          
          }} /> Consideras el dato desactualizado?  </p>
        <p><input type="radio" name="dep" 
      key={previousOptio2key}
        onChange={(ev)=>{
          if(ev.target.checked){
              this.isDeprecated=false
              this.setState({
              prob:this.state.prob<9?2*actualFrecuence+2:10
              })
          
          }}}/> Confirmas la veracidad del dato?</p>
        <button className="sendButton" 
                onClick={()=>{
                  this.setState({loading:true})
                  this.updatedFrecuence(this.state.lat, this.state.lng, this.isDeprecated)
                  }}>
                   {this.state.loading&&<div className="loader"></div>}
                   {!this.state.loading&&<span>Enviar</span>}

        </button>
      </div>
     {this.state.excessOfRevitions&& <p className="excess">
        No puedes incrementar o disminuir la probabilidad más de una vez
      </p>}
    </div>
    )
}


  async updatedFrecuence(lat=0,lng=0, isDeprecated=false){
    if(isDeprecated){
      editFrecuences(actualFrecuence-0.5, actualCoords)
    }
    else{
      editFrecuences(actualFrecuence+1, actualCoords)
    }
    console.log("enviando")
    try{
    await axios.put(process.env.REACT_APP_POINTS_URI,{lat,lng,isDeprecated})
    this.setState({loading:false})
    console.log("Dato Actualizado")
  }catch( err){
    console.log(err)
  }
    }
  open(lat, lng, data){
    console.log(data.frecuence)
    actualCoords=lat+""+lng
    actualFrecuence = data.frecuence
    previousOptio1key=Math.random()
    previousOptio2key=Math.random()

    this.setState({
      display:"block",
      prob:2*actualFrecuence,
      lat,
      lng
    })
  }
}