import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap/dist/js/bootstrap.bundle.min"; 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage/index.tsx'
import CityPage from "./pages/cities/CityPage.tsx";
import LoginPage from './pages/LoginPage/index.tsx'; // Added import
import RegisterPage from './pages/RegisterPage/index.tsx'; // Added import
import ProtectedRoute from './components/ProtectedRoute.tsx'; // Added import


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cities/:name" element={<CityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
