import './assets/AboutWindow.css'
import closeIcon from './assets/images/closeIcon.svg'
import animalsIcon from './assets/images/animalsIcon.png'


export const AboutWindow = (props) => {
    return (
        <section className="aboutWindowContainer" onClick={props.close}>
            <div className="aboutWindow">
                <img src={closeIcon} className="closeIcon" onClick={props.close} />
                <p className="title">
                    Acerca de
                </p>
                <p>
                    <span>Mio cid</span> es un app diseñada para que puedas encontrar
                    y reportar animales de la calle.
                </p>
                <p className="info">
                    <ul >
                        <li>Agrega un registro dando click en <span className="plus bolder">+</span></li>
                        <li>Arrastra la marca que agregaste </li>
                        <li>Puedes ajustar el <span className="green bolder">área</span> y subir una <span className="blue">foto</span></li>
                        <li>Puedes añadir tu información de contacto</li>
                    </ul>
                </p>
                <p>
                    Si deseas adoptar un peludito o te sobra un poco de comida puedes estar seguro 
                    de que un animal callejero te agradecerá tu ayuda
                </p>

            </div>
        </section>

    )
}