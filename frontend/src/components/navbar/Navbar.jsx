import "./Navbar.css";
import logo from "../../assets/logoQR.png";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-container">

                <div className="navbar-left">
                    <img src={logo} alt="logoQR" className="logo" />
                    <span className="brand">AgilCheck</span>
                </div>

                <Link to="/login" className="login-btn">
                    Iniciar Sesión
                </Link>

            </div>
        </header>
    );
}

export default Navbar;
