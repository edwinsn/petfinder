import { useState, useEffect, useRef } from "react";
import { fire, auth, provider } from './fire'
import { Login } from "./login";
import { MainPage } from './MainPage'
import './assets/App.css'
import { Loading } from './Loading'

let loading

export const App = () => {

    const [user, setUser] = useState("noUserYet")
    const password = useRef("")
    const email = useRef("")
    const [errors, setErrors] = useState({})
    const [hasAccount, setHasAccount] = useState(true)
    const [showMap, setShowMap] = useState(true)

    const clearInput = () => {
        password.current = ''
        email.current = ''
    }

    const clearErrors = () => {
        setErrors({})
    }

    const handleLoginWithGoogle = () => {
        auth.signInWithRedirect(provider);
    }

    const handleLogin = (endLoading) => {
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
                        break;
                    default:
                        setErrors({ emailError: err.message })
                        break;
                    case "auth/wrong-password":
                        setErrors({
                            passwordError: "Contraseña incorrecta",
                            resetPassword: true
                        })
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
        this.clearErrors()
        fire.auth().sendPasswordResetEmail(this.state.email)
            .then((res => console.log(res)))
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