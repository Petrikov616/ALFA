import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import "../css/ReportesAdmin.css";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { SignOutButton, useUser } from "@clerk/clerk-react";

const ReportesAdmin = () => {
    const { user } = useUser();

    // ESTADO DE LA API
    const [reportes, setReportes] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(true);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    // --- FORM STATE ---
    const [estudiante, setEstudiante] = useState("");
    const [grupo, setGrupo] = useState("");
    const [servicio, setServicio] = useState("");
    const [alimento, setAlimento] = useState("");
    const [nivel, setNivel] = useState("");
    const [observacion, setObservacion] = useState("");

    // --- FILTROS LISTA ---
    const [busqueda, setBusqueda] = useState("");
    const [filtroNivel, setFiltroNivel] = useState("Todos");

    // Listas estáticas
    const servicios = ["Refrigerio", "Almuerzo"];
    const niveles = ["Poco", "Medio", "Mucho"];

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            setLoading(true);
            await Promise.all([obtenerReportes(), obtenerEstudiantes(), obtenerGrupos()]);
            setLoading(false);
        };
        cargarDatosIniciales();
    }, []);

    const obtenerReportes = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/reportes");
            if (!res.ok) {
                console.error("El servidor devolvió un error:", res.status);
                setReportes([]);
                return;
            }
            const data = await res.json();
            setReportes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al obtener reportes:", error);
            setReportes([]);
        }
    };

    const obtenerGrupos = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/grupos");
            if (!res.ok) return setGrupos([]);
            const data = await res.json();
            setGrupos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al obtener grupos:", error);
            setGrupos([]);
        }
    };

    const obtenerEstudiantes = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/estudiantes");
            if (!res.ok) return setEstudiantes([]);
            const data = await res.json();
            const listaEstudiantes = Array.isArray(data) ? data : (data.estudiantes || []);
            setEstudiantes(listaEstudiantes);
        } catch (error) {
            console.error("Error al obtener estudiantes:", error);
            setEstudiantes([]);
        }
    };

    const formatearNombre = (est) => {
        if (!est) return "";
        if (typeof est === "string") return est.trim();
        if (typeof est === "object") {
            if (est.nombre1 || est.apellido1) {
                return [est.nombre1, est.nombre2, est.apellido1, est.apellido2]
                    .filter(Boolean)
                    .map((s) => String(s).trim())
                    .join(" ")
                    .trim();
            }
            if (est.nombres && est.apellidos) {
                return `${String(est.nombres).trim()} ${String(est.apellidos).trim()}`;
            }
            const nombreBase = est.nombre || est.nombres || est.nombre_completo || "";
            return String(nombreBase).trim();
        }
        return String(est).trim();
    };

    // Función auxiliar para resolver el nombre de un reporte de forma segura
    const obtenerNombreEstudianteDeReporte = (r) => {
        if (!r) return "Estudiante sin nombre";
        
        // 1. Intentar por objeto estudiante anidado
        if (r.estudiante) {
            const nombreFormateado = formatearNombre(r.estudiante);
            if (nombreFormateado) return nombreFormateado;
        }

        // 2. Intentar buscar en lista de estudiantes por ID
        const idABuscar = r.estudiante_id || r.id_estudiante || r.estudianteId;
        if (idABuscar) {
            const estudianteEncontrado = estudiantes.find(
                (e) => String(e.id) === String(idABuscar)
            );
            if (estudianteEncontrado) return formatearNombre(estudianteEncontrado);
        }

        // 3. Otros fallbacks
        if (typeof r.estudiante === 'string' && r.estudiante.trim() !== '') return r.estudiante;
        
        return r.nombre_estudiante || r.estudiante_nombre || "Estudiante sin nombre";
    };

    const handleGuardar = async (e) => {
        if (e) e.preventDefault();

        if (!estudiante || !grupo || !servicio || !alimento || !nivel) {
            Swal.fire({
                title: "Campos incompletos",
                text: "Por favor completa todos los campos",
                icon: "warning",
                confirmButtonColor: "#1a7fa8",
            });
            return;
        }

        const estudianteEncontrado = estudiantes.find((est) => {
            const nombreCompleto = formatearNombre(est).toLowerCase();
            const nombreInput = estudiante.trim().toLowerCase();
            return nombreCompleto.localeCompare(nombreInput, undefined, { sensitivity: 'base' }) === 0;
        });

        if (!estudianteEncontrado) {
            Swal.fire({
                title: "Estudiante no encontrado",
                text: "El nombre escrito no coincide con ningún estudiante registrado.",
                icon: "error",
                confirmButtonColor: "#1a7fa8",
            });
            return;
        }

        const grupoRealEstudiante = estudianteEncontrado.grupo || estudianteEncontrado.nombre_grupo;

        if(grupoRealEstudiante && grupoRealEstudiante.trim().toLowerCase() !== grupo.trim().toLocaleLowerCase()) {
            Swal.fire({
                title: "Grupo incorrecto",
                text: "El estudiante escrito no pertenece al grupo seleccionado.",
                icon: "warning",
                confirmButtonColor: "#1a7fa8",
            })
            return;
        }

        const servicioRealEstudiante = estudianteEncontrado.servicio;

        if(servicioRealEstudiante) {
            const servReal = servicioRealEstudiante.trim().toLowerCase();
            const servSeleccionado = servicio.trim().toLowerCase();

            if(servReal !== "ambos" && servReal !== servSeleccionado) {
                Swal.fire({
                    title: "Servicio no autorizado",
                    text: `El estudiante solo cuenta con el servicio de: ${servicioRealEstudiante}. No se puede registrar un reporte con este servicio.`,
                    icon: "warning",
                    confirmButtonColor: "#1a7fa8",
                });
                return;
            }
        }


        const nuevoReporte = {
            estudiante_id: parseInt(estudianteEncontrado.id),
            grupo: grupo,
            servicio: servicio,
            alimento: alimento,
            nivel: nivel,
            observacion: observacion || "Sin observaciones",
            registrado_por: 1
        };

        try {
            const res = await fetch("http://localhost:4000/api/reportes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoReporte)
            });

            if (res.ok) {
                const reporteCreado = await res.json();

                Swal.fire({
                    title: "¡Reporte registrado!",
                    text: "El reporte se ha guardado en la base de datos",
                    icon: "success",
                    confirmButtonColor: "#1a7fa8",
                });

                // Inyectamos el objeto estudiante para evitar fallos visuales inmediatos antes del re-fetch
                const reporteConEstudiante = {
                    ...reporteCreado,
                    estudiante: estudianteEncontrado
                };

                setReportes((reportesPrevios) => [reporteConEstudiante, ...reportesPrevios]);

                // Limpiar formulario
                setEstudiante("");
                setGrupo("");
                setServicio("");
                setAlimento("");
                setNivel("");
                setObservacion("");
            } else {
                const errorData = await res.json();
                console.error("Error detallado del backend:", errorData);
                throw new Error("Error en el servidor");
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo guardar el reporte",
                icon: "error"
            });
        }
    };

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:4000/api/reportes/${id}`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    Swal.fire("Eliminado", "El reporte ha sido borrado.", "success");
                    setReportes((prev) => prev.filter((r) => r.id !== id));
                } else {
                    throw new Error("No se pudo eliminar en el servidor");
                }
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "No se pudo eliminar el reporte", "error");
            }
        }
    };

    const reportesFiltrados = reportes.filter((r) => {
        if (!r) return false;
        
        // Usamos la misma función ultra-segura para filtrar por búsqueda sin que rompa
        const nombreEstudiante = obtenerNombreEstudianteDeReporte(r).toLowerCase();
        const coincideBusqueda = nombreEstudiante.includes(busqueda.toLowerCase());
        const coincideNivel = filtroNivel === "Todos" || r.nivel === filtroNivel;
        
        return coincideBusqueda && coincideNivel;
    });

    const linkClass = ({ isActive }) => isActive ? "menu-link active" : "menu-link";

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Cargando datos del sistema...</p>
            </div>
        );
    }

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
                        <NavLink to="/admin/asistencia" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 2v2" /><path d="M17.915 22a6 6 0 0 0-12 0" /><path d="M8 2v2" /><circle cx="12" cy="12" r="4" /><rect x="3" y="4" width="18" height="18" rx="2" />
                            </svg>
                            <span className="menu-label">Asistencia</span>
                        </NavLink>

                        <NavLink to="/admin/estudiantes" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" />
                                <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                            </svg>
                            <span className="menu-label">Estudiantes</span>
                        </NavLink>

                        <NavLink to="/admin/registrar" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
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

                        <NavLink to="/admin/usuarios" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m14.305 19.53.923-.382" /><path d="m15.228 16.852-.923-.383" /><path d="m16.852 15.228-.383-.923" /><path d="m16.852 20.772-.383.924" /><path d="m19.148 15.228.383-.923" /><path d="m19.53 21.696-.382-.924" /><path d="M2 21a8 8 0 0 1 10.434-7.62" /><path d="m20.772 16.852.924-.383" /><path d="m20.772 19.148.924.383" /><circle cx="10" cy="8" r="5" /><circle cx="18" cy="18" r="3" />
                            </svg>
                            <span className="menu-label">Usuarios</span>
                        </NavLink>
                    </nav>

                    <div className="logout">
                        <NavLink to="/login" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            </svg>
                            <SignOutButton redirectUrl="/login">
                                <span className="menu-label">Cerrar sesión</span>
                            </SignOutButton>
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

                <div className="contenedor-reportes">
                    {/* FORMULARIO */}
                    <div className="reporte-card">
                        <h2 className="card-titulo">Nuevo reporte</h2>

                        <div className="form-group">
                            <label className="form-label">Nombre del estudiante</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Escribe el nombre completo..."
                                value={estudiante}
                                onChange={(e) => setEstudiante(e.target.value)}
                                list="estudiantes-list"
                                autoComplete="off"
                            />
                            <datalist id="estudiantes-list">
                                {estudiantes.slice(0, 10).map((est) => (
                                    <option key={est.id} value={formatearNombre(est)} />
                                ))}
                            </datalist>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Grupo</label>
                            <select className="form-select" value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                                <option value="">Seleccionar grupo...</option>
                                {grupos.map((g) => (
                                    <option key={g.id} value={g.nombre_grupo}>
                                        {g.nombre_grupo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Servicio</label>
                            <select className="form-select" value={servicio} onChange={(e) => setServicio(e.target.value)}>
                                <option value="">Seleccionar servicio...</option>
                                {servicios.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Alimento sobrante</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Ej: Arroz, Sopa, Carne..."
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setNivel(n);
                                        }}
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

                    {/* LISTA DE REPORTES */}
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
                                reportesFiltrados.map((r) => {
                                    const nombreFinal = obtenerNombreEstudianteDeReporte(r);

                                    return (
                                        <div className="reporte-item" key={r.id}>
                                            <div className="reporte-info">
                                                <span className="reporte-nombre">{nombreFinal}</span>
                                                <span className="reporte-meta">{r.grupo ? (r.grupo.toLowerCase().startsWith("grupo") ? r.grupo : `Grupo ${r.grupo}`) : "Sin grupo"} • {r.servicio} • {r.hora || "Reciente"}</span>
                                            </div>

                                            <div className="reporte-acciones">
                                                <span className={`badge badge-${r.nivel ? r.nivel.toLowerCase() : "default"}`}>{r.nivel}</span>
                                                <button
                                                    className="btn-eliminar"
                                                    onClick={() => handleEliminar(r.id)}
                                                    title="Eliminar reporte"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
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