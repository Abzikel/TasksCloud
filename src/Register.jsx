import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import './styles/Register.css';
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBInput
} from 'mdb-react-ui-kit';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        if (!email || !password) {
            setMessage("Error: Todos los campos son obligatorios.");
            return;
        }

        if (password.length < 6) {
            setMessage("Error: La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Enviar correo de verificación
            await sendEmailVerification(user);
            setMessage("Cuenta creada con éxito. Por favor, verifica tu correo antes de iniciar sesión.");
            
            // Redirigir al login después de un tiempo
            setTimeout(() => {
                window.location.href = "/login"; // O usa navigate("/login") si usas react-router-dom
            }, 5000);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
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
    );
}

export default Register;
