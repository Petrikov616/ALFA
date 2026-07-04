import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

function Redirect() {
    const { isLoaded, user } = useUser();

    if (!isLoaded) return null;

    const role = user?.publicMetadata?.role || "lider";
    return <Navigate to={role === "admin" ? "/admin/listado" : "/lider/listado"} />;
}

export default Redirect;