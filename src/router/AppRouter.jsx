import Navbar from '../components/navbar/Navbar'
import Hero from '../components/navbar/Hero'
import Login from '../pages/Login'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import RegistrarAdmin from '../pages/RegistrarAdmin'
import ListadoAdmin from '../pages/ListadoAdmin'
import LeerQRAdmin from '../pages/LeerQRAdmin'

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Hero />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/listadoadmin" element={<ListadoAdmin />} />
            <Route path="/registraradmin" element={<RegistrarAdmin />} />
            <Route path='/leerqradmin' element={<LeerQRAdmin />} />
        </Routes>
    );
}

export default AppRouter;
