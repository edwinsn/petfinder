import { Component } from 'react'
import './assets/Panel.css'
import axios from 'axios'
import closeIcon from './assets/images/closeIcon.svg'
import { editFrecuences } from './GetMarkers'
import UserIcon from './assets/images/userIcon.svg'
import frecuenceIcon from './assets/images/frecuenceIcon.svg'
import petsIcon from './assets/images/petsIcon.svg'
import plus from './assets/images/plus .svg'
import minus from './assets/images/minus.svg'
import dogIcon from './assets/images/dogIcon.svg'
import catIcon from './assets/images/catIcon.svg'

let actualCoords
let actualFrecuence
let previousOptio1key
let previousOptio2key

export class Panel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      display: "none",
      prob: "10",
      lat: 0,
      lng: 0,
      loading: false,
      imgUrl: false,
      isImgOpen: false
    }
    this.updatedFrecuence = this.updatedFrecuence.bind(this)
    this.open = this.open.bind(this)
    this.isDeprecated = false


  }

  render() {

    //console.log("Panel rendered")

    let openImg = () => {
      if (!this.state.isImgOpen) this.setState({ isImgOpen: true })
    }

    let probabilityBars = []
    for (let i = 0; i < 10; i++) {
      probabilityBars.push(
        <div key={i} style={{ background: i < this.state.prob ? "#3B72E1" : "#E3E3E3" }}></div>
      )
    }
    return (
      <div className="panelContainer">

        <div className={this.state.show ? "panel active" : "panel inactive"} >
          <img
            src={closeIcon}
            alt="close"
            className="close"
            onClick={
              () => {
                this.state?.unpaintCircle?.()
                this.setState({
                  show: false
                })
              }
            } />
          {this.state.excessOfRevitions &&
            <p className="excess">
              No puedes incrementar o disminuir la probabilidad más de una vez
            </p>}
          {this.state.updatedFrecuence &&
            <p className="frecuenceUpdated">Dato actualizado!</p>
          }
          <div className="infoContainer">

            <div>

              <div>
                <div className="verticalCentered">
                  <img src={petsIcon} className="petsImg" />
                  <span>Descripcion</span>
                </div>
                <p>
                  {this.state.description ? this.state.description : "No hay descripción"}
                </p>
              </div>

              <div>
                <div className="verticalCentered">
                  <img src={frecuenceIcon} />
                  <span>Avistamientos</span>
                </div>
                <div className="probabilityContainer">
                  <div className="probabilitybars">
                    {probabilityBars}
                  </div>

                  <label htmlFor="decrementProb">
                    <input type="radio" name="dep"
                      className="hidden"
                      key={previousOptio1key}
                      id="decrementProb"
                      onChange={(ev) => {
                        if (ev.target.checked) { this.updatedFrecuence(this.state.lat, this.state.lng, true) }
                      }} />
                    <img src={minus} />
                  </label>

                  <label htmlFor="incrementProb">
                    <input type="radio"
                      className="hidden"
                      id="incrementProb"
                      name="dep"
                      key={previousOptio2key}
                      onChange={(ev) => {
                        if (ev.target.checked) {
                          this.updatedFrecuence(this.state.lat, this.state.lng, false)
                        }
                      }} />
                    <img src={plus} />
                  </label>
                </div>
              </div>

              <div>
                <div className="verticalCentered">
                  <img src={UserIcon} />
                  <span>Contacto</span>
                </div>

                <p>
                  {this.state.contact ? this.state.contact : "No hay contacto"}
                </p>
              </div>

            </div>
            <div className={this.state.isImgOpen ? "fullScreen" : "animalImgcontainer"} >

              {this.state.isImgOpen &&
                <div className="background"
                  onClick={() => { this.setState({ isImgOpen: false }) }}
                ></div>}

              <div className={this.state.isImgOpen ? "deployimg" : ""}>

                {this.state.isImgOpen &&
                  <img className={window.innerHeight > window.innerWidth ? "close left" : "close"} src={closeIcon}
                    onClick={() => { this.setState({ isImgOpen: false }) }}
                  />}
                <img className={this.state.isImgOpen ?
                  (window.innerHeight > window.innerWidth ? "mobilbigimg" : "animalImg") :
                  "animalImg"}
                  onClick={openImg}
                  src={this.state.imgUrl ? this.state.imgUrl : undefined} />

              </div>

            </div>
          </div>


        </div>
      </div >
    )
  }


  async updatedFrecuence(lat = 0, lng = 0, isDeprecated = false) {
    if (isDeprecated) {
      this.setState({ prob: actualFrecuence <= 1 ? 1 : 2 * actualFrecuence - 1 })
      editFrecuences(actualFrecuence - 0.5, actualCoords)
    }
    else {
      this.setState({ prob: this.state.prob < 9 ? 2 * actualFrecuence + 2 : 10 })
      editFrecuences(actualFrecuence + 1, actualCoords)
    }
    //console.log("enviando")
    try {
      await axios.put(process.env.REACT_APP_POINTS_URI, { lat, lng, isDeprecated })
      this.setState({ loading: false, updatedFrecuence: true })
      setTimeout(() => { this.setState({ display: "none", updatedFrecuence: false }) }, 600)

      console.log("Dato Actualizado")
    } catch (err) {
      console.log(err)
    }
  }

  open(lat, lng, data) {
    actualCoords = lat + "" + lng
    actualFrecuence = data.frecuence
    previousOptio1key = Math.random()
    previousOptio2key = Math.random()

    //console.log(data)

    this.setState({
      display: "block",
      show: true,
      prob: 2 * actualFrecuence,
      lat,
      lng,
      imgUrl: data.imgurl ? data.imgurl : (data.type === "dog" ? dogIcon : catIcon),
      contact: data.contact,
      description: data.description,
      unpaintCircle: data.unpaintCircle
    })
  }
}