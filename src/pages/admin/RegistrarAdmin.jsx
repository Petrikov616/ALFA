import { useState } from "react";
import "./RegistrarAdmin.css";
import { Link } from "react-router-dom";

const RegistrarAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="admin-layout">
            {/* Mantenemos tu Sidebar original */}
            <aside className={`sidebar ${menuOpen ? "open" : "closed"}`}>
                <div className="sidebar-content">
                    <h2 onClick={toggleMenu} className="logo">
                        ☰ <span>AgilCheck</span>
                    </h2>
                    <nav className="menu">
                        <button><span>Registrar Estudiante</span></button>
                        <button><span>Leer QR</span></button>
                        <button><span>Listado de Estudiantes</span></button>
                        <button><span>Gestión de permisos</span></button>
                    </nav>
                    <div className="logout">
                        <button><span>Cerrar Sesión</span></button>
                    </div>
                </div>
            </aside>

            {/* Ajustamos el contenido principal para que coincida con la imagen */}
            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <div className="header-text">
                    <h1>Registro de Estudiantes</h1>
                    <p>Registro de cada estudiante, y generar un código QR respectivo a su TI o CC.</p>
                </div>

                <div className="content-box-RA">
                    <div className="form-side">
                        <input type="text" placeholder="Nombre Usuario" className="input-field" />
                        
                        <select className="input-field select-field">
                            <option value="" disabled selected>Servicio</option>
                            <option value="refrigerio">Refrigerio</option>
                            <option value="almuerzo">Almuerzo</option>
                            <option value="ambos">Ambos</option>
                        </select>

                        <select className="input-field select-field">
                            <option value="" disabled selected>Grupo</option>
                            <option value="1">Grupo 01</option>
                            <option value="2">Grupo 02</option>

                        </select>

                        <input type="text" placeholder="Documento" className="input-field" />

                        <button className="btn-generate">GENERAR QR</button>
                    </div>

                    <div className="qr-side">
                        <img 
                            src="https://www.pngall.com/wp-content/uploads/5/QR-Code-PNG-High-Quality-Image.png" 
                            alt="Código QR" 
                            className="qr-image" 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default RegistrarAdmin;