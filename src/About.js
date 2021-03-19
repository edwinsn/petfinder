import './assets/About.css'

export function About(){
    return <div className="about">
                <p className="infoIcon">i</p>
                <div className="info">
                    <p>Encuentra y reporta animales en la calle</p>
                    <p>Agraga un registro dando click en <span className="plus">+</span></p>
                    <p>Arrastra la marca que agregaste a la ubicación del animal</p>
                </div>
           </div>
}