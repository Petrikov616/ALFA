import { useState } from "react";
import "./ListadoAdmin.css";
import { NavLink } from "react-router-dom";
import { Pencil, Trash2, Check, X } from "lucide-react";

const ListadoAdmin = () => {

    const [menuOpen, setMenuOpen] = useState(true);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    // -------------------------
    // FILTROS
    // -------------------------
    const [busqueda, setBusqueda] = useState("");
    const [grupo, setGrupo] = useState("Todos");
    const [mes, setMes] = useState("Enero");

    const grupos = ["Todos", "6-1", "6-2", "7-1", "7-2", "8-1", "8-2", "9-1", "9-2", "10-1", "10-2", "11-1", "11-2"];

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // -------------------------
    // DATOS MOCK
    // -------------------------
    const [estudiantes, setEstudiantes] = useState([
        { id: 1, estudiante: "Simon Tobon Correa", grupo: "6-1" },
        { id: 2, estudiante: "Samuel Zuleta Hincapie", grupo: "11-2" },
        { id: 3, estudiante: "Victor Manuel Perez", grupo: "8-2" },
        { id: 4, estudiante: "Salo NO SE XD", grupo: "11-1" },
    ]);

    // -------------------------
    // FUNCIÓN DÍAS DEL MES
    // -------------------------
    const obtenerDiasDelMes = (mes) => {
        const mesesIndex = {
            Enero: 0, Febrero: 1, Marzo: 2, Abril: 3,
            Mayo: 4, Junio: 5, Julio: 6, Agosto: 7,
            Septiembre: 8, Octubre: 9, Noviembre: 10, Diciembre: 11,
        };

        const year = new Date().getFullYear();
        const mesIndex = mesesIndex[mes];
        const diasEnMes = new Date(year, mesIndex + 1, 0).getDate();
        const dias = [];

        for (let i = 1; i <= diasEnMes; i++) {
            const fecha = new Date(year, mesIndex, i);
            const nombreDia = fecha.toLocaleDateString("es-ES", { weekday: "short" });

            dias.push({
                numero: i,
                nombre: nombreDia
            });
        }
        return dias;
    };

    const dias = obtenerDiasDelMes(mes);

    // -------------------------
    // FILTRO
    // -------------------------
    const estudiantesFiltrados = estudiantes.filter((e) => {
        const coincideNombre = e.estudiante.toLowerCase().includes(busqueda.toLowerCase());
        const coincideGrupo = grupo === "Todos" || e.grupo === grupo;
        return coincideNombre && coincideGrupo;
    });

    // -------------------------
    // ACCIONES
    // -------------------------
    const eliminarEstudiante = (id) => {
        setEstudiantes(estudiantes.filter(e => e.id !== id));
    };

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

                <h1 className="titulo-p">Bienvenido, Administrador</h1>

                {/* FILTROS */}
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Buscar estudiante..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                        {grupos.map(g => <option key={g}>{g}</option>)}
                    </select>
                    <select value={mes} onChange={(e) => setMes(e.target.value)}>
                        {meses.map(m => <option key={m}>{m}</option>)}
                    </select>
                </div>

                {/* TABLA */}
                <div className="tabla">

                    {/* HEADER */}
                    <div className="tabla-header">
                        <span className="col-estudiante">Estudiante</span>
                        <span className="col-grupo">Grupo</span>

                        {dias.map((d, i) => (
                            <span key={i}>
                                {String(d.numero).padStart(2, "0")} {d.nombre}
                            </span>
                        ))}

                        <span style={{ width: '80px', textAlign: 'center' }}>Editar</span>
                        <span style={{ width: '80px', textAlign: 'center' }}>Eliminar</span>
                    </div>

                    {/* FILAS */}
                    {estudiantesFiltrados.map((est) => (
                        <div key={est.id} className="fila">

                            {/* NOMBRE (FIJO) */}
                            <span className="col-estudiante">{est.estudiante}</span>

                            {/* GRUPO (FIJO) */}
                            <span className="col-grupo">{est.grupo}</span>

                            {/* DÍAS (SCROLLABLE) */}
                            {dias.map((_, i) => (
                                <span key={i}>
                                    {Math.random() > 0.5
                                        ? <span><Check size={20} color="green" /></span>
                                        : <span><X size={20} color="red" /></span>}
                                </span>
                            ))}

                            {/* ACCIONES */}
                            <div style={{ display: 'flex', width: '160px', flexShrink: 0 }}>
                                <span className="col-acciones">

                                    <button className="btn-icon"><Pencil size={16} /></button>

                                </span>
                                <span className="col-acciones">

                                    <button className="btn-icon" onClick={() => eliminarEstudiante(est.id)}><Trash2 size={16} /></button>

                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ListadoAdmin;    