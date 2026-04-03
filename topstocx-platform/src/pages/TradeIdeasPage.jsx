import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Send, Heart, MessageCircle, Share2, MoreHorizontal, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import HomeHeader from '../components/layout/HomeHeader';

// Mock Initial Data
const INITIAL_POSTS = [
    {
        id: 1,
        author: { name: 'Sarah Chen', handle: '@s_chen_trades', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        time: '2h ago',
        content: "Expecting a major breakout on $NVDA. We've been consolidating in this wedge pattern for 3 weeks. Look at the volume profile shifting.",
        sentiment: 'bullish',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800&h=400',
        likes: 245,
        commentsCount: 2,
        shares: 12,
        isLiked: false,
        isMine: false,
        commentsList: [
            { id: 101, author: 'Alex', handle: '@alextrades', text: 'Totally agree, the 1H chart looks primed.', isMine: false, time: '1h ago' },
            { id: 102, author: 'BigBear', handle: '@bears_r_us', text: 'Careful with macro data tomorrow though.', isMine: false, time: '30m ago' }
        ]
    },
    {
        id: 2,
        author: { name: 'Marcus Trading', handle: '@marcustrade', avatar: 'https://i.pravatar.cc/150?u=marcus' },
        time: '5h ago',
        content: "Be careful with $TSLA here. Macro conditions are weakening and we just rejected off the 200 SMA on the daily chart.",
        sentiment: 'bearish',
        image: null,
        likes: 89,
        commentsCount: 0,
        shares: 2,
        isLiked: true,
        isMine: false,
        commentsList: []
    }
];

export default function TradeIdeasPage() {
    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState(null);
    const [sentiment, setSentiment] = useState(null);

    // Comments State
    const [expandedComments, setExpandedComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});

    // Post Creation
    const handlePostSubmit = (e) => {
        e.preventDefault();
        if (!newPostContent.trim() && !newPostImage) return;

        const newPost = {
            id: Date.now(),
            author: { name: 'You (Demo)', handle: '@your_handle', avatar: 'https://i.pravatar.cc/150?u=you' },
            time: 'Just now',
            content: newPostContent,
            sentiment: sentiment,
            image: newPostImage ? URL.createObjectURL(newPostImage) : null,
            likes: 0,
            commentsCount: 0,
            shares: 0,
            isLiked: false,
            isMine: true,
            commentsList: []
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
        setNewPostImage(null);
        setSentiment(null);
    };

    const handleDeletePost = (id) => {
        setPosts(posts.filter(p => p.id !== id));
    };

    const handleLike = (id) => {
        setPosts(posts.map(p => {
            if (p.id === id) {
                return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
            }
            return p;
        }));
    };

    const handleShare = (id) => {
        setPosts(posts.map(p => {
            if (p.id === id) {
                return { ...p, shares: p.shares + 1 };
            }
            return p;
        }));
        alert("Post link copied to clipboard!");
    };

    const toggleComments = (id) => {
        setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCommentChange = (id, text) => {
        setCommentInputs(prev => ({ ...prev, [id]: text }));
    };

    const handleSubmitComment = (e, postId) => {
        e.preventDefault();
        const text = commentInputs[postId];
        if (!text || !text.trim()) return;

        setPosts(posts.map(p => {
            if (p.id === postId) {
                const newComment = {
                    id: Date.now(),
                    author: 'You',
                    handle: '@your_handle',
                    text: text,
                    isMine: true,
                    time: 'Just now'
                };
                return {
                    ...p,
                    commentsCount: p.commentsCount + 1,
                    commentsList: [...p.commentsList, newComment]
                };
            }
            return p;
        }));

        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    };

    const handleDeleteComment = (postId, commentId) => {
        setPosts(posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    commentsCount: p.commentsCount - 1,
                    commentsList: p.commentsList.filter(c => c.id !== commentId)
                };
            }
            return p;
        }));
    };

    return (
        <div style={{ backgroundColor: '#0d1117', minHeight: '100vh', color: '#e8f0fe', fontFamily: "'Inter', sans-serif" }}>
            <HomeHeader />

            <main style={{ paddingTop: '120px', maxWidth: '680px', margin: '0 auto', paddingBottom: '4rem' }}>
                <div style={{ padding: '0 1rem', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Syne', sans-serif", letterSpacing: 1, margin: 0 }}>
                        Trade Ideas
                    </h1>
                    <p style={{ color: '#8b949e', fontSize: '15px', marginTop: 8 }}>
                        Share setups, react, and discuss market trends together.
                    </p>
                </div>

                {/* Create Post Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 16, margin: '0 1rem 2rem', overflow: 'hidden' }}
                >
                    <form onSubmit={handlePostSubmit} style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <img src="https://i.pravatar.cc/150?u=you" alt="You" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}>
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Share an analysis, chart, or setup... (e.g., $AAPL breaking out)"
                                    style={{
                                        width: '100%', minHeight: 80, background: 'transparent', border: 'none',
                                        color: '#e8f0fe', fontSize: 16, fontFamily: "'Inter', sans-serif", resize: 'none', outline: 'none'
                                    }}
                                />
                                {newPostImage && (
                                    <div style={{ position: 'relative', marginTop: 12, borderRadius: 12, overflow: 'hidden' }}>
                                        <img src={URL.createObjectURL(newPostImage)} alt="Upload preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
                                        <button type="button" onClick={() => setNewPostImage(null)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer' }}>✕</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #30363d' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#2962ff', fontSize: 14, fontWeight: 600, padding: '6px 10px', borderRadius: 8 }}>
                                    <Image size={18} /><span>Media</span>
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setNewPostImage(e.target.files[0]) }} />
                                </label>
                                <button type="button" onClick={() => setSentiment(sentiment === 'bullish' ? null : 'bullish')} style={{
                                    display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                                    background: sentiment === 'bullish' ? 'rgba(46,160,67,0.15)' : 'transparent', color: sentiment === 'bullish' ? '#3fb950' : '#8b949e',
                                    border: `1px solid ${sentiment === 'bullish' ? 'rgba(46,160,67,0.4)' : 'transparent'}`, padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600
                                }}><TrendingUp size={16} /> Bullish</button>

                                <button type="button" onClick={() => setSentiment(sentiment === 'bearish' ? null : 'bearish')} style={{
                                    display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                                    background: sentiment === 'bearish' ? 'rgba(248,81,73,0.15)' : 'transparent', color: sentiment === 'bearish' ? '#f85149' : '#8b949e',
                                    border: `1px solid ${sentiment === 'bearish' ? 'rgba(248,81,73,0.4)' : 'transparent'}`, padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600
                                }}><TrendingDown size={16} /> Bearish</button>
                            </div>

                            <button type="submit" disabled={!newPostContent.trim() && !newPostImage} style={{
                                background: (!newPostContent.trim() && !newPostImage) ? '#21262d' : '#2962ff', color: (!newPostContent.trim() && !newPostImage) ? '#8b949e' : '#fff',
                                border: 'none', borderRadius: 20, padding: '8px 20px', fontSize: 14, fontWeight: 700, cursor: (!newPostContent.trim() && !newPostImage) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6
                            }}>Post <Send size={16} /></button>
                        </div>
                    </form>
                </motion.div>

                {/* Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 1rem' }}>
                    <AnimatePresence>
                        {posts.map((post) => (
                            <motion.div key={post.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 16, padding: '1.25rem' }}>
                                {/* Post Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <img src={post.author.avatar} alt={post.author.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ fontWeight: 700, fontSize: 15, color: '#e8f0fe' }}>{post.author.name}</span>
                                                <span style={{ color: '#8b949e', fontSize: 14 }}>{post.author.handle}</span>
                                                <span style={{ color: '#8b949e', fontSize: 14 }}>· {post.time}</span>
                                            </div>
                                            {post.sentiment && (
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, color: post.sentiment === 'bullish' ? '#3fb950' : '#f85149', fontSize: 12, fontWeight: 600 }}>
                                                    {post.sentiment === 'bullish' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                    {post.sentiment === 'bullish' ? 'Bullish Setup' : 'Bearish Setup'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {post.isMine && (
                                            <button onClick={() => handleDeletePost(post.id)} style={{ background: 'none', border: 'none', color: '#f85149', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#c9d1d9', marginBottom: 14, whiteSpace: 'pre-wrap' }}>
                                    {post.content.split(/(\$[A-Z]+)/).map((part, i) =>
                                        part.startsWith('$') ? <span key={i} style={{ color: '#2962ff', fontWeight: 600, cursor: 'pointer' }}>{part}</span> : part
                                    )}
                                </p>

                                {/* Image */}
                                {post.image && (
                                    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #30363d', marginBottom: 16 }}>
                                        <img src={post.image} alt="Trade idea" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
                                    </div>
                                )}

                                {/* Actions Bar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', borderTop: '1px solid #30363d', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                    <button onClick={() => handleLike(post.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: post.isLiked ? '#ff4d6d' : '#8b949e', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}>
                                        <Heart size={18} fill={post.isLiked ? '#ff4d6d' : 'none'} color={post.isLiked ? '#ff4d6d' : 'currentColor'} /> {post.likes}
                                    </button>

                                    <button onClick={() => toggleComments(post.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}>
                                        <MessageCircle size={18} /> {post.commentsCount}
                                    </button>

                                    <button onClick={() => handleShare(post.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}>
                                        <Share2 size={18} /> {post.shares}
                                    </button>
                                </div>

                                {/* Comments Section */}
                                <AnimatePresence>
                                    {expandedComments[post.id] && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                            <div style={{ background: '#11151a', borderRadius: 8, padding: '1rem', marginTop: '1rem' }}>
                                                {/* Existing Comments */}
                                                {post.commentsList.map(comment => (
                                                    <div key={comment.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #21262d', paddingBottom: '0.75rem' }}>
                                                        <div>
                                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f0fe', marginBottom: 2 }}>{comment.author} <span style={{ fontWeight: 400, color: '#8b949e' }}>{comment.handle} · {comment.time}</span></div>
                                                            <div style={{ fontSize: 14, color: '#c9d1d9' }}>{comment.text}</div>
                                                        </div>
                                                        {comment.isMine && (
                                                            <button onClick={() => handleDeleteComment(post.id, comment.id)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer' }}>
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Add Comment Input */}
                                                <form onSubmit={(e) => handleSubmitComment(e, post.id)} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Write a comment..."
                                                        value={commentInputs[post.id] || ''}
                                                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                                        style={{ flex: 1, background: '#1c2128', border: '1px solid #30363d', color: '#e8f0fe', padding: '8px 12px', borderRadius: 20, fontSize: 14, outline: 'none' }}
                                                    />
                                                    <button type="submit" disabled={!commentInputs[post.id]?.trim()} style={{ background: 'none', border: 'none', color: commentInputs[post.id]?.trim() ? '#2962ff' : '#8b949e', cursor: commentInputs[post.id]?.trim() ? 'pointer' : 'not-allowed', padding: '0 8px' }}>
                                                        <Send size={18} />
                                                    </button>
                                                </form>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
