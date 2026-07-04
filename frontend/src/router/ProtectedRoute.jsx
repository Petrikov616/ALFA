import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRole }) => {
    const { isLoaded, isSignedIn, user } = useUser();
    const role = user?.publicMetadata?.role || "lider";

    if (!isLoaded) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#070a0f",
                gap: "16px"
            }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid rgba(255,255,255,0.1)",
                    borderTop: "3px solid #6366f1",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }} />
                <p style={{
                    color: "#ffffff",
                    fontFamily: "sans-serif",
                    fontSize: "16px",
                    letterSpacing: "0.5px",
                    margin: 0,
                    opacity: 0.8
                }}>
                    Cargando...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" />;
    }

    //si el rol no coincide, redirige a su área correcta
    if (allowedRole && role !== allowedRole) {
        return <Navigate to={role === "admin" ? "/admin/listado" : "/lider/inicio"} />;
    }

    return children;
};