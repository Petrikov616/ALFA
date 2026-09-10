import { useState, useEffect } from "react";
import "../pages/css/ModalEditar.css";

const ModalEditarEstudiante = ({ estudiante, onClose, onSave }) => {
    // Estado local para los campos del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        documento: "",
        servicio: "",
        grupo: ""
    });

    // Estados para almacenar los grupos cargados de la base de datos
    const [gruposBD, setGruposBD] = useState([]);
    const [cargandoGrupos, setCargandoGrupos] = useState(true);

    // 1. Sincroniza los datos del estudiante seleccionado
    useEffect(() => {
        if (estudiante) {
            setFormData({
                nombre: estudiante.nombre || "",
                documento: estudiante.documento || "",
                servicio: estudiante.servicio || "",
                grupo: estudiante.grupo || ""
            });
        }
    }, [estudiante]);

    // 2. Consulta la API para obtener los grupos de la BD
    useEffect(() => {
        const obtenerGrupos = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/grupos");
                if (res.ok) {
                    const data = await res.json();
                    setGruposBD(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Error al cargar grupos:", error);
            } finally {
                setCargandoGrupos(false);
            }
        };

        obtenerGrupos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(estudiante.id, formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3>Editar Estudiante</h3>
                    <button onClick={onClose} className="btn-close-x" title="Cerrar">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>NOMBRE COMPLETO</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>DOCUMENTO</label>
                        <input
                            type="text"
                            name="documento"
                            value={formData.documento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>SERVICIO</label>
                        <select
                            name="servicio"
                            value={formData.servicio}
                            onChange={handleChange}
                            required
                        >
                            <option value="Ninguno">Ninguno</option>
                            <option value="Refrigerio">Refrigerio</option>
                            <option value="Almuerzo">Almuerzo</option>
                            <option value="Ambos">Ambos</option>
                        </select>
                    </div>

                    {/* SELECT CORREGIDO PARA EXTRAER EL TEXTO DEL OBJETO */}
                    <div className="form-group">
                        <label>GRUPO ASIGNADO</label>
                        <select
                            name="grupo"
                            value={formData.grupo}
                            onChange={handleChange}
                            required
                            disabled={cargandoGrupos}
                        >
                            <option value="">
                                {cargandoGrupos ? "Cargando grupos..." : "Seleccione un grupo"}
                            </option>
                            {gruposBD.map((grupo, index) => {
                                // Extrae el nombre según la propiedad que tenga el objeto
                                const nombreVisible = typeof grupo === "object" 
                                    ? (grupo.nombre_grupo || grupo.nombre || "") 
                                    : grupo;
                                const valorId = typeof grupo === "object" 
                                    ? (grupo.id || index) 
                                    : index;

                                return (
                                    <option key={valorId} value={nombreVisible}>
                                        {nombreVisible}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-cancelar">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-guardar">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEditarEstudiante;