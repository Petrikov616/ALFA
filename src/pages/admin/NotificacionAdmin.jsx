import { useState } from "react";
import "./NotificacionAdmin.css";
import { NavLink } from "react-router-dom";
import { } from "lucide-react";


function NotificacionAdmin() {
    const [notificaciones, setNotificaciones] = useState([]);

    return (
        <div className="notificacion-admin">
            <h1>Notificaciones</h1>
        </div>
    );
}

export default NotificacionAdmin;