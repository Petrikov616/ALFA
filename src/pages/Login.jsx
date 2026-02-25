import "./Login.css";
import escudo from "../assets/escudo.png";
import logo from "../assets/logoQR.png";

function Login() {
    return (
        <section className="login">
            <div className="logo-header">
                <img src={logo} alt="logoQR" className="logo" />
                <span className="brand">AgilCheck</span>
            </div>

            <div className="login-card">
                <div className="login-left">
                    <img src={escudo} alt="Escudo institucional" className="login-image" />
                </div>

                <div className="login-right">
                    <h2>Iniciar sesion</h2>
                    <p>Bienvenido al sistema AgilCheck</p>

                    <form className="login-form">

                        <div className="input-group">
                            <label>Usuario</label>
                            <input type="text" placeholder="Ingrese su usuario" />
                        </div>

                        <div className="input-group">
                            <label>Contraseña</label>
                            <input type="password" placeholder="Ingrese su contraseña" />
                        </div>

                        <div className="forgot-password">
                            <a href="#">¿Olvidaste tu contraseña?</a>
                        </div>

                        <button type="submit" className="login-boton">Ingresar</button>
                    </form>
                </div>
            </div>
        </section>

    );
}

export default Login;
