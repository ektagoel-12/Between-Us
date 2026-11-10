import React, { useState } from "react";
import { Sparkles, Heart, Copy, Check, Wind, Compass, BookOpen, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState } from "../types";
import { playChimeSound } from "../utils/audio";

interface TranslatorTabProps {
  couple: CoupleState;
  activePartner: "A" | "B";
  onSendUnsentLetter?: (title: string, content: string) => void;
}

interface TranslationResult {
  underlyingNeed: string;
  partnerPerspective: string;
  phrasings: Array<{
    tone: string;
    message: string;
  }>;
  groundingAdvice: string;
  reflectionQuestion: string;
}

export const TranslatorTab: React.FC<TranslatorTabProps> = ({
  couple,
  activePartner,
  onSendUnsentLetter,
}) => {
  const [situation, setSituation] = useState("");
  const [rawFeelings, setRawFeelings] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [breathStage, setBreathStage] = useState<"inhale" | "hold" | "exhale" | null>(null);

  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const partner = activePartner === "A" ? couple.partnerB : couple.partnerA;

  const quickScenarios = [
    {
      label: "Fell asleep without saying goodnight",
      sit: "They fell asleep early without answering my message or saying goodnight.",
      feel: "I feel lonely, unimportant, and forgotten when the day ends in silence.",
    },
    {
      label: "Disappointed about rescheduled video call",
      sit: "We had a date night scheduled over FaceTime, but their work ran late and they asked to push it.",
      feel: "I was looking forward to this all week and now I feel rejected and de-prioritized.",
    },
    {
      label: "Longing for touch / physical presence",
      sit: "Just feeling the heavy weight of distance today after seeing couples outside.",
      feel: "I'm heartbroken that we can't just share a 5-second physical hug right now.",
    },
    {
      label: "Timezone disconnect & brief replies",
      sit: "Their texts have felt hurried and short all day while I was waiting for them to wake up.",
      feel: "I worry they are pulling away or getting bored with texting across miles.",
    },
  ];

  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!situation.trim() && !rawFeelings.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/gemini/translate-emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: situation.trim(),
          rawFeelings: rawFeelings.trim(),
          partnerName: partner.name,
          userName: me.name,
        }),
      });

      const data = await res.json();
      if (data.success && data.translation) {
        setResult(data.translation);
        playChimeSound();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    playChimeSound();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const runBreathingExercise = () => {
    setBreathStage("inhale");
    setTimeout(() => {
      setBreathStage("hold");
      setTimeout(() => {
        setBreathStage("exhale");
        setTimeout(() => {
          setBreathStage(null);
        }, 4000);
      }, 4000);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/25 text-purple-200 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Non-Judgmental Couple Wisdom</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Emotional Translator
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/70 max-w-xl mx-auto">
          Distance magnifies words and silence. Translate raw frustration, fear, or anxiety into
          vulnerable, tender truth that invites {partner.name} closer.
        </p>
      </div>

      {/* Preset Quick Scenario Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-purple-300/60 block">Common long-distance moments:</span>
        <div className="flex flex-wrap gap-2">
          {quickScenarios.map((sc, i) => (
            <button
              key={i}
              onClick={() => {
                setSituation(sc.sit);
                setRawFeelings(sc.feel);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-purple-900/40 border border-white/5 hover:border-purple-400/30 text-purple-200 transition-all text-left"
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Card */}
      <form onSubmit={handleTranslate} className="rounded-3xl glass-panel border border-purple-500/25 p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-purple-200 block">
            1. What happened? (The objective situation)
          </label>
          <input
            type="text"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder={`e.g. ${partner.name} had to cancel our Sunday morning call for extra work`}
            className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-purple-200 block">
            2. Your raw, unfiltered feelings (Be as messy as you need—this is your private sanctuary)
          </label>
          <textarea
            value={rawFeelings}
            onChange={(e) => setRawFeelings(e.target.value)}
            rows={3}
            placeholder="e.g. I felt so lonely and angry. I wonder if they even care about making time for us..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={runBreathingExercise}
            className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors"
          >
            <Wind className="w-3.5 h-3.5 text-pink-400" />
            <span>
              {breathStage
                ? `Breathing: ${breathStage.toUpperCase()}...`
                : "Need a calming breath first?"}
            </span>
          </button>

          <button
            type="submit"
            disabled={loading || (!situation.trim() && !rawFeelings.trim())}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-40 transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Translating with Compassion...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
                <span>Translate with AI</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Translation Output Presentation */}
      {result && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Deep Insight Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Underlying Need */}
            <div className="p-5 rounded-3xl bg-purple-950/60 border border-purple-400/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400/40" />
                <span>What Your Heart is Craving</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-serif">
                {result.underlyingNeed}
              </p>
            </div>

            {/* Partner's Perspective */}
            <div className="p-5 rounded-3xl bg-indigo-950/60 border border-indigo-400/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>Seeing Through {partner.name}'s Eyes</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-serif">
                {result.partnerPerspective}
              </p>
            </div>
          </div>

          {/* Three Ready Phrasings */}
          <div className="rounded-3xl glass-panel border border-purple-500/25 p-6 space-y-4">
            <div>
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Empathetic Phrasings Ready to Send
              </h2>
              <p className="text-xs text-purple-200/70">
                Choose the voice that feels most authentic to you right now
              </p>
            </div>

            <div className="space-y-3">
              {result.phrasings.map((option, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-black/40 border border-purple-500/20 hover:border-purple-400/40 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200">
                      {option.tone}
                    </span>
                    <button
                      onClick={() => handleCopy(option.message, idx)}
                      className="flex items-center gap-1 text-xs text-purple-300 hover:text-white px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800 transition-colors"
                      title="Copy message to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-serif">
                    “{option.message}”
                  </p>
                </div>
              ))}
            </div>

            {/* Somatic grounding bar */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs text-purple-200">
              <span className="text-pink-300 font-medium">Grounding tip:</span>
              <span className="text-right text-purple-200/80">{result.groundingAdvice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
