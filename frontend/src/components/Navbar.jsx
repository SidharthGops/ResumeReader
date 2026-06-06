import { useEffect, useState } from 'react'
import { useAuth } from '../useAuth.js'
import { LogOut, CircleUserRound, Sparkles, Moon, Sun, Palette, History, FileScan } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        document.body.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const themes = [
        { name: 'Light', value: 'light', icon: Sun },
        { name: 'Dark', value: 'dark', icon: Moon },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-base-content/10 bg-base-100/80 backdrop-blur-md">
            <div className="navbar max-w-7xl mx-auto px-4 md:px-8 min-h-[64px]">
                {/* Brand */}
                <div className="flex-1">
                    <Link to="/upload" className="flex items-center gap-2 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-primary-content shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105">
                            <FileScan size={20} className="animate-pulse" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            ResumeReader
                        </span>
                    </Link>
                </div>

                {/* Right side items */}
                <div className="flex-none gap-4">
                    {/* Theme selector */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <Palette size={20} />
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow-xl border border-base-content/10 mt-3">
                            <li className="menu-title text-xs opacity-60">Select Theme</li>
                            {themes.map((t) => {
                                const IconComponent = t.icon
                                return (
                                    <li key={t.value}>
                                        <button
                                            onClick={() => {
                                                if (theme !== t.value) {
                                                    setTheme(t.value)
                                                    if (t.value === 'dark') {
                                                        toast('Dark mode activated', { icon: '🌚', });
                                                    } else {
                                                        toast('Light mode activated', {
                                                            icon: '🌝',
                                                            style: {
                                                                borderRadius: '10px',
                                                                background: '#333',
                                                                color: '#fff',
                                                            },
                                                        })
                                                    }
                                                }
                                            }}
                                            className={`flex items-center justify-between ${theme === t.value ? 'active' : ''}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <IconComponent size={16} />
                                                {t.name}
                                            </span>
                                            {theme === t.value && <span className="h-2 w-2 rounded-full bg-primary"></span>}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <Link to="/history" className="btn btn-ghost gap-2 normal-case">
                        <History size={18} />
                        History
                    </Link>
                    {/* User profile dropdown */}
                    {user && (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost gap-2 pl-2 pr-3 normal-case border border-base-content/10 rounded-full hover:bg-base-200">
                                <div className="w-8 h-8 rounded-full border border-base-content/10 bg-base-100 flex items-center justify-center">
                                    <CircleUserRound size={22} className="text-base-content/70" />
                                </div>
                                <span className="hidden md:inline text-sm max-w-[120px] truncate">
                                    {user.email}
                                </span>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-[1] w-64 p-2 shadow-xl border border-base-content/10 mt-3">
                                <li className="menu-title flex flex-col items-start px-4 py-3 border-b border-base-content/10 mb-2">
                                    <span className="text-xs opacity-55">Logged in as</span>
                                    <span className="text-sm font-semibold text-base-content break-all mt-0.5">{user.email}</span>
                                </li>
                                <li>
                                    <Link to="/upload" className="flex items-center gap-3">
                                        <Sparkles size={16} />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <button onClick={handleLogout} className="flex items-center gap-3 text-error hover:bg-error/10">
                                        <LogOut size={16} />
                                        <span>Log Out</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
