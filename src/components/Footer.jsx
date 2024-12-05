import React from "react";
import "./Footer.css";

const Footer = () => {
    // Get current year and show next to the copyright info
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer text-center py-3">
            <p className="m-0">
                &copy; {currentYear} TasksCloud. Todos los derechos reservados.
            </p>
        </footer>
    );
};

export default Footer;
