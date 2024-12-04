import React from "react";
import "./styles/Dashboard.css";
import { ReactComponent as Logo } from './images/logo.svg';
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="logo">
            <Logo className="logo-icon" />
            <b>TasksCloud</b>
        </div>
        <nav className="nav">
          {/* Usa el componente Link para redirigir a /login */}
          <Link to="/login">Iniciar Sesión</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Organiza tus tareas con facilidad</h1>
          <Link to="/login">
            <button className="cta-btn">Inicia ahora</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>¿Por qué TasksCloud?</h2>
        <div className="feature">
          <img src="/images/feature1.png" alt="Feature 1" />
          <h3>Gestión fácil</h3>
          <p>Administra tus tareas desde cualquier dispositivo, en cualquier lugar.</p>
        </div>
        <div className="feature">
          <img src="/images/feature2.png" alt="Feature 2" />
          <h3>Notificaciones</h3>
          <p>Recibe recordatorios para que nunca olvides lo importante.</p>
        </div>
        <div className="feature">
          <img src="/images/feature3.png" alt="Feature 3" />
          <h3>Colaboración</h3>
          <p>Comparte y organiza tareas con tu equipo fácilmente.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 TasksCloud. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
