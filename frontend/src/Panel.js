import {Component} from 'react'
import './assets/Panel.css'
import axios from 'axios'
import closeIcon from './assets/images/closeIcon.svg'

export class Panel extends Component{

  constructor(props){
    super(props)
    this.state={
      display:"none",
      prob:"10",
      lat:0,
      lng:0
    }
    this.updatedDeprecatedLevel=this.updatedDeprecatedLevel.bind(this)
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
        <p><input type="radio" name="dep" onChange={(ev)=>{
          if(ev.target.checked){
              this.isDeprecated=true
              this.setState({
                prob:this.state.prob-1
              })
                    }
          
          }} /> Consideras el dato desactualizado?  </p>
        <p><input type="radio" name="dep" onChange={(ev)=>{
          if(ev.target.checked){
              this.isDeprecated=false
              this.setState({
              prob:this.state.prob+1
              })
          
          }}}/> Confirmas la veracidad del dato?</p>
        <button className="sendButton" 
                onClick={()=>{
                  this.updatedDeprecatedLevel(this.state.lat, this.state.lng, this.isDeprecated)
                  }}>
                   
                    Enviar
        </button>
      </div>
    </div>
    )
}


  async updatedDeprecatedLevel(lat=0,lng=0, isDeprecated=false){
    console.log("enviando")
    try{
    await axios.put(process.env.REACT_APP_POINTS_URI,{lat,lng,isDeprecated})
    console.log("--")
  }catch( err){
    console.log(err)
  }
    }
  open(lat, lng, deprecated_level){

    this.setState({
      display:"block",
      prob:10-deprecated_level,
      lat,
      lng
    })
  }
}