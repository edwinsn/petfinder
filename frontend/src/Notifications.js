import { Component } from "react"
import './assets/notifications.css'

export class Notifications extends Component {

    state = { progress: 0, showProgress: false, showOutOfRange: false, showMarkerInThere: false }

    update(progress=-1, showProgress = false, showOutOfRange = false) {

        this.setState({ progress, showOutOfRange, showProgress , showMarkerInThere:progress==-1?true:false})
    }

    render() {
        return (
            <div className="notifications">

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