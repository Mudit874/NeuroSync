import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect, useRef } from 'react'

const MAX_VISIBLE = 3

export default function Testimonials() {
    const testimonials = [
        { name: "Retik", role: "CS Student", content: "NeuroSync is a game-changer for my well-being. Exactly what students need." },
        { name: "Harmeet", role: "Med Student", content: "I've never felt more understood. The community is so supportive and non-judgmental." },
        { name: "Jamshed", role: "Graduate", content: "Sage AI is surprisingly effective. It really helps me process my thoughts." },
        { name: "Utkarsh", role: "Design Student", content: "Booking a counseling session was so easy. Best step I've taken this year." },
        { name: "Akash", role: "Business Student", content: "The daily check-ins help me stay grounded. Highly recommended app." },
        { name: "Ishita", role: "Psychology Student", content: "Finally an app that understands the nuance of student mental health!" },
    ]

    const [visibleItems, setVisibleItems] = useState([])
    const counterRef = useRef(0) // monotonically increasing counter for alternation

    useEffect(() => {
        // Seed with first message immediately
        const firstItem = testimonials[0]
        setVisibleItems([{ ...firstItem, id: Date.now(), side: 'left' }])
        counterRef.current = 1

        const interval = setInterval(() => {
            const idx = counterRef.current % testimonials.length
            const side = counterRef.current % 2 === 0 ? 'left' : 'right'
            const nextItem = { ...testimonials[idx], id: Date.now(), side }
            counterRef.current += 1

            setVisibleItems(prev => {
                const newItems = [...prev, nextItem]
                // Keep max 3 visible — drop oldest
                if (newItems.length > MAX_VISIBLE) return newItems.slice(newItems.length - MAX_VISIBLE)
                return newItems
            })
        }, 3200)

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="py-24 bg-background relative">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-b from-primary/5 via-transparent to-secondary/5 blur-[120px] pointer-events-none" />

            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* ── Left: Heading ── */}
                    <div className="space-y-6 lg:sticky lg:top-1/4 text-center lg:text-left">
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-8xl font-serif text-foreground tracking-tight leading-none"
                        >
                            From our <br />
                            <span className="italic text-primary">Community</span>
                        </motion.h2>
                    </div>

                    {/* ── Right: Chat Bubbles ── */}
                    {/* Fixed-height container; flex-col so newest card is at bottom */}
                    <div className="flex flex-col gap-4 min-h-0">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {visibleItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.75, y: 40 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -30, filter: 'blur(6px)' }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 130,
                                        damping: 22,
                                        layout: { type: 'spring', stiffness: 100, damping: 18 },
                                    }}
                                    className={`w-full flex ${item.side === 'left' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <Card
                                        className={`
                                            max-w-[80%] p-5 border-none
                                            ${item.side === 'left'
                                                ? 'rounded-3xl rounded-bl-none bg-linear-to-l from-background to-transparent text-foreground'
                                                : 'rounded-3xl rounded-br-none bg-linear-to-r from-primary to-primary/50 text-white'}
                                        `}
                                    >
                                        <div className="space-y-3">
                                            <p className="text-base md:text-lg font-serif italic leading-snug">
                                                "{item.content}"
                                            </p>
                                            <div className={`flex items-center gap-2.5 pt-3 border-t ${item.side === 'left' ? 'border-primary/5' : 'border-white/10'}`}>
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs
                                                    ${item.side === 'left' ? 'bg-primary/10 text-primary' : 'bg-white/20 text-white'}`}
                                                >
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-xs leading-none">{item.name}</p>
                                                    <p className={`text-[9px] uppercase tracking-widest mt-1 font-medium opacity-50`}>{item.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    )
}