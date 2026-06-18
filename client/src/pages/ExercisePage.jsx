import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, X, RotateCcw, Save, Shuffle, Brain, Wind, Dumbbell, BookOpen, Eye, Hand, Ear, Flower2, Apple, Grip, Move, ArrowUpFromDot, Smile, Frown, Footprints, ScanFace, PenLine } from "lucide-react"
import StepCountdown from "@/components/resources/StepCountdown"
import BreathingTimer from "@/components/resources/BreathingTimer"
import SessionComplete from "@/components/resources/SessionComplete"

// ─── Exercise Data ──────────────────────────────────────

const exerciseConfigs = {
    "5-4-3-2-1-grounding": {
        title: "5-4-3-2-1 Grounding",
        description: "Ground yourself in the present moment using your five senses. This technique reduces anxiety by anchoring your awareness to your immediate surroundings.",
        icon: Brain,
        type: "step",
        steps: [
            { title: "5 Things You See", instruction: "Look around you. Identify five things you can see right now. Notice their colors, shapes, and textures.", icon: Eye, duration: 15 },
            { title: "4 Things You Feel", instruction: "Notice four things you can physically feel. The chair beneath you, your feet on the ground, the air on your skin.", icon: Hand, duration: 15 },
            { title: "3 Things You Hear", instruction: "Close your eyes if comfortable. Listen for three distinct sounds — distant or nearby, loud or subtle.", icon: Ear, duration: 15 },
            { title: "2 Things You Smell", instruction: "Notice two scents around you. Perhaps coffee, fresh air, or the subtle scent of fabric.", icon: Flower2, duration: 10 },
            { title: "1 Thing You Taste", instruction: "Focus on one taste in your mouth. It may be subtle — the aftertaste of a drink, or simply the feeling of your tongue.", icon: Apple, duration: 10 },
        ],
    },
    "box-breathing": {
        title: "Box Breathing",
        description: "A powerful technique used by Navy SEALs to stay calm under pressure. Breathe in a perfect square pattern to regulate your nervous system.",
        icon: Wind,
        type: "breathing",
        pattern: [
            { label: "Breathe In", duration: 4 },
            { label: "Hold", duration: 4 },
            { label: "Breathe Out", duration: 4 },
            { label: "Hold", duration: 4 },
        ],
        durations: [5, 10, 15],
        animated: "box",
    },
    "progressive-muscle-relaxation": {
        title: "Progressive Muscle Relaxation",
        description: "Systematically tense and release each muscle group to release physical tension and promote deep relaxation throughout your body.",
        icon: Dumbbell,
        type: "step",
        steps: [
            { title: "Hands — Tense", instruction: "Make tight fists with both hands. Squeeze as hard as you can. Feel the tension building in your hands and forearms.", icon: Grip, duration: 5 },
            { title: "Hands — Release", instruction: "Let go. Open your hands wide and let them rest. Feel the warmth flowing through your fingers as tension melts away.", icon: Hand, duration: 8 },
            { title: "Arms — Tense", instruction: "Bend your arms at the elbow and flex your biceps tightly. Hold the tension and notice how it feels.", icon: Dumbbell, duration: 5 },
            { title: "Arms — Release", instruction: "Straighten your arms and let them fall naturally. Feel the heaviness and relief as the muscles relax completely.", icon: Move, duration: 8 },
            { title: "Shoulders — Tense", instruction: "Raise your shoulders up toward your ears. Hold them there, pressing up as high as they'll go.", icon: ArrowUpFromDot, duration: 5 },
            { title: "Shoulders — Release", instruction: "Drop your shoulders all at once. Feel the release cascade down your back. Let your neck lengthen naturally.", icon: Smile, duration: 8 },
            { title: "Face — Tense", instruction: "Scrunch your entire face — squeeze your eyes shut, wrinkle your nose, clench your jaw. Hold it tightly.", icon: Frown, duration: 5 },
            { title: "Face — Release", instruction: "Relax every muscle in your face. Let your jaw hang open slightly. Smooth your forehead. Feel complete ease.", icon: ScanFace, duration: 8 },
            { title: "Legs — Tense", instruction: "Press your legs together and point your toes. Feel the tension through your thighs, calves, and feet.", icon: Dumbbell, duration: 5 },
            { title: "Legs — Release", instruction: "Let your legs fall apart naturally. Wiggle your toes. Feel the warmth and relief spreading through your lower body.", icon: Footprints, duration: 8 },
        ],
    },
    "journaling-prompts": {
        title: "Journaling Prompts",
        description: "Process your emotions through reflective writing. Let your thoughts flow freely onto the page without judgment.",
        icon: PenLine,
        type: "journal",
    },
}

// ─── Journaling prompts pool ────────────────────────────

const journalPrompts = [
    "What are three things you're grateful for today, and why?",
    "Describe a moment today when you felt at peace.",
    "What emotion are you feeling most strongly right now? Explore why.",
    "Write a letter of forgiveness to yourself.",
    "What would you tell your younger self?",
    "Describe your ideal day from start to finish.",
    "What's a boundary you need to set, and how can you do it?",
    "List five things that bring you joy, no matter how small.",
    "What fear is holding you back? What would you do without it?",
    "Describe a challenge you overcame and what it taught you.",
    "What does self-care look like for you today?",
    "Write about someone who has inspired you and why.",
    "If your anxiety could speak, what would it say? How would you respond?",
    "What do you need to let go of in order to move forward?",
    "Describe a safe place, real or imaginary, in vivid detail.",
]

// ─── Journal Component ──────────────────────────────────

function JournalExercise({ onClose }) {
    const [prompt, setPrompt] = useState(() => journalPrompts[Math.floor(Math.random() * journalPrompts.length)])
    const [text, setText] = useState("")
    const [timeLeft, setTimeLeft] = useState(300) // 5 min
    const [isRunning, setIsRunning] = useState(true)
    const [isSaved, setIsSaved] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const intervalRef = useRef(null)

    const cleanup = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) {
            cleanup()
            if (timeLeft <= 0) setIsComplete(true)
            return
        }
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsComplete(true)
                    cleanup()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return cleanup
    }, [isRunning, timeLeft, cleanup])

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

    const saveEntry = () => {
        const entries = JSON.parse(localStorage.getItem("NeuroSync-journal") || "[]")
        entries.push({
            prompt,
            text,
            date: new Date().toISOString(),
        })
        localStorage.setItem("NeuroSync-journal", JSON.stringify(entries))
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2000)
    }

    const shufflePrompt = () => {
        const newPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)]
        setPrompt(newPrompt)
    }

    if (isComplete && text.trim()) {
        return (
            <SessionComplete
                title="Journaling Complete"
                onRestart={() => {
                    setTimeLeft(300)
                    setText("")
                    setPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)])
                    setIsComplete(false)
                    setIsRunning(true)
                }}
                activityType="exercise"
                activityName="Journaling Prompts"
                activitySlug="journaling-prompts"
                duration={300}
            />
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-xl"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6">
                <div className="flex items-center gap-4">
                    <Button onClick={onClose} variant="ghost" size="icon" className="rounded-full w-10 h-10">
                        <X className="w-5 h-5" />
                    </Button>
                    <span className="text-sm text-muted-foreground tabular-nums">
                        {formatTime(timeLeft)} remaining
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsRunning(prev => !prev)} variant="ghost" size="icon" className="rounded-full w-10 h-10">
                        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                        onClick={saveEntry}
                        variant="outline"
                        className="rounded-full px-5 py-2 text-sm border-primary/20"
                        disabled={!text.trim()}
                    >
                        <Save className="w-3.5 h-3.5 mr-2" />
                        {isSaved ? "Saved!" : "Save"}
                    </Button>
                </div>
            </div>

            {/* Prompt */}
            <div className="max-w-2xl mx-auto w-full px-6 pt-4">
                <div className="flex items-start gap-3 mb-6">
                    <Card className="flex-1 p-6 bg-primary/5 border-primary/10 rounded-2xl">
                        <p className="text-lg font-serif text-foreground leading-relaxed italic">
                            "{prompt}"
                        </p>
                    </Card>
                    <Button onClick={shufflePrompt} variant="ghost" size="icon" className="rounded-full w-10 h-10 mt-1 shrink-0">
                        <Shuffle className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Text area */}
            <div className="flex-1 max-w-2xl mx-auto w-full px-6 pb-6">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Begin writing here... Let your thoughts flow freely."
                    className="w-full h-full resize-none bg-transparent border-none outline-none text-foreground text-lg leading-relaxed font-light placeholder:text-muted-foreground/40 custom-scrollbar"
                    autoFocus
                />
            </div>

            {/* Word count */}
            <div className="p-4 text-center">
                <span className="text-xs text-muted-foreground">
                    {text.trim() ? text.trim().split(/\s+/).length : 0} words
                </span>
            </div>
        </motion.div>
    )
}

// ─── Box Breathing Animated Square ──────────────────────

function BoxBreathingVisual({ onClose }) {
    const [isActive, setIsActive] = useState(false)
    const [selectedDuration, setSelectedDuration] = useState(5)

    if (isActive) {
        return (
            <BreathingTimer
                pattern={exerciseConfigs["box-breathing"].pattern}
                totalDuration={selectedDuration * 60}
                title="Box Breathing"
                onClose={() => setIsActive(false)}
                activityType="exercise"
                activitySlug="box-breathing"
            />
        )
    }

    const config = exerciseConfigs["box-breathing"]

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto w-full mt-32">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="rounded-full mb-6 text-muted-foreground hover:text-foreground -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
                    </Button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center">
                    {(() => {
                        const Icon = config.icon; return (
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Icon className="w-8 h-8 text-primary" />
                            </div>
                        )
                    })()}
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">{config.title}</h1>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-xl mx-auto mb-10">{config.description}</p>
                </motion.div>

                {/* Duration */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
                    <p className="text-sm text-muted-foreground text-center mb-4 uppercase tracking-widest font-semibold">Choose Duration</p>
                    <div className="flex justify-center gap-3">
                        {config.durations.map(dur => (
                            <button
                                key={dur}
                                onClick={() => setSelectedDuration(dur)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all border ${selectedDuration === dur
                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                    : "bg-white/40 text-foreground border-white/40 hover:bg-white/60"
                                    }`}
                            >
                                {dur} min
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Pattern Preview */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="p-8 bg-white/40 backdrop-blur-xl border-white/40 rounded-[2rem] mb-10">
                        <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-5 text-center">Box Pattern</p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            {config.pattern.map((p, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="text-center">
                                        <div className="text-2xl font-light text-foreground tabular-nums">{p.duration}s</div>
                                        <div className="text-xs text-muted-foreground mt-1">{p.label}</div>
                                    </div>
                                    {i < config.pattern.length - 1 && <div className="w-8 h-px bg-border" />}
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
                    <Button
                        onClick={() => setIsActive(true)}
                        className="rounded-full px-12 py-7 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                    >
                        <Play className="w-5 h-5 mr-3" /> Begin Exercise
                    </Button>
                </motion.div>
            </main>
        </div>
    )
}

// ─── Main Exercise Page ─────────────────────────────────

export default function ExercisePage() {
    const { type } = useParams()
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(false)

    const config = exerciseConfigs[type]

    if (!config) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <Navbar />
                <main className="flex-1 flex items-center justify-center mt-32">
                    <div className="text-center">
                        <h2 className="text-2xl font-serif text-foreground mb-4">Exercise not found</h2>
                        <Button onClick={() => navigate("/resources")} variant="outline" className="rounded-full px-8 py-6">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    // Box breathing has its own visual component
    if (type === "box-breathing") {
        return <BoxBreathingVisual onClose={() => navigate("/resources")} />
    }

    // Journal exercise
    if (type === "journaling-prompts" && isActive) {
        return <JournalExercise onClose={() => setIsActive(false)} />
    }

    // Step-based exercises in active mode
    if (isActive && config.type === "step") {
        return (
            <StepCountdown
                steps={config.steps}
                title={config.title}
                onClose={() => setIsActive(false)}
                autoAdvance={true}
                activityType="exercise"
                activitySlug={type}
            />
        )
    }

    // Landing / Setup screen
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto w-full mt-32">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Button
                        onClick={() => navigate("/resources")}
                        variant="ghost"
                        className="rounded-full mb-6 text-muted-foreground hover:text-foreground -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                >
                    {(() => {
                        const Icon = config.icon; return (
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Icon className="w-8 h-8 text-primary" />
                            </div>
                        )
                    })()}
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">{config.title}</h1>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-xl mx-auto mb-10">{config.description}</p>
                </motion.div>

                {/* Steps preview */}
                {config.steps && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-8 bg-white/40 backdrop-blur-xl border-white/40 rounded-[2rem] mb-10">
                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-5 text-center">
                                {config.type === "step" ? "Exercise Steps" : "How It Works"}
                            </p>
                            <div className="space-y-3">
                                {config.steps.map((s, i) => (
                                    <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-background/50">
                                        {(() => {
                                            const StepIcon = s.icon; return (
                                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <StepIcon className="w-4 h-4 text-primary" />
                                                </div>
                                            )
                                        })()}
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-foreground">{s.title}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground tabular-nums">{s.duration}s</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Journal info */}
                {config.type === "journal" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-8 bg-white/40 backdrop-blur-xl border-white/40 rounded-[2rem] mb-10">
                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-5 text-center">
                                How It Works
                            </p>
                            <div className="space-y-3 text-center">
                                <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-background/50">
                                    <span className="text-xl">✨</span>
                                    <span className="text-sm text-foreground">A random reflective prompt to inspire you</span>
                                </div>
                                <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-background/50">
                                    <span className="text-xl">⏱️</span>
                                    <span className="text-sm text-foreground">5-minute writing timer to keep you focused</span>
                                </div>
                                <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-background/50">
                                    <span className="text-xl">💾</span>
                                    <span className="text-sm text-foreground">Save entries locally to revisit later</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <Button
                        onClick={() => setIsActive(true)}
                        className="rounded-full px-12 py-7 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                    >
                        <Play className="w-5 h-5 mr-3" /> Begin Exercise
                    </Button>
                </motion.div>
            </main>
        </div>
    )
}
