import { useState, useEffect } from "react";
// Cambiamos "ModalEditarEstudiante.css" por el nombre real del archivo creado
// Subir a src/, entrar a pages y luego a css
import "../pages/css/ModalEditar.css";

const ModalEditarEstudiante = ({ estudiante, onClose, onSave }) => {
    // Estado local para controlar los inputs del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        documento: "",
        servicio: "",
        grupo: ""
    });

    // Sincroniza los datos del estudiante seleccionado cuando se abre el modal
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviamos los datos editados al componente padre (EstudiantesAdmin)
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

                    <div className="form-group">
                        <label>GRUPO ASIGNADO</label>
                        <input
                            type="text"
                            name="grupo"
                            value={formData.grupo}
                            onChange={handleChange}
                            required
                        />
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