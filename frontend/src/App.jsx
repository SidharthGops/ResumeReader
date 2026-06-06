import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './useAuth.js'
import Login from './pages/Login.jsx'
import Upload from './pages/Upload.jsx'
import Results from './pages/Results.jsx'
import History from './pages/History.jsx'

function ProtectedRoute({ children }) {
    const { user } = useAuth()
    return user ? children : <Navigate to="/login" />
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/upload" element={
                <ProtectedRoute>
                    <Upload />
                </ProtectedRoute>
            } />
            <Route path="/results" element={
                <ProtectedRoute>
                    <Results />
                </ProtectedRoute>
            } />
            <Route path="/history" element={
                <ProtectedRoute>
                    <History />
                </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    )
}
