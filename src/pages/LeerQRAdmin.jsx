import { useState } from "react";
import "./LeerQRAdmin.css";

const LeerQRAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="admin-layout">

            <aside className={`sidebar ${menuOpen ? "open" : "closed"}`}>
                <div className="sidebar-content">

                    <h2 onClick={toggleMenu} className="logo">
                        ☰ <span>AgilCheck</span>
                    </h2>

                    <nav className="menu">
                        <button><span>Listado de Estudiantes</span></button>
                        <button><span>Registrar Estudiante</span></button>
                        <button><span>Leer QR</span></button>
                        <button><span>Gestión de permisos</span></button>
                        <button><span>Registrar líder</span></button>
                    </nav>

                    <div className="logout">
                        <button><span>Cerrar Sesión</span></button>
                    </div>

                </div>
            </aside>

            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <h1>Registrar Asistencia</h1>

                <p className="subtitle">
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