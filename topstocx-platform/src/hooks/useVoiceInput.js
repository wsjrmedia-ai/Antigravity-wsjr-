/**
 * useVoiceInput — a thin wrapper around the browser's Speech Recognition
 * API, tuned for trading-desk queries.
 *
 * Why not just use the API directly everywhere? Three reasons:
 *   1. Vendor prefixes: Chrome/Edge expose `webkitSpeechRecognition`,
 *      Safari exposes `SpeechRecognition`, Firefox exposes nothing.
 *      Callers shouldn't have to care.
 *   2. Lifecycle: we need to cleanly stop + abort on unmount, or the
 *      mic indicator stays on forever.
 *   3. Trading-vocabulary correction: the recognizer loves to hear
 *      "Tesla" as "Tessler", "NVDA" as "N video", "BTC" as "bitsy".
 *      We post-process with a small fuzzy-replace pass so downstream
 *      intent routing sees clean tickers.
 *
 * Contract:
 *   const { supported, listening, transcript, start, stop, error } =
 *     useVoiceInput({ onFinal, lang });
 *
 *   `transcript`  — live interim + final text, updates while speaking
 *   `onFinal(text)` — fires once when the recognizer commits a final
 *                    segment (user paused, or stop() was called)
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// Trading-desk phonetic → ticker corrections. Applied LAST so the
// raw transcript stays visible to the user while the corrected
// version is what we hand to the intent router.
const VOCAB_FIXES = [
  [/\b(bit\s*coin|bitcoin)\b/gi, 'bitcoin'],
  [/\b(ethereum|ether|e\s*t\s*h)\b/gi, 'ETH'],
  [/\bin\s*video\b/gi, 'NVDA'],
  [/\bn\s*vidia\b/gi, 'NVDA'],
  [/\btesla\b/gi, 'TSLA'],
  [/\bapple\b/gi, 'AAPL'],
  [/\bmicrosoft\b/gi, 'MSFT'],
  [/\bamazon\b/gi, 'AMZN'],
  [/\bgoogle\b/gi, 'GOOGL'],
  [/\bmeta\b/gi, 'META'],
  [/\bsolana\b/gi, 'SOL'],
  // "US session", "us dollar index" etc: leave alone.
];

function applyVocabFixes(text) {
  let out = text;
  for (const [re, sub] of VOCAB_FIXES) out = out.replace(re, sub);
  return out;
}

function getRecognitionCtor() {
  if (typeof window === 'undefined') return null;
  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null
  );
}

export function useVoiceInput({ onFinal, lang = 'en-US' } = {}) {
  const Ctor = getRecognitionCtor();
  const supported = !!Ctor;

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const finalBufferRef = useRef('');
  // Stable ref to the onFinal callback so changes don't force us to
  // tear down and re-create the recognizer mid-session.
  const onFinalRef = useRef(onFinal);
  useEffect(() => { onFinalRef.current = onFinal; }, [onFinal]);

  const start = useCallback(() => {
    if (!supported) {
      setError('Voice input not supported in this browser.');
      return;
    }
    if (recognitionRef.current) return; // already running

    try {
      const rec = new Ctor();
      rec.continuous = false;          // one utterance at a time
      rec.interimResults = true;        // show text as they speak
      rec.lang = lang;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setListening(true);
        setError(null);
        finalBufferRef.current = '';
        setTranscript('');
      };

      rec.onresult = (event) => {
        // Walk through results; concat finals, surface interim.
        let interim = '';
        let final = finalBufferRef.current;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const t = result[0]?.transcript ?? '';
          if (result.isFinal) final += t;
          else interim += t;
        }
        finalBufferRef.current = final;
        setTranscript(applyVocabFixes((final + interim).trim()));
      };

      rec.onerror = (event) => {
        // `no-speech` is a benign timeout; don't treat it as a real error.
        if (event.error === 'no-speech' || event.error === 'aborted') return;
        setError(event.error || 'Voice error');
      };

      rec.onend = () => {
        setListening(false);
        recognitionRef.current = null;
        const final = applyVocabFixes(finalBufferRef.current.trim());
        if (final) {
          try { onFinalRef.current?.(final); } catch {}
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      setError(e.message || 'Failed to start voice input.');
      recognitionRef.current = null;
    }
  }, [supported, Ctor, lang]);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try { rec.stop(); } catch {}
  }, []);

  // On unmount, abort outright — no need to fire onFinal for a
  // screen the user is leaving.
  useEffect(() => () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try { rec.abort(); } catch {}
    recognitionRef.current = null;
  }, []);

  return { supported, listening, transcript, start, stop, error };
}
