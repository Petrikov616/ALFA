import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/EstudiantesAdmin.css";
import { SignOutButton } from "@clerk/clerk-react";
import ModalEditarEstudiante from "../../components/ModalEditarEstudiante";
import Swal from "sweetalert2";

const EstudiantesAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [estudiantes, setEstudiantes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [grupoSeleccionado, setGrupoSeleccionado] = useState('Todos');
    const [cargando, setCargando] = useState(true);
    const [estudianteEditando, setEstudianteEditando] = useState(null);

    const gruposDisponibles = ['Todos', ...new Set(estudiantes.map(e => e.grupo).filter(Boolean))];

    // Filtrar la lista en tiempo real por nombre, documento o grupo
    const estudiantesFiltrados = estudiantes.filter(estudiante => {
        const coincideNombre = (estudiante.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
            (estudiante.documento || "").toString().includes(busqueda);
        const coincideGrupo = grupoSeleccionado === 'Todos' || estudiante.grupo === grupoSeleccionado;

        return coincideNombre && coincideGrupo;
    });

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const linkClass = ({ isActive }) => isActive ? "menu-link active" : "menu-link";

    // Consultar estudiantes desde la API
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

    useEffect(() => {
        obtenerEstudiantes();
    }, []);

    // Abrir Modal de Edición
    const handleEdit = (estudiante) => {
        setEstudianteEditando(estudiante);
    };

    // Guardar cambios
    const handleSaveEdit = async (id, datosActualizados) => {
        const swalOptions = {
            willOpen: () => {
                const container = document.querySelector('.swal2-container');
                if (container) container.style.zIndex = '99999';
            }
        };

        const regexCedula = /^\d{8,10}$/;
        if (!regexCedula.test(datosActualizados.documento)) {
            Swal.fire({
                ...swalOptions,
                icon: 'error',
                title: 'Documento inválido',
                text: 'La cédula debe tener entre 8 y 10 dígitos.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        if (
            !datosActualizados.nombre ||
            !datosActualizados.servicio ||
            datosActualizados.servicio.trim() === "" ||
            datosActualizados.servicio === "Ninguno" ||
            !datosActualizados.grupo ||
            datosActualizados.grupo.trim() === "" ||
            datosActualizados.grupo === "Seleccione un grupo"
        ) {
            Swal.fire({
                ...swalOptions,
                icon: 'error',
                title: 'Campos obligatorios',
                text: 'Debe ingresar un nombre, seleccionar un servicio válido y asignar un grupo.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/estudiantes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: datosActualizados.nombre,
                    documento: datosActualizados.documento,
                    servicio: datosActualizados.servicio,
                    grupo: datosActualizados.grupo
                }),
            });

            if (res.ok) {
                setEstudianteEditando(null);
                await obtenerEstudiantes();

                Swal.fire({
                    ...swalOptions,
                    icon: 'success',
                    title: '¡Guardado!',
                    text: 'Los cambios se han guardado correctamente en la base de datos.',
                    confirmButtonColor: '#3085d6'
                });
            } else {
                const errorData = await res.json().catch(() => ({}));
                Swal.fire({
                    ...swalOptions,
                    icon: 'error',
                    title: 'Error al guardar',
                    text: errorData.error || errorData.mensaje || 'No se pudo actualizar la información en la base de datos.',
                    confirmButtonColor: '#3085d6'
                });
            }
        } catch (error) {
            console.error("Error al actualizar estudiante:", error);
            Swal.fire({
                ...swalOptions,
                icon: 'error',
                title: 'Error de conexión',
                text: 'Ocurrió un error al conectar con el servidor.',
                confirmButtonColor: '#d33'
            });
        }
    };

    // Eliminar estudiante
    const handleDelete = async (id, nombre) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar a ${nombre || 'este estudiante'}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:4000/api/estudiantes/${id}`, {
                        method: "DELETE",
                    });

                    if (res.ok) {
                        setEstudiantes((prevEstudiantes) =>
                            prevEstudiantes.filter((estudiante) => estudiante.id !== id)
                        );

                        Swal.fire(
                            '¡Eliminado!',
                            'El estudiante ha sido eliminado correctamente.',
                            'success'
                        );
                    } else {
                        Swal.fire(
                            'Error',
                            'No se pudo eliminar al estudiante. Inténtalo de nuevo.',
                            'error'
                        );
                    }
                } catch (error) {
                    console.error("Error al eliminar estudiante:", error);
                    Swal.fire(
                        'Error del servidor',
                        'Ocurrió un error en el servidor al intentar eliminar.',
                        'error'
                    );
                }
            }
        });
    };

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

                    {/* BARRA DE FILTROS */}
                    <div className="filtros-contenedor">
                        <input
                            type="text"
                            className="input-busqueda"
                            placeholder="Buscar por nombre o documento..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />

                        <select
                            className="select-grupo"
                            value={grupoSeleccionado}
                            onChange={(e) => setGrupoSeleccionado(e.target.value)}
                        >
                            {gruposDisponibles.map((grupo, index) => (
                                <option key={index} value={grupo}>
                                    {grupo === 'Todos' ? 'Todos los grupos' : grupo}
                                </option>
                            ))}
                        </select>
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
                                        <th>NOMBRE COMPLETO</th>
                                        <th>DOCUMENTO</th>
                                        <th>SERVICIO</th>
                                        <th>GRUPO</th>
                                        <th className="columna-acciones">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estudiantesFiltrados.length > 0 ? (
                                        estudiantesFiltrados.map((e) => (
                                            <tr key={e.id}>
                                                <td>{e.nombre}</td>
                                                <td>{e.documento}</td>
                                                <td>
                                                    <span className={`badge ${e.servicio ? e.servicio.toLowerCase() : ''}`}>
                                                        {e.servicio || 'Ninguno'}
                                                    </span>
                                                </td>
                                                <td>{e.grupo || 'Sin asignar'}</td>
                                                <td className="celda-acciones">
                                                    <button className="btn-editar" onClick={() => handleEdit(e)}>Editar</button>
                                                    <button className="btn-eliminar" onClick={() => handleDelete(e.id, e.nombre)}>Eliminar</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="sin-resultados">
                                                No se encontraron estudiantes con esos criterios.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal de Edición */}
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