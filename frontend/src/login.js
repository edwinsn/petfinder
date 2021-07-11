import './assets/login.css'
import appIcon from './assets/images/appIcon.png'
import googleIcon from './assets/images/googleIcon.svg'
import userIcon from './assets/images/userIcon.svg'
import passwordIcon from './assets/images/passwordIcon.svg'
import goBackIcon from './assets/images/goBackIcon.svg'
import {Link} from 'react-router-dom'

export const Login = (props) => {

    const { email,
        password,
        handleLogin,
        handleSingUp,
        hasAccount,
        setHasAccount,
        errors,
        handleLoginWithGoogle } = props

    return (
        <section className="login">

            <Link to="/"><img alt="salir" src={goBackIcon} className="goback" /></Link>
            <div>
                <img className="appIcon" src={appIcon} alt="icono de la app" />
                <p>Encuentra y reporta animales<br /> callejeros</p>
            </div>
            <div className="loginContainer">
                <div>
                    <img src={userIcon} />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Email"
                        required
                        onChange={
                            (ev) => {
                                email.current = ev.target.value
                            }
                        }
                    />
                </div>
                <p className="errorMsg">{errors.emailError}</p>
                <div>
                    <img src={passwordIcon} />
                    <input type="password"
                        required
                        placeholder="contraseña"
                        onChange={(ev) => {
                            password.current = ev.target.value
                        }}
                    />
                </div>
                <p className="errorMsg">{errors.passwordError}</p>

                {hasAccount ?
                    (<div>
                        <button className="signInBtn" onClick={handleLogin} >Ingresar</button>
                        <p>Sin cuenta? <span onClick={() => { setHasAccount(false) }}>Registrate</span></p>
                    </div>) :
                    (<div>
                        <button className="signUpBtn" onClick={handleSingUp}>Registrarse</button>
                        <p>Tienes cuenta? <span onClick={() => { setHasAccount(true) }}>Ingresar</span></p>
                    </div>)
                }
            </div>
            <div className="googleBtnDiv">
                <button onClick={handleLoginWithGoogle}>
                    <img src={googleIcon} />
                    Continuar con Google
                </button>
            </div>
        </section>
    )
}