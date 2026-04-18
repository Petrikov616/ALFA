import { useState } from "react";
import "./NotificacionAdmin.css";
import { NavLink } from "react-router-dom";

function NotificacionAdmin() {

    const [menuOpen, setMenuOpen] = useState(true);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const [filtro, setFiltro] = useState("todos");

    const [notificaciones, setNotificaciones] = useState([
        {id: 1, estudiante: "Juan Pérez", tipo: "Eliminacion", motivos: "Renuncio al PAE", grupo: "7-1", fecha: "2024-06-01"},
        {id: 2, motivo: "Sin servicio", tipo: "Dia sin servicio", fecha: "2024-06-01"},
        {id: 3, estudiante: "Simon Tobon Correa", tipo: "Editacion", motivos: "Cambios en la cedula", grupo: "11-1", fecha: "2024-06-01"},
        {id: 4, estudiante: "Samuel Zuleta Hincapie", tipo: "Eliminacion", motivos: "Renuncio al PAE", grupo: "6-1", fecha: "2024-06-01"},
    ]);

    const filtros = ["Dia sin servicio", "Eliminacion", "Editacion"];

    // ✅ CORRECCIÓN: filtrado aplicado correctamente sobre el array
    const notificacionesFiltradas = notificaciones.filter(
        (r) => filtro === "todos" || r.tipo === filtro
    );

    const linkClass = ({ isActive }) =>
        isActive ? "menu-link active" : "menu-link";

    return (
        <div className="admin-layout">

            {/* SIDEBAR */}
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
                            <span className="menu-label">Reportes</span>
                        </NavLink>

                        <NavLink to="/admin/lider" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 21a8 8 0 0 1 13.292-6" /><circle cx="10" cy="8" r="5" /><path d="M19 16v6" /><path d="M22 19h-6" />
                            </svg>
                            <span className="menu-label">Registrar líder</span>
                        </NavLink>

                        <NavLink to="/admin/notificaciones" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M22 8c0-2.3-.8-4.3-2-6" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /><path d="M4 2C2.8 3.7 2 5.7 2 8" />
                            </svg>
                            <span className="menu-label">Notificaciones</span>
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

            {/* CONTENIDO PRINCIPAL */}
            <main className="main-content">

                <h1 className="titulo-p">Gestión de notificaciones</h1>
                <p className="text-p">
                    Se muestran notificaciones sobre estudiantes (como ausencias, eliminación o edición), con opción de filtrarlas por grupo y tipo.
                </p>

                <div className="noti-card">
                    <div className="lista-header">
                        <h2 className="card-titulo" style={{ marginBottom: 0 }}>Notificaciones</h2>
                        <div className="filtros">
                            <select
                                className="form-noti filtro-grupo"
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}>
                                <option value="todos">Todos</option>
                                {filtros.map((n) => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="lista-noti">
                        {notificacionesFiltradas.length === 0 ? (
                            <p className="text-p">No hay notificaciones para mostrar.</p>
                        ) : (
                            notificacionesFiltradas.map((r) => (
                                <div key={r.id} className="noti-item">
                                    <div className="noti-info">
                                        <span className="noti-nombre">{r.estudiante} {r.motivo}</span>
                                        <span className="noti-meta">
                                            {r.tipo} · {r.motivos} · {r.fecha} · {r.grupo}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="lista-footer">
                    {/* ✅ CORRECCIÓN: texto del contador corregido */}
                    <span>{notificacionesFiltradas.length} notificación{notificacionesFiltradas.length === 1 ? "" : "es"} hoy</span>
                </div>

            </main>
        </div>
    );
}

export default NotificacionAdmin;