import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Shield, GraduationCap, Eye, EyeOff, Loader2, AlertCircle, Heart, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function Register() {
    const [role, setRole] = useState('student')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        speciality: '',
        credentials: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const { data } = await api.post('/auth/register', { ...formData, role })
            if (data.success) {
                if (role === 'counselor') {
                    setMessage({
                        type: 'success',
                        text: 'Registration successful! Your account is pending approval. Redirecting to login...'
                    })
                    setTimeout(() => {
                        window.location.href = '/login'
                    }, 3000)
                } else {
                    localStorage.setItem('user', JSON.stringify({
                        ...data,
                        token: data.token
                    }))
                    setMessage({
                        type: 'success',
                        text: `Welcome to your sanctuary, ${data.name}. Redirecting...`
                    })
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 1500)
                }
            }
        } catch (error) {
            console.error('Registration error:', error)
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to create your account. Please try again.'
            })
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (message.text) setMessage({ type: '', text: '' })
    }

    const roles = [
        { id: 'student', label: 'Student', icon: GraduationCap },
        { id: 'counselor', label: 'Counselor', icon: User },
        { id: 'admin', label: 'Admin', icon: Shield },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">

            {/* Back to Home Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute top-6 left-6 md:top-10 md:left-10 z-50"
            >
                <Button asChild variant="ghost" className="rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-sm hover:bg-white/60 text-foreground gap-2 transition-all">
                    <Link to="/">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                </Button>
            </motion.div>

            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] pointer-events-none -z-10">
                <div className="absolute top-0 left-10 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full max-w-lg z-10 py-12"
            >
                <Card className="w-full p-8 sm:p-12 border-white/40 bg-white/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] relative overflow-hidden">

                    {/* Header */}
                    <div className="text-center space-y-3 mb-10">
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground tracking-tight">
                            Create <span className="italic text-primary">Account</span>
                        </h1>
                        <p className="text-muted-foreground font-light text-sm">
                            Join NeuroSync and start your journey to peace.
                        </p>
                    </div>

                    {/* Form Area */}
                    <div className="space-y-8">

                        {/* Custom Role Selector (Pill Style) */}
                        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-white/40 shadow-sm relative">
                            {roles.map((r) => {
                                const Icon = r.icon
                                const isActive = role === r.id
                                return (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => setRole(r.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-all duration-500 relative z-10
                                            ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{r.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="register-active-role"
                                                className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Error/Success Messages */}
                        <AnimatePresence mode="wait">
                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    className={`overflow-hidden rounded-2xl ${message.type === 'error' ? 'bg-destructive/5 text-destructive' : 'bg-primary/5 text-primary'
                                        }`}
                                >
                                    <div className={`p-4 border text-sm flex items-start gap-3 rounded-2xl ${message.type === 'error' ? 'border-destructive/10' : 'border-primary/10'
                                        }`}>
                                        {message.type === 'error' ? (
                                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        ) : (
                                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                        )}
                                        <p className="leading-relaxed">{message.text}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Inputs */}
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 ml-2">Full Name</label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Retik Yadav"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="h-14 px-6 rounded-full bg-white/60 border-white/40 focus-visible:ring-primary/30 shadow-sm transition-all text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 ml-2">Email Address</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="rk@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="h-14 px-6 rounded-full bg-white/60 border-white/40 focus-visible:ring-primary/30 shadow-sm transition-all text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 ml-2">Password</label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="h-14 pl-6 pr-14 rounded-full bg-white/60 border-white/40 focus-visible:ring-primary/30 shadow-sm transition-all text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Conditional Counselor Fields */}
                            <AnimatePresence>
                                {role === 'counselor' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-5 overflow-hidden"
                                    >
                                        <div className="space-y-2 pt-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 ml-2">Speciality</label>
                                            <Input
                                                id="speciality"
                                                name="speciality"
                                                placeholder="e.g. Anxiety, Academic Stress"
                                                required={role === 'counselor'}
                                                value={formData.speciality}
                                                onChange={handleChange}
                                                className="h-14 px-6 rounded-full bg-white/60 border-white/40 focus-visible:ring-primary/30 shadow-sm transition-all text-base"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 ml-2">Proof of Credibility</label>
                                            <Input
                                                id="credentials"
                                                name="credentials"
                                                placeholder="License No. or LinkedIn URL"
                                                required={role === 'counselor'}
                                                value={formData.credentials}
                                                onChange={handleChange}
                                                className="h-14 px-6 rounded-full bg-white/60 border-white/40 focus-visible:ring-primary/30 shadow-sm transition-all text-base"
                                            />
                                            <p className="text-[11px] text-muted-foreground font-light px-2 mt-2 leading-relaxed">
                                                Your account will require administrator approval before accepting counseling requests.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary text-lg font-medium transition-all active:scale-95 disabled:opacity-70 disabled:hover:scale-100 mt-6"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    `Join as ${role.charAt(0).toUpperCase() + role.slice(1)}`
                                )}
                            </Button>
                        </form>
                    </div>
                </Card>

                {/* Footer Link */}
                <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground font-light">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-medium hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}