import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; 
import "../css/EstudiantesAdmin.css";
import { SignOutButton } from "@clerk/clerk-react";
import ModalEditarEstudiante from "../../components/ModalEditarEstudiante";

const EstudiantesAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [estudiantes, setEstudiantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    // ESTADO CLAVE: Almacena el objeto del estudiante que se está editando. Si es null, el modal se cierra.
    const [estudianteEditando, setEstudianteEditando] = useState(null);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const linkClass = ({ isActive }) => isActive ? "menu-link active" : "menu-link";

    // Obtener los estudiantes del Backend al montar el componente
    useEffect(() => {
        const obtenerEstudiantes = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/estudiantes");
                if (res.ok) {
                    const data = await res.json();
                    setEstudiantes(data);
                }
            } catch (error) {
                console.error("Error al traer estudiantes:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerEstudiantes();
    }, []);

    // 2. Manejador para abrir el Modal pasando el objeto completo del estudiante
    const handleEdit = (estudiante) => {
        setEstudianteEditando(estudiante);
    };

    // 3. Manejador para procesar la actualización asíncrona (Formulario del Modal)
    const handleSaveEdit = async (id, datosActualizados) => {
        try {
            const res = await fetch(`http://localhost:4000/api/estudiantes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosActualizados),
            });

            if (res.ok) {
                // Actualización optimista: mapeamos el estado actual para reflejar los cambios en tiempo real
                setEstudiantes((prevEstudiantes) =>
                    prevEstudiantes.map((e) => (e.id === id ? { ...e, ...datosActualizados } : e))
                );
                setEstudianteEditando(null); // Cerramos el modal
                alert("Estudiante actualizado correctamente.");
            } else {
                alert("No se pudieron guardar los cambios. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al actualizar estudiante:", error);
            alert("Ocurrió un error en el servidor al intentar guardar los cambios.");
        }
    };

    // 4. Manejador para la Eliminación Asíncrona
    const handleDelete = async (id, nombre) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar al estudiante ${nombre}?`);
        if (!confirmar) return;

        try {
            const res = await fetch(`http://localhost:4000/api/estudiantes/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setEstudiantes((prevEstudiantes) =>
                    prevEstudiantes.filter((estudiante) => estudiante.id !== id)
                );
                alert("Estudiante eliminado correctamente.");
            } else {
                alert("No se pudo eliminar al estudiante. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al eliminar estudiante:", error);
            alert("Ocurrió un error en el servidor al intentar eliminar.");
        }
    };

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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" />
                                <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                            </svg>
                            <span className="menu-label">Estudiantes</span>
                        </NavLink>

                        <NavLink to="/admin/registrar" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" />
                                <path d="M12 8v8" />
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.305 19.53.923-.382" /><path d="m15.228 16.852-.923-.383" />
                                <path d="m16.852 15.228-.383-.923" /><path d="m16.852 20.772-.383.924" /><path d="m19.148 15.228.383-.923" /><path d="m19.53 21.696-.382-.924" /><path d="M2 21a8 8 0 0 1 10.434-7.62" /><path d="m20.772 16.852.924-.383" /><path d="m20.772 19.148.924.383" /><circle cx="10" cy="8" r="5" /><circle cx="18" cy="18" r="3" />
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
            <main className="main-content">
                <div className="contenedor-estudiantes">
                    <div className="header-seccion">
                        <h2>Listado de Estudiantes</h2>
                        <p>Gestión y visualización de alumnos registrados en el PAE.</p>
                    </div>

                    {cargando ? (
                        <p className="loading-text">Cargando estudiantes...</p>
                    ) : estudiantes.length === 0 ? (
                        <p className="no-data">No hay estudiantes registrados todavía.</p>
                    ) : (
                        <div className="tabla-responsive">
                            <table className="tabla-estudiantes">
                                <thead>
                                    <tr>
                                        <th>Nombre Completo</th>
                                        <th>Documento</th>
                                        <th>Servicio</th>
                                        <th>Grupo</th>
                                        <th style={{ textAlign: "center" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estudiantes.map((e) => (
                                        <tr key={e.id}>
                                            <td><strong>{e.nombre}</strong></td>
                                            <td>{e.documento}</td>
                                            <td><span className="tag-servicio">{e.servicio}</span></td>
                                            <td>{e.grupo}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <div className="acciones-celda">
                                                    {/* Pasamos 'e' (el objeto completo) para rellenar los campos del Modal */}
                                                    <button onClick={() => handleEdit(e)} className="btn-accion btn-editar">
                                                        Editar
                                                    </button>
                                                    <button onClick={() => handleDelete(e.id, e.nombre)} className="btn-accion btn-eliminar">
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* 5. Renderizado Condicional del Modal de Edición */}
            {estudianteEditando && (
                <ModalEditarEstudiante
                    estudiante={estudianteEditando}
                    onClose={() => setEstudianteEditando(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default EstudiantesAdmin;