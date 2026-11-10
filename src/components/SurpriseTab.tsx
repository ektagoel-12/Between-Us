import React, { useState } from "react";
import { Sparkles, Gift, Heart, Clock, Compass, CheckCircle, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState } from "../types";
import { playChimeSound, playHeartbeatSound } from "../utils/audio";

interface SurpriseTabProps {
  couple: CoupleState;
  activePartner: "A" | "B";
}

interface SurpriseItem {
  id: string;
  title: string;
  badge: string;
  overview: string;
  stepByStep: string[];
  whyItWorks: string;
}

export const SurpriseTab: React.FC<SurpriseTabProps> = ({
  couple,
  activePartner,
}) => {
  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const partner = activePartner === "A" ? couple.partnerB : couple.partnerA;

  const [category, setCategory] = useState("virtual_date");
  const [vibe, setVibe] = useState("Cozy & Romantic");
  const [timeBudget, setTimeBudget] = useState("30 minutes");
  const [loading, setLoading] = useState(false);
  const [surprises, setSurprises] = useState<SurpriseItem[]>([
    {
      id: "s-1",
      title: "The Mystery Doorstep Dessert Swap",
      badge: "Delicious & Fun",
      overview:
        "Without telling the other what you ordered, secretly use an international food delivery app to deliver a late-night dessert or warm morning bakery item to each other's doorsteps at the exact same minute.",
      stepByStep: [
        "Agree on a secret budget and exact delivery time window.",
        "Choose a comfort pastry or signature dessert that reminds you of them.",
        "Hop on video as you unbox your partner's mystery pick together.",
      ],
      whyItWorks:
        "It turns a simple food delivery into an act of physical care where you taste each other's thoughtfulness.",
    },
    {
      id: "s-2",
      title: "The 36-Question Whisper Session",
      badge: "Deep Intimacy",
      overview:
        "Light a single candle in your dark bedrooms, put in wireless earbuds, and take turns asking one question from the psychological 36 Questions That Lead to Love in a soft whisper.",
      stepByStep: [
        "Dim the room lights completely and light one warm candle.",
        "Use earbuds with soft ambient rain playing in the background.",
        "Answer without rushing, maintaining eye contact on video.",
      ],
      whyItWorks:
        "Vocal resonance and soft lighting remove the coldness of digital screens and simulate lying side-by-side in bed.",
    },
    {
      id: "s-3",
      title: "5-Minute Apartment Scavenger Hunt",
      badge: "Playful & Fast",
      overview:
        "Set a 5-minute timer. Both partners must find 3 items in their room: something that smells like you, something you bought while thinking of them, and something that makes you laugh.",
      stepByStep: [
        "Start the synchronized in-app timer.",
        "Scramble to collect your 3 items.",
        "Show-and-tell each artifact with the story behind it.",
      ],
      whyItWorks:
        "Brings their physical living space into your view and triggers spontaneous storytelling.",
    },
  ]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/generate-surprise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          currentVibe: vibe,
          timeBudget,
          timeDifferenceHours: 13,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.surprises) {
        setSurprises(data.data.surprises);
        playChimeSound();
        confetti({ particleCount: 35, spread: 65, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = (title: string) => {
    playHeartbeatSound();
    playChimeSound();
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#ec4899", "#a855f7", "#38bdf8"],
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/25 text-pink-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Gemini 3.8 Flash Long-Distance Concierge</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          AI Surprise Generator
        </h1>
        <p className="text-xs text-purple-200/70 max-w-lg mx-auto">
          Never run out of creative, romantic date experiences and spontaneous challenges, tailored
          to your exact timezones and mood.
        </p>
      </div>

      {/* Control Panel */}
      <div className="rounded-3xl glass-panel border border-purple-500/25 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-purple-200 block mb-1">
              Surprise Type
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl bg-[#120a28] border border-purple-500/25 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="virtual_date">Virtual Date Blueprint</option>
              <option value="spontaneous_challenge">5-Minute Apartment Challenge</option>
              <option value="deep_talk">Intimacy & Deep Talk Spark</option>
              <option value="care_package_idea">Surprise Care Package Idea</option>
              <option value="love_coupon">Long-Distance Love Coupon</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-purple-200 block mb-1">Vibe</label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl bg-[#120a28] border border-purple-500/25 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="Cozy & Romantic">Cozy & Romantic</option>
              <option value="Playful & Mischievous">Playful & Mischievous</option>
              <option value="Deep & Vulnerable">Deep & Vulnerable</option>
              <option value="Sensory & Ambient">Sensory & Ambient</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-purple-200 block mb-1">
              Time Available
            </label>
            <select
              value={timeBudget}
              onChange={(e) => setTimeBudget(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl bg-[#120a28] border border-purple-500/25 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="15 minutes">Quick 15 Mins</option>
              <option value="30 minutes">Comfortable 30 Mins</option>
              <option value="1 hour">Full 1-Hour Evening</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={loading}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-40 shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Concocting Romantic Surprise Ideas...</span>
            </>
          ) : (
            <>
              <Gift className="w-4 h-4" />
              <span>Generate 3 Fresh Date Ideas (+15 Starlight)</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Surprises Cards */}
      <div className="space-y-4">
        {surprises.map((item, idx) => (
          <div
            key={item.id || idx}
            className="rounded-3xl glass-panel border border-purple-500/25 p-6 space-y-3.5 hover:border-pink-400/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold">
                {item.badge || "Romantic Blueprint"}
              </span>
              <button
                onClick={() => handleClaim(item.title)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-medium transition-colors"
              >
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/40" />
                <span>Plan This Tonight</span>
              </button>
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-white">{item.title}</h3>
              <p className="text-xs text-purple-100/90 leading-relaxed mt-1">{item.overview}</p>
            </div>

            {/* Step-by-step blueprint */}
            {item.stepByStep && item.stepByStep.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <span className="text-[11px] font-semibold text-purple-200 block">
                  Experience Blueprint:
                </span>
                <ul className="space-y-1">
                  {item.stepByStep.map((step, sIdx) => (
                    <li key={sIdx} className="text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-pink-400 font-mono text-[11px] shrink-0">
                        {sIdx + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.whyItWorks && (
              <p className="text-[11px] text-pink-300/80 italic font-serif">
                ✨ Why it bridges the distance: {item.whyItWorks}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
