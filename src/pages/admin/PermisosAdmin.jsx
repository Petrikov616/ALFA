import { useState } from "react";
import "./PermisosAdmin.css";
import { Link } from "react-router-dom";

const PermisosAdmin = () => {

    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // dropdown grupo
    const [openGrupo, setOpenGrupo] = useState(false);
    const [grupo, setGrupo] = useState("Todos");

    const grupos = [
        "Todos",
        "6-1","6-2",
        "7-1","7-2",
        "8-1","8-2",
        "9-1","9-2",
        "10-1","10-2",
        "11-1","11-2"
    ];

    // dropdown estado
    const [openEstado, setOpenEstado] = useState(false);
    const [estado, setEstado] = useState("Pendiente");

    const estados = [
        "Pendiente",
        "Aprobado",
        "Rechazado"
    ];

    return (
        <div className="admin-layout">

            {/* SIDEBAR */}
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

                <h1>Gestión de Permisos y Justificaciones</h1>

                <p className="subtitle">
                    Genera el código QR para cada estudiante mediante el documento de identidad
                </p>


                {/* BARRA DE FILTROS */}
                <div className="filters-container">

                    {/* BUSCADOR */}
                    <div className="search-box">
                        
                        <input
                            type="text"
                            placeholder="Buscar por nombre de estudiante..."
                        />
                    </div>


                    {/* DROPDOWN GRUPO */}
                    <div className="dropdown">
                        <button
                            className="select-btn"
                            onClick={() => setOpenGrupo(!openGrupo)}
                        >
                            {grupo} ▾
                        </button>

                        {openGrupo && (
                            <div className="dropdown-menu">
                                {grupos.map((g, index) => (
                                    <div
                                        key={index}
                                        className="dropdown-item"
                                        onClick={() => {
                                            setGrupo(g);
                                            setOpenGrupo(false);
                                        }}
                                    >
                                        {g}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* DROPDOWN ESTADO */}
                    <div className="dropdown">
                        <button
                            className="select-btn"
                            onClick={() => setOpenEstado(!openEstado)}
                        >
                            {estado} ▾
                        </button>

                        {openEstado && (
                            <div className="dropdown-menu">
                                {estados.map((e, index) => (
                                    <div
                                        key={index}
                                        className="dropdown-item"
                                        onClick={() => {
                                            setEstado(e);
                                            setOpenEstado(false);
                                        }}
                                    >
                                        {e}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>


                {/* TABLA / CONTENIDO */}
                <div className="permiso-table">

                </div>

            </main>

        </div>
    );
};

export default PermisosAdmin;
