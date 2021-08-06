import './assets/fallback.css'
import errorIcon from './assets/images/error.svg'

export function FallBack() {

    return (
        <section className="fallback">

            <div>
                <p>Un error inesperado ha ocurrido, recarga el sitio para seguir usandolo.</p>
                <p>El error ya ha sido reportado y los solucionaremos pronto.</p>
            </div>
            <img src={errorIcon} alt="" />
        </section>
    )
}