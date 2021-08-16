import closeIcon from './assets/images/closeIcon.svg'


export const AboutWindow = (props) => {
    return (
        <section className="emergentContainer">
            <div onClick={props.close} className="background"></div>
            <div className="emergentWindow hide-scroll" >
                <img src={closeIcon} className="closeIcon" onClick={props.close} />
                <p className="title">
                    Acerca de
                </p>
                <p>
                    <span>Animalcoords</span> es un app diseñada para que puedas encontrar
                    y reportar animales de la calle.
                </p>
                <p>
                    <ul >
                        <li>Agrega un registro dando click en <span className="blue bolder">+</span></li>
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