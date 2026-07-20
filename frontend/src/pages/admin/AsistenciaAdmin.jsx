import { useState, useMemo } from "react";
import "../css/AsistenciaAdmin.css";
import { NavLink } from "react-router-dom";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { SignOutButton } from "@clerk/clerk-react";
// Constantes estáticas fuera para no sobrecargar el render
const GRUPOS = ["Todos", "6-1", "6-2", "7-1", "7-2", "8-1", "8-2", "9-1", "9-2", "10-1", "10-2", "11-1", "11-2"];
const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const ListadoAdmin = () => {
    // ESTADOS
    const [menuOpen, setMenuOpen] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [grupo, setGrupo] = useState("Todos");
    const [mes, setMes] = useState("Enero");
    const [estudiantes, setEstudiantes] = useState([
        { id: 1, estudiante: "Simon Tobon Correa", grupo: "6-1" },
        { id: 2, estudiante: "Samuel Zuleta Hincapie", grupo: "11-2" },
        { id: 3, estudiante: "Victor Manuel Perez", grupo: "8-2" },
        { id: 4, estudiante: "Salo NO SE XD", grupo: "11-1" },
    ]);

    // LÓGICA DE NEGOCIO (Memorizada)
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const diasDelMes = useMemo(() => {
        const mesesIndex = { 
            Enero: 0, Febrero: 1, Marzo: 2, Abril: 3, Mayo: 4, Junio: 5, 
            Julio: 6, Agosto: 7, Septiembre: 8, Octubre: 9, Noviembre: 10, Diciembre: 11 
        };
        const year = new Date().getFullYear();
        const mesIndex = mesesIndex[mes];
        const diasEnMes = new Date(year, mesIndex + 1, 0).getDate();
        
        return Array.from({ length: diasEnMes }, (_, i) => {
            const fecha = new Date(year, mesIndex, i + 1);
            return {
                numero: i + 1,
                nombre: fecha.toLocaleDateString("es-ES", { weekday: "short" })
            };
        });
    }, [mes]);

    const estudiantesFiltrados = useMemo(() => {
        return estudiantes.filter((e) => {
            const coincideNombre = e.estudiante.toLowerCase().includes(busqueda.toLowerCase());
            const coincideGrupo = grupo === "Todos" || e.grupo === grupo;
            return coincideNombre && coincideGrupo;
        });
    }, [busqueda, grupo, estudiantes]);

    const eliminarEstudiante = (id) => {
        if(window.confirm("¿Deseas eliminar este estudiante?")) {
            setEstudiantes(estudiantes.filter(e => e.id !== id));
        }
    };

    const linkClass = ({ isActive }) => isActive ? "menu-link active" : "menu-link";

    return (
        <div className="admin-layout">

            {/* SIDEBAR REINTEGRADO */}
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round-icon lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/>
                                            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>
                                        </svg>
                                        <span className="menu-label">Estudiantes</span>
                                    </NavLink>
            
                                    <NavLink to="/admin/registrar" className={linkClass}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus-icon lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>
                                            <path d="M12 8v8"/>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-cog-icon lucide-user-round-cog"><path d="m14.305 19.53.923-.382"/><path d="m15.228 16.852-.923-.383"/>
                                        <path d="m16.852 15.228-.383-.923"/><path d="m16.852 20.772-.383.924"/><path d="m19.148 15.228.383-.923"/><path d="m19.53 21.696-.382-.924"/><path d="M2 21a8 8 0 0 1 10.434-7.62"/><path d="m20.772 16.852.924-.383"/><path d="m20.772 19.148.924.383"/><circle cx="10" cy="8" r="5"/><circle cx="18" cy="18" r="3"/>
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

            {/* CONTENIDO PRINCIPAL */}
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
                        {GRUPOS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select value={mes} onChange={(e) => setMes(e.target.value)}>
                        {MESES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* TABLA */}
                <div className="tabla-container" style={{ overflowX: 'auto' }}>
                    <div className="tabla">
                        {/* HEADER */}
                        <div className="tabla-header">
                            <span className="col-estudiante">Estudiante</span>
                            <span className="col-grupo">Grupo</span>

                            {diasDelMes.map((d) => (
                                <span key={d.numero} style={{ minWidth: '60px', textAlign: 'center' }}>
                                    {String(d.numero).padStart(2, "0")} <br/> 
                                    <small style={{ fontSize: '0.7em', textTransform: 'uppercase' }}>{d.nombre}</small>
                                </span>
                            ))}
                        </div>

                        {/* FILAS */}
                        {estudiantesFiltrados.map((est) => (
                            <div key={est.id} className="fila">
                                <span className="col-estudiante">{est.estudiante}</span>
                                <span className="col-grupo">{est.grupo}</span>

                                {diasDelMes.map((d) => (
                                    <span key={d.numero} style={{ minWidth: '60px', textAlign: 'center' }}>
                                        {/* Aquí pondrás la lógica real de asistencia luego */}
                                        <Check size={20} color="#10b981" /> 
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ListadoAdmin;