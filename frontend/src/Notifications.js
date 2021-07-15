import { Component } from "react"
import './assets/notifications.css'

export class Notifications extends Component {

    state = { progress: 0, showProgress: false, showOutOfRange: false, showMarkerInThere: false, withoutConnection: false, feedBack: false }

    update(progress = -1, showProgress = false, showOutOfRange = false, withoutConnection = false, feedBack = false) {

        this.setState({ progress, showOutOfRange, showProgress, showMarkerInThere: progress == -1 ? true : false, withoutConnection, feedBack })
    }

    render() {
        return (
            <div className="notifications">
                {
                    this.state.feedBack && <div className="uploading" >Gracias por tus sugerencias</div>
                }
                {
                    this.state.withoutConnection && <div className="error">Sin conexión</div>
                }
                {
                    this.state.showOutOfRange && <div className="error">El area debe ser menor a 400mts</div>}
                {
                    this.state.showProgress &&
                    <div className="uploading">
                        <span>Guardando...</span>
                        <progress value={this.state.progress}></progress>
                    </div>}
                {
                    this.state.showMarkerInThere && <div className="error"> Ya hay una marca en ese lugar</div>
                }
            </div>
        )
    }
}