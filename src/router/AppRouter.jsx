import Navbar from '../components/navbar/Navbar'
import Hero from '../components/navbar/Hero'
import Login from '../pages/Login'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import RegistrarAdmin from '../pages/RegistrarAdmin'
import ListadoAdmin from '../pages/ListadoAdmin'

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Hero />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/listadoadmin" element={<ListadoAdmin />} />
            <Route path="/registraradmin" element={<RegistrarAdmin />} />
        </Routes>
    );
}

export default AppRouter;
