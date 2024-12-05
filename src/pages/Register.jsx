import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Spinner } from 'react-bootstrap';
import { onAuthStateChanged, getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from '../firebase/firebase';
import './Register.css';
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBInput
} from 'mdb-react-ui-kit';

function Register() {
    // States to manage input fields, messages and loading spinner
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // Reference to Firestore database
    const db = getFirestore();

    // Check if the user is already logged in when the component mounts
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check if the user's document exists in Firestore
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    // Redirect to tasks page if document exists
                    window.location.href = "/tasks";
                } else {
                    // Redirect to profile completion page if document doesn't exist
                    window.location.href = "/tasks";
                }
            } else {
                // Stop spinner if no user is logged in
                setLoading(false);
            }
        });

        // Cleanup the listener
        return () => unsubscribe();
    }, [db]);

    const handleRegister = async () => {
        // Check if email and password are provided
        if (!email || !password) {
            // Display error if fields are empty
            setMessage("Error: Todos los campos son obligatorios.");
            return;
        }

        // Check if the password meets the minimum length requirement
        if (password.length < 6) {
            // Display error for short passwords
            setMessage("Error: La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // Initialize Firebase Authentication
        const auth = getAuth();
        try {
            // Attempt to create a new user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send a verification email to the newly created user
            await sendEmailVerification(user);
            setMessage("Cuenta creada con éxito. Por favor, verifica tu correo antes de iniciar sesión.");

            // Redirect to the login page after a delay of 5 seconds
            setTimeout(() => {
                // Navigate to login page
                window.location.href = "/login";
            }, 5000);
        } catch (error) {
            // Display any error that occurs during registration
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
        <div className="page-container">
            <Navbar buttonText="Iniciar Sesión" />

            <div className="content-wrap">
                <MDBContainer fluid className="p-3 my-5">
                    <MDBRow>
                        <MDBCol col="10" md="6">
                            <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                                className="img-fluid"
                                alt="Registration"
                            />
                        </MDBCol>

                        <MDBCol col="4" md="6">
                            <h3 className="mb-4">Crear cuenta</h3>

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

                            <MDBBtn className="mb-4 w-100" size="lg" onClick={handleRegister}>
                                Crear cuenta
                            </MDBBtn>

                            {message && (
                                <p className={message.startsWith("Error") ? "error-message" : "success-message"}>
                                    {message}
                                </p>
                            )}

                            <p className="text-center">
                                ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
                            </p>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>

            <Footer />
        </div>
    );
}

export default Register;
