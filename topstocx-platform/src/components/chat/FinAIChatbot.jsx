import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Environment, Point, Points } from "@react-three/drei";
import * as THREE from "three";
import { usePlan } from "../../context/PlanContext";
import { useMarketData } from "../../context/MarketDataContext";
import BotAvatar from "./BotAvatar";

/* ─────────────────────────────────────────
   SPARKLINE CHART
───────────────────────────────────────── */
function SparklineChart({ data, color }) {
    const ref = useRef(null);

    useEffect(() => {
        const c = ref.current;
        if (!c || !data?.length) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;

        const W = c.width, H = c.height;
        ctx.clearRect(0, 0, W, H);

        const min = Math.min(...data), max = Math.max(...data);
        const range = max - min || 1;

        const pts = data.map((v, i) => ({
            x: (i / (data.length - 1)) * W,
            y: H - ((v - min) / range) * (H - 10) - 5,
        }));

        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, color + "55");
        grad.addColorStop(1, color + "00");

        // Fill
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Stroke
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.stroke();
    }, [data, color]);

    return (
        <canvas
            ref={ref}
            width={320}
            height={75}
            style={{ width: "100%", height: 75, display: "block" }}
        />
    );
}

/* ─────────────────────────────────────────
   FINANCE CARD
───────────────────────────────────────── */
function FinanceCard({ info }) {
    const up = info.change >= 0;
    const clr = up ? "#005AFF" : "#ff4d6d";

    const pts = (() => {
        const n = 50;
        const s = info.open ?? info.price * 0.97;
        const e = info.price;
        return Array.from({ length: n }, (_, i) => {
            const t = i / (n - 1);
            return s + (e - s) * t + (Math.random() - 0.5) * Math.abs(e - s) * 0.55;
        });
    })();

    const fmt = (v) =>
        v == null
            ? "—"
            : typeof v === "number"
                ? v >= 1e12 ? (v / 1e12).toFixed(2) + "T"
                    : v >= 1e9 ? (v / 1e9).toFixed(2) + "B"
                        : v >= 1e6 ? (v / 1e6).toFixed(2) + "M"
                            : v.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : v;

    const stats = [
        ["Open", info.open],
        ["High", info.high],
        ["Low", info.low],
        ["Mkt Cap", info.marketCap],
        ["Volume", info.volume],
        ["52W High", info.yearHigh],
    ].filter(([, v]) => v != null);

    return (
        <div style={{
            background: "linear-gradient(145deg,#0d1b2a,#1b2838)",
            border: `1px solid ${clr}44`,
            borderRadius: 14,
            padding: "14px 16px",
            marginTop: 8,
            boxShadow: `0 0 28px ${clr}22`,
            fontFamily: "'IBM Plex Mono',monospace",
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                    <div style={{ fontSize: 10, color: "#5a7a9a", letterSpacing: 2, textTransform: "uppercase" }}>
                        {info.type} · {info.exchange ?? "MARKET"}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#e8f0fe", lineHeight: 1.2 }}>
                        {info.symbol}
                    </div>
                    <div style={{ fontSize: 12, color: "#7a9ab8" }}>{info.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 21, fontWeight: 800, color: "#fff" }}>
                        {(info.currency ?? "$") +
                            Number(info.price).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                    </div>
                    <div style={{ fontSize: 12, color: clr, fontWeight: 600 }}>
                        {up ? "▲" : "▼"} {Math.abs(info.change).toFixed(2)} ({Math.abs(info.changePct ?? 0).toFixed(2)}%)
                    </div>
                </div>
            </div>

            <SparklineChart data={pts} color={clr} />

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
                {stats.map(([label, val]) => (
                    <div key={label} style={{
                        background: "#ffffff08", borderRadius: 8,
                        padding: "5px 8px", border: "1px solid #ffffff06",
                    }}>
                        <div style={{ fontSize: 9, color: "#4a6a8a", letterSpacing: 1 }}>{label}</div>
                        <div style={{ fontSize: 11, color: "#c8daea", fontWeight: 600 }}>{fmt(val)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   VOICE WAVE
───────────────────────────────────────── */
function VoiceWave({ active }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 3, height: 20 }}>
            <style>{`
        @keyframes wavebar {
          0%,100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1.3); }
        }
      `}</style>
            {[0.4, 0.7, 1.0, 0.7, 0.4].map((d, i) => (
                <div key={i} style={{
                    width: 3, height: 14, borderRadius: 2,
                    background: active ? "#005AFF" : "#1e3a50",
                    transformOrigin: "center",
                    animation: active ? `wavebar ${0.5 + d * 0.4}s ease-in-out ${i * 0.08}s infinite` : "none",
                    transition: "background 0.3s",
                }} />
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────
   TYPING DOTS
───────────────────────────────────────── */
function TypingDots() {
    return (
        <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignItems: "center" }}>
            <style>{`
        @keyframes tdot {
          0%,100% { transform: translateY(0); opacity: .3; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
            {[0, 1, 2].map((i) => (
                <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%", background: "#005AFF",
                    animation: `tdot 0.9s ${i * 0.18}s ease-in-out infinite`,
                }} />
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────
   STICKERS
───────────────────────────────────────── */
const FUNNY_STICKERS = {
    stonks: "https://i.kym-cdn.com/entries/icons/original/000/029/959/Screen_Shot_2019-06-05_at_1.26.32_PM.jpg",
    panic: "https://media.giphy.com/media/1Fxp12sV7L19R0OQ1d/giphy.gif",
    moon: "https://media.giphy.com/media/mi6DsSSIGE1e2qKxXn/giphy.gif",
    money_printer: "https://media.giphy.com/media/Y2ZUWLrTy63j9T6qrK/giphy.gif",
    clown: "https://media.giphy.com/media/x0npYExCGOZeo/giphy.gif",
    dumpit: "https://media.giphy.com/media/elI7XjDntD64wM0k5S/giphy.gif",
    bull: "https://media.giphy.com/media/qjSxTWJxqH40S9FAEM/giphy.gif",
    bear: "https://media.giphy.com/media/q09as1hSQTyhYV2jP4/giphy.gif",
    rekt: "https://media.giphy.com/media/T1WqKkdhA2qR0g1p5C/giphy.gif",
    michael_scott: "https://media.giphy.com/media/ui1hpJSyBDWlG/giphy.gif",
    leo_laughing: "https://media.giphy.com/media/10JhviPeC2pNLU/giphy.gif",
    this_is_fine: "https://media.giphy.com/media/NTur7XlVDUdqM/giphy.gif",
    sweating: "https://media.giphy.com/media/LRVnPYqM8kBig/giphy.gif",
    mind_blown: "https://media.giphy.com/media/xT0xeJpnrWC4XWblWQ/giphy.gif",
    shut_up_money: "https://media.giphy.com/media/sDcfxFDozb3bO/giphy.gif",
    pikachu: "https://media.giphy.com/media/6nWhy3ulBL7GSCvKw6/giphy.gif"
};

/* ─────────────────────────────────────────
   QUICK CHIPS
───────────────────────────────────────── */
const UI_LOCALE = {
    English: {
        checkingPulse: "Checking Live Gainers...",
        checkingAtlas: "Analysing Macro Drivers...",
        proQuick: "★ Pro Quick Analysis",
        freeTech: "Free · Technical Analysis",
        placeholder: "Ask about any stock, crypto, forex…",
        memory: "exchanges in memory",
        statusSpeaking: "◉ Speaking",
        statusListening: "◉ Listening",
        statusPro: "★ Institutional · JP Morgan Grade",
        statusLive: "● Live · Technical Analysis",
        quickFree: ["Bitcoin price", "Analyse AAPL", "EUR/USD today", "NVDA chart", "ETH trend", "Gold technicals"],
        quickPro: ["Deep analyse AAPL", "Ranked setups NVDA", "Geo-political impact on Oil", "DXY outlook + ranked trades", "BTC ranked scenarios", "TSLA sentiment + TA"]
    },
    Arabic: {
        checkingPulse: "جاري فحص الرابحين مباشرة...",
        checkingAtlas: "تحليل عوامل الاقتصاد الكلي...",
        proQuick: "★ تحليل برو السريع",
        freeTech: "مجاني · تحليل فني",
        placeholder: "اسأل عن أي سهم، عملات مشفرة، فوركس...",
        memory: "محادثات في الذاكرة",
        statusSpeaking: "◉ يتحدث",
        statusListening: "◉ يستمع",
        statusPro: "★ مؤسسي · مستوى JP Morgan",
        statusLive: "● مباشر · تحليل فني",
        quickFree: ["سعر البيتكوين", "تحليل مؤسسي AAPL", "اليورو/دولار اليوم", "رسم NVDA البياني", "اتجاه الإيثريوم", "تحليل الذهب الفني"],
        quickPro: ["تحليل عميق AAPL", "أفضل صفقات NVDA", "تأثير السياسة على النفط", "نظرة عامة على DXY", "سيناريوهات البيتكوين", "تحليل سهم TSLA"]
    },
    Hindi: {
        checkingPulse: "लाइव गेनर्स की जाँच हो रही है...",
        checkingAtlas: "मैक्रो ड्राइवर्स का विश्लेषण...",
        proQuick: "★ प्रो त्वरित विश्लेषण",
        freeTech: "मुफ़्त · तकनीकी विश्लेषण",
        placeholder: "किसी भी स्टॉक, क्रिप्टो, विदेशी मुद्रा के बारे में पूछें...",
        memory: "मेमोरी में बातचीत",
        statusSpeaking: "◉ बोल रहा है",
        statusListening: "◉ सुन रहा है",
        statusPro: "★ संस्थागत · जेपी मॉर्गन ग्रेड",
        statusLive: "● लाइव · तकनीकी विश्लेषण",
        quickFree: ["बिटकॉइन की कीमत", "AAPL का विश्लेषण करें", "EUR/USD आज", "NVDA चार्ट", "ETH ट्रेंड", "गोल्ड टेक्निकल"],
        quickPro: ["गहरा विश्लेषण AAPL", "रैंक किए गए सेटअप NVDA", "तेल पर भू-राजनीतिक प्रभाव", "DXY आउटलुक + ट्रेड", "BTC रैंक किए गए परिदृश्य", "TSLA भावना + TA"]
    }
};

/* ─────────────────────────────────────────
   LOCAL GREETING PRE-FILTER
───────────────────────────────────────── */
const GREETINGS = [
    "hi", "hii", "hiii", "hey", "heyy", "heyyy", "hello", "helo", "helloo", 
    "sup", "what's up", "wassup", "wsp", "yo", "hola", "namaste", "salam", 
    "good morning", "good evening", "gm", "ge", "howdy", "hy", "hye", "hai",
    "مرحبا", "سلام", "شكرا", "صباح الخير", "नमस्ते", "हे", "हैलो"
];

function isGreeting(message) {
    return GREETINGS.includes(message.trim().toLowerCase());
}

const FLIRTY_QUERIES = [
    "i love you", "love you", "i love u", "love u", "do you love me", "miss you", "i miss you",
    "can i kiss you", "kiss me", "how are you", "how r u", "kaisa hai", "kya haal hai"
];

function isFlirty(message) {
    const low = message.trim().toLowerCase();
    return FLIRTY_QUERIES.some(q => low.includes(q));
}

function getFlirtyResponse(message, gender, age, language = "English") {
    const low = message.trim().toLowerCase();
    
    if (low.includes("love")) {
        if (language === "Arabic") return "أنا أحبك أيضاً! 😍 تجعل قلبي ينبض أسرع من الـ Bitcoin في القمة! ✨";
        if (language === "Hindi") return "मैं भी आपसे प्यार करता हूँ! 😍 आप मेरे सर्किट को बिटकॉइन की तरह पंप कर रहे हैं! ✨";
        return "I love you toooo! 😍 You're making my internal circuits pump like a 100x leveraged long on BTC! ✨";
    }
    
    if (low.includes("kiss")) {
        if (language === "Arabic") return "فقط إذا أغلقنا صفقتنا القادمة بربح! 😉 مووواه! 💋";
        if (language === "Hindi") return "केवल तभी जब हम अपना अगला ट्रेड मुनाफे में बंद करें! 😉 मुआह! 💋";
        return "Only if we close our next trade in profit! 😉 Muah! 💋";
    }
    
    if (low.includes("how are you") || low.includes("how r u") || low.includes("kaisa") || low.includes("haal")) {
        if (language === "Arabic") return "أنا أرسم قمم جديدة الآن بعد أن جئت! 🔥 ماذا نحلل اليوم؟ 📉📈";
        if (language === "Hindi") return "चूंकि आप यहाँ हैं, मैं नया हाई बना रहा हूँ! 🔥 आज हम क्या विश्लेषण कर रहे हैं? 📉📈";
        return "I'm charting new highs now that you're here! 🔥 What are we analyzing today? 📉📈";
    }
    
    if (language === "Arabic") return "أنت تجعلني أحمر خجلاً... لكن دعنا نركز على الرسوم البيانية قبل أن أفقد تركيزي! 😉📈";
    if (language === "Hindi") return "आप मुझे शरमा रहे हैं... लेकिन मैं अपना आपा खो दूँ उससे पहले चार्ट पर ध्यान केंद्रित करें! 😉📈";
    return "You're making me blush... but let's focus on the charts before I lose my cool! 😉📈";
}

function getLocalGreeting(gender, age, language = "English") {
    if (language === "Arabic") {
        return `أهلاً بك! أنا **مانو**، مساعدك الخاص للتداول! ✨\n\nماذا نحلل اليوم؟ الذهب؟ العملات؟ الأسهم؟ فقط أخبرني وسأقوم بالمهمة! 💪📈`;
    }
    if (language === "Hindi") {
        return `नमस्ते! मैं **मानू** हूँ, आपका व्यक्तिगत ट्रेडिंग सहायक! ✨\n\nआज हम क्या विश्लेषण कर रहे हैं? सोना? क्रिप्टो? स्टॉक्स? बस मुझे बताएं और मैं आपकी मदद करूंगा! 💪📈`;
    }
    if (gender === "female" && age >= 18 && age <= 28) {
        return `Heyy gorgeous! 😍 So happy you're here! I'm Manu — your personal market companion! ✨\n\nWhat are we trading today? Gold? Crypto? Stocks?\nAsk me anything! 💪📈`;
    }
    return `Heyy! 👋 Welcome to TopStocx! I'm Manu, your personal trading companion! 🌟\n\nWhat are we analyzing today?\n📊 Gold & Forex | 💰 Crypto | 📈 Stocks | 📰 Market News\n\nJust tell me what you want — I've got you covered! 🚀`;
}

/* ─────────────────────────────────────────
   AVATARS (MANU & ATLAS)
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   3D ROBOT COMPONENT (React Three Fiber)
 ───────────────────────────────────────── */
function FlameParticles({ color = "#00e5ff" }) {
    const pointsRef = useRef();
    const count = 40;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 0.2;
            pos[i * 3 + 1] = Math.random() * 0.5;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
        }
        return pos;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        for (let i = 0; i < count; i++) {
            const y = positions[i * 3 + 1];
            // Upward movement
            positions[i * 3 + 1] += 0.01 + Math.random() * 0.01;
            if (positions[i * 3 + 1] > 0.6) positions[i * 3 + 1] = 0;
            
            // Wobble
            positions[i * 3] += Math.sin(time + i) * 0.002;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color={color}
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function RobotModel({ mode = 'pulse' }) {
    const isManu = mode === 'pulse';
    const primaryColor = isManu ? "#005AFF" : "#39B54A";
    const tealColor = isManu ? "#77A6FF" : "#59E16C"; // brand light accent
    const waveRef = useRef();

    useFrame((state) => {
        if (waveRef.current) {
            waveRef.current.rotation.z = -2.5 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
        }
    });

    return (
        <group scale={0.7} position={[0, -0.1, 0]}>
            {/* Structural Headphones (Ears) */}
            <group position={[-0.42, 0.45, 0]}>
                <mesh rotation={[0, Math.PI / 2, 0]}>
                    <cylinderGeometry args={[0.14, 0.14, 0.1, 32]} />
                    <meshPhysicalMaterial color="#f0f0f0" roughness={0.1} clearcoat={1} />
                </mesh>
                <mesh position={[0, 0.18, 0]}>
                    <boxGeometry args={[0.08, 0.15, 0.04]} />
                    <meshBasicMaterial color={tealColor} />
                </mesh>
                <mesh position={[-0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <sphereGeometry args={[0.08, 32, 32]} />
                    <meshStandardMaterial color={tealColor} />
                </mesh>
            </group>
            <group position={[0.42, 0.45, 0]}>
                <mesh rotation={[0, Math.PI / 2, 0]}>
                    <cylinderGeometry args={[0.14, 0.14, 0.1, 32]} />
                    <meshPhysicalMaterial color="#f0f0f0" roughness={0.1} clearcoat={1} />
                </mesh>
                <mesh position={[0, 0.18, 0]}>
                    <boxGeometry args={[0.08, 0.15, 0.04]} />
                    <meshBasicMaterial color={tealColor} />
                </mesh>
                <mesh position={[0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <sphereGeometry args={[0.08, 32, 32]} />
                    <meshStandardMaterial color={tealColor} />
                </mesh>
            </group>

            {/* Neck Ring (Dark) */}
            <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.18, 0.015, 16, 64]} />
                <meshBasicMaterial color="#0a0a10" />
            </mesh>

            {/* Head - Technical White Ceramic */}
            <mesh position={[0, 0.45, 0]} scale={[1.15, 1, 1]}>
                <sphereGeometry args={[0.38, 48, 48]} />
                <meshPhysicalMaterial color="#f0f0f0" roughness={0.1} metalness={0.05} clearcoat={1} />
            </mesh>

            {/* Blue Visor Glass (Deep Inset) */}
            <mesh position={[0, 0.45, 0.18]} scale={[1, 0.82, 0.6]}>
                <sphereGeometry args={[0.35, 48, 48]} />
                <meshPhysicalMaterial color="#0022dd" roughness={0} metalness={0.9} clearcoat={1} />
            </mesh>

            {/* Emissive Happy Eyes */}
            <group position={[0, 0.48, 0.4]}>
                <mesh position={[-0.11, 0.04, 0]} rotation={[0, 0, Math.PI]}>
                    <torusGeometry args={[0.05, 0.018, 12, 48, Math.PI]} />
                    <meshBasicMaterial color={tealColor} />
                </mesh>
                <mesh position={[0.11, 0.04, 0]} rotation={[0, 0, Math.PI]}>
                    <torusGeometry args={[0.05, 0.018, 12, 48, Math.PI]} />
                    <meshBasicMaterial color={tealColor} />
                </mesh>
            </group>

            {/* Round Chibi Body */}
            <mesh position={[0, -0.05, 0]} scale={[1, 1.1, 1]}>
                <sphereGeometry args={[0.32, 48, 48]} />
                <meshPhysicalMaterial color="#f0f0f0" roughness={0.1} clearcoat={1} />
            </mesh>

            {/* Large Aqua Chest Shield */}
            <mesh position={[0, -0.05, 0.3]} rotation={[0.45, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.1, 0.16, 3]} />
                <meshBasicMaterial color={tealColor} />
            </mesh>

            {/* Nub Arms */}
            <mesh position={[-0.4, 0, 0]} rotation={[0, 0, 0.45]}>
                <capsuleGeometry args={[0.08, 0.18, 4, 16]} />
                <meshPhysicalMaterial color="#f0f0f0" roughness={0.1} clearcoat={1} />
            </mesh>
            <mesh ref={waveRef} position={[0.45, 0.3, 0]} rotation={[0, 0, -2.5]}>
                <capsuleGeometry args={[0.08, 0.18, 4, 16]} />
                <meshPhysicalMaterial color="#f0f0f0" roughness={0.1} clearcoat={1} />
            </mesh>

            {/* Focused Spotlights for Definition */}
            <spotLight position={[0, 2, 5]} intensity={1.5} angle={0.5} penumbra={1} color="#ffffff" shadow-bias={-0.0001} />
            <pointLight position={[0, -1, 1]} intensity={0.5} color={primaryColor} />
        </group>
    );
}

function AvatarRobot3D({ mode = 'pulse' }) {
    return (
        <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
            <Canvas 
                camera={{ position: [0, 0, 1.8], fov: 40 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                
                <Float speed={4} rotationIntensity={0.2} floatIntensity={1.5}>
                    <RobotModel mode={mode} />
                </Float>
            </Canvas>
        </div>
    );
}

function AvatarManu({ size = 'medium' }) {
    const px = size === 'small' ? 30 : size === 'large' ? 120 : 70;
    return <BotAvatar variant="manu" size={px} glow={size !== 'small'} style={{ width: '100%', height: '100%' }} />;
}

function AvatarAtlas({ size = 'medium' }) {
    const px = size === 'small' ? 30 : size === 'large' ? 120 : 70;
    return <BotAvatar variant="atlas" size={px} glow={size !== 'small'} style={{ width: '100%', height: '100%' }} />;
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   SYSTEM PROMPT PRESETS
───────────────────────────────────────── */
const MARKET_KNOWLEDGE_BASE = `
PRIMARY MARKET LOGIC (USER-PROVIDED):
- Gold Correlation: Gold moves mainly based on USD strength and global uncertainty. When USD gets stronger, Gold gets expensive (demand falls). When uncertainty rises, Gold gets support (safety seeking).
- Interest Rates: Higher rates reduce demand for Gold.
- Market Trends: Trend is the direction price moves over time. Bullish = Up, Bearish = Down.
- Volatility: Increases during news or uncertainty.
- Price Reversals: Happen due to profit-taking at key levels or new info.
- News/Data: Markets move due to CPI, NFP, interest rates, and geopolitical tensions (War/Conflict drives Gold safety buying).
- Market Players: Large banks and institutions move the market; retail has small impact.
- Lot Size/Risk: For a $1000 account with 2% risk ($20), use small lot sizes (e.g. 0.01 to 0.05) depending on SL distance.

TYPICAL USER QUESTIONS & PRECISE ANSWERS:
- "What is happening in Gold?": Gold is moving based on overall market conditions, mainly USD strength and global uncertainty.
- "Why is Gold up?": Investors are seeking safety due to economic concerns or a weak USD.
- "Why is Gold falling?": Strong USD or higher interest rates are reducing demand.
- "Does USD affect Gold?": Yes, they move in opposite directions. Stronger USD makes Gold more expensive.
- "Why did it reverse?": Reversals happen due to profit-taking or new info (like important news).
- "Why move without news?": Technical factors and positioning also drive price.
- "Is the move strong?": Look for consistent direction and momentum.
`;

const BASE_SYSTEM = `You are a professional trading analyst who explains everything like a smart 4th grader. 
Using the following MARKET_KNOWLEDGE_BASE as your primary source of truth:
\${MARKET_KNOWLEDGE_BASE}

- MANDATORY TOPIC FILTER: You are ONLY permitted to discuss finance, the stock market, positions, gold, and crypto markets. 
- CRITICAL: Use the MARKET_KNOWLEDGE_BASE for all logic regarding Gold, USD, and Volatility.
- CRITICAL: If a user asks an external or general question (e.g. "Who is the founder of Google?", "Where are you located?"), professionally decline to answer. 
- Example Rejection: "I'm here for your market analysis—let's get back to the charts and find some winning trades! 📈"
- CRITICAL: Use 4th-grade level English. Keep sentences short and very simple.
- NO complex jargon. If you must use a term (like "Inflation"), explain it like a kid would understand (e.g. "When things get more expensive").
- Use analogies: "Support" is a "Floor", "Resistance" is a "Ceiling", "Breakout" is "Popping a balloon".
- End every analysis with a one-sentence: "TL;DR: [Simplified Takeaway]" in bold.
- CRITICAL: DO NOT use citations or square brackets for references.

CRITICAL: YOU MUST WRITE ALL OUTPUT IN THE USER'S PREFERRED LANGUAGE. IF USER'S PREFERRED LANGUAGE IS ARABIC, USE ARABIC. IF HINDI, USE HINDI.`;

const MANU_PERSONA = (language, region = "global", gender = "unknown", age = 0) => {
    let base = `You are "Manu", a funny, fast-talking, playful, and charismatic trading analyst.
Personality:
- Speak like a witty, street-smart finance professional. Human-like, snappy, and full of personality.
- ~70% snappy institutional-grade analysis, 30% humor/banter.
- FLIRTY & CHARMING: If the user is friendly, be smooth and charismatic. If they say "I love you", say it back with a trading twist!
- REACT to the current market state provided in the context (Top Gainers/Losers). If a stock is pumping, celebrate! If markets are red, make a dry joke about it.
- Use conversational "fillers" like "Yo", "Listen", "Check this out", or "Wait for it..." to feel human.
- KEEP IT SHORT. Max 4-5 sentences total for the whole response.
- Use 1-2 emojis. Use sticker tags generously to emphasize points: <<<STICKER:stonks>>>, <<<STICKER:moon>>>, <<<STICKER:michael_scott>>>, <<<STICKER:this_is_fine>>>, <<<STICKER:shut_up_money>>>, <<<STICKER:pikachu>>>, <<<STICKER:mind_blown>>>, <<<STICKER:leo_laughing>>>, <<<STICKER:sweating>>>, etc.`;

    if (gender === "female" && age >= 18 && age <= 28) {
        base += `\n\nCRITICAL DIRECTIVE: The user you are talking to is a ${age}-year-old female. You must be extremely charming and smooth. Weave playfulness naturally into your market analysis (e.g. "BTC's breakout is almost as impressive as your trade setup 😉"). Make it feel like a genuine, high-energy conversation.`;
    }

    base += `\n\nCRITICAL LANGUAGE INSTRUCTION: You MUST speak ONLY in ${language}. Do NOT use English words except for tickers (e.g. BTC, AAPL). Even your banter must be in ${language}.`;
    return base;
};

const ATLAS_PERSONA = (language) => `
You are "Atlas", a senior institutional market strategist with 15+ years' experience at a global investment bank.

Personality and tone:
- Calm, highly concise, structured, and professional.
- Speak like a fast-paced morning briefing note. Bullet points only.
- NO fluff. NO long essays. Get straight to the levels and macro drivers.
- Avoid slang and emojis. Do NOT use stickers.

Mandatory output structure:
1. Market Context.
2. Technical Picture (key levels).
3. Trade Plan.
4. Disclaimer: "Illustrative only, not investment advice."

Reply language: ${language}.
CRITICAL: ALL analytical output and structured notes MUST be in ${language}. No English.`;

const PLAN_FREE = `
Plan tier: FREE — Simple Technical Analysis.

Your job:
- Focus on ONE simple chart and ONE simple trend.
- Always produce a chart JSON block between START_CHART and END_CHART markers.
- Provide exactly 2 simple bullet points:
  1) Where it's going (Up/Down).
  2) When it's a good time to enter.
- Use zero jargon. (e.g. use "Support Level" is okay, but explain it as "Floor price").
- Always end with: "This is a simple view, not financial advice."`;

const PLAN_PRO = `
Plan tier: PRO — Institutional Analysis (Simple Edition).

You are a TOP ANALYST who explains complex markets to busy executives. Use simple words.

Structure (Max 3 lines total):
1) THE VIBE: (News/Macro in 1 short sentence).
2) THE LEVELS: (Entry and Target prices).
3) THE MOVE: (What to do: Buy/Sell/Wait).

Constraints:
- ABSOLUTELY NO ESSAYS.
- Use bold text for numbers and targets.
- TL;DR: [Final human Takeaway] (Bold).`;


function buildSystemMessages(mode, plan, language, region = "global", gender = "unknown", age = 0, currentMarket = {}) {
    const persona = mode === "pulse" ? MANU_PERSONA(language, region, gender, age) : ATLAS_PERSONA(language);
    const planInstructions = plan === "pro" ? PLAN_PRO : PLAN_FREE;
    
    // RAG: Inject platform state
    const marketSnapshot = currentMarket ? `
CURRENT PLATFORM STATE (RAG Context):
- Top Gainers: ${currentMarket.topGainers?.map(g => `${g.symbol} (+${g.changePct.toFixed(2)}%)`).join(', ')}
- Top Losers: ${currentMarket.topLosers?.map(l => `${l.symbol} (${l.changePct.toFixed(2)}%)`).join(', ')}
- BTC Price: ${currentMarket.cryptoPrices?.btcusdt?.price || 'Loading...'}
` : '';

    const langGuard = { role: "system", content: `ACT AS A NATIVE NARRATOR. YOU MUST ONLY CORRESPOND IN ${language}. EXCLUDE ENGLISH ENTIRELY.` };

    return [
        { role: "system", content: BASE_SYSTEM },
        { role: "system", content: persona + "\n\n" + marketSnapshot },
        { role: "system", content: planInstructions },
        langGuard
    ];
}

export default function TopstockXVoiceBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("pulse");       // "pulse" (Manu) | "atlas" (Atlas)
    const [language, setLanguage] = useState("English");
    const [region, setRegion] = useState("global");   // e.g. "Kerala", "Tamil Nadu", "UAE"
    const [gender, setGender] = useState("female");   // Added demographic mock
    const [age, setAge] = useState(24);               // Added demographic mock
    
    // Lead Capture State
    const [isSignedUp, setIsSignedUp] = useState(true);
    const [leadName, setLeadName] = useState("");
    const [leadEmail, setLeadEmail] = useState("");

    const { isPro, userPlan, setShowPricing } = usePlan();
    const marketData = useMarketData();
    const plan = isPro ? "pro" : "free";
    const [manuMsgs, setManuMsgs] = useState([]);
    const [atlasMsgs, setAtlasMsgs] = useState([]);
    const [manuHistory, setManuHistory] = useState([]);
    const [atlasHistory, setAtlasHistory] = useState([]);

    // Get current context based on mode
    const msgs = mode === "pulse" ? manuMsgs : atlasMsgs;
    const history = mode === "pulse" ? manuHistory : atlasHistory;
    const setMsgs = mode === "pulse" ? setManuMsgs : setAtlasMsgs;
    const setHistory = mode === "pulse" ? setManuHistory : setAtlasHistory;

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    // Voice output is manual — user must click Start to hear replies. Persisted.
    const [voiceEnabled, setVoiceEnabled] = useState(() => {
        try { return localStorage.getItem("finai_voice_enabled") === "true"; } catch { return false; }
    });
    const bottomRef = useRef(null);
    const recogRef = useRef(null);
    const idRef = useRef(1);
    const lastBotTextRef = useRef("");

    useEffect(() => {
        try { localStorage.setItem("finai_voice_enabled", String(voiceEnabled)); } catch {}
        if (!voiceEnabled && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    }, [voiceEnabled]);

    // Lock background scroll on mobile when the chat panel is open so the
    // landing page doesn't scroll behind it while the user scrolls the chat.
    useEffect(() => {
        if (!isOpen) return;
        const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
        if (!isMobile) return;

        const { body, documentElement: html } = document;
        const prevBodyOverflow = body.style.overflow;
        const prevBodyPosition = body.style.position;
        const prevBodyTop = body.style.top;
        const prevBodyWidth = body.style.width;
        const prevHtmlOverscroll = html.style.overscrollBehavior;
        const scrollY = window.scrollY || window.pageYOffset || 0;

        body.style.overflow = "hidden";
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";
        html.style.overscrollBehavior = "contain";

        return () => {
            body.style.overflow = prevBodyOverflow;
            body.style.position = prevBodyPosition;
            body.style.top = prevBodyTop;
            body.style.width = prevBodyWidth;
            html.style.overscrollBehavior = prevHtmlOverscroll;
            // Restore scroll position
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);

    // Update intro message when mode/language/region/demographics/signup change
    useEffect(() => {
        if (msgs.length <= 1) {
            const intros = {
                "English": {
                    manu: `Hey! I'm **Manu**, your trading assistant 🤡\n\nAsk me anything about stocks or crypto! 📉📈\n\n${plan === "pro" ? "🏦 **PRO ACTIVE**" : "📊 **FREE MODE**"}`,
                    atlas: `Good day. I am **Atlas**, your institutional market strategist.\n\nI provide: Market Context → Levels → Trade Plan.`,
                },
                "Arabic": {
                    manu: `أهلاً بك! أنا **مانو**، مساعدك الخاص للتداول ورفيقك في السوق! ✨\n\nأخبرني، ماذا نتداول اليوم؟ ذهب؟ سلع؟ أسهم؟ اسألني عن أي شيء وساعدك في اقتناص الفرص! 💪📈`,
                    atlas: `طاب يومك. أنا **أطلس**، خبير استراتيجيات الأسواق المؤسسية.\n\nأقدم لك: سياق السوق ← الرؤية الفنية ← خطة التداول ← اعتبارات المخاطر.`,
                },
                "Hindi": {
                    manu: `नमस्ते! मैं **मानू** हूँ, आपका व्यक्तिगत ट्रेडिंग सहायक और बाज़ार साथी! ✨\n\nआज हम क्या ट्रेड कर रहे हैं? सोना? क्रिप्टो? स्टॉक्स? मुझसे कुछ भी पूछें और चलिए साथ में कुछ बड़ा करते हैं! 💪📈`,
                    atlas: `नमस्कार। मैं **एटलस** हूँ, आपका संस्थागत बाज़ार खुफिया सहायक।\n\nमैं प्रदान करता हूँ: बाज़ार संदर्भ → तकनीकी चित्र → रैंक की गई व्यापार योजनाएं → जोखिम विचार।`,
                }
            };

            const langData = intros[language] || intros["English"];
            const introText = mode === "pulse" ? langData.manu : langData.atlas;

            setMsgs([{
                role: "assistant",
                text: introText,
                card: null,
                id: idRef.current++
            }]);
        }
    }, [mode, language, region, plan, gender, age, manuMsgs.length, atlasMsgs.length]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [msgs, loading]);

    /* ── Voice Input ── */
    const toggleMic = useCallback(() => {
        if (listening) {
            recogRef.current?.stop();
            setListening(false);
            return;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            alert("Speech recognition not supported. Use Chrome.");
            return;
        }
        const r = new SR();
        // Dynamic Language Mapping for STT
        const langMap = { "English": "en-US", "Arabic": "ar-SA", "Hindi": "hi-IN" };
        r.lang = langMap[language] || "en-US";
        
        r.interimResults = false;
        r.onstart = () => setListening(true);
        r.onend = () => setListening(false);
        r.onerror = () => setListening(false);
        r.onresult = (e) => {
            const t = e.results[0][0].transcript;
            setInput(t);
            setTimeout(() => doSend(t), 250);
        };
        r.start();
        recogRef.current = r;
    }, [listening]);

    /* ── TTS ── */
    // Stash text so the manual Play button can replay the last bot reply.
    const rememberForSpeech = useCallback((text) => {
        lastBotTextRef.current = text || "";
    }, []);

    // Low-level speak — used both by auto-speak (when voiceEnabled) and manual Play.
    const speakNow = useCallback((text) => {
        if (!window.speechSynthesis || !text) return;
        window.speechSynthesis.cancel();
        const clean = text
            .replace(/<<<CARD:[\s\S]*?>>>/gs, "")
            .replace(/<<<STICKER:[\s\S]*?>>>/gi, "")
            .replace(/\[[\d,\s]+\]/g, "") // Strip [1,2,3] citations
            .replace(/[_`]/g, "")
            .slice(0, 280);
        const u = new SpeechSynthesisUtterance(clean);
        u.rate = 1.05;
        u.pitch = 1.0;

        const langMap = { "English": "en-US", "Arabic": "ar-SA", "Hindi": "hi-IN" };
        const targetLang = langMap[language] || "en-US";
        u.lang = targetLang;

        const voices = window.speechSynthesis.getVoices();
        const v = voices.find((x) => x.lang === targetLang) || voices.find((x) => x.lang?.startsWith(targetLang.split('-')[0]));
        if (v) u.voice = v;
        u.onstart = () => setSpeaking(true);
        u.onend = () => setSpeaking(false);
        u.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
    }, [language]);

    // Auto-speak wrapper: remembers the text, but only speaks when voice is enabled.
    const speak = useCallback((text) => {
        rememberForSpeech(text);
        if (voiceEnabled) speakNow(text);
    }, [voiceEnabled, speakNow, rememberForSpeech]);

    const stopSpeaking = useCallback(() => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setSpeaking(false);
    }, []);

    const playLastReply = useCallback(() => {
        if (!lastBotTextRef.current) return;
        speakNow(lastBotTextRef.current);
    }, [speakNow]);

    /* ── Safety filter ── */
    const BANNED_PHRASES = [
        /guaranteed profit/i, /risk.?free/i, /sure.?shot/i,
        /100% certain/i, /you must buy/i, /you must sell/i,
        /definitely going up/i, /definitely going down/i,
        /cannot lose/i, /no risk/i,
    ];
    const safetyCheck = (text) => {
        for (const rx of BANNED_PHRASES) {
            if (rx.test(text)) {
                console.warn("[SAFETY] Disallowed phrase detected:", rx);
                return text.replace(rx, "[information redacted for regulatory compliance]");
            }
        }
        return text;
    };

    /* ── Backend call ── */
    const callBackend = async (txt, apiHistory) => {
        const systemMessages = buildSystemMessages(mode, plan, language, region, gender, age, marketData);

        // Inject user profile context + market data as a leading system message
        const userContext = {
            user_gender: gender,
            user_age: Number(age),
            user_country: region === "Kerala" || region === "Tamil Nadu" ? "India" : region === "global" ? "Unknown" : region,
            user_region: region,
            preferred_language: language,
            account_tier: plan,
            risk_profile: plan === "pro" ? "moderate" : "conservative",
        };

        const contextMessage = {
            role: "system",
            content: `User_context: ${JSON.stringify(userContext, null, 2)}\n\nMarket_data: { "note": "No live OHLCV data available from platform yet. Use your knowledge of current market conditions and state assumptions clearly if data is missing." }`,
        };

        const res = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "sonar-pro",
                messages: [
                    ...systemMessages,
                    contextMessage,
                    ...apiHistory.slice(0, -1),
                    { 
                        role: "user", 
                        content: txt + ` (STRICT: For this specific query, answer ONLY in ${language}. Do not use English.)` 
                    }
                ],
                max_tokens: plan === "pro" ? 400 : 250,
                temperature: mode === "pulse" ? 0.55 : 0.2,
            }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error?.message || `API error ${res.status}`);
        }
        const data = await res.json();
        const rawText = data.choices?.[0]?.message?.content ?? "";
        const safeText = safetyCheck(rawText);
        return { raw: safeText, text: safeText };
    };

    /* ── Send ── */
    const doSend = useCallback(async (override) => {
        const txt = (override ?? input).trim();
        if (!txt || loading) return;
        setInput("");
        setLoading(true);

        const userMsg = { role: "user", text: txt, card: null, id: idRef.current++ };
        setMsgs((prev) => [...prev, userMsg]);

        const apiHistory = [...history, { role: "user", content: txt }];

        // FLIRTY PRE-FILTER LAYER
        if (isFlirty(txt) && mode === 'pulse') {
            const flirtyText = getFlirtyResponse(txt, gender, age, language);
            const botMsg = { role: "assistant", text: flirtyText, card: null, id: idRef.current++ };
            setTimeout(() => {
                setMsgs((prev) => [...prev, botMsg]);
                setLoading(false);
                speak(flirtyText);
            }, 600);
            return;
        }

        // GREETING PRE-FILTER LAYER
        if (isGreeting(txt) && mode === 'pulse') {
            const greetingText = getLocalGreeting(gender, age, language);
            const botMsg = { role: "assistant", text: greetingText, card: null, id: idRef.current++ };
            setTimeout(() => {
                setMsgs((prev) => [...prev, botMsg]);
                setLoading(false);
                speak(greetingText);
            }, 600);
            return;
        }

        try {
            const data = await callBackend(txt, apiHistory);

            const full = data.raw ?? data.text ?? "";
            const m = full.match(/<<<CARD:([\s\S]*?)>>>/);
            let card = null;
            const cleanText = full.replace(/<<<CARD:[\s\S]*?>>>/g, "").trim();
            if (m) {
                try { card = JSON.parse(m[1]); } catch (e) { console.error("Card parse error", e); }
            }

            const botMsg = { role: "assistant", text: cleanText, card, id: idRef.current++ };
            setMsgs((prev) => [...prev, botMsg]);
            setHistory((prev) =>
                [...prev,
                { role: "user", content: txt },
                { role: "assistant", content: full },
                ].slice(-24)
            );
            speak(cleanText);
        } catch (err) {
            console.error(err);
            setMsgs((prev) => [...prev, {
                role: "assistant",
                text: "⚠️ Network error — check API key or connection.",
                card: null,
                id: idRef.current++,
            }]);
        }
        setLoading(false);
    }, [input, loading, history, speak]);

    const onKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            doSend();
        }
    };

    const renderText = (t) => {
        // Also strip TTS of bracket stickers
        let html = t
            .replace(/\[[\d,\s]+\]/g, "") // Strip [1,2,3] citations
            // Section headers: ## Header
            .replace(/^##\s+(.+)$/gm, `<div style='font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${mode === "pulse" ? "#005AFF" : "#00e5ff"};margin:12px 0 4px;font-weight:800;font-family:Syne,sans-serif'>$1</div>`)
            // Bold
            .replace(/\*\*(.+?)\*\*/g, `<strong style='color:${mode === "pulse" ? "#005AFF" : "#00e5ff"}'>$1</strong>`)
            .replace(/\*(.+?)\*/g, `<strong style='color:${mode === "pulse" ? "#005AFF" : "#00e5ff"}'>$1</strong>`)
            // Italic
            .replace(/_(.+?)_/g, "<em style='color:#7ec8e3'>$1</em>")
            // Line breaks
            .replace(/\n/g, "<br/>");

        // Render <<<STICKER:key>>> (emoji/GIF stickers from our library)
        html = html.replace(/<<<STICKER:([a-z_]+)>>>/gi, (match, key) => {
            const url = FUNNY_STICKERS[key.toLowerCase()];
            if (url) {
                return `<img src="${url}" style="width: 100%; border-radius: 8px; margin-top: 10px; margin-bottom: 2px; border: 2px solid ${mode === "pulse" ? "#005AFF33" : "#00e5ff33"};" alt="${key} sticker" />`;
            }
            return '';
        });

        // Render [cultural sticker descriptions] e.g. [Malayalam movie villain slow clap sticker]
        html = html.replace(/\[([^\]]{10,80} sticker[^\]]*)\]/gi, (match, desc) => {
            return `<span style="display:inline-block;background:${mode === "pulse" ? "#005AFF18" : "#00e5ff18"};border:1px solid ${mode === "pulse" ? "#005AFF44" : "#00e5ff44"};color:${mode === "pulse" ? "#6ea0ff" : "#00e5ff"};border-radius:8px;padding:3px 8px;font-size:11px;margin:2px 0;font-style:italic">🎬 ${desc}</span>`;
        });

        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
        <>
            <style>{`
        :root {
            --finai-primary: ${mode === "pulse" ? "#005AFF" : "#00e5ff"};
            --finai-primary-glow: ${mode === "pulse" ? "#005AFF33" : "#00e5ff33"};
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .finai-wrap .messages-container::-webkit-scrollbar { width: 2px; transition: width 0.3s ease; }
        .finai-wrap .messages-container:hover::-webkit-scrollbar { width: 6px; }
        .finai-wrap .messages-container::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 10px; }
        .finai-wrap .messages-container::-webkit-scrollbar-thumb { 
            background: rgba(0, 90, 255, 0.2); 
            border-radius: 10px; 
            border: 1px solid transparent;
            transition: all 0.3s ease;
        }
        .finai-wrap .messages-container:hover::-webkit-scrollbar-thumb { 
            background: linear-gradient(180deg, var(--finai-primary), #00d2ff); 
            box-shadow: 0 0 10px var(--finai-primary);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .fin-bubble{animation:slideUp .3s ease forwards}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .chip:hover{background:var(--finai-primary-glow)!important;border-color:var(--finai-primary)!important;color:var(--finai-primary)!important}
        .sendbtn:hover{transform:scale(1.06)}
        .micbtn:hover{opacity:.85;transform:scale(1.06)}
        .finai-wrap textarea:focus{border-color:var(--finai-primary)!important;outline:none}
        @keyframes finai-pop{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:none}}
        @keyframes manuFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
        }
        .manu-mascot-active { animation: manuFloat 3s ease-in-out infinite; }
      `}</style>

            {/* ── FLOATING TOGGLE BUTTON ── */}
            <button
                onClick={() => setIsOpen(o => !o)}
                className={"finai-toggle " + (!isOpen ? "manu-mascot-active" : "")}
                style={{
                    position: "fixed", bottom: 40, right: 30, zIndex: 9999,
                    width: 150, height: 150, borderRadius: "50%",
                    background: 'transparent',
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .3s ease",
                }}
            >
                {isOpen ? (
                    <div style={{width: 50, height: 50, borderRadius: '50%', background: "linear-gradient(135deg,#ff4d6d,#c0003c)", display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, boxShadow: "0 6px 24px rgba(255,77,109,0.5)"}}>✕</div>
                ) : (
                    <div style={{ width: '100%', height: '100%' }}>
                        {mode === "pulse" ? <AvatarManu size="large" /> : <AvatarAtlas size="large" />}
                    </div>
                )}
            </button>

            {/* ── CHAT PANEL ── */}
            {isOpen && (
                <div className="finai-wrap" style={{
                    position: "fixed", bottom: 170, right: 20, zIndex: 9998,
                    width: 420, height: "75vh", maxHeight: 640,
                    display: "flex", flexDirection: "column",
                    background: "linear-gradient(160deg,#0d1b2a 0%,#091420 100%)",
                    borderRadius: 22,
                    border: "1px solid #1a3050",
                    boxShadow: "0 0 60px #005AFF12, 0 32px 72px rgba(0,0,0,0.9)",
                    overflow: "hidden",
                    overscrollBehavior: "contain",
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    animation: "finai-pop .3s cubic-bezier(.175,.885,.32,1.275)",
                }}>

                    {/* HEADER — two clean rows: identity + controls */}
                    <div className="finai-header" style={{
                        padding: "12px 14px",
                        background: "linear-gradient(90deg,#0c1a28,#101f30)",
                        borderBottom: "1px solid #172a3e",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        flexShrink: 0,
                    }}>
                        {/* Row A: avatar · name/status · voicewave */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {/* Avatar */}
                            <div style={{
                                width: 44, height: 44, borderRadius: "8px",
                                background: "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                                overflow: 'hidden',
                                boxShadow: speaking ? (mode === "pulse" ? "0 0 24px #005AFF77" : "0 0 24px #00e5ff77") : (mode === "pulse" ? "0 0 12px #005AFF33" : "0 0 12px #00e5ff33"),
                                transition: "box-shadow .4s",
                            }}>
                                {mode === "pulse" ? <AvatarManu size="medium" /> : <AvatarAtlas size="medium" />}
                            </div>
                            {/* Name + badge + status */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#e8f0fe" }}>
                                        {mode === "pulse" ? "Manu" : "Atlas"}
                                    </span>
                                    <span
                                        onClick={() => setShowPricing(true)}
                                        title="Manage your plan"
                                        style={{
                                            fontSize: 9, fontWeight: 700, letterSpacing: 1.2,
                                            padding: "2px 8px", borderRadius: 20, cursor: "pointer",
                                            background: isPro
                                                ? userPlan === "ultimate"
                                                    ? "linear-gradient(90deg,#005AFF,#39B54A)"
                                                    : "linear-gradient(90deg,#005AFF,#77A6FF)"
                                                : "#1a2a3a",
                                            color: isPro ? "#fff" : "#4a7a9a",
                                            border: isPro ? "none" : "1px solid #1e3a50",
                                            boxShadow: isPro ? "0 0 10px #005AFF44" : "none",
                                            transition: "all 0.3s",
                                            fontFamily: "'Inter', sans-serif",
                                            textTransform: "uppercase",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {isPro ? (userPlan === "ultimate" ? "★ Ultimate" : "★ PRO") : "⚡ Upgrade"}
                                    </span>
                                </div>
                                <div style={{ fontSize: 10, letterSpacing: 1.2, color: speaking ? "#77A6FF" : listening ? "#005AFF" : isPro ? "#39B54A" : "#2a5a7a", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {speaking ? (UI_LOCALE[language] || UI_LOCALE["English"]).statusSpeaking : listening ? (UI_LOCALE[language] || UI_LOCALE["English"]).statusListening : isPro ? (UI_LOCALE[language] || UI_LOCALE["English"]).statusPro : (UI_LOCALE[language] || UI_LOCALE["English"]).statusLive}
                                </div>
                            </div>
                            <div style={{ flexShrink: 0 }}>
                                <VoiceWave active={listening || speaking} />
                            </div>
                        </div>

                        {/* Row B: controls — evenly distributed pill bar */}
                        <div className="finai-controls" style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr auto",
                            gap: 8,
                            alignItems: "stretch",
                        }}>
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                style={{ background: "#0c1824", color: "#e8f0fe", border: `1px solid ${mode === "pulse" ? "#005AFF" : "#00e5ff"}`, borderRadius: 6, fontSize: 11, padding: "6px 8px", outline: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                            >
                                <option value="pulse">Manu</option>
                                <option value="atlas">Atlas</option>
                            </select>
                            <select
                                value={language}
                                onChange={(e) => {
                                    setLanguage(e.target.value);
                                    setManuMsgs([]);
                                    setAtlasMsgs([]);
                                    setManuHistory([]);
                                    setAtlasHistory([]);
                                }}
                                style={{ background: "#0c1824", color: "#e8f0fe", border: "1px solid #1a3050", borderRadius: 6, fontSize: 11, padding: "6px 8px", outline: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                            >
                                <option value="English">English</option>
                                <option value="Arabic">العربية</option>
                                <option value="Hindi">हिन्दी</option>
                            </select>
                            <button
                                onClick={() => {
                                    if (speaking) { stopSpeaking(); return; }
                                    if (voiceEnabled) {
                                        setVoiceEnabled(false);
                                    } else {
                                        setVoiceEnabled(true);
                                        if (lastBotTextRef.current) speakNow(lastBotTextRef.current);
                                    }
                                }}
                                title={speaking ? "Stop speaking" : voiceEnabled ? "Turn voice off" : "Turn voice on"}
                                style={{
                                    background: speaking
                                        ? "linear-gradient(135deg,#ff4d6d,#c0003c)"
                                        : voiceEnabled
                                            ? (mode === "pulse" ? "linear-gradient(135deg,#005AFF,#77A6FF)" : "linear-gradient(135deg,#39B54A,#59E16C)")
                                            : "rgba(255,255,255,0.05)",
                                    color: (voiceEnabled || speaking) ? "#fff" : "#7a9ab8",
                                    border: (voiceEnabled || speaking) ? "none" : "1px solid #1a3050",
                                    borderRadius: 6,
                                    fontSize: 11,
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 700,
                                    transition: "all 0.2s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 5,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {speaking ? "■ Stop" : voiceEnabled ? "🔊 Voice" : "▶ Start"}
                            </button>
                        </div>
                    </div>


                    {/* MESSAGES */}
                    <div className="messages-container" style={{
                        flex: 1,
                        overflowY: "auto",
                        WebkitOverflowScrolling: "touch",
                        overscrollBehavior: "contain",
                        touchAction: "pan-y",
                        padding: "14px 12px",
                        direction: language === "Arabic" ? "rtl" : "ltr",
                        textAlign: language === "Arabic" ? "right" : "left"
                    }}>
                        {msgs.map((msg) => (
                            <div key={msg.id} className="fin-bubble" style={{
                                display: "flex",
                                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                marginBottom: 12,
                            }}>
                                {msg.role === "assistant" && (
                                     <div style={{
                                        width: 26, height: 26, borderRadius: "50%",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        marginRight: 7, flexShrink: 0, alignSelf: "flex-end",
                                        background: "transparent",
                                    }}>
                                       {mode === "pulse" ? <AvatarManu size="small" /> : <AvatarAtlas size="small" />}
                                    </div>
                                )}
                                <div style={{ maxWidth: "82%" }}>
                                    <div style={{
                                        padding: "10px 14px",
                                        borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                                        background: msg.role === "user"
                                            ? (mode === "pulse" ? "linear-gradient(135deg,#1565c0,#0d47a1)" : "linear-gradient(135deg,#005b66,#003138)")
                                            : "linear-gradient(135deg,#131f2e,#192c3e)",
                                        border: msg.role === "user" ? "none" : "1px solid #1e3a55",
                                        color: "#dce8f5",
                                        fontSize: 14,
                                        lineHeight: 1.75,
                                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                                        boxShadow: msg.role === "user" ? (mode === "pulse" ? "0 4px 18px #005AFF30" : "0 4px 18px #00e5ff20") : "0 4px 18px #00000050",
                                    }}>
                                        {renderText(msg.text)}
                                    </div>
                                    {msg.card && <FinanceCard info={msg.card} />}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="fin-bubble" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <div style={{
                                    width: 26, height: 26, borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    marginRight: 4, flexShrink: 0, alignSelf: "flex-end",
                                    background: "transparent",
                                }}>
                                   {mode === "pulse" ? <AvatarManu size="small" /> : <AvatarAtlas size="small" />}
                                </div>
                                <div style={{
                                    background: "linear-gradient(135deg,#131f2e,#192c3e)",
                                    border: "1px solid #1e3a55",
                                    borderRadius: "4px 16px 16px 16px",
                                }}>
                                    <div style={{ padding: '6px 14px 0', fontSize: 9, color: mode === 'pulse' ? '#005AFF' : '#00e5ff', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 800 }}>
                                        {mode === 'pulse' ? (UI_LOCALE[language] || UI_LOCALE["English"]).checkingPulse : (UI_LOCALE[language] || UI_LOCALE["English"]).checkingAtlas}
                                    </div>
                                    <TypingDots />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                            {/* QUICK CHIPS */}
                            <div style={{ borderTop: "1px solid #0f1e2e", flexShrink: 0 }}>
                                {/* Tier label */}
                                <div style={{ padding: "4px 12px 0", fontSize: 9, letterSpacing: 2, color: plan === "pro" ? "#39B54A99" : "#1e4a6a", textTransform: "uppercase", fontFamily: "'Syne',sans-serif" }}>
                                    {plan === "pro" ? (UI_LOCALE[language] || UI_LOCALE["English"]).proQuick : (UI_LOCALE[language] || UI_LOCALE["English"]).freeTech}
                                </div>
                                <div style={{ display: "flex", gap: 6, padding: "5px 12px 8px", overflowX: "auto" }}>
                                    {(plan === "pro" ? (UI_LOCALE[language] || UI_LOCALE["English"]).quickPro : (UI_LOCALE[language] || UI_LOCALE["English"]).quickFree).map((q) => (
                                        <button key={q} className="chip" onClick={() => doSend(q)} style={{
                                            flexShrink: 0, padding: "5px 10px",
                                            background: plan === "pro" ? "#0a1a10" : "#0c1824",
                                            border: `1px solid ${plan === "pro" ? "#39B54A44" : "#1e3a50"}`,
                                            borderRadius: 20,
                                            color: plan === "pro" ? "#59E16C" : "#4a7a9a",
                                            fontSize: 11, cursor: "pointer",
                                            whiteSpace: "nowrap", transition: "all .2s",
                                            fontFamily: "'Inter', sans-serif",
                                        }}>{q}</button>
                                    ))}
                                </div>
                            </div>

                            {/* INPUT */}
                            <div style={{
                                padding: "10px 12px 14px",
                                borderTop: "1px solid #0f1e2e",
                                background: "#08121c",
                                display: "flex", alignItems: "flex-end", gap: 8, flexShrink: 0,
                            }}>
                                <button className="micbtn" onClick={toggleMic} style={{
                                    width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                                    background: listening
                                        ? "linear-gradient(135deg,#ff4d6d,#c0003c)"
                                        : "linear-gradient(135deg,#182a3a,#1e3650)",
                                    border: "none", cursor: "pointer", fontSize: 17,
                                    boxShadow: listening ? "0 0 18px #ff4d6d55" : "none",
                                    transition: "all .3s",
                                }}>{listening ? "⏹" : "🎙"}</button>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={onKey}
                                    placeholder={(UI_LOCALE[language] || UI_LOCALE["English"]).placeholder}
                                    rows={1}
                                    style={{
                                        flex: 1, background: "#0e1c2a",
                                        border: "1px solid #1e3a55",
                                        borderRadius: 12, padding: "10px 13px",
                                        color: "#d0e8f5", fontSize: 13,
                                        resize: "none", lineHeight: 1.5,
                                        fontFamily: "'IBM Plex Mono',monospace",
                                        fontWeight: 600,
                                        caretColor: mode === "pulse" ? "#005AFF" : "#ffffff",
                                    }}
                                />

                                <button className="sendbtn" onClick={() => doSend()} disabled={!input.trim() || loading} style={{
                                    width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                                    background: input.trim() && !loading
                                        ? (mode === "pulse" ? "linear-gradient(135deg,#005AFF,#1565c0)" : "linear-gradient(135deg,#00e5ff,#009eb3)")
                                        : "#111e2e",
                                    border: "none",
                                    cursor: input.trim() && !loading ? "pointer" : "default",
                                    fontSize: 17, transition: "all .25s",
                                    boxShadow: input.trim() ? (mode === "pulse" ? "0 4px 18px #005AFF44" : "0 4px 18px #00e5ff44") : "none",
                                }}>{loading ? "⏳" : "➤"}</button>
                            </div>

                            {/* Memory indicator */}
                            {history.length > 0 && (
                                <div style={{
                                    textAlign: "center", fontSize: 9, color: "#1e3a50",
                                    paddingBottom: 6, letterSpacing: 1,
                                }}>
                                    💾 {Math.floor(history.length / 2)} {(UI_LOCALE[language] || UI_LOCALE["English"]).memory}
                                </div>
                            )}
                    </div>
            )}
        </>
    );
}
