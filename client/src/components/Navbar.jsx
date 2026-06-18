import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Heart, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ProfileDropdown from './ProfileDropdown'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'motion/react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { user, logout } = useAuth()
    const location = useLocation()

    // Navbar links
    const links = [
        { href: '/', label: 'Home' },
        { href: '/chatbot', label: 'Sage AI' },
        { href: '/assessment', label: 'Assessment' },
        { href: '/resources', label: 'Resources' },
        { href: '/community', label: 'Community' },
        { href: '/counseling', label: 'Counseling' },
        { href: '/emergency', label: 'Emergency' },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-100 px-4 sm:px-8 py-6 pointer-events-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">

                {/* Logo - Serif and Italic like Hero */}
                <Link to="/" className="flex items-center gap-2 group  bg-white/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-sm">
                    <span className="font-serif text-2xl italic tracking-tight text-foreground">NeuroSync</span>
                </Link>

                {/* Desktop Menu - Minimal Pill Style */}
                <div className="hidden md:flex gap-1 items-center bg-white/40 backdrop-blur-md border border-white/20 px-2 py-1.5 rounded-full shadow-sm">
                    {links.map((link) => {
                        const isActive = location.pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-500 ${isActive
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-foreground/60 hover:text-foreground hover:bg-white/30'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Right CTAs */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2">
                        {!user && (
                            <Button asChild variant="ghost" className="rounded-full text-sm font-medium px-6 bg-white/30 backdrop-blur-md border border-white/20 hover:bg-white/50 hover:shadow-sm text-foreground/80 hover:text-foreground transition-all duration-300">
                                <Link to="/login">Login</Link>
                            </Button>
                        )}
                        {user ? (
                            <ProfileDropdown />
                        ) : (
                            <Button asChild variant="default" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                                <Link to="/register">Sign Up</Link>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button - Visible ONLY on mobile */}
                    <button
                        className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-white/20 text-foreground shadow-sm"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="md:hidden absolute top-24 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 shadow-2xl pointer-events-auto"
                    >
                        <div className="flex flex-col gap-2">
                            {links.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        to={link.href}
                                        className="block px-6 py-4 rounded-2xl text-xl font-serif italic text-foreground/80 hover:bg-primary/5 hover:text-primary transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="h-px bg-primary/5 my-4" />
                            {user ? (
                                <>
                                    <Link
                                        to={user.role === 'counselor' ? '/counselor-dashboard' : user.role === 'admin' ? '/admin' : '/student-dashboard'}
                                        className="flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Activity className="w-5 h-5" />
                                        My Journey
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="w-full py-6 rounded-2xl text-lg font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                        onClick={() => { logout(); setIsOpen(false); }}
                                    >
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" className="w-full py-6 rounded-2xl text-lg font-medium bg-white/50 border border-white/40">
                                        <Link to="/login" onClick={() => setIsOpen(false)}>
                                            Login
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full py-7 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
                                        <Link to="/register" onClick={() => setIsOpen(false)}>
                                            Begin Journey
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}