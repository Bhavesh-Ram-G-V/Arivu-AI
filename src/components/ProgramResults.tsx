import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  FileText,
  Gift,
  Loader2,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  Square,
  UserCheck,
  Users,
  Volume2,
} from 'lucide-react';
import { ArivuResponse } from '../types/arivu';

interface ProgramResultsProps {
  data: ArivuResponse;
  onReset: () => void;
}

function toShortBullets(input: string[] | string | undefined): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((item) => item.trim()).filter(Boolean);
  }
  return input
    .split(/(?:\n+|•|;|\.(?=\s+))/)
    .map((item) => item.replace(/^[-•*\s]+/, '').trim())
    .filter(Boolean);
}

function toSpokenLines(text: string): string[] {
  return text
    .split(/(?<=[.!?।])\s+|\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function formatForNaturalTamilSpeech(text: string): string {
  // Remove parenthetical English brackets, slashes, and English words so Tamil TTS pauses naturally
  const cleaned = text
    .replace(/\([^)]*\)/g, '')
    .replace(/\s*\/\s*/g, ', ')
    .replace(/[A-Za-z]+/g, '')
    .replace(/[।|]/g, '.')
    .replace(/\s*,\s*,+/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => {
      const body = sentence.replace(/[.!?]+$/g, '').trim();
      if (!body) return '';
      const commaParts = body.split(',').map((p) => p.trim()).filter(Boolean);
      const punctuated = commaParts.map((part) => {
        const words = part.split(/\s+/);
        if (words.length <= 7) return part;
        const chunks: string[] = [];
        for (let i = 0; i < words.length; i += 5) {
          chunks.push(words.slice(i, i + 5).join(' '));
        }
        return chunks.join(', ');
      });
      return `${punctuated.join(', ')}.`;
    })
    .filter(Boolean);

  return sentences.slice(0, 3).join(' ');
}

export const ProgramResults: React.FC<ProgramResultsProps> = ({
  data,
  onReset,
}) => {
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [audioNote, setAudioNote] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pauseTimerRef = useRef<number | null>(null);

  const spokenLines = useMemo(
    () => toSpokenLines(formatForNaturalTamilSpeech(data.spoken_explanation_tamil)),
    [data.spoken_explanation_tamil],
  );

  const stopAudio = () => {
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAudioState('idle');
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [data]);

  const speakWithBrowserFallback = (rawText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioNote('ஒலி வசதி இல்லை. கீழே உள்ள வரிகளைப் படிக்கவும்.');
      setAudioState('idle');
      return;
    }

    window.speechSynthesis.cancel();
    const speechFriendlyText = formatForNaturalTamilSpeech(rawText);
    const sentences = toSpokenLines(speechFriendlyText);

    if (sentences.length === 0) {
      setAudioState('idle');
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const tamilVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('ta-in')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('ta'));

    setAudioState('playing');

    let index = 0;
    const speakNext = () => {
      if (index >= sentences.length) {
        setAudioState('idle');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentences[index]);
      utterance.lang = 'ta-IN';
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        index += 1;
        if (index < sentences.length) {
          pauseTimerRef.current = window.setTimeout(speakNext, 160);
        } else {
          setAudioState('idle');
        }
      };
      utterance.onerror = () => {
        setAudioState('idle');
        setAudioNote('ஒலி இயக்க முடியவில்லை. கீழே உள்ள வரிகளைப் படிக்கவும்.');
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const handleExplainResult = async () => {
    if (audioState === 'playing') {
      stopAudio();
      return;
    }

    setAudioNote(null);
    setAudioState('loading');

    const speechFriendlyText = formatForNaturalTamilSpeech(data.spoken_explanation_tamil);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speechFriendlyText }),
      });

      if (!response.ok) {
        throw new Error('TTS service unavailable');
      }

      const result = await response.json();
      if (!result.audioBase64) {
        throw new Error('Empty audio payload');
      }

      const audio = new Audio(
        `data:${result.mimeType || 'audio/wav'};base64,${result.audioBase64}`,
      );
      audioRef.current = audio;
      audio.onended = () => {
        setAudioState('idle');
        audioRef.current = null;
      };
      audio.onerror = () => {
        audioRef.current = null;
        speakWithBrowserFallback(data.spoken_explanation_tamil);
      };

      await audio.play();
      setAudioState('playing');
    } catch {
      speakWithBrowserFallback(data.spoken_explanation_tamil);
    }
  };

  return (
    <section aria-label="Recommended Government Programs" className="space-y-8">
      {/* Summary & Explain My Result Card */}
      <div className="cushion-card rounded-[2rem] p-6 sm:p-9">
        <p className="text-base font-bold text-[#006a6a]">
          உங்களுக்கான வழிகாட்டுதல் · Your Guide
        </p>
        <h2 className="mt-2 text-2xl sm:text-[28px] font-bold leading-snug text-[#1f1b18]">
          {data.summary_tamil}
        </h2>

        <div className="mt-7 flex flex-col gap-5">
          <button
            type="button"
            onClick={handleExplainResult}
            disabled={audioState === 'loading'}
            className={`tactile-push inline-flex min-h-[70px] w-full sm:w-auto sm:self-start items-center justify-center gap-3.5 rounded-full px-8 py-4 text-xl font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 cursor-pointer ${
              audioState === 'playing'
                ? 'breathing-ring-teal bg-[#2b8282] hover:bg-[#006a6a]'
                : 'breathing-ring bg-[#d95d39] hover:bg-[#a43716]'
            }`}
          >
            {audioState === 'loading' ? (
              <>
                <Loader2 className="h-7 w-7 animate-spin shrink-0" aria-hidden="true" />
                <span>ஒலி தயாராகிறது...</span>
              </>
            ) : audioState === 'playing' ? (
              <>
                <Square className="h-6 w-6 fill-current shrink-0" aria-hidden="true" />
                <span>ஒலியை நிறுத்தவும் · Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="h-7 w-7 shrink-0" aria-hidden="true" />
                <span>Explain My Result · விளக்கத்தைக் கேளுங்கள்</span>
              </>
            )}
          </button>

          {audioNote && (
            <p className="text-base font-semibold text-[#a43716]" role="status">
              {audioNote}
            </p>
          )}

          {/* Short, scannable next-step lines (No Paragraphs) */}
          <div className="rounded-3xl bg-[#fbf2ed] p-5 sm:p-6">
            <div className="text-base font-bold text-[#58423c]">
              அடுத்த படிகள் · Next Steps
            </div>
            <ul className="mt-3 space-y-2.5">
              {spokenLines.map((line, lineIdx) => (
                <li
                  key={`${lineIdx}-${line.slice(0, 12)}`}
                  className="flex items-start gap-3 text-lg leading-snug text-[#1f1b18]"
                >
                  <Volume2
                    className="mt-1 h-5 w-5 shrink-0 text-[#a43716]"
                    aria-hidden="true"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Program Cards — Strictly 6 scannable fields with short bullet points & icons */}
      <div className="space-y-7">
        {data.programs.map((program, idx) => {
          const eligibilityBullets = toShortBullets(program.eligibility_tamil);
          const benefitBullets = toShortBullets(program.free_benefits_tamil);

          return (
            <article
              key={`${program.title_tamil}-${idx}`}
              className="cushion-card rounded-[2rem] p-6 sm:p-9"
            >
              {/* 1. Title */}
              <div className="pb-5 border-b border-[#f0e6e1]">
                <div className="text-base font-bold text-[#a43716]">
                  திட்டம் {idx + 1} · Title · 100% இலவசம்
                </div>
                <h3 className="mt-1.5 text-2xl sm:text-[26px] font-bold leading-snug text-[#1f1b18]">
                  {program.title_tamil}
                </h3>
              </div>

              {/* 2. Who Can Join & 3. Free Benefits (Short bullet points with icons) */}
              <div className="grid grid-cols-1 gap-6 py-6 border-b border-[#f0e6e1] md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-base font-bold text-[#58423c]">
                    <Users className="h-5 w-5 text-[#2b8282] shrink-0" aria-hidden="true" />
                    <span>யார் சேரலாம் · Who Can Join</span>
                  </div>
                  <ul className="space-y-2.5">
                    {eligibilityBullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-2.5 text-lg leading-snug text-[#1f1b18]"
                      >
                        <Check
                          className="mt-1 h-5 w-5 shrink-0 text-[#2b8282]"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-base font-bold text-[#58423c]">
                    <Gift className="h-5 w-5 text-[#a43716] shrink-0" aria-hidden="true" />
                    <span>இலவச சலுகைகள் · Free Benefits</span>
                  </div>
                  <ul className="space-y-2.5">
                    {benefitBullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-2.5 text-lg leading-snug text-[#1f1b18]"
                      >
                        <Check
                          className="mt-1 h-5 w-5 shrink-0 text-[#a43716]"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 4. Where to Go & 5. Whom to Contact */}
              <div className="my-6 rounded-3xl bg-[#fbf2ed] p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 text-base font-bold text-[#a43716]">
                      <Building2 className="h-6 w-6 shrink-0" aria-hidden="true" />
                      <span>எங்கு செல்ல வேண்டும் · Where to Go</span>
                    </div>
                    <p className="text-xl font-bold leading-snug text-[#1f1b18]">
                      {program.where_to_go_tamil}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 text-base font-bold text-[#006a6a]">
                      <UserCheck className="h-6 w-6 shrink-0" aria-hidden="true" />
                      <span>யாரைச் சந்திக்க வேண்டும் · Whom to Contact</span>
                    </div>
                    <p className="text-xl font-bold leading-snug text-[#1f1b18]">
                      {program.whom_to_contact_tamil}
                    </p>
                  </div>
                </div>
              </div>

              {/* 6. Documents to Carry */}
              <div className="pt-2">
                <div className="flex items-center gap-2.5 text-base font-bold text-[#58423c]">
                  <FileText className="h-5 w-5 text-[#2b8282] shrink-0" aria-hidden="true" />
                  <span>எடுத்துச் செல்ல வேண்டியவை · Documents to Carry</span>
                </div>
                <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {program.documents_to_carry_tamil.map((doc, docIndex) => (
                    <li
                      key={`${doc}-${docIndex}`}
                      className="flex items-center gap-3 rounded-2xl bg-[#fff8f5] px-4 py-3 text-lg font-semibold text-[#1f1b18]"
                    >
                      <CheckCircle2
                        className="h-6 w-6 shrink-0 text-[#2b8282]"
                        aria-hidden="true"
                      />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      {/* Helpline & New Search Card */}
      <div className="cushion-card rounded-[2rem] p-6 sm:p-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-base font-bold text-[#006a6a]">
              <PhoneCall className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span>அரசு உதவி எண் · Official Helpline</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tabular-nums text-[#1f1b18]">
              {data.helpline}
            </div>
            <div className="flex items-center gap-2 text-base text-[#58423c]">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#2b8282]" aria-hidden="true" />
              <span>ஆதார், வங்கி கணக்கு, கட்டணம் தேவையில்லை.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="tactile-push inline-flex min-h-[64px] items-center justify-center gap-3 rounded-full bg-[#2b8282] px-7 py-4 text-lg font-bold text-white hover:bg-[#006a6a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span>மற்றொரு தேடல் · New Search</span>
          </button>
        </div>
      </div>
    </section>
  );
};
