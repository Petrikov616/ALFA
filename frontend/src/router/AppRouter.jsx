import Navbar from '../components/navbar/Navbar'
import Redirect from '../pages/Redirect'
import Hero from '../components/navbar/Hero'
import Login from '../pages/Login'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import RegistrarAdmin from '../pages/admin/RegistrarAdmin'
import AsistenciaAdmin from '../pages/admin/AsistenciaAdmin'
import LeerQRAdmin from '../pages/admin/LeerQRAdmin'
import ReportesAdmin from '../pages/admin/ReportesAdmin'
import RegistrarLiderAdmin from '../pages/admin/RegistrarLider'
import NotificacionAdmin from '../pages/admin/NotificacionAdmin'
import UsuariosAdmin from '../pages/admin/UsuariosAdmin'
import EstudiantesAdmin from '../pages/admin/EstudiantesAdmin'


import AsistenciaLider from '../pages/lider/AsistenciaLider'
import LeerQRLider from '../pages/lider/LeerQRLider'
import ReportesLider from '../pages/lider/ReportesLider'
import NotificacionLider from '../pages/lider/NotificacionLider'

import ReportesEncargado from '../pages/encargado/ReportesEncargado'

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Hero />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/redirect" element={<Redirect />} />

            {/* RUTAS DE ADMINISTRADOR */}
            <Route path="/admin/asistencia" element={<ProtectedRoute allowedRole="admin"><AsistenciaAdmin /></ProtectedRoute>} />
            <Route path="/admin/estudiantes" element={<ProtectedRoute allowedRole="admin"><EstudiantesAdmin /></ProtectedRoute>} />
            <Route path="/admin/registrar" element={<ProtectedRoute allowedRole="admin"><RegistrarAdmin /></ProtectedRoute>} />
            <Route path="/admin/leerqr" element={<ProtectedRoute allowedRole="admin"><LeerQRAdmin /></ProtectedRoute>} />
            <Route path="/admin/permisos" element={<ProtectedRoute allowedRole="admin"><ReportesAdmin /></ProtectedRoute>} />
            <Route path="/admin/lider" element={<ProtectedRoute allowedRole="admin"><RegistrarLiderAdmin /></ProtectedRoute>} />
            <Route path="/admin/notificaciones" element={<ProtectedRoute allowedRole="admin"><NotificacionAdmin /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute allowedRole="admin"><UsuariosAdmin /></ProtectedRoute>} />

            {/* RUTAS DE LIDER */}
            <Route path="/lider/asistencia" element={<ProtectedRoute allowedRole="lider"><AsistenciaLider /></ProtectedRoute>} />
            <Route path="/lider/leerqr" element={<ProtectedRoute allowedRole="lider"><LeerQRLider /></ProtectedRoute>} />
            <Route path="/lider/permisos" element={<ProtectedRoute allowedRole="lider"><ReportesLider /></ProtectedRoute>} />
            <Route path="/lider/notificaciones" element={<ProtectedRoute allowedRole="lider"><NotificacionLider /></ProtectedRoute>} />

            {/* RUTA DEL ENCARGADO */}
            <Route path="/encargado/permisos" element={<ProtectedRoute allowedRole="encargado"><ReportesEncargado /></ProtectedRoute>} />
        </Routes>
    );
}

export default AppRouter;