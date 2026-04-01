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

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Hero />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/admin/listado" element={<ListadoAdmin />} />
            <Route path="/admin/registrar" element={<RegistrarAdmin />} />
            <Route path='/admin/leerqr' element={<LeerQRAdmin />} />
            <Route path='/admin/permisos' element={<ReportesAdmin />} />
            <Route path='/admin/lider' element={<RegistrarLider />} />

        </Routes>
    );
}

export default AppRouter;
