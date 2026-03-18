import { useState } from "react";
import "./LeerQRAdmin.css";
import { NavLink } from "react-router-dom";

const LeerQRAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const linkClass = ({ isActive }) => isActive ? "menu-link active" : "menu-link";

    return (
        <div className="admin-layout">

            <aside className={`sidebar ${menuOpen ? "open" : "closed"}`}>
                <div className="sidebar-content">

                    <div onClick={toggleMenu} className="logo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" />
                        </svg>
                        <span>AgilCheck</span>
                    </div>

                    <nav className="menu">

                        <NavLink to="/admin/listado" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 2v2" /><path d="M17.915 22a6 6 0 0 0-12 0" /><path d="M8 2v2" /><circle cx="12" cy="12" r="4" /><rect x="3" y="4" width="18" height="18" rx="2" />
                            </svg>
                            <span className="menu-label">Listado de Estudiantes</span>
                        </NavLink>

                        <NavLink to="/admin/registrar" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 12v4a1 1 0 0 1-1 1h-4" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M17 8V7" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M7 17h.01" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><rect x="7" y="7" width="5" height="5" rx="1" />
                            </svg>
                            <span className="menu-label">Registrar Estudiante</span>
                        </NavLink>

                        <NavLink to="/admin/leerqr" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" />
                            </svg>
                            <span className="menu-label">Leer QR</span>
                        </NavLink>

                        <NavLink to="/admin/permisos" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M12 17h.01" /><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
                            </svg>
                            <span className="menu-label">Gestión de permisos</span>
                        </NavLink>

                        <NavLink to="/admin/lider" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 21a8 8 0 0 1 13.292-6" /><circle cx="10" cy="8" r="5" /><path d="M19 16v6" /><path d="M22 19h-6" />
                            </svg>
                            <span className="menu-label">Registrar líder</span>
                        </NavLink>

                    </nav>

                    <div className="logout">
                        <NavLink to="/login" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            </svg>
                            <span className="menu-label">Cerrar sesión</span>
                        </NavLink>
                    </div>

                </div>
            </aside>

            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <h1 className="titulo-p">Registrar Asistencia</h1>
                <p className="text-p">
                    Genera el código QR para cada estudiante mediante el documento de identidad
                </p>

                <div className="qr-container">

                    {/*BLOQUE 1*/}
                    <div className="qr-card">
                        <h2>
                            Escanear QR
                        </h2>
                        <p>
                            Coloca el código QR del estudiante dentro del recuadro
                        </p>
                    </div>

                    {/*BLOQUE 2*/}

                    <div className="qr-card">
                        <h2>
                            Registro Manual
                        </h2>
                        <p>
                            Si el QR del estudiante no funciona o no lo tiene, ingrese manualmente el documento
                        </p>
                        <div className="manual-box">
                            <label>Codigo del estudiante</label>
                            <div className="input-group">
                                <input type="text" />

                                <button>Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>


    )
}
export default LeerQRAdmin