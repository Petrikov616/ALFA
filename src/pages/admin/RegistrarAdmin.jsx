import { useState } from "react";
import "./RegistrarAdmin.css";
import { NavLink } from "react-router-dom";
import { 
    LayoutDashboard, 
    Users, 
    UserPlus, 
    QrCode, 
    ShieldCheck, 
    UserRoundPlus, 
    BellRing, 
    LogOut,
    ChevronDown,
    Fingerprint
} from "lucide-react";

const RegistrarAdmin = () => {

    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // --- ESTADOS DEL FORMULARIO ---
    const [nombre, setNombre] = useState("");
    const [documento, setDocumento] = useState("");
    
    // dropdown servicio
    const [openServicio, setOpenServicio] = useState(false);
    const [servicio, setServicio] = useState("Servicio");
    const servicios = ["Servicio", "Refrigerio", "Almuerzo", "Ambos"];

    // dropdown grupo
    const [openGrupo, setOpenGrupo] = useState(false);
    const [grupo, setGrupo] = useState("Grupo");
    const grupos = ["Grupo", "Grupo 01", "Grupo 02"];

    // Estado para la huella dactilar
    const [huellaRegistrada, setHuellaRegistrada] = useState(false);

    // --- LÓGICA DE VALIDACIÓN ---
    const isFormValid = 
        nombre.trim() !== "" && 
        documento.trim() !== "" && 
        servicio !== "Servicio" && 
        grupo !== "Grupo" && 
        huellaRegistrada === true;

    const linkClass = ({ isActive }) => isActive ? "menu-link active" : "menu-link";

    const handleGuardar = () => {
        if (isFormValid) {
            alert(`Registro guardado exitosamente para: ${nombre}`);
        }
    };

    return (
        <div className="admin-layout">

            {/* SIDEBAR */}
            <aside className={`sidebar ${menuOpen ? "open" : "closed"}`}>
                <div className="sidebar-content">
                    <div onClick={toggleMenu} className="logo">
                        <LayoutDashboard size={30} color="white" />
                        <span>AgilCheck</span>
                    </div>

                    <nav className="menu">
                        <NavLink to="/admin/listado" className={linkClass}>
                            <Users size={20} />
                            <span className="menu-label">Listado de Estudiantes</span>
                        </NavLink>
                        <NavLink to="/admin/registrar" className={linkClass}>
                            <UserPlus size={20} />
                            <span className="menu-label">Registrar Estudiante</span>
                        </NavLink>
                        <NavLink to="/admin/leerqr" className={linkClass}>
                            <QrCode size={20} />
                            <span className="menu-label">Leer QR</span>
                        </NavLink>
                        <NavLink to="/admin/permisos" className={linkClass}>
                            <ShieldCheck size={20} />
                            <span className="menu-label">Gestión de permisos</span>
                        </NavLink>
                        <NavLink to="/admin/lider" className={linkClass}>
                            <UserRoundPlus size={20} />
                            <span className="menu-label">Registrar líder</span>
                        </NavLink>

                        <NavLink to="/admin/notificaciones" className={linkClass}>
                            <BellRing size={20} />
                            <span className="menu-label">Notificaciones</span>
                        </NavLink>
                    </nav>

                    <div className="logout">
                        <NavLink to="/login" className={linkClass}>
                            <LogOut size={20} />
                            <span className="menu-label">Cerrar sesión</span>
                        </NavLink>
                    </div>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                
                <div className="header-section">
                    <h1 className="titulo-p">Registro de Estudiantes</h1>
                    <p className="text-p">Complete los datos y registre la huella dactilar para finalizar.</p>
                </div>

                {/* CONTENEDOR AZUL PRINCIPAL */}
                <div className="main-blue-container">
                    
                    {/* TARJETA BLANCA 2: REGISTRO DATOS */}
                    <div className="white-card">
                        <h2 className="card-title-b">Datos del Estudiante</h2>
                        <p className="card-desc-b">Ingrese los datos del estudiante para completar el registro.</p>
                        
                        {/* CAJA AZUL INTERNA PARA EL FORMULARIO */}
                        <div className="inner-dark-box">
                            <p className="form-label">Datos de registro</p>
                            
                            <input 
                                type="text" 
                                placeholder="Nombre Usuario" 
                                className="input-white" 
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />

                            <div className="dropdown">
                                <button type="button" className="select-btn input-white" onClick={() => setOpenServicio(!openServicio)}>
                                    {servicio} <ChevronDown size={18} className="arrow-down" />
                                </button>
                                {openServicio && (
                                    <div className="dropdown-menu white-menu">
                                        {servicios.map((s, index) => (
                                            <div key={index} className="dropdown-item-w" onClick={() => { setServicio(s); setOpenServicio(false); }}>{s}</div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="dropdown">
                                <button type="button" className="select-btn input-white" onClick={() => setOpenGrupo(!openGrupo)}>
                                    {grupo} <ChevronDown size={18} className="arrow-down" />
                                </button>
                                {openGrupo && (
                                    <div className="dropdown-menu white-menu">
                                        {grupos.map((g, index) => (
                                            <div key={index} className="dropdown-item-w" onClick={() => { setGrupo(g); setOpenGrupo(false); }}>{g}</div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <input 
                                type="text" 
                                placeholder="Documento" 
                                className="input-white" 
                                value={documento}
                                onChange={(e) => setDocumento(e.target.value)}
                            />

                            <button 
                                className={`btn-confirmar ${!isFormValid ? 'disabled' : ''}`} 
                                disabled={!isFormValid}
                                onClick={handleGuardar}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>

                    {/* TARJETA BLANCA 2: ESCANEAR HUELLA */}
                    <div className="white-card">
                        <h2 className="card-title-b">Escanear Huella</h2>
                        <p className="card-desc-b">Coloca la huella del estudiante dentro del escaner indicado</p>
                        
                        <div className="fingerprint-wrapper">
                            <div className={`fingerprint-box ${huellaRegistrada ? 'registered' : ''}`}>
                                <Fingerprint size={80} color={huellaRegistrada ? "#4CAF50" : "#ccc"} />
                            </div>
                            
                            <button 
                                className={`btn-register-finger ${huellaRegistrada ? 'success' : ''}`}
                                onClick={() => setHuellaRegistrada(!huellaRegistrada)}
                            >
                                {huellaRegistrada ? "Huella Registrada ✓" : "Registrar Huella"}
                            </button>
                        </div>
                    </div>

                    
                    
                </div>
            </main>
        </div>
    );
};

export default RegistrarAdmin;