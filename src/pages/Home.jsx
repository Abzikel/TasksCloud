import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";

// Import SVGs as components
import { ReactComponent as Feature1Icon } from "../images/feature1.svg";
import { ReactComponent as Feature2Icon } from "../images/feature2.svg";
import { ReactComponent as Feature3Icon } from "../images/feature3.svg";

const Home = () => {
  return (
    <div className="home">
      {/* Navbar */}
      <Navbar buttonText="Iniciar Sesión" />

      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <h1 className="display-4">Organiza tus tareas con facilidad</h1>
          <p className="lead my-4">
            Simplifica tu día a día con nuestra plataforma para gestión de tareas.
          </p>
          <a href="/login" className="btn btn-primary btn-lg">
            Inicia ahora
          </a>
        </div>
        {/* Attribution Text */}
        <div className="attribution text-end pe-3">
          <small>
            Designed by <a href="http://www.freepik.com/" target="_blank" rel="noopener noreferrer">Freepik</a>
          </small>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">¿Por qué TasksCloud?</h2>
          <div className="row text-center">
            <div className="col-md-4">
              <Feature1Icon className="mb-3 feature-icon" />
              <h3>Gestión fácil</h3>
              <p>Administra tus tareas desde cualquier dispositivo, en cualquier lugar.</p>
            </div>
            <div className="col-md-4">
              <Feature2Icon className="mb-3 feature-icon" />
              <h3>Simplicidad</h3>
              <p>Una interfaz intuitiva y fácil de usar para mantenerte enfocado.</p>
            </div>
            <div className="col-md-4">
              <Feature3Icon className="mb-3 feature-icon" />
              <h3>Colaboración</h3>
              <p>Comparte y organiza tareas con tu equipo fácilmente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
