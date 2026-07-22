import "./Hero.css";
import escudo from "../../assets/escudo.png";
import { NavLink } from "react-router-dom";

function Hero() {
    return (
        <section className="hero">
            <div className="hero-container">

                <div className="hero-text">
                    <h1>
                        Optimiza el control <br />
                        de asistencia con <br />
                        Agilcheck
                    </h1>

                    <p>
                        Simplifica y moderniza el registro de asistencia en colegios a través
                        de la tecnología de códigos QR, ahorrando tiempo a profesores y estudiantes.
                    </p>

                    <NavLink to="/login" className="acceder-btn">
                        Acceder a la Plataforma
                    </NavLink>
                </div>

                <div className="hero-image">
                    <img src={escudo} alt="Escudo institucional" />
                </div>

            </div>
        </section>
    );
}

export default Hero;
