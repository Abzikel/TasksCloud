import React, { useState, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Spinner } from 'react-bootstrap';
import { onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, githubProvider } from '../firebase/firebase';
import './Login.css';
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
    // States to manage input fields, messages and loading spinner
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // Reference to Firestore database
    const db = getFirestore();

    // Function to handle user redirection based on their state in Firestore
    const handleUserRedirect = useCallback(async (user) => {
        // Query Firestore to check if the user's document exists
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            // If the document exists, redirect to the dashboard page
            window.location.href = "/dashboard";
        } else {
            // If not, redirect to the profile completion page
            window.location.href = "/dashboard";
        }
    }, [db])

    // useEffect: Runs when the component mounts to check if a user is already authenticated
    useEffect(() => {
        // Subscribe to changes in authentication state
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // If a user is authenticated, redirect based on their state in Firestore
                await handleUserRedirect(user);
            }

            // Set loading to false once verification is done
            setLoading(false);
        });

        // Cleanup: Unsubscribe the listener when the component unmounts
        return () => unsubscribe();
    }, [handleUserRedirect]);

    // Function to handle login with email and password
    const handleLogin = async () => {
        try {
            // Set session persistence based on the "Remember Me" preference
            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence);

            // Attempt to log in with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Redirect the user based on their state in Firestore
            await handleUserRedirect(userCredential.user);
        } catch (error) {
            // If an error occurs, display the message in the UI
            setMessage(`Error: ${error.message}`);
        }
    };

    // Function to handle login with Google
    const handleGoogleLogin = async () => {
        try {
            // Set session persistence
            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence);

            // Proceed with Google login
            const userCredential = await signInWithPopup(auth, googleProvider);
            await handleUserRedirect(userCredential.user);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    // Function to handle login with GitHub
    const handleGithubLogin = async () => {
        try {
            // Set session persistence
            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence);

            // Proceed with GitHub login
            const userCredential = await signInWithPopup(auth, githubProvider);
            await handleUserRedirect(userCredential.user);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    if (loading) {
        // Render a loading spinner while checking authentication
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <>
            {/* Navbar */}
            <Navbar showButton={false} />

            {/* Login Form */}
            <MDBContainer fluid className="p-3 my-5">
                <MDBRow>
                    <MDBCol col='10' md='6'>
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw1.svg" className="img-fluid" alt="Login" />
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
                                checked={rememberMe}
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

            {/* Footer */}
            <Footer />
        </>
    );
}

export default Login;
