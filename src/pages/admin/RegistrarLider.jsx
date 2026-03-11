import { useState } from "react";
import "./RegistrarLider.css";
import { Link } from "react-router-dom";

const RegistrarLider = () => {
    const [menuOpen, setMenuOpen] = useState(true)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    };

    return (
        <div className="admin-layout">

            <aside className={`sidebar ${menuOpen ? "open" : "closed"}`}>
                <div className="sidebar-content">

                    <h2 onClick={toggleMenu} className="logo">
                        ☰ <span>AgilCheck</span>
                    </h2>

                    <nav className="menu">

                        <Link to="/admin/listado" className="menu-link">
                            <span>Listado de Estudiantes</span>
                        </Link>

                        <Link to="/admin/registrar" className="menu-link">
                            <span>Registrar Estudiante</span>
                        </Link>

                        <Link to="/admin/leerqr" className="menu-link">
                            <span>Leer QR</span>
                        </Link>

                        <Link to="/admin/permisos" className="menu-link">
                            <span>Gestión de permisos</span>
                        </Link>

                        <Link to="/admin/lider" className="menu-link">
                            <span>Registrar líder</span>
                        </Link>
                    </nav>

                    <div className="logout">
                        <Link to="/login" className="menu-link">
                        <span>Cerrar secion</span>
                        </Link>
                    </div>

                </div>
            </aside>

            {/* CONTENIDO */}
            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <h1>Registro de Lideres</h1>

                <p className="subtitle">
                    Registro de lideres para el plan de alimentación escolar
                </p>

                <div className="container-lider">
                    <div className="form-lider">

                        <div className="input-lider">
                            <label htmlFor="lider">Lider</label>
                            <input type="text" placeholder="Lider" id="lider" />
                        </div>

                        <div className="input-lider">
                            <label htmlFor="documento">Documento</label>
                            <input type="text" placeholder="Documento" id="documento" />
                        </div>

                        <div className="input-lider">
                            <label htmlFor="contraseña">Contraseña</label>
                            <input type="password" placeholder="Contraseña" id="contraseña" />
                        </div>

                        <button type="submit" className="lider-btn">Crear lider</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RegistrarLider