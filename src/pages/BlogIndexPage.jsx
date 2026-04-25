import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BLOG_POSTS, BLOG_TAGS } from '../data/blogPosts';

const formatDate = (iso) => {
    try {
        return new Date(iso).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return iso;
    }
};

const BlogIndexPage = () => {
    const [activeTag, setActiveTag] = useState('All');

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Insights & Resources — Wall Street Jr. Academy';
        const desc =
            'Articles, frameworks, and resources from Wall Street Jr. Academy on finance, AI, design, and modern business.';
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = desc;
    }, []);

    const filtered = useMemo(() => {
        const sorted = [...BLOG_POSTS].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );
        if (activeTag === 'All') return sorted;
        return sorted.filter((p) => p.tags.includes(activeTag));
    }, [activeTag]);

    return (
        <div
            className="blog-root"
            style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                color: '#FFF',
                fontFamily: 'var(--font-body)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Ambient glow */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    top: '-15%',
                    left: '-10%',
                    width: '60vw',
                    height: '60vw',
                    background:
                        'radial-gradient(ellipse at center, rgba(247,172,65,0.16) 0%, rgba(247,172,65,0) 60%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/* Hero */}
            <section
                className="blog-hero"
                style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '160px 8% 60px',
                    maxWidth: '1400px',
                    margin: '0 auto',
                }}
            >
                <Link
                    to="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        marginBottom: '40px',
                    }}
                >
                    ← Back to home
                </Link>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(2.6rem, 6vw, 5rem)',
                        fontWeight: 500,
                        lineHeight: 1.05,
                        letterSpacing: '-1.8px',
                        margin: 0,
                        maxWidth: '1200px',
                    }}
                >
                    Insights &{' '}
                    <span
                        style={{
                            fontStyle: 'italic',
                            background:
                                'linear-gradient(101deg, #F7AC41 8.57%, #BC7E26 48.6%, #FFBD5F 85.66%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Resources
                    </span>
                    .
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                    style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(1.05rem, 1.4vw, 1.3rem)',
                        lineHeight: 1.55,
                        color: 'rgba(255,255,255,0.82)',
                        margin: '28px 0 0',
                        maxWidth: '720px',
                        fontWeight: 500,
                    }}
                >
                    Frameworks, perspectives, and practical guides from the Wall
                    Street Jr. faculty. Built for professionals serious about
                    finance, AI, design, and operating real businesses.
                </motion.p>

                {/* Tag filter */}
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        marginTop: '36px',
                    }}
                >
                    {['All', ...BLOG_TAGS].map((tag) => {
                        const active = activeTag === tag;
                        return (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    border: active
                                        ? '1px solid rgba(247,172,65,0.6)'
                                        : '1px solid rgba(255,255,255,0.18)',
                                    background: active
                                        ? 'rgba(247,172,65,0.15)'
                                        : 'transparent',
                                    color: active ? '#F7AC41' : '#FFF',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.82rem',
                                    fontWeight: 500,
                                    letterSpacing: '0.05em',
                                    cursor: 'pointer',
                                    transition: 'all 0.18s ease',
                                }}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Grid */}
            <section
                className="blog-grid"
                style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '20px 8% 140px',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
                    gap: '28px',
                }}
            >
                {filtered.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.6)', gridColumn: '1 / -1' }}>
                        No posts in this category yet.
                    </p>
                ) : (
                    filtered.map((post, idx) => (
                        <motion.article
                            key={post.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{
                                duration: 0.5,
                                delay: idx * 0.08,
                                ease: 'easeOut',
                            }}
                            className="blog-card"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(247,172,65,0.18)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '320px',
                                transition: 'all 0.25s ease',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <Link
                                to={`/blog/${post.slug}`}
                                style={{
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: 1,
                                    padding: '32px 30px',
                                    gap: '14px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '8px',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {post.tags.slice(0, 2).map((t) => (
                                        <span
                                            key={t}
                                            style={{
                                                fontSize: '0.62rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.14em',
                                                textTransform: 'uppercase',
                                                padding: '3px 10px',
                                                borderRadius: '999px',
                                                background: 'rgba(247,172,65,0.12)',
                                                color: '#F7AC41',
                                                border: '1px solid rgba(247,172,65,0.3)',
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <h2
                                    style={{
                                        fontFamily: 'var(--font-hero)',
                                        fontSize: '1.5rem',
                                        fontWeight: 500,
                                        lineHeight: 1.2,
                                        margin: 0,
                                        color: '#FFF',
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    {post.title}
                                </h2>
                                <p
                                    style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '0.95rem',
                                        lineHeight: 1.55,
                                        color: 'rgba(255,255,255,0.78)',
                                        margin: 0,
                                        flex: 1,
                                    }}
                                >
                                    {post.excerpt}
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: '14px',
                                        fontSize: '0.78rem',
                                        color: 'rgba(255,255,255,0.55)',
                                    }}
                                >
                                    <span>{formatDate(post.date)}</span>
                                    <span>{post.readTime} min read</span>
                                </div>
                            </Link>
                        </motion.article>
                    ))
                )}
            </section>

            <style>{`
                .blog-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(247,172,65,0.4) !important;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.35);
                }
                @media (max-width: 768px) {
                    .blog-hero { padding: 120px 6% 40px !important; }
                    .blog-grid { padding: 12px 6% 80px !important; gap: 18px !important; }
                    .blog-card { min-height: 260px !important; }
                }
            `}</style>
        </div>
    );
};

export default BlogIndexPage;
