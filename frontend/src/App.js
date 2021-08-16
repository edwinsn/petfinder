import { useState, useEffect, useRef } from "react";
import { fire, auth, provider } from './fire'
import { Login } from "./login";
import { MainPage } from './MainPage'
import './assets/App.css'
import { Loading } from './Loading'
import { FallBack } from './FallBack'

let loading

export const App = () => {

    useEffect(() => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, [])

    const [user, setUser] = useState("noUserYet")
    const password = useRef("")
    const email = useRef("")
    const [errors, setErrors] = useState({})
    const [hasAccount, setHasAccount] = useState(true)
    const [showMap, setShowMap] = useState(true)
    const [newPassword, setNewPassword] = useState(false)

    const clearInput = () => {
        password.current = ''
        email.current = ''
    }

    const clearErrors = () => {
        setErrors({})
    }

    const handleLoginWithGoogle = () => {

        auth.signInWithPopup(provider)
            .catch((err) => {
                alert("err: " + err)
            });
    }

    const handleLogin = () => {
        loading = true
        clearErrors()
        auth
            .signInWithEmailAndPassword(email.current, password.current)
            .catch(err => {
                loading = false
                switch (err.code) {
                    case "auth/Invalid-email":
                        setErrors({ emailError: "Email inválido" })
                        break;
                    case "auth/user-disable":
                        setErrors({ emailError: "Usuario Desabilitad0" })
                        break;
                    case "auth/user-not-found":
                        setErrors({ emailError: "Usuario no registrado" })
                        break
                    case "auth/too-many-requests":
                        setErrors({
                            emailError: "Demasiados intentos, regresa en unos minutos o restablece tu contraseña",
                            resetPassword: true
                        })
                        setNewPassword(true)
                        break;
                    default:
                        setErrors({ emailError: err.message })
                        break;
                    case "auth/wrong-password":
                        setErrors({
                            passwordError: "Contraseña incorrecta",
                            resetPassword: true
                        })
                        setNewPassword(true)
                        break;
                }
            })
    }

    const handleSingUp = () => {
        loading = true
        clearErrors()

        auth
            .createUserWithEmailAndPassword(email.current, password.current)
            .catch(err => {
                loading = false
                switch (err.code) {
                    case 'auth/email-already-in-use':
                        setErrors({ emailError: "Usuario registrado" })
                        break;
                    case 'auth/invalid-email':
                        setErrors({ emailError: "Email inválido" })
                        break;
                    case 'auth/weak-password':
                        setErrors({ passwordError: "Contraseña débil" })
                        break;
                    case 'auth/argument-error':
                    default:
                        setErrors({ passwordError: err.message })
                        break;

                }
            })
    }

    const handleLogout = () => {
        loading = false
        auth.signOut()
    }
    const authListener = () => {
        auth.onAuthStateChanged(user => {
            if (user) {
                clearInput()
                setShowMap(true)
                setUser(user)
            } else {
                setUser("noUser")
            }
        })
    }

    /*
    sobreposicion
     */

    const resetPassword = () => {
        setErrors({})
        fire.auth().sendPasswordResetEmail(email.current)
            .then((res => console.log(res)))
            .catch((err)=>{ console.log(err) })
    }

    useEffect(() => {
        authListener()
    }, [])
    let view


    switch (user) {
        case "noUserYet":
            view = <Loading />
            break;
        default:
            view =
                <>
                    <Login
                        email={email}
                        password={password}
                        handleLogin={handleLogin}
                        handleSingUp={handleSingUp}
                        hasAccount={hasAccount}
                        setHasAccount={setHasAccount}
                        errors={errors}
                        handleLoginWithGoogle={handleLoginWithGoogle}
                        show={!showMap}
                        hide={() => { setShowMap(true) }}
                        loading={loading}
                        resetPassword={resetPassword}
                        newPassword={newPassword}
                        clearErrors={()=>{setErrors({})}}
                    />
                    <MainPage useruid={user != "noUser" ? user.uid : false}
                        handleLogout={handleLogout}
                        show={showMap}
                        showLogin={() => { setShowMap(false) }}
                    />
                </>

            break;
    }

    return (<div className="App">
        {view}
    </div>)
}