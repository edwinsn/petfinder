import './assets/login.css'
import appIcon from './assets/images/appIcon.png'
import googleIcon from './assets/images/googleIcon.svg'
import userIcon from './assets/images/userIcon.svg'
import passwordIcon from './assets/images/passwordIcon.svg'
import goBackIcon from './assets/images/goBackIcon.svg'
import { LoadingCircles } from './Loading'


export const Login = (props) => {

    const { email,
        password,
        handleLogin,
        handleSingUp,
        hasAccount,
        setHasAccount,
        errors,
        handleLoginWithGoogle,
        show,
        hide,
        loading } = props



    return show ? (
        <section className="loginContainer">
            <div className="login">

                <img alt="salir" src={goBackIcon} onClick={hide} className="goback" />
                <div>
                    <img className="appIcon" src={appIcon} alt="icono de la app" />
                    <p>Encuentra y reporta animales<br /> callejeros</p>
                </div>
                <div className="inputsContainer">
                    <div>
                        <img src={userIcon} />
                        <input
                            type="text"
                            autoFocus
                            autoComplete="off"
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
                            autocomplete="off"
                            placeholder="contraseña"
                            onChange={(ev) => {
                                password.current = ev.target.value
                            }}
                        />
                    </div>
                    <p className="errorMsg">{errors.passwordError}</p>

                    {hasAccount ?
                        (<div >
                            <div onClick={handleLogin} className="BtnContainer">
                                {loading ? <LoadingCircles color={"white"} /> :
                                    <button className="signInBtn"  >Ingresar</button>
                                }
                            </div>
                            <p>Sin cuenta? <span onClick={() => { setHasAccount(false) }}>Registrate</span></p>
                        </div>) :
                        (<div>
                            <div>
                                <div className="BtnContainer signUpBtn">{
                                    loading ? <LoadingCircles color={"white"} /> :
                                        <button onClick={handleSingUp} className="signUpBtn" >Registrarse</button>}
                                </div>
                            </div>
                            <p>Tienes cuenta? <span onClick={() => { setHasAccount(true) }}>Ingresar</span></p>
                        </div>)
                    }
                </div >
                <div className="googleBtnDiv" onClick={handleLoginWithGoogle}>
                    <button >
                        <img src={googleIcon} />
                        Continuar con Google
                    </button>
                </div>
            </div>
        </section>
    )
        :
        null
}