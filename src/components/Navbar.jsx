import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../images/logo.svg";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import "./Navbar.css";

const Navbar = ({ buttonText, showButton = true }) => {
    const navigate = useNavigate();

    // Handle button click from navbar
    const handleButtonClick = async () => {
        if (buttonText === "Cerrar Sesión") {
            const confirmLogout = window.confirm("¿Seguro que deseas cerrar sesión?");
            if (confirmLogout) {
                try {
                    // Sign out from FirebaseAuth and redirect to the root
                    await signOut(auth);
                    navigate("/");
                } catch (error) {
                    console.error("Error al cerrar sesión:", error.message);
                }
            }
        } else {
            navigate("/login");
        }
    };

    // Handle click on the logo and app name
    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <nav className="navbar py-3">
            <div className="container d-flex justify-content-between align-items-center">
                <div
                    className="d-flex align-items-center logo-container"
                    onClick={handleLogoClick}
                    style={{ cursor: "pointer" }}
                >
                    <Logo className="logo-icon me-2" />
                    <h1 className="h4 m-0 text-brand">TasksCloud</h1>
                </div>
                {showButton && (
                    <button className="btn btn-login" onClick={handleButtonClick}>
                        {buttonText}
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
