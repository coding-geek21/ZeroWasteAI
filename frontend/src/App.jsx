import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'

import Landing   from './pages/Landing'
import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'
import Scan      from './pages/Scan'
import Inventory from './pages/Inventory'
import Actions   from './pages/Actions'
import Donate    from './pages/Donate'
import Impact    from './pages/Impact'
import Settings  from './pages/Settings'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected – wrapped in Layout */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
        />
        <Route
          path="/scan"
          element={<ProtectedRoute><Layout><Scan /></Layout></ProtectedRoute>}
        />
        <Route
          path="/inventory"
          element={<ProtectedRoute><Layout><Inventory /></Layout></ProtectedRoute>}
        />
        <Route
          path="/actions"
          element={<ProtectedRoute><Layout><Actions /></Layout></ProtectedRoute>}
        />
        <Route
          path="/donate"
          element={<ProtectedRoute><Layout><Donate /></Layout></ProtectedRoute>}
        />
        <Route
          path="/impact"
          element={<ProtectedRoute><Layout><Impact /></Layout></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
