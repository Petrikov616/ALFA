import { useState } from "react";
import "./RegistrarAdmin.css";

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
                        <button><span>Listado de Estudiantes</span></button>
                        <button><span>Registrar Estudiante</span></button>
                        <button><span>Leer QR</span></button>
                        <button><span>Gestión de permisos</span></button>
                        <button><span>Registrar líder</span></button>
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