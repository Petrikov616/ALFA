import { useState } from "react";
import "./ListadoAdmin.css";

const ListadoAdmin = () => {
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
                <h1>Bienvenido, Administrador</h1>

                <div className="content-box">
                    <div className="filters">

                        <div className="filter-group">
                            <span>Grupo:</span>
                            <button className="select-btn">Grupo 9-2 ▾</button>
                        </div>

                        <div className="filter-group">
                            <span>Mes:</span>
                            <div className="month-selector">
                                <button>{"<"}</button>
                                <button className="select-btn">Octubre</button>
                                <button>{">"}</button>
                            </div>
                        </div>

                        <button className="excel-btn">
                            Exportar a Excel
                        </button>

                    </div>

                </div>
            </main>

        </div>
    );
};

export default ListadoAdmin;
