import { useState, useEffect } from "react";
import "../css/RegistrarLider.css";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { SignOutButton } from "@clerk/clerk-react";

const RegistrarLider = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [grupos, setGrupos] = useState([]); // lista de grupos que trae el backend
    const [formData, setFormData] = useState({
        lider: "",
        document: "",
        correo: "",
        contraseña: "",
        grupo_ids: [], // ids de los grupos que el líder va a manejar
    });

    // Al montar el componente, traemos los grupos disponibles desde el backend
    useEffect(() => {
        const cargarGrupos = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/grupos");
                const data = await res.json();
                setGrupos(data);
            } catch (error) {
                console.error("Error al cargar grupos:", error);
            }
        };
        cargarGrupos();
    }, []);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const linkClass = ({ isActive }) => isActive ? "menu-link active" : "menu-link";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Marca o desmarca un grupo del array grupo_ids
    const toggleGrupo = (grupoId) => {
        setFormData((prev) => {
            const yaEstaSeleccionado = prev.grupo_ids.includes(grupoId);
            const nuevosGrupos = yaEstaSeleccionado
                ? prev.grupo_ids.filter((id) => id !== grupoId) // lo quitamos si ya estaba
                : [...prev.grupo_ids, grupoId]; // lo agregamos si no estaba
            return { ...prev, grupo_ids: nuevosGrupos };
        });
    };

    const esContraseñaDebil = (password) => {
        if (password.length < 8) return true;

        const tieneMayuscula = /[A-Z]/.test(password);
        const tieneMinuscula = /[a-z]/.test(password);
        const tieneNumero = /[0-9]/.test(password);

        if (!tieneMayuscula || !tieneMinuscula || !tieneNumero) {
            return true;
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita recarga de página

        // 1. Validación de campos obligatorios
        if (!formData.lider || !formData.document || !formData.correo || !formData.contraseña) {
            Swal.fire({
                title: "Campos incompletos",
                text: "Por favor completa todos los campos",
                icon: "warning",
                confirmButtonColor: "#1a7fa8",
            });
            return;
        }

        

        // Validación extra: longitud razonable de una cédula (ej: entre 6 y 10 dígitos)
        if (formData.document.length < 8 || formData.document.length > 10) {
            Swal.fire({
                title: "Documento inválido",
                text: "La cédula debe tener entre 8 y 10 dígitos",
                icon: "warning",
                confirmButtonColor: "#1a7fa8",
            });
            return;
        }

        // 2. Validación de grupos asignados
        if (formData.grupo_ids.length === 0) {
            Swal.fire({
                title: "Selecciona un grupo",
                text: "Debes asignarle al menos un grupo al líder",
                icon: "warning",
                confirmButtonColor: "#1a7fa8",
            });
            return;
        }

        // 3. Validación de longitud de contraseña (Corregido a formData.contraseña)
        if (esContraseñaDebil(formData.contraseña)) {
            Swal.fire({
                title: "Contraseña muy debil",
                html: "Por seguridad, la contraseña debe cumplir con lo siguiente:<br><br>" +
                    "<ul style='text-align: left; margin-left: 20px;'>" +
                    "<li>Tener al menos 8 caracteres</li>" +
                    "<li>Incluir al menos una letra mayúscula</li>" +
                    "<li>Incluir al menos una letra minúscula</li>" +
                    "<li>Incluir al menos un número</li>" +
                    "</ul>",
                    icon: "error",
                    confirmButtonColor: "#1e3a8a",
            });
            return;
        }

        // 4. Si todo está correcto, iniciamos el proceso de registro y mostramos la carga
        Swal.fire({
            title: "Registrando líder...",
            text: "Por favor, espera un momento",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Realizamos la petición real a tu servidor backend
            const response = await fetch("http://localhost:4000/api/lideres", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: formData.lider,             // Mapeado a lo que espera tu backend
                    documento: formData.document,       // Mapeado a lo que espera tu backend
                    correo: formData.correo,
                    password: formData.contraseña,      // Mapeado a lo que espera tu backend
                    grupo_ids: formData.grupo_ids,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || "No se pudo procesar el registro");
            }

            // Si la respuesta fue exitosa, mostramos el modal correspondiente
            Swal.fire({
                title: "¡Registro exitoso!",
                text: "El líder se registró correctamente en Clerk y en la base de datos",
                icon: "success",
                confirmButtonColor: "#1a7fa8",
            });

            // Limpiamos el formulario únicamente tras un éxito real
            setFormData({ lider: "", document: "", correo: "", contraseña: "", grupo_ids: [] });

        } catch (error) {
            console.error("Error en el registro:", error);
            Swal.fire({
                title: "Error al registrar",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <div className="admin-layout">
            {/* SIDEBAR - SIN CAMBIOS */}
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

            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <header className="header-section">
                    <h1 className="titulo-p">Registro de Líderes</h1>
                    <p className="text-p">Gestión del Plan de Alimentación Escolar (PAE)</p>
                </header>

                <section className="container-lider">
                    <div className="card-header">
                        <h2 className="registro">Nuevo Registro</h2>
                    </div>

                    <form className="form-lider" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="lider">Nombre Completo</label>
                            <input type="text" placeholder="Nombre Completo" id="lider"
                                value={formData.lider} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="document">Documento de Identidad</label>
                            <input 
                                type="text" 
                                placeholder="Número de documento" 
                                id="document"
                                value={formData.document} 
                                onChange={(e) => {
                                    const valor = e.target.value;
                                    // Bloqueo en tiempo real: Solo permite actualizar si son números
                                    if (/^[0-9]*$/.test(valor)) {
                                        handleChange(e);
                                    }
                                }} 
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="correo">Correo Electrónico</label>
                            <input type="email" placeholder="correo@ejemplo.com" id="correo"
                                value={formData.correo} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="contraseña">Contraseña</label>
                            <input type="password" placeholder="••••••••" id="contraseña"
                                value={formData.contraseña} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label className="input-label-title">Grupos a cargo</label>
                            <div className="grupos-checklist">
                                {grupos.length === 0 && (
                                    <p className="text-muted">No hay grupos creados todavía.</p>
                                )}
                                {grupos.map((grupo) => (
                                    <label key={grupo.id} className="grupo-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.grupo_ids.includes(grupo.id)}
                                            onChange={() => toggleGrupo(grupo.id)}
                                        />
                                        <span>{grupo.nombre_grupo}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="lider-btn">
                            Registrar Líder
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default RegistrarLider;