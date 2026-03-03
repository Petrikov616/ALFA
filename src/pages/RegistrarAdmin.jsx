import {useState} from "react";
import "./RegistrarAdmin.css";

const RegistrarAdmin = () =>{
    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <h1>Registro Estudiante</h1>

    );
}

export default RegistrarAdmin