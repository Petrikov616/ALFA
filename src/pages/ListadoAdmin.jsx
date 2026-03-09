import { useState } from "react";
import "./ListadoAdmin.css";
import { Link } from "react-router-dom";

const ListadoAdmin = () => {

    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // DROPDOWN GRUPO
    const [openGrupo, setOpenGrupo] = useState(false);
    const [grupo, setGrupo] = useState("Todos");

    const grupos = [
        "Todos",
        "6-1", "6-2",
        "7-1", "7-2",
        "8-1", "8-2",
        "9-1", "9-2",
        "10-1", "10-2",
        "11-1", "11-2"
    ];

    // DROPDOWN MES
    const [openMes, setOpenMes] = useState(false);
    const [mes, setMes] = useState("Enero");

    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
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
                        <button><span>Cerrar Sesión</span></button>
                    </div>

                </div>
            </aside>


            {/* CONTENIDO */}
            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <h1>Bienvenido, Administrador</h1>

                <div className="content-box">
                    <div className="filters">

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


                        {/* DROPDOWN MES */}
                        <div className="dropdown">

                            <button
                                className="select-btn"
                                onClick={() => setOpenMes(!openMes)}
                            >
                                {mes} ▾
                            </button>

                            {openMes && (
                                <div className="dropdown-menu">
                                    {meses.map((e, index) => (
                                        <div
                                            key={index}
                                            className="dropdown-item"
                                            onClick={() => {
                                                setMes(e);
                                                setOpenMes(false);
                                            }}
                                        >
                                            {e}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>


                        {/* BOTÓN EXPORTAR */}
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
