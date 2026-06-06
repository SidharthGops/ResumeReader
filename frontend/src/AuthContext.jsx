import { useMemo, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { AuthContext } from './useAuth.js'

const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1]
        const decoded = JSON.parse(atob(payload))
        return decoded // should contain { email, exp, iat }
    } catch {
        return null
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null)
    const user = useMemo(() => token ? decodeToken(token) : null, [token])

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    }, [token])

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark'
        document.documentElement.setAttribute('data-theme', savedTheme)
        document.body.setAttribute('data-theme', savedTheme)
    }, [])

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()
            if (data.token) {
                setToken(data.token)
                toast.success('Logged in successfully!')
                return { success: true }
            } else {
                toast.error(data.message || 'Login failed')
                return { success: false, message: data.message }
            }
        } catch {
            toast('Network error during login', { icon: '🌐', });
            return { success: false, message: 'Network error' }
        }
    }

    const register = async (email, password) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (data.token) {
            setToken(data.token)
            toast.success('Account created successfully!')
            return { success: true }
        }
        toast.error(data.message || 'Registration failed')
        return { success: false, message: data.message }
    }

    const logout = () => {
        setToken(null)
        toast(
            "Logged out successfully!",
            {
                duration: 5000,
            }
        );
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
