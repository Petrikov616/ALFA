import { SignIn, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const clerkAppearance = {
    layout: {
        logoPlacement: "inside",
        socialButtonsPlacement: "top",
    },
    variables: {
        colorBackground: "#bbcfd3",
        colorInputBackground: "rgba(255,255,255,0.05)",
        colorInputText: "rgba(0, 0, 0, 0.9)",
        colorText: "rgba(0, 0, 0, 0.85)",
        colorTextSecondary: "rgb(0, 0, 0)",
        colorPrimary: "#2b8dbb",
        colorDanger: "#b94545",
        borderRadius: "10px",
        fontFamily: "'DM Sans', sans-serif",
    },
    elements: {
        card: {
            background: "#42a1f0",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            boxShadow: "0 0 80px rgba(99,102,241,0.1)",
        },
        headerTitle: {
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
        },
        headerSubtitle: {
            color: "rgba(255,255,255,0.45)",
        },
        socialButtonsBlockButton: {
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.85)",
            "&:hover": {
                background: "rgba(255,255,255,0.1)",
            },
        },
        dividerLine: {
            background: "rgba(255, 255, 255, 0.74)",
        },
        dividerText: {
            color: "rgba(255, 255, 255, 0.77)",
        },
        formFieldLabel: {
            color: "rgba(255, 255, 255, 0.84)",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.3px",
        },
        formFieldInput: {
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.9)",
            "&:focus": {
                border: "1px solid rgba(99,102,241,0.6)",
                boxShadow: "0 0 0 2px rgba(99,102,241,0.15)",
            },
        },
        formButtonPrimary: {
            background: "linear-gradient(135deg, #1b7cbd, #1554db)",
            transition: "opacity 0.2s ease, transform 0.1s ease",
            "&:hover": {
                background: "linear-gradient(135deg, #1157c0, #0e3fa8)",
                opacity: "0.9",
            },
            "&:active": {
                transform: "scale(0.98)",
            },
        },
        footerActionLink: {
            color: "#818cf8",
        },
        footer: {
            "& + div": { display: "none" },
        },
    },
};

function Login() {
    const { isSignedIn, isLoaded, user } = useUser();

    if (!isLoaded) return null;

    if (isSignedIn) {
        const role = user?.publicMetadata?.role || "lider";
        return <Navigate to={role === "admin" ? "/admin/listado" : "/lider/listado"} />;
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#070a0f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <SignIn
                appearance={clerkAppearance}
                afterSignInUrl="/redirect"
            />
        </div>
    );
}

export default Login;