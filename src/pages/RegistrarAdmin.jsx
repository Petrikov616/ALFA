import { useState } from "react";
import "./RegistrarAdmin.css";
import { Link } from "react-router-dom";

const RegistrarAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
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
                        <button><span>Cerrar Sesión</span></button>
                    </div>

                </div>
            </aside>

            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <h1>Registro Estudiantes</h1>
            </main>
        </div>

    );
}

export default RegistrarAdmin