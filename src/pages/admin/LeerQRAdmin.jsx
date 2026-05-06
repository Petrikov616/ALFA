import { useState } from "react";
import "./LeerQRAdmin.css";
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
    Fingerprint,
    Search
} from "lucide-react";

const LeerQRAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [documentoManual, setDocumentoManual] = useState("");
    const [escaneando, setEscaneando] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleConfirmarManual = () => {
        alert(`Buscando asistencia para documento: ${documentoManual}`);
    };

    const linkClass = ({ isActive }) => isActive ? "menu-link active" : "menu-link";

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

            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <h1 className="titulo-p">Registrar Asistencia</h1>
                <p className="text-p">
                    Escanee la huella o ingrese el documento para validar la entrada al servicio.
                </p>

                <div className="main-blue-container">
                    
                    {/* TARJETA 1: ESCANEO */}
                    <div className="white-card">
                        <h2 className="card-title-b">Escanear Huella</h2>
                        <p className="card-desc-b">Coloque la huella del estudiante en el lector para registrar asistencia.</p>
                        
                        <div className="fingerprint-wrapper">
                            <div 
                                className={`fingerprint-box ${escaneando ? 'scanning' : ''}`}
                                onClick={() => setEscaneando(!escaneando)}
                            >
                                <Fingerprint size={80} color={escaneando ? "#5dade2" : "#ccc"} />
                                {escaneando && <div className="scan-line"></div>}
                            </div>
                            <p className="status-text">{escaneando ? "Escaneando..." : "Esperando huella"}</p>
                        </div>
                    </div>

                    {/* TARJETA 2: REGISTRO MANUAL */}
                    <div className="white-card">
                        <h2 className="card-title-b">Registro Manual</h2>
                        <p className="card-desc-b">Use esta opción si el lector de huellas presenta inconvenientes.</p>
                        
                        <div className="inner-dark-box">
                            <p className="form-label">Identificación</p>
                            <div className="manual-input-wrapper">
                                <Search size={20} className="input-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Número de documento" 
                                    className="input-white" 
                                    value={documentoManual}
                                    onChange={(e) => setDocumentoManual(e.target.value)}
                                />
                            </div>

                            <button 
                                className={`btn-confirmar ${!documentoManual ? 'disabled' : ''}`}
                                disabled={!documentoManual}
                                onClick={handleConfirmarManual}
                            >
                                Confirmar Asistencia
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>


    )
}
export default LeerQRAdmin