import Navbar from '../components/navbar/Navbar'
import Hero from '../components/navbar/Hero'
import Login from '../pages/Login'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import RegistrarAdmin from '../pages/admin/RegistrarAdmin'
import ListadoAdmin from '../pages/admin/ListadoAdmin'
import LeerQRAdmin from '../pages/admin/LeerQRAdmin'
import ReportesAdmin from '../pages/admin/ReportesAdmin'
import RegistrarLider from '../pages/admin/RegistrarLider'
import NotificacionAdmin from '../pages/admin/NotificacionAdmin'

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Hero />} />
            </Route>

            {/* RUTAS DE ADMINISTRADOR */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin/listado" element={<ListadoAdmin />} />
            <Route path="/admin/registrar" element={<RegistrarAdmin />} />
            <Route path='/admin/leerqr' element={<LeerQRAdmin />} />
            <Route path='/admin/permisos' element={<ReportesAdmin />} />
            <Route path='/admin/lider' element={<RegistrarLider />} />
            <Route path='/admin/notificaciones' element={<NotificacionAdmin />} />

            {/* RUTAS DE LIDER */}
            <Route path="/lider/listado" element={<ListadoAdmin />} />
            <Route path="/lider/registrar" element={<RegistrarAdmin />} />
            <Route path='/lider/leerqr' element={<LeerQRAdmin />} />
            <Route path='/lider/permisos' element={<ReportesAdmin />} />
            <Route path='/lider/notificaciones' element={<NotificacionAdmin />} />


        </Routes>
    );
}

export default AppRouter;
