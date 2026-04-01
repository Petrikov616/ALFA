import { useState } from "react";
import "./ReportesAdmin.css";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

const ReportesAdmin = () => {

    const [menuOpen, setMenuOpen] = useState(true);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    // --- FORM STATE ---
    const [estudiante, setEstudiante] = useState("");
    const [grupo, setGrupo] = useState("");
    const [servicio, setServicio] = useState("");
    const [alimento, setAlimento] = useState("");
    const [nivel, setNivel] = useState("");
    const [observacion, setObservacion] = useState("");

    // --- LISTA DE REPORTES (mock inicial) ---
    const [reportes, setReportes] = useState([
        { id: 1, estudiante: "Carlos Ramírez", grupo: "7-1", servicio: "Almuerzo", alimento: "Arroz con lentejas", nivel: "Poco", hora: "hace 5 min" },
        { id: 2, estudiante: "Valentina Torres", grupo: "6-2", servicio: "Desayuno", alimento: "Sopa de verduras", nivel: "Mucho", hora: "hace 18 min" },
        { id: 3, estudiante: "Juan Pérez", grupo: "6-1", servicio: "Almuerzo", alimento: "Frijoles", nivel: "Medio", hora: "hace 32 min" },
    ]);

    // --- FILTROS LISTA ---
    const [busqueda, setBusqueda] = useState("");
    const [filtroNivel, setFiltroNivel] = useState("Todos");

    const grupos = ["6-1", "6-2", "7-1", "7-2", "8-1", "8-2", "9-1", "9-2", "10-1", "10-2", "11-1", "11-2"];
    const servicios = ["Desayuno", "Almuerzo"];
    const niveles = ["Poco", "Medio", "Mucho"];

    const handleGuardar = () => {
        if (!estudiante || !grupo || !servicio || !alimento || !nivel) {
            Swal.fire({
                title: "Campos incompletos",
                text: "Por favor completa todos los campos",
                icon: "warning",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#1a7fa8",
            });
            return;
        }

        const nuevo = {//Crea un nuevo objeto (reporte) con los datos del formulario
            id: Date.now(),
            estudiante,
            grupo,
            servicio,
            alimento,
            nivel,
            hora: "ahora",
        };

        setReportes([nuevo, ...reportes]);

        Swal.fire({
            title: "¡Reporte registrado!",
            text: "El reporte se ha registrado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#1a7fa8",
        });

        setEstudiante("");
        setGrupo("");
        setServicio("");
        setAlimento("");
        setNivel("");
        setObservacion("");
    };

    const reportesFiltrados = reportes.filter((r) => {//Recorre todos los reportes y devuelve solo los que cumplen condiciones
        const coincideBusqueda = r.estudiante.toLowerCase().includes(busqueda.toLowerCase()); //Verifica si el nombre coincide con lo que escribiste
        const coincideNivel = filtroNivel === "Todos" || r.nivel === filtroNivel;//Flitra por nivel o todos
        return coincideBusqueda && coincideNivel;//Solo muestra los que cumplen ambas condiciones
    });

    const badgeClass = (n) => {
        if (n === "Poco") return "badge badge-poco";
        if (n === "Medio") return "badge badge-medio";
        if (n === "Mucho") return "badge badge-mucho";
        return "badge";
    };

    const linkClass = ({ isActive }) => isActive ? "menu-link active" : "menu-link";

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

            {/* CONTENIDO */}
            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>

                <h1 className="titulo-p">Gestión de Reportes</h1>
                <p className="text-p">
                    Registra el desperdicio de alimentos dejados por los estudiantes.
                </p>

                {/* CONTENEDOR DE REPORTES */}
                <div className="contenedor-reportes">

                    {/* FORMULARIO */}
                    <div className="reporte-card">
                        <h2 className="card-titulo">Nuevo reporte</h2>

                        <div className="form-group">
                            <label className="form-label">Nombre del estudiante</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Nombre del estudiante"
                                value={estudiante}
                                onChange={(e) => setEstudiante(e.target.value)}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Grupo</label>
                                <select className="form-select" value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                                    <option value="">Seleccionar...</option>
                                    {grupos.map((g) => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Servicio</label>
                                <select className="form-select" value={servicio} onChange={(e) => setServicio(e.target.value)}>
                                    <option value="">Seleccionar...</option>
                                    {servicios.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Alimento sobrante</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Ej: Arroz con pollo"
                                value={alimento}
                                onChange={(e) => setAlimento(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nivel de desperdicio</label>
                            <div className="nivel-row">
                                {niveles.map((n) => (
                                    <button
                                        key={n}
                                        className={`nivel-btn nivel-${n.toLowerCase()} ${nivel === n ? "selected" : ""}`}
                                        onClick={() => setNivel(n)}
                                        type="button"
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Observación (opcional)</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Ej: No le gustó la sopa..."
                                value={observacion}
                                onChange={(e) => setObservacion(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn-guardar"
                            onClick={handleGuardar}
                            disabled={!estudiante || !grupo || !servicio || !alimento || !nivel}
                        >
                            Guardar reporte
                        </button>
                    </div>

                    {/* LISTA */}
                    <div className="reporte-card">
                        <div className="lista-header">
                            <h2 className="card-titulo" style={{ marginBottom: 0 }}>Reportes del día</h2>
                            <div className="lista-filtros">
                                <input
                                    className="form-input busqueda"
                                    type="text"
                                    placeholder="Buscar estudiante..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                                <select
                                    className="form-select filtro-select"
                                    value={filtroNivel}
                                    onChange={(e) => setFiltroNivel(e.target.value)}
                                >
                                    <option value="Todos">Todos</option>
                                    {niveles.map((n) => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="lista-reportes">
                            {reportesFiltrados.length === 0 ? (
                                <div className="lista-vacia">No hay reportes registrados aún.</div>
                            ) : (
                                reportesFiltrados.map((r) => (
                                    <div key={r.id} className="reporte-item">
                                        <div className="reporte-info">
                                            <span className="reporte-nombre">{r.estudiante}</span>
                                            <span className="reporte-meta">
                                                Grupo {r.grupo} · {r.servicio} · {r.alimento} · {r.hora}
                                            </span>
                                        </div>
                                        <span className={badgeClass(r.nivel)}>{r.nivel}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="lista-footer">
                            <span>{reportesFiltrados.length} reporte{reportesFiltrados.length !== 1 ? "s" : ""} hoy</span>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ReportesAdmin;
