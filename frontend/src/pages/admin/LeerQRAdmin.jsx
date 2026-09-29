import React, { useState } from "react";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import "../css/AsistenciaAdmin.css"; // Asegúrate de ajustar la ruta del CSS si difiere

const LeerQRAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [cedula, setCedula] = useState("");

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const linkClass = ({ isActive }) => (isActive ? "menu-link active" : "menu-link");

    const registrarAsistencia = async (e) => {
        if (e) e.preventDefault();

        if (!cedula.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Campo requerido",
                text: "Por favor ingresa un número de cédula válido.",
                confirmButtonColor: "#0284c7",
            });
            return;
        }

        try {
            const res = await fetch("http://localhost:4000/api/asistencia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cedula: cedula.trim() }),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "¡Asistencia Registrada!",
                    text: `Estudiante: ${data.estudiante || "Registrado"} | Servicio: ${data.servicio || "Asignado"}`,
                    confirmButtonColor: "#16a34a",
                    timer: 2500,
                    timerProgressBar: true,
                });
                setCedula(""); // Limpiar la casilla después del registro exitoso
            } else {
                // Muestra el mensaje detallado enviado desde el backend (por ejemplo: duplicados o estudiante no encontrado)
                Swal.fire({
                    icon: "warning",
                    title: "Atención",
                    text: data.error || "No se pudo completar el registro de asistencia.",
                    confirmButtonColor: "#0284c7",
                });
            }
        } catch (error) {
            console.error("Error al conectar con la API de asistencia:", error);
            Swal.fire({
                icon: "error",
                title: "Error de servidor",
                text: "No se pudo establecer conexión con el servidor backend.",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    return (
        <div className="admin-layout">
            {/* SIDEBAR DE NAVEGACIÓN */}
            <aside className={`sidebar ${menuOpen ? "open" : "closed"}`}>
                <div className="sidebar-content">
                    <div onClick={toggleMenu} className="logo" style={{ cursor: "pointer" }}>
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></svg>
                            <span className="menu-label">Estudiantes</span>
                        </NavLink>

                        <NavLink to="/admin/registrar" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                            <span className="menu-label">Registrar Estudiante</span>
                        </NavLink>

                        <NavLink to="/admin/leerqr" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" />
                            </svg>
                            <span className="menu-label">Leer QR</span>
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

            {/* CONTENIDO DE REGISTRO / ESCÁNER */}
            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <header className="main-header">
                    <h1 className="titulo-p">Registrar Asistencia</h1>
                    <p className="subtitulo-p">Ingrese el documento de identidad para registrar la entrada.</p>
                </header>

                <div className="qr-container" style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
                    <form onSubmit={registrarAsistencia} style={{ background: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "450px" }}>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label htmlFor="cedula-input" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#334155" }}>
                                Cédula de Identidad
                            </label>
                            <input
                                id="cedula-input"
                                type="text"
                                placeholder="Ej: 112314224"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1rem" }}
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            style={{ width: "100%", padding: "0.75rem", background: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}
                        >
                            Registrar Asistencia
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default LeerQRAdmin;