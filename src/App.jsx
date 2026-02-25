import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Hero from './components/navbar/Hero'
import Login from './pages/Login/'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Hero />} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
