import { useState, useEffect } from "react";
import "../css/RegistrarAdmin.css";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { SignOutButton } from "@clerk/clerk-react";
import { ChevronDown } from "lucide-react";

const RegistrarAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // --- ESTADOS DEL FORMULARIO ---
    const [nombre, setNombre] = useState("");
    const [documento, setDocumento] = useState("");

    // Dropdown servicio
    const [openServicio, setOpenServicio] = useState(false);
    const [servicio, setServicio] = useState("Seleccione un servicio");
    const servicios = ["refrigerio", "almuerzo", "ambos"];

    // Dropdown grupo
    const [openGrupo, setOpenGrupo] = useState(false);
    const [listaGrupos, setListaGrupos] = useState([]);
    const [grupo, setGrupo] = useState("Seleccione un grupo");

    // Petición para traer los grupos reales de la base de datos
    useEffect(() => {
        const cargarGrupos = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/grupos");
                if (res.ok) {
                    const data = await res.json();
                    setListaGrupos(data);
                } else {
                    console.error("Error al traer los grupos");
                }
            } catch (error) {
                console.error("Error de red al cargar grupos:", error);
            }
        };

        cargarGrupos();
    }, []);

    // --- BLOQUEO DE LETRAS EN EL DOCUMENTO ---
    const handleDocumentoChange = (e) => {
        const valor = e.target.value;
        // Solo permite actualizar el estado si son dígitos numéricos
        if (/^\d*$/.test(valor)) {
            setDocumento(valor);
        }
    };

    // --- LÓGICA DE VALIDACIÓN ---
    const isFormValid =
        nombre.trim() !== "" &&
        documento.trim() !== "" &&
        servicio !== "Seleccione un servicio" &&
        grupo !== "Seleccione un grupo";

    const linkClass = ({ isActive }) => isActive ? "menu-link active" : "menu-link";

    const handleGuardar = async () => {
        if (!isFormValid) return;

        const largoDocumento = documento.trim().length;
        if (largoDocumento !== 8 && largoDocumento !== 10) {
            Swal.fire({
                title: "Documento inválido",
                text: "La cédula debe tener exactamente 8 o 10 dígitos.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "Corregir"
            });
            return;
        }

        const grupoSeleccionado = listaGrupos.find(g => g.nombre_grupo === grupo);
        const id_grupo = grupoSeleccionado ? grupoSeleccionado.id : null;
        const servicioFormateado = servicio.toLowerCase();

        const payload = {
            documento: documento.trim(),
            nombreCompleto: nombre.trim(),
            id_grupo: id_grupo,
            servicio: servicioFormateado
        };

        try {
            const response = await fetch("http://localhost:4000/api/estudiantes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "!Rgistro Exitoso!",
                    text: "El estudiante ha sido registrado con exito",
                    icon: "success",
                    confirmButtonColor: "#1a7fa8",
                    confirmButtonText: "Aceptar",
                });




                setNombre("");
                setDocumento("");
                setServicio("Seleccione un servicio");
                setGrupo("Seleccione un grupo");
            } else {
                Swal.fire({
                    title: "Error en el registro",
                    text: data.error || "No se pudo registrar al estudiante.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                    confirmButtonText: "Cerrar"
                });
            }
        } catch (error) {
            console.error("Error al registrar estudiante:", error);

            Swal.fire({
                title: "Error de conexión",
                text: "Hubo un problema al conectar con el servidor. Verifica tu conexión de red.",
                icon: "warning",
                confirmButtonColor: "#f8bb86",
                confirmButtonText: "Reintentar"
            });
        }
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round-icon lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" />
                                <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                            </svg>
                            <span className="menu-label">Estudiantes</span>
                        </NavLink>

                        <NavLink to="/admin/registrar" className={linkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus-icon lucide-circle-plus"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" />
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-cog-icon lucide-user-round-cog"><path d="m14.305 19.53.923-.382" /><path d="m15.228 16.852-.923-.383" />
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
            <main className={`main-content ${menuOpen ? "expanded" : "collapsed"}`}>
                <div className="header-section">
                    <h1 className="titulo-p">Registro de Estudiantes</h1>
                    <p className="text-p">Gestión del Plan de Alimentación Escolar (PAE)</p>
                </div>

                <div className="leader-card-container">
                    <div className="leader-style-card">
                        <div className="card-header-blue">
                            Nuevo Registro
                        </div>

                        <div className="card-body-form">
                            <div className="form-group">
                                <label className="titulo-label">Nombre Completo</label>
                                <input
                                    type="text"
                                    placeholder="Nombre Completo"
                                    className="input-leader"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="titulo-label">Documento de Identidad</label>
                                <input
                                    type="text"
                                    placeholder="Número de documento"
                                    className="input-leader"
                                    value={documento}
                                    onChange={handleDocumentoChange}
                                />
                            </div>

                            {/* DROPDOWN DE SERVICIO */}
                            <div className="form-group">
                                <label className="field-label">Servicio asignado</label>
                                <div className="dropdown">
                                    <button
                                        type="button"
                                        className="select-btn input-leader"
                                        onClick={() => { setOpenServicio(!openServicio); setOpenGrupo(false); }}
                                    >
                                        <span className={servicio.includes("Seleccione") ? "placeholder-text" : ""}>{servicio}</span>
                                        <ChevronDown size={18} className="arrow-down" />
                                    </button>
                                    {openServicio && (
                                        <div className="dropdown-menu leader-menu">
                                            {servicios.map((s, index) => (
                                                <div
                                                    key={index}
                                                    className="dropdown-item-l"
                                                    onClick={() => { setServicio(s); setOpenServicio(false); }}
                                                >
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DROPDOWN DE GRUPOS */}
                            <div className="form-group">
                                <label className="field-label">Grupo</label>
                                <div className="dropdown">
                                    <button
                                        type="button"
                                        className="select-btn input-leader"
                                        onClick={() => { setOpenGrupo(!openGrupo); setOpenServicio(false); }}
                                    >
                                        <span className={grupo?.includes("Seleccione") ? "placeholder-text" : ""}>{grupo}</span>
                                        <ChevronDown size={18} className="arrow-down" />
                                    </button>
                                    {openGrupo && (
                                        <div className="dropdown-menu leader-menu">
                                            {listaGrupos.map((g, index) => {
                                                const nombreSeguro = g.nombre_grupo || "Sin nombre";
                                                return (
                                                    <div
                                                        key={index}
                                                        className="dropdown-item-l"
                                                        onClick={() => { setGrupo(nombreSeguro); setOpenGrupo(false); }}
                                                    >
                                                        {nombreSeguro}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                className={`btn-registrar-leader ${!isFormValid ? 'disabled' : ''}`}
                                disabled={!isFormValid}
                                onClick={handleGuardar}
                            >
                                Registrar Estudiante
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegistrarAdmin;