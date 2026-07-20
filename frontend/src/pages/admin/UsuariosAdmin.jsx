import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import "../css/UsuariosAdmin.css";
import Swal from "sweetalert2";

export default function UsuariosAdmin() {
    const [lideres, setLideres] = useState([]);
    const [grupos, setGrupos] = useState([]); // Almacena grupos para el select
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eliminandoId, setEliminandoId] = useState(null);
    const [menuOpen, setMenuOpen] = useState(true);

    // Estados para el Modal de Edición
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editNombre, setEditNombre] = useState('');
    const [editContraseña, setEditContraseña] = useState('');
    const [editGrupo, setEditGrupo] = useState('');
    const [guardando, setGuardando] = useState(false);

    // URL de tu API
    const API_URL = "http://localhost:4000/api";

    const obtenerDatos = async () => {
        try {
            setLoading(true);
            // Cargamos en paralelo los líderes y los grupos
            const [resLideres, resGrupos] = await Promise.all([
                fetch(`${API_URL}/lideres`),
                fetch(`${API_URL}/grupos`)
            ]);

            if (!resLideres.ok || !resGrupos.ok) {
                throw new Error("No se pudo obtener la información de los líderes o grupos.");
            }

            const dataLideres = await resLideres.json();
            const dataGrupos = await resGrupos.json();

            setLideres(dataLideres);
            setGrupos(dataGrupos);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Error al cargar los usuarios. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, []);

    // Abre el modal asignando los valores del líder actual
    const handleEditClick = (lider) => {
        setSelectedUser(lider);
        setEditNombre(lider.nombre || "");
        setEditContraseña(""); // Se deja vacía por seguridad
        setEditGrupo(lider.grupos && lider.grupos.length > 0 ? lider.grupos[0].id : "");
        setIsEditModalOpen(true);
    };

    const esContraseñaDebil = (password) => {
        // Si el campo está vacío en la edición, asumimos que no se quiere cambiar la contraseña.
        // Por lo tanto, no es una contraseña "débil" (es válida porque no se actualizará).
        if (!password || password.trim() === "") return false;

        // Si escribió algo, evaluamos los criterios de seguridad:
        if (password.length < 8) return true;

        const tieneMayuscula = /[A-Z]/.test(password);
        const tieneMinuscula = /[a-z]/.test(password);
        const tieneNumero = /[0-9]/.test(password);

        if (!tieneMayuscula || !tieneMinuscula || !tieneNumero) {
            return true;
        }

        return false;
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!editNombre || !selectedUser?.documento || !selectedUser?.correo) {
            Swal.fire({
                title: "Campos incompletos",
                text: "El nombre, documento y correo son obligatorios.",
                icon: "warning",
                confirmButtonColor: "#1a7fa8",
            });
            return;
        }

        if (esContraseñaDebil(editContraseña)) {
            Swal.fire({
                title: "Contraseña muy débil",
                html: "Por seguridad, si vas a cambiar la contraseña debe cumplir con:<br><br>" +
                    "<ul style='text-align: left; margin-left: 20px;'>" +
                    "<li>Tener al menos 8 caracteres</li>" +
                    "<li>Incluir al menos una letra mayúscula</li>" +
                    "<li>Incluir al menos una letra minúscula</li>" +
                    "<li>Incluir al menos un número</li>" +
                    "</ul>",
                icon: "error",
                confirmButtonColor: "#1e3a8a"
            });
            return; // Detiene la ejecución
        }

        const clerkIdSincro = selectedUser.clerkId || selectedUser.clerk_id;

        try {
            setGuardando(true);
            const response = await fetch(`${API_URL}/lideres/${selectedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: editNombre,
                    contraseña: editContraseña ? editContraseña : null,
                    grupoId: editGrupo ? parseInt(editGrupo) : null,
                    clerk_id: clerkIdSincro // Envia cualquiera de los dos que exista
                }),
            });



            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "¡Actualizado!",
                    text: "El líder se ha actualizado correctamente.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsEditModalOpen(false);
                obtenerDatos(); // Recargar datos de la tabla
            } else {
                Swal.fire("Error", result.detalle || "No se pudo actualizar el líder", "error");
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            Swal.fire("Error", "Ocurrió un problema de conexión con el servidor", "error");
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = (id, nombre) => {
        Swal.fire({
            title: `¿Estas seguro de eliminar a ${nombre || 'este lider'}?`,
            text: "No podras revertir esta accion",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setEliminandoId(id);
                    const response = await fetch(`${API_URL}/lideres/${id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error("No se pudo eliminar el lider");
                    }

                    setLideres((prev) => prev.filter((item) => item.id !== id));

                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El lider ha sido eliminado del sistema con exito',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });

                } catch (error) {
                    console.error("Error al eliminar", error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrio un problema al eliminar el lider',
                        icon: 'error',
                    });
                } finally {
                    setEliminandoId(null);
                }
            }
        });
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);
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

            <div className="usuarios-container">
                {/* Encabezado */}
                <div className="usuarios-header">
                    <h2>Gestión de Usuarios</h2>
                    <p>Administra las cuentas de los Líderes, consulta sus grupos o edítalos/elimínalos del sistema.</p>
                </div>

                {/* Alerta de Error */}
                {error && (
                    <div className="error-alert">
                        {error}
                    </div>
                )}

                {/* Contenedor de la Tabla */}
                <div className="tabla-card">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Cargando líderes registrados...</p>
                        </div>
                    ) : lideres.length === 0 ? (
                        <div className="empty-state">
                            <p className="empty-title">No hay líderes registrados</p>
                            <p className="empty-subtitle">Usa el formulario de registro para dar de alta a un nuevo líder.</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="tabla-usuarios">
                                <thead>
                                    <tr>
                                        <th>Líder</th>
                                        <th>Correo Electrónico</th>
                                        <th>Identificación</th>
                                        <th>Grupos a Cargo</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lideres.map((lider) => (
                                        <tr key={lider.id}>
                                            {/* Nombre */}
                                            <td className="user-name-cell">
                                                <div className="avatar-circle">
                                                    {lider.nombre ? lider.nombre.charAt(0).toUpperCase() : "?"}
                                                </div>
                                                <span className="font-semibold">{lider.nombre}</span>
                                            </td>

                                            {/* Correo */}
                                            <td className="user-email">{lider.correo}</td>

                                            {/* Documento */}
                                            <td>
                                                {lider.documento ? (
                                                    <span className="badge-documento">{lider.documento}</span>
                                                ) : (
                                                    <span className="no-data">No registrado</span>
                                                )}
                                            </td>

                                            {/* Grupos */}
                                            <td>
                                                <div className="grupos-badges">
                                                    {lider.grupos && lider.grupos.length > 0 ? (
                                                        lider.grupos.map((grp) => (
                                                            <span key={grp.id} className="badge-grupo">
                                                                {grp.nombre_grupo}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="badge-sin-grupo">Sin grupos</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Acciones */}
                                            <td className="text-center">
                                                <div className="acciones-container">
                                                    <button
                                                        onClick={() => handleEditClick(lider)}
                                                        className="btn-edit"
                                                        title="Editar Líder"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(lider.id, lider.nombre)}
                                                        disabled={eliminandoId === lider.id}
                                                        className="btn-delete"
                                                        title="Eliminar Líder"
                                                    >
                                                        {eliminandoId === lider.id ? "..." : "Eliminar"}
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
            </div>

            {/* MODAL DE EDICIÓN FLOTANTE */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Editar Líder</h3>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="modal-close-btn"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="modal-form">
                            {/* Input Nombre */}
                            <div className="modal-form-group">
                                <label className="modal-label">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={editNombre}
                                    onChange={(e) => setEditNombre(e.target.value)}
                                    className="modal-input"
                                    required
                                />
                            </div>

                            {/* Input Contraseña */}
                            <div className="modal-form-group">
                                <label className="modal-label">
                                    Nueva Contraseña <span className="modal-input-optional">(Opcional)</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Dejar en blanco para no cambiar"
                                    value={editContraseña}
                                    onChange={(e) => setEditContraseña(e.target.value)}
                                    className="modal-input"
                                    minLength={6}
                                />
                            </div>

                            {/* Selector de Grupo */}
                            <div className="modal-form-group">
                                <label className="modal-label">Grupo Asignado</label>
                                <select
                                    value={editGrupo}
                                    onChange={(e) => setEditGrupo(e.target.value)}
                                    className="modal-select"
                                >
                                    <option value="">Sin grupo / Ninguno</option>
                                    {grupos.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.nombre_grupo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botones del Modal */}
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="btn-modal-cancel"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className="btn-modal-save"
                                >
                                    {guardando ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}