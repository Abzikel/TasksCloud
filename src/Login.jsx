import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, githubProvider } from './firebase/firebase';
import './styles/Login.css';
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCheckbox
} from 'mdb-react-ui-kit';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState("");

    const db = getFirestore(); // No necesitas inicializar esto múltiples veces

    // Verificar si ya hay una sesión activa
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await handleUserRedirect(user);
            }
        });

        return () => unsubscribe(); // Limpia el listener al desmontar el componente
    }, []);

    const handleLogin = async () => {
        try {
            // Configurar persistencia
            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence);

            // Iniciar sesión con correo y contraseña
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleUserRedirect(userCredential.user);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            await handleUserRedirect(userCredential.user);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleGithubLogin = async () => {
        try {
            const userCredential = await signInWithPopup(auth, githubProvider);
            await handleUserRedirect(userCredential.user);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleUserRedirect = async (user) => {
        // Verificar si el usuario tiene un documento en Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            // Redirigir a la página de tareas
            window.location.href = "/tasks";
        } else {
            // Redirigir a la página para completar el perfil
            window.location.href = "/tasks";
        }
    };

    return (
        <MDBContainer fluid className="p-3 my-5">
            <MDBRow>
                <MDBCol col='10' md='6'>
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw1.svg" class="img-fluid" alt="Phone image" />
                </MDBCol>

                <MDBCol col='4' md='6'>
                    <h3 className="mb-4">Iniciar Sesión</h3>

                    <MDBInput
                        wrapperClass="mb-4"
                        label="Correo electrónico"
                        id="formEmail"
                        type="email"
                        size="lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <MDBInput
                        wrapperClass="mb-4"
                        label="Contraseña"
                        id="formPassword"
                        type="password"
                        size="lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="d-flex justify-content-between mx-4 mb-4">
                        <MDBCheckbox
                            name="flexCheck"
                            value=""
                            id="flexCheckDefault"
                            label="Recordarme"
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <a href="!#">¿Olvidaste tu contraseña?</a>
                    </div>

                    <MDBBtn className="mb-4 w-100" size="lg" onClick={handleLogin}>
                        Iniciar Sesión
                    </MDBBtn>

                    {message && <p className="text-center text-danger mt-3">{message}</p>}

                    <div className="divider d-flex align-items-center my-4">
                        <p className="text-center fw-bold mx-3 mb-0">O</p>
                    </div>

                    <MDBBtn
                        className="mb-4 w-100 google-btn"
                        size="lg"
                        style={{ backgroundColor: '#DB4437', color: 'white', border: 'none' }}
                        onClick={handleGoogleLogin}
                    >
                        <MDBIcon fab icon="google" className="mx-2" />
                        Continuar con Google
                    </MDBBtn>

                    <MDBBtn
                        className="mb-4 w-100 github-btn"
                        size="lg"
                        style={{ backgroundColor: '#333333', color: 'white', border: 'none' }}
                        onClick={handleGithubLogin}
                    >
                        <MDBIcon fab icon="github" className="mx-2" />
                        Continuar con GitHub
                    </MDBBtn>

                    <div className="text-center mt-3">
                        ¿No tienes cuenta? <a href="/register" className="register-link">Crear una</a>
                    </div>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Login;
