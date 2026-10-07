import { useState, useMemo, useEffect } from "react";
import "../css/AsistenciaAdmin.css";
import { NavLink } from "react-router-dom";
import { Check, Minus, X } from "lucide-react";
import { SignOutButton } from "@clerk/clerk-react";

const GRUPOS = ["Todos", "6-1", "6-2", "7-1", "7-2", "8-1", "8-2", "9-1", "9-2", "10-1", "10-2", "11-1", "11-2"];
const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const MESES_MAP = {
    Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
    Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12
};

// Helpers fuera del componente para evitar recreaciones en cada render
const HORA_FIN_MINUTOS = 10 * 60; // 10:00 AM = 600 minutos

function horaActualMinutos() {
    const ahora = new Date();
    return ahora.getHours() * 60 + ahora.getMinutes();
}

function evaluarAsistencia(asistio, diaNumero, mesNombre) {
    if (asistio) return "ASISTIO";

    const hoy = new Date();
    const diaHoy = hoy.getDate();
    const mesHoy = hoy.getMonth() + 1;
    const mesSeleccionado = MESES_MAP[mesNombre];

    // Meses anteriores -> inasistencia
    if (mesSeleccionado < mesHoy) return "NO_ASISTIO";

    // Mismo mes, días anteriores -> inasistencia
    if (mesSeleccionado === mesHoy && diaNumero < diaHoy) return "NO_ASISTIO";

    // Mismo mes y mismo día -> validar la hora fin de jornada
    if (mesSeleccionado === mesHoy && diaNumero === diaHoy) {
        if (horaActualMinutos() > HORA_FIN_MINUTOS) {
            return "NO_ASISTIO";
        }
    }

    // Días futuros o día en curso antes de la hora límite
    return "PENDIENTE";
}

const ListadoAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [grupo, setGrupo] = useState("Todos");
    const [mes, setMes] = useState("Enero");
    const [estudiantes, setEstudiantes] = useState([]);

    useEffect(() => {
        obtenerMatrizAsistencia();
    }, [mes]);

    const obtenerMatrizAsistencia = async () => {
        try {
            const numeroMes = MESES_MAP[mes];
            const anioActual = new Date().getFullYear();

            const res = await fetch(`http://localhost:4000/api/asistencia/matriz?mes=${numeroMes}&anio=${anioActual}`);
            const data = await res.json();

            if (res.ok) {
                setEstudiantes(data.estudiantes);
            }
        } catch (error) {
            console.error("Error al cargar la matriz de asistencias:", error);
        }
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const diasDelMes = useMemo(() => {
        const year = new Date().getFullYear();
        const mesIndex = MESES_MAP[mes] - 1;
        const diasEnMes = new Date(year, mesIndex + 1, 0).getDate();

        return Array.from({ length: diasEnMes }, (_, i) => {
            const fecha = new Date(year, mesIndex, i + 1);
            return {
                numero: i + 1,
                nombre: fecha.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "")
            };
        });
    }, [mes]);

    const estudiantesFiltrados = useMemo(() => {
        return estudiantes.filter((e) => {
            const nombre = e.estudiante || "";
            const coincideNombre = nombre.toLowerCase().includes(busqueda.toLowerCase());
            const coincideGrupo = grupo === "Todos" || e.grupo === grupo;
            return coincideNombre && coincideGrupo;
        });
    }, [busqueda, grupo, estudiantes]);

    const linkClass = ({ isActive }) => (isActive ? "menu-link active" : "menu-link");

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className={`sidebar ${menuOpen ? "open" : "closed"}`}>
                <div className="sidebar-content">
                    <div onClick={toggleMenu} className="logo" style={{ cursor: "pointer" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" />
                        </svg>
                        <span>AgilCheck</span>
                    </div>

                    <nav className="menu">
                        <NavLink to="/lider/asistencia" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 2v2" /><path d="M17.915 22a6 6 0 0 0-12 0" /><path d="M8 2v2" /><circle cx="12" cy="12" r="4" /><rect x="3" y="4" width="18" height="18" rx="2" />
                            </svg>
                            <span className="menu-label">Asistencia</span>
                        </NavLink>

                        <NavLink to="/lider/leerqr" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" />
                            </svg>
                            <span className="menu-label">Leer QR</span>
                        </NavLink>

                        <NavLink to="/lider/permisos" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M12 17h.01" /><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
                            </svg>
                            <span className="menu-label">Reportes</span>
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

            {/* CONTENIDO PRINCIPAL */}
            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <header className="main-header">
                    <h1 className="titulo-p">Bienvenido, Administrador</h1>
                </header>

                <section className="filters-container">
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Buscar estudiante..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="input-search"
                        />
                        <select value={grupo} onChange={(e) => setGrupo(e.target.value)} className="select-filter">
                            {GRUPOS.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                        <select value={mes} onChange={(e) => setMes(e.target.value)} className="select-filter">
                            {MESES.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* TABLA DE ASISTENCIA */}
                <section className="asistencia-card">
                    <div className="asistencia-table-wrapper">
                        <div className="asistencia-row header-row">
                            <div className="col-estudiante font-bold">Estudiante</div>
                            <div className="col-grupo font-bold">Grupo</div>
                            <div className="col-dias-container">
                                {diasDelMes.map((d) => (
                                    <div key={d.numero} className="col-dia font-bold">
                                        <span>{d.nombre}</span>
                                        <span>{d.numero}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {estudiantesFiltrados.length > 0 ? (
                            estudiantesFiltrados.map((est) => (
                                <div key={est.id} className="asistencia-row body-row">
                                    <div className="col-estudiante">{est.estudiante}</div>
                                    <div className="col-grupo">{est.grupo}</div>
                                    <div className="col-dias-container">
                                        {diasDelMes.map((d) => {
                                            const asistio = est.diasAsistidos?.includes(d.numero) || false;
                                            const estado = evaluarAsistencia(asistio, d.numero, mes);

                                            return (
                                                <div key={d.numero} className="col-dia">
                                                    {estado === "ASISTIO" && (
                                                        <Check size={16} style={{ color: "#16a34a" }} />
                                                    )}
                                                    {estado === "NO_ASISTIO" && (
                                                        <X size={16} style={{ color: "#ef4444" }} />
                                                    )}
                                                    {estado === "PENDIENTE" && (
                                                        <Minus size={16} style={{ color: "#94a3b8" }} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data">
                                No se encontraron estudiantes.
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ListadoAdmin;