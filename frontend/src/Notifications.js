import { Component } from "react"
import { useSelector } from 'react-redux'
import './assets/notifications.css'

export const Notifications = () => {

    /*   state = { progress: 0, showProgress: false, showOutOfRange: false, showMarkerInThere: false, withoutConnection: false, feedBack: false, noEditable: false, editInstructions: false }
    
        update(progress = -1, showProgress = false, showOutOfRange = false, withoutConnection = false, feedBack = false, noEditable = false) {
    
            this.setState({ progress, showOutOfRange, showProgress, showMarkerInThere: progress == -1 ? true : false, withoutConnection, feedBack, noEditable })
        }*/


    const notifications = useSelector(state => {
        return state.notifications.value
    });

    return (
        <div className="notifications">
            {
                notifications.editInstructions && <div className="uploading editMarkers "> Da click en la marcas <span className="orange">naranjas</span> para editarlas </div>
            }
            {
                notifications.noEditable && <div className="error">No puedes editar marcas que no hayas reportado</div>
            }
            {
                notifications.feedBack && <div className="uploading" >Gracias por tus sugerencias</div>
            }
            {
                notifications.withoutConnection && <div className="error">Sin conexión</div>
            }
            {
                notifications.showOutOfRange && <div className="error">El area debe ser menor a 400mts</div>}
            {
                notifications.showProgress &&
                <div className="uploading">
                    <span>Guardando...</span>
                    <progress value={notifications.progress}></progress>
                </div>}
            {
                notifications.showMarkerInThere && <div className="error"> Ya hay una marca en ese lugar</div>
            }
        </div>
    )
}