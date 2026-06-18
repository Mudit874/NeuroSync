import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2, MoreHorizontal, PenLine, Send, Loader2, AlertCircle, LogIn, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useAuth } from "@/context/AuthContext"
import { Link } from "react-router-dom"
import api from "@/lib/api"

export default function CommunityComponent() {
    const [posts, setPosts] = useState([])
    const [newPost, setNewPost] = useState("")
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)
    const [commentingOn, setCommentingOn] = useState(null)
    const [newComment, setNewComment] = useState("")
    const [error, setError] = useState("")
    const [successMsg, setSuccessMsg] = useState("")

    const { user } = useAuth()

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true)
            setError("")
            const response = await api.get('/community/posts')
            if (response.data && response.data.success) {
                const postsData = response.data.data
                if (Array.isArray(postsData)) {
                    setPosts(postsData)
                } else {
                    setPosts([])
                }
            } else {
                setError("Server returned an unexpected response.")
            }
        } catch (err) {
            console.error("Error fetching posts:", err)
            const message = err.response?.data?.message || err.message || "Unknown error"
            setError(`Failed to load posts: ${message}`)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (user) fetchPosts()
    }, [fetchPosts, user])

    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(""), 3000)
            return () => clearTimeout(timer)
        }
    }, [successMsg])

    const handlePost = async () => {
        if (!newPost.trim() || posting) return
        if (!user) {
            setError("Please log in to share a post.")
            return
        }
        setPosting(true)
        setError("")
        try {
            const response = await api.post('/community/posts', {
                content: newPost,
                authorName: "Anonymous"
            })
            if (response.data && response.data.success && response.data.data) {
                setPosts(prev => [response.data.data, ...prev])
                setNewPost("")
                setSuccessMsg("Your thoughts have been shared anonymously ✨")
            } else {
                setError("Post was created but response was unexpected. Refreshing...")
                fetchPosts()
            }
        } catch (err) {
            console.error("Error creating post:", err)
            if (err.response?.status === 401) {
                setError("Your session has expired. Please log in again.")
            } else {
                setError(err.response?.data?.message || "Failed to create post. Please try again.")
            }
        } finally {
            setPosting(false)
        }
    }

    const toggleLike = async (postId) => {
        if (!user) {
            setError("Please log in to like posts.")
            return
        }
        setPosts(prev => prev.map(post => {
            if (post._id === postId) {
                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likesCount: post.isLiked ? (post.likesCount || 1) - 1 : (post.likesCount || 0) + 1
                }
            }
            return post
        }))
        try {
            const response = await api.put(`/community/posts/${postId}/like`)
            if (response.data && response.data.success) {
                setPosts(prev => prev.map(post =>
                    post._id === postId ? response.data.data : post
                ))
            }
        } catch (err) {
            console.error("Error liking post:", err)
            fetchPosts()
            if (err.response?.status === 401) {
                setError("Please log in to like posts.")
            }
        }
    }

    const handleComment = async (postId) => {
        if (!newComment.trim()) return
        if (!user) {
            setError("Please log in to comment.")
            return
        }
        try {
            const response = await api.post(`/community/posts/${postId}/comment`, {
                content: newComment,
                authorName: "Anonymous"
            })
            if (response.data && response.data.success) {
                setPosts(prev => prev.map(post =>
                    post._id === postId ? response.data.data : post
                ))
                setNewComment("")
                setSuccessMsg("Comment added anonymously 💬")
            }
        } catch (err) {
            console.error("Error adding comment:", err)
            if (err.response?.status === 401) {
                setError("Your session has expired. Please log in again.")
            } else {
                setError(err.response?.data?.message || "Failed to add comment. Please try again.")
            }
        }
    }

    const handleShare = async (post) => {
        const shareText = `"${post.content}" — Anonymous, NeuroSync Community`
        if (navigator.share) {
            try {
                await navigator.share({ title: 'NeuroSync Community', text: shareText })
            } catch (e) { /* cancelled */ }
        } else {
            try {
                await navigator.clipboard.writeText(shareText)
                setSuccessMsg("Copied to clipboard! 📋")
            } catch (e) {
                setError("Could not copy to clipboard.")
            }
        }
    }

    const formatTime = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now - date) / 1000)
        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // ─── Logged-out state: show full login gate ───────────
    if (!user) {
        return (
            <div className="space-y-8 relative z-10 w-full max-w-3xl mx-auto">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="p-10 sm:p-12 bg-card/40 backdrop-blur-xl border-border/40 shadow-lg rounded-[2.5rem] text-center space-y-5">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                            <LogIn className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-medium text-foreground mb-2">Join the Conversation</h3>
                            <p className="text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
                                Log in to share your thoughts, like posts, and comment — all anonymously. Your identity is always protected.
                            </p>
                        </div>
                        <Button asChild className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/15">
                            <Link to="/login">
                                <LogIn className="w-4 h-4 mr-2" />
                                Log In to Participate
                            </Link>
                        </Button>
                        <p className="text-sm text-muted-foreground pt-1">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary font-medium hover:underline underline-offset-4">
                                Sign up
                            </Link>
                        </p>
                    </Card>
                </motion.div>
            </div>
        )
    }

    // ─── Logged-in state: full community experience ──────
    return (
        <div className="space-y-8 relative z-10 w-full max-w-3xl mx-auto">

            {/* Ambient Background Glow */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            {/* Global Messages */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="bg-destructive/5 border border-destructive/10 text-destructive p-4 rounded-2xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm leading-relaxed flex-1">{error}</p>
                            <button onClick={() => setError("")} className="text-destructive/50 hover:text-destructive text-lg leading-none">&times;</button>
                        </div>
                    </motion.div>
                )}
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="bg-primary/5 border border-primary/10 text-primary p-4 rounded-2xl flex items-center gap-3">
                            <p className="text-sm leading-relaxed flex-1">{successMsg}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Post Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="p-2 bg-card/60 backdrop-blur-xl border-border/40 shadow-xl shadow-primary/5 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500 focus-within:bg-card/80 focus-within:shadow-2xl">
                    <div className="p-4 sm:p-6 space-y-4">
                        <Textarea
                            placeholder="Share your thoughts anonymously..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-32 resize-none border-none bg-accent/50 focus-visible:ring-0 text-lg font-serif leading-relaxed placeholder:font-sans placeholder:text-base placeholder:font-light p-2 px-4 shadow-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handlePost()
                                }
                            }}
                        />
                        <div className="flex justify-between items-center pt-2 border-t border-border/20">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium">
                                Posted Anonymously
                            </p>
                            <Button
                                onClick={handlePost}
                                disabled={!newPost.trim() || posting}
                                className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:hover:scale-100 font-medium"
                            >
                                {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4 mr-2" />}
                                Share
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Feed Section */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
                        <p className="text-sm text-muted-foreground/60">Loading community posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center">
                            <MessageCircle className="w-8 h-8 text-primary/30" />
                        </div>
                        <div>
                            <h3 className="text-lg font-serif font-medium text-foreground mb-1">No posts yet</h3>
                            <p className="text-sm text-muted-foreground">Be the first to share your thoughts with the community.</p>
                        </div>
                        <Button onClick={fetchPosts} variant="outline" className="rounded-full mt-2 gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Refresh button */}
                        <div className="flex justify-end">
                            <button
                                onClick={fetchPosts}
                                className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-primary transition-colors px-3 py-1.5 rounded-full hover:bg-primary/5"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Refresh
                            </button>
                        </div>

                        {/* Post Cards */}
                        {posts.map((post, index) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08, type: "spring", stiffness: 100, damping: 20 }}
                            >
                                <Card className="p-8 bg-card/40 backdrop-blur-xl border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 rounded-[2.5rem] group">

                                    {/* Post Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-serif text-xl italic text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                                                {(post.authorName || 'A')[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground leading-none mb-1">{post.authorName || 'Anonymous'}</p>
                                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{formatTime(post.createdAt)}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-accent/50 transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {/* Post Content */}
                                    <p className="text-xl md:text-2xl font-serif text-foreground/90 leading-relaxed mb-8">
                                        "{post.content}"
                                    </p>

                                    {/* Post Actions */}
                                    <div className="flex gap-2 pt-6 border-t border-border/20">
                                        <button
                                            onClick={() => toggleLike(post._id)}
                                            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 ${post.isLiked
                                                ? "bg-red-500/10 text-red-500 shadow-sm"
                                                : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-sm"
                                                }`}
                                        >
                                            <motion.div whileTap={{ scale: 0.8 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                                                <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                                            </motion.div>
                                            {post.likesCount || 0}
                                        </button>

                                        <button
                                            onClick={() => setCommentingOn(commentingOn === post._id ? null : post._id)}
                                            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 ${commentingOn === post._id
                                                ? "bg-primary/10 text-primary shadow-sm"
                                                : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-sm"
                                                }`}
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            {post.comments?.length || 0}
                                        </button>

                                        <button
                                            onClick={() => handleShare(post)}
                                            className="flex items-center justify-center w-9 h-9 rounded-full bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-sm transition-all duration-300 ml-auto"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    <AnimatePresence>
                                        {commentingOn === post._id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-6 space-y-4 overflow-hidden"
                                            >
                                                {post.comments && post.comments.length > 0 ? (
                                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                        {post.comments.map((comment, idx) => (
                                                            <div
                                                                key={comment._id || idx}
                                                                className="bg-accent/30 p-4 rounded-2xl"
                                                            >
                                                                <div className="flex justify-between items-center mb-1.5">
                                                                    <span className="text-xs font-bold text-primary">{comment.authorName || 'Anonymous'}</span>
                                                                    <span className="text-[10px] text-muted-foreground/60">{formatTime(comment.createdAt)}</span>
                                                                </div>
                                                                <p className="text-sm text-foreground/80 leading-relaxed">{comment.content}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground/50 text-center py-2 italic">No comments yet. Be the first!</p>
                                                )}

                                                {user ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Write an anonymous comment..."
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                            className="flex-1 bg-accent/30 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 border border-border/30 placeholder:text-muted-foreground/50 text-foreground"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleComment(post._id)
                                                            }}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            onClick={() => handleComment(post._id)}
                                                            disabled={!newComment.trim()}
                                                            className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3">
                                                        <Link to="/login" className="text-sm text-primary hover:underline underline-offset-4 font-medium">
                                                            Log in to leave a comment
                                                        </Link>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}
