import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { findPostBySlug, BLOG_POSTS } from '../data/blogPosts';
import SEO from '../components/SEO';

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

const Section = ({ section }) => {
    if (section.type === 'heading') {
        const level = section.level === 3 ? 3 : 2;
        const Tag = `h${level}`;
        return (
            <Tag
                style={{
                    fontFamily: 'var(--font-hero)',
                    fontWeight: 500,
                    fontSize:
                        level === 2
                            ? 'clamp(1.6rem, 2.6vw, 2rem)'
                            : 'clamp(1.25rem, 2vw, 1.5rem)',
                    color: '#FFF',
                    lineHeight: 1.25,
                    letterSpacing: '-0.5px',
                    margin: level === 2 ? '48px 0 12px' : '32px 0 8px',
                }}
            >
                {section.text}
            </Tag>
        );
    }
    if (section.type === 'paragraph') {
        return (
            <p
                style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.88)',
                    margin: '0 0 18px',
                }}
            >
                {section.text}
            </p>
        );
    }
    if (section.type === 'list') {
        const Tag = section.ordered ? 'ol' : 'ul';
        return (
            <Tag
                style={{
                    margin: '8px 0 24px',
                    paddingLeft: '24px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.88)',
                }}
            >
                {section.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: '8px' }}>
                        {item}
                    </li>
                ))}
            </Tag>
        );
    }
    if (section.type === 'quote') {
        return (
            <blockquote
                style={{
                    margin: '32px 0',
                    padding: '20px 28px',
                    borderLeft: '3px solid #F7AC41',
                    background: 'rgba(247,172,65,0.06)',
                    fontFamily: 'var(--font-hero)',
                    fontSize: '1.15rem',
                    fontStyle: 'italic',
                    color: '#FFF',
                    lineHeight: 1.5,
                }}
            >
                “{section.text}”
                {section.cite && (
                    <footer
                        style={{
                            marginTop: '10px',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.6)',
                            fontStyle: 'normal',
                        }}
                    >
                        — {section.cite}
                    </footer>
                )}
            </blockquote>
        );
    }
    return null;
};

const BlogPostPage = () => {
    const { slug } = useParams();
    const post = findPostBySlug(slug);

    useEffect(() => {
        if (post) window.scrollTo(0, 0);
    }, [post]);

    if (!post) return <Navigate to="/blog" replace />;

    const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        author: { '@type': 'Person', name: post.author },
        publisher: { '@id': 'https://wsjrschool.com/#organization' },
        mainEntityOfPage: `https://wsjrschool.com/blog/${post.slug}`,
        keywords: post.tags.join(', '),
        image: 'https://wsjrschool.com/og-default.jpg',
    };

    return (
        <div
            className="blog-post-root"
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
                    right: '-10%',
                    width: '50vw',
                    height: '50vw',
                    background:
                        'radial-gradient(ellipse at center, rgba(247,172,65,0.14) 0%, rgba(247,172,65,0) 60%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <SEO
                title={post.title}
                description={post.excerpt}
                path={`/blog/${post.slug}`}
                type="article"
                schema={articleSchema}
            />

            <article
                style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '760px',
                    margin: '0 auto',
                    padding: '160px 5% 120px',
                }}
            >
                <Link
                    to="/blog"
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
                    ← All resources
                </Link>

                {/* Tags */}
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        marginBottom: '20px',
                    }}
                >
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            style={{
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                padding: '4px 12px',
                                borderRadius: '999px',
                                background: 'rgba(247,172,65,0.12)',
                                color: '#F7AC41',
                                border: '1px solid rgba(247,172,65,0.3)',
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                        fontWeight: 500,
                        lineHeight: 1.1,
                        letterSpacing: '-1.5px',
                        margin: 0,
                    }}
                >
                    {post.title}
                </motion.h1>

                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        flexWrap: 'wrap',
                        margin: '24px 0 48px',
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.6)',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    <span>{post.author}</span>
                    <span aria-hidden>·</span>
                    <span>{formatDate(post.date)}</span>
                    <span aria-hidden>·</span>
                    <span>{post.readTime} min read</span>
                </div>

                <div className="blog-body">
                    {post.sections.map((section, i) => (
                        <Section key={i} section={section} />
                    ))}
                </div>
            </article>

            {/* Related */}
            {related.length > 0 && (
                <section
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 5% 120px',
                    }}
                >
                    <h3
                        style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: '1.6rem',
                            color: '#FFF',
                            margin: '0 0 28px',
                            fontWeight: 500,
                            letterSpacing: '-0.5px',
                        }}
                    >
                        Continue reading
                    </h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        {related.map((p) => (
                            <Link
                                key={p.slug}
                                to={`/blog/${p.slug}`}
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(247,172,65,0.18)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    display: 'block',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor =
                                        'rgba(247,172,65,0.4)';
                                    e.currentTarget.style.transform =
                                        'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor =
                                        'rgba(247,172,65,0.18)';
                                    e.currentTarget.style.transform =
                                        'translateY(0)';
                                }}
                            >
                                <h4
                                    style={{
                                        fontFamily: 'var(--font-hero)',
                                        fontSize: '1.15rem',
                                        fontWeight: 500,
                                        margin: '0 0 8px',
                                        lineHeight: 1.25,
                                    }}
                                >
                                    {p.title}
                                </h4>
                                <p
                                    style={{
                                        fontSize: '0.88rem',
                                        color: 'rgba(255,255,255,0.7)',
                                        margin: 0,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {p.excerpt}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .blog-post-root article { padding: 120px 6% 80px !important; }
                }
            `}</style>
        </div>
    );
};

export default BlogPostPage;
