import './assets/About.css'

export function About() {
    return <div className="about">
        <p className="infoIcon">i</p>
        <div className="info">
            <p>Encuentra y reporta animales en la calle</p>
            <ul >
                <li>Agrega un registro dando click en <span className="plus bolder">+</span></li>
                <li>Arrastra la marca que agregaste </li>
                <li>puedes ajustar el <span className="green bolder">área</span> y subir una <span className="blue">foto</span></li>
            </ul>
        </div>
    </div>
}