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

                        <Link to="/admin/listado">
                            <span>Listado de Estudiantes</span>
                        </Link>

                        <Link to="/admin/registrar">
                            <span>Registrar Estudiante</span>
                        </Link>

                        <Link to="/admin/leerqr">
                            <span>Leer QR</span>
                        </Link>

                        <Link to="/admin/permisos">
                            <span>Gestión de permisos</span>
                        </Link>

                        <Link to="/admin/lider">
                            <span>Registrar líder</span>
                        </Link>

                    </nav>

                    <div className="logout">
                        <Link to="/login">
                            <span>Cerrar sesión</span>
                        </Link>
                    </div>

                </div>
            </aside>

            <main className="main-content">
                <h1>Registro Estudiantes</h1>
            </main>

        </div>
    );
};

export default RegistrarAdmin;
