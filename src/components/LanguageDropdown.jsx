import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * LanguageDropdown
 *
 * Translation language picker that replaces the static "EN" label.
 * Visual + interaction only for now — actual i18n string switching is
 * not wired up yet, so non-English options are marked "Coming soon".
 * Selection persists in localStorage under `wsjr.lang`.
 *
 * Variants:
 *   - "hero"   white text/icon, intended for the hero header
 *   - "menu"   sized to fit inside the open mobile menu
 */
const LANGUAGES = [
    { code: 'EN', label: 'English', native: 'English', ready: true },
    { code: 'AR', label: 'Arabic', native: 'العربية', ready: false },
    { code: 'HI', label: 'Hindi', native: 'हिन्दी', ready: false },
];

const STORAGE_KEY = 'wsjr.lang';

const LanguageDropdown = ({ variant = 'hero' }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('EN');
    const ref = useRef(null);

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved && LANGUAGES.some((l) => l.code === saved)) {
                setSelected(saved);
            }
        } catch {
            /* ignore storage errors (e.g. private mode) */
        }
    }, []);

    useEffect(() => {
        if (!open) return;
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        const onEsc = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('mousedown', onClick);
        window.addEventListener('keydown', onEsc);
        return () => {
            window.removeEventListener('mousedown', onClick);
            window.removeEventListener('keydown', onEsc);
        };
    }, [open]);

    const handleSelect = (lang) => {
        if (!lang.ready) {
            setOpen(false);
            return;
        }
        setSelected(lang.code);
        try {
            window.localStorage.setItem(STORAGE_KEY, lang.code);
        } catch {
            /* ignore */
        }
        setOpen(false);
    };

    const sizes =
        variant === 'menu'
            ? {
                  triggerFont: '1.5rem',
                  triggerGap: '8px',
                  panelFont: '1.05rem',
                  panelMinWidth: '180px',
              }
            : {
                  triggerFont: '20px',
                  triggerGap: '5px',
                  panelFont: '0.95rem',
                  panelMinWidth: '170px',
              };

    return (
        <div
            ref={ref}
            className="lang-dropdown"
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
            }}
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Change language, current: ${selected}`}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: sizes.triggerGap,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#FFF',
                    fontSize: sizes.triggerFont,
                    fontWeight: 500,
                    fontFamily: 'var(--font-hero)',
                    lineHeight: 1,
                }}
            >
                <svg width="24" height="24" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M16.0277 3.00565C13.4518 3.00565 10.9338 3.76948 8.79207 5.20055C6.65032 6.63162 4.98103 8.66565 3.99529 11.0454C3.00955 13.4252 2.75164 16.0439 3.25416 18.5702C3.75669 21.0966 4.99708 23.4172 6.81849 25.2386C8.6399 27.06 10.9605 28.3004 13.4869 28.803C16.0132 29.3055 18.6319 29.0476 21.0117 28.0618C23.3915 27.0761 25.4255 25.4068 26.8566 23.265C28.2876 21.1233 29.0515 18.6053 29.0515 16.0294C29.0475 12.5765 27.6741 9.26618 25.2325 6.82461C22.7909 4.38304 19.4806 3.00962 16.0277 3.00565ZM27.0478 16.0294C27.0487 17.0457 26.9083 18.0572 26.6308 19.0349H21.8082C22.1155 17.043 22.1155 15.0158 21.8082 13.0239H26.6308C26.9083 14.0016 27.0487 15.0131 27.0478 16.0294ZM12.7717 21.0386H19.2836C18.6421 23.1406 17.5284 25.0682 16.0277 26.6739C14.5275 25.0678 13.4139 23.1404 12.7717 21.0386ZM12.2834 19.0349C11.9394 17.046 11.9394 15.0128 12.2834 13.0239H19.782C20.126 15.0128 20.126 17.046 19.782 19.0349H12.2834ZM5.00757 16.0294C5.0067 15.0131 5.14704 14.0016 5.42458 13.0239H10.2471C9.9399 15.0158 9.9399 17.043 10.2471 19.0349H5.42458C5.14704 18.0572 5.0067 17.0457 5.00757 16.0294ZM19.2836 11.0203H12.7717C13.4133 8.9182 14.527 6.99065 16.0277 5.38499C17.5278 6.99107 18.6414 8.91849 19.2836 11.0203ZM25.8368 11.0203H21.3762C20.814 8.95765 19.8665 7.02007 18.5836 5.30985C20.1336 5.68219 21.5847 6.38529 22.8375 7.37094C24.0903 8.35658 25.1152 9.60148 25.8419 11.0203H25.8368ZM13.4718 5.30985C12.1889 7.02007 11.2414 8.95765 10.6792 11.0203H6.21352C6.94019 9.60148 7.96505 8.35658 9.21787 7.37094C10.4707 6.38529 11.9218 5.68219 13.4718 5.30985ZM6.21352 21.0386H10.6792C11.2414 23.1012 12.1889 25.0388 13.4718 26.749C11.9218 26.3767 10.4707 25.6736 9.21787 24.6879C7.96505 23.7023 6.94019 22.4574 6.21352 21.0386ZM18.5836 26.749C19.8665 25.0388 20.814 23.1012 21.3762 21.0386H25.8419C25.1152 22.4574 24.0903 23.7023 22.8375 24.6879C21.5847 25.6736 20.1336 26.3767 18.5836 26.749Z" fill="currentColor"/>
                </svg>
                <span>{selected}</span>
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                    style={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        marginLeft: '2px',
                    }}
                >
                    <path
                        d="M2 4.5L6 8.5L10 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        role="listbox"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 12px)',
                            left: 0,
                            margin: 0,
                            padding: '6px',
                            listStyle: 'none',
                            background: '#3A0008',
                            border: '1px solid rgba(247,172,65,0.25)',
                            borderRadius: '14px',
                            boxShadow: '0 18px 44px rgba(0,0,0,0.45)',
                            minWidth: sizes.panelMinWidth,
                            zIndex: 1000,
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        {LANGUAGES.map((lang) => {
                            const isSelected = lang.code === selected;
                            return (
                                <li key={lang.code} role="option" aria-selected={isSelected}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(lang)}
                                        disabled={!lang.ready}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '12px',
                                            background: isSelected
                                                ? 'rgba(247,172,65,0.14)'
                                                : 'transparent',
                                            border: 'none',
                                            color: lang.ready
                                                ? '#FFF'
                                                : 'rgba(255,255,255,0.45)',
                                            cursor: lang.ready ? 'pointer' : 'not-allowed',
                                            padding: '10px 14px',
                                            borderRadius: '10px',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: sizes.panelFont,
                                            fontWeight: 500,
                                            textAlign: 'left',
                                            transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (lang.ready && !isSelected) {
                                                e.currentTarget.style.background =
                                                    'rgba(255,255,255,0.06)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (lang.ready && !isSelected) {
                                                e.currentTarget.style.background =
                                                    'transparent';
                                            }
                                        }}
                                    >
                                        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                                                {lang.code}
                                            </span>
                                            <span style={{ fontSize: '0.78em', opacity: 0.75 }}>
                                                {lang.native}
                                            </span>
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '0.7em',
                                                color: isSelected
                                                    ? '#F7AC41'
                                                    : 'rgba(255,255,255,0.4)',
                                                fontWeight: 500,
                                                letterSpacing: '0.08em',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {isSelected
                                                ? 'Selected'
                                                : lang.ready
                                                ? ''
                                                : 'Coming soon'}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageDropdown;
