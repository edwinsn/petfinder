import './assets/login.css'
import appIcon from './assets/images/appIcon.svg'
import googleIcon from './assets/images/googleIcon.svg'
import userIcon from './assets/images/userIcon.svg'
import passwordIcon from './assets/images/passwordIcon.svg'
import goBackIcon from './assets/images/goBackIcon.svg'
import { LoadingCircles } from './Loading'
import { useState } from 'react'


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
        loading,
        newPassword,
        resetPassword,
        clearErrors } = props


    let [showResetPasswordMessage, toggleShowResetPasswordMessage] = useState(false)
    const [checkMail, setCheckMail] = useState(false)


    return show ? (
        <section className="loginContainer justify-center align-center">
            <img alt="salir" src={goBackIcon} onClick={hide} className="goback" />
            <div id="login" className="relative justify-center align-center">

                <div>
                    <img className="appIcon" src={appIcon} alt="icono de la app" />
                    <p className="slogan">Encuentra, reporta y ayuda</p>
                </div>
                <div className="inputsContainer align-center">
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
                    <div className="errorMsg small">{errors.emailError}</div>
                    <div>
                        <img src={passwordIcon} />
                        <input type="password"
                            required
                            autoComplete="off"
                            placeholder="contraseña"
                            onChange={(ev) => {
                                password.current = ev.target.value
                            }}
                        />
                    </div>
                    <p className="errorMsg small">{errors.passwordError}</p>

                    {hasAccount ?
                        (<div className="relative">
                            <div onClick={handleLogin} className="BtnContainer">
                                {loading ? <LoadingCircles color={"white"} /> :
                                    <button className="signInBtn"  >Ingresar</button>
                                }
                            </div>
                            <p>Sin cuenta? <span onClick={() => { setHasAccount(false); clearErrors() }}>Registrate</span></p>
                            {(newPassword && !checkMail) && <div className="small"
                                ><span onClick={() => {

                                    if (!showResetPasswordMessage) {
                                        resetPassword()
                                        toggleShowResetPasswordMessage(true)
                                        setCheckMail(true)
                                    }

                                }} >Restablecer Contraseña</span></div>}
                            {checkMail && <div className="white small bolder">Revisa tu correo para restablecer la contraseña</div>}
                        </div>) :
                        (<div>
                            <div>
                                <div className="BtnContainer signUpBtn">{
                                    loading ? <LoadingCircles color={"white"} /> :
                                        <button onClick={handleSingUp} className="signUpBtn" >Registrarse</button>}
                                </div>
                            </div>
                            <p>Tienes cuenta? <span onClick={() => { setHasAccount(true) ; clearErrors()}}>Ingresar</span></p>
                        </div>)
                    }
                </div >
                <div className="googleBtnDiv justify-center relative" onClick={handleLoginWithGoogle}>
                    <button className="justify-center align-center">
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