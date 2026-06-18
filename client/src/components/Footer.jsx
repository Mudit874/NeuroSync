import { Link } from 'react-router-dom'
import { Heart, ArrowUp } from 'lucide-react'
import { motion } from 'motion/react'

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <footer className="bg-background py-24 relative overflow-hidden">
            {/* The "Breathing" Glow - matches your Hero/Features glow logic */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">

                    {/* Brand Column - Large and Serif driven */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 group cursor-default">
                                <span className="font-serif text-4xl tracking-tight text-foreground italic">NeuroSync</span>
                            </div>
                            <p className="text-xl text-muted-foreground leading-relaxed font-serif italic max-w-md">
                                "Your personal digital sanctuary for mental wellness and finding the light within."
                            </p>
                        </div>

                        {/* Interactive back to top */}
                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{ y: -5 }}
                            className="flex items-center gap-3 text-xs uppercase tracking-wide font-bold text-primary/60 hover:text-primary transition-colors"
                        >
                            Return to top
                        </motion.button>
                    </div>

                    {/* Navigation Grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div className="space-y-6">
                            <h3 className="font-bold text-foreground uppercase tracking-widest text-[10px] opacity-40">Navigation</h3>
                            <ul className="space-y-4 font-light text-sm">
                                <li><Link to="/chatbot" className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block">Sage AI</Link></li>
                                <li><Link to="/resources" className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block">Inner Journey</Link></li>
                                <li><Link to="/community" className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block">Shared Light</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bold text-foreground uppercase tracking-widest text-[10px] opacity-40">Support</h3>
                            <ul className="space-y-4 font-light text-sm">
                                <li><Link to="/counseling" className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block">Connect</Link></li>
                                <li><Link to="/emergency" className="transition-all hover:translate-x-1 inline-block text-red-400/60 hover:text-red-400">Emergency Care</Link></li>
                                <li><a href="mailto:peace@NeuroSync.com" className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block">Find Help</a></li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bold text-foreground uppercase tracking-widest text-[10px] opacity-40">Legal</h3>
                            <ul className="space-y-4 font-light text-sm">
                                <li><Link to="#" className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block">Privacy Path</Link></li>
                                <li><Link to="#" className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block">Terms of Peace</Link></li>
                                <li><a href="mailto:ritiknewyadav614@gmail.com?subject=NeuroSync%20-%20Contact" className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block">Developer Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground/40 font-medium">
                        &copy; 2026 NeuroSync Sanctuary &mdash; Crafted for Peace
                    </p>
                    <div className="flex gap-8 items-center opacity-30 hover:opacity-100 transition-opacity">
                        {/* Placeholder for small social icons or badges */}
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <div className="w-1 h-1 rounded-full bg-primary" />
                    </div>
                </div>
            </div>
        </footer>
    )
}