import Navbar from '../components/navbar/Navbar'
import Hero from '../components/navbar/Hero'
import Login from '../pages/Login'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Admin from '../pages/Admin'

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Hero />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
    );
}

export default AppRouter;
