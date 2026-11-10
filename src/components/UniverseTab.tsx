import React, { useState } from "react";
import { Sparkles, Star, Heart, Compass, Moon, Orbit, Gift, MessageCircleHeart } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState } from "../types";
import { playChimeSound, playHeartbeatSound } from "../utils/audio";

interface UniverseTabProps {
  couple: CoupleState;
  activePartner: "A" | "B";
  onSendPulse: () => void;
  onQuickAction: (actionName: string) => void;
}

export const UniverseTab: React.FC<UniverseTabProps> = ({
  couple,
  activePartner,
  onSendPulse,
  onQuickAction,
}) => {
  const [selectedConstellation, setSelectedConstellation] = useState<number | null>(null);
  const [dailyResponse, setDailyResponse] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState(false);
  const [crystalGlow, setCrystalGlow] = useState(false);

  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const partner = activePartner === "A" ? couple.partnerB : couple.partnerA;

  const constellations = [
    {
      id: 1,
      name: "The First Spark",
      stars: 4,
      date: "Oct 14, 2024",
      story: "The late-night conversation when 5 minutes accidentally turned into 4 hours.",
      quote: "When talking to you felt like coming home after an endless voyage.",
      unlocked: true,
      x: "18%",
      y: "32%",
    },
    {
      id: 2,
      name: "The Airport Embrace",
      stars: 5,
      date: "Dec 20, 2024",
      story: "Dropping our heavy luggage at Terminal 3 and holding on like gravity didn't exist.",
      quote: "No jet lag could ever dim the relief of your arms.",
      unlocked: true,
      x: "48%",
      y: "22%",
    },
    {
      id: 3,
      name: "Solstice Promise",
      stars: 6,
      date: "Jun 21, 2025",
      story: "Watching the sun set in Tokyo while it rose in Manhattan on video call.",
      quote: "We share the very same light, just on different sides of the sphere.",
      unlocked: true,
      x: "78%",
      y: "36%",
    },
    {
      id: 4,
      name: "Parallel Sanctuary",
      stars: 7,
      date: "Nov 02, 2025",
      story: "Studying quietly for 6 hours together with only keyboard taps and gentle smiles.",
      quote: "True intimacy is sharing silence without needing to fill it.",
      unlocked: true,
      x: "32%",
      y: "65%",
    },
    {
      id: 5,
      name: "The Reunion Star",
      stars: 8,
      date: "Next Reunion",
      story: "Our upcoming countdown star, unlocking on our next flight touchdown.",
      quote: "Every ticking second brings us closer to the same timezone.",
      unlocked: false,
      x: "68%",
      y: "72%",
    },
  ];

  const handleCrystalTouch = () => {
    setCrystalGlow(true);
    playChimeSound();
    playHeartbeatSound();
    confetti({
      particleCount: 28,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#a855f7", "#ec4899", "#f43f5e", "#e9d5ff"],
    });
    onSendPulse();
    setTimeout(() => setCrystalGlow(false), 1500);
  };

  const handleDailySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyResponse.trim()) return;
    setSubmittedPrompt(true);
    playChimeSound();
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#c084fc", "#f472b6"],
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Hero Cosmic Showcase */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-purple-500/25 p-6 sm:p-8 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Universe Description & Level */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/25 text-purple-200 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: "6s" }} />
              <span>Cosmic Terrarium Level {couple.universeLevel}</span>
              <span className="text-purple-300/40">·</span>
              <span>{couple.starlightPoints} / {(couple.universeLevel + 1) * 100} Starlight</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Our Shared Universe
            </h1>
            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed max-w-xl">
              A living digital sanctuary that grows each time you speak, play, reflect, or hold
              space across the distance. Every memory turns into celestial starlight.
            </p>

            {/* Level progress bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-purple-300/70">
                <span>Starlight Harmony</span>
                <span className="font-mono">
                  {Math.round((couple.starlightPoints / ((couple.universeLevel + 1) * 100)) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-purple-500/20 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-300 rounded-full transition-all duration-700 shadow-sm shadow-pink-500/50"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(15, (couple.starlightPoints / ((couple.universeLevel + 1) * 100)) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Intimacy Metrics Strip */}
            <div className="grid grid-cols-3 gap-2.5 pt-3">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-purple-300/70 block">Days Together</span>
                <span className="text-lg sm:text-xl font-bold font-serif text-white">412</span>
                <span className="text-[10px] text-pink-300/80 block mt-0.5">Every day chosen</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-purple-300/70 block">Distance Bridged</span>
                <span className="text-lg sm:text-xl font-bold font-serif text-white">6,740 mi</span>
                <span className="text-[10px] text-indigo-300/80 block mt-0.5">Tokyo ⇄ New York</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-purple-300/70 block">Heart Pulses</span>
                <span className="text-lg sm:text-xl font-bold font-serif text-white">{couple.pulseCount}</span>
                <span className="text-[10px] text-rose-300/80 block mt-0.5">Vibrations sent</span>
              </div>
            </div>
          </div>

          {/* Right: Cosmic Terrarium Sphere with Touch Crystal */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-b from-purple-500/30 via-pink-500/20 to-transparent border border-purple-400/30 shadow-2xl shadow-purple-900/50 group">
              {/* Rotating starlight ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-purple-400/40 animate-spin" style={{ animationDuration: "40s" }} />
              
              <img
                src="/src/assets/images/cosmic_universe_world_1794344570482.jpg"
                alt="Cosmic Universe World"
                className="w-full h-full object-cover rounded-full shadow-inner ring-1 ring-purple-300/40"
              />

              {/* Floating interactive Touch Crystal button */}
              <button
                onClick={handleCrystalTouch}
                className={`absolute inset-0 m-auto w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
                  crystalGlow
                    ? "bg-pink-500/80 scale-110 shadow-2xl shadow-pink-500"
                    : "bg-purple-900/70 hover:bg-purple-800/80 hover:scale-105 backdrop-blur-md border border-purple-300/40"
                }`}
                title="Tap to send ambient starlight to your partner"
              >
                <Heart className={`w-6 h-6 ${crystalGlow ? "text-white animate-ping" : "text-pink-300 fill-pink-400/60"}`} />
                <span className="text-[10px] font-semibold text-white tracking-wide mt-1">Touch</span>
              </button>
            </div>
            <span className="text-xs text-purple-300/70 mt-3 text-center">
              Touch the crystal to share an instant ripple of love
            </span>
          </div>
        </div>
      </div>

      {/* Constellation Star Map */}
      <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-purple-500/20 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              Constellation Milestones
            </h2>
            <p className="text-xs text-purple-200/70 mt-0.5">
              Click any star node to reveal the romantic memory written into your stars
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-200 border border-purple-500/25">
            4 / 5 Unlocked
          </span>
        </div>

        {/* Visual Map Canvas */}
        <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-[#090615] border border-purple-500/15 overflow-hidden">
          {/* Subtle starry background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

          {/* Connected Constellation SVG Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline
              points="90,95 240,65 390,110 160,200"
              fill="none"
              stroke="rgba(192, 132, 252, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Star Nodes */}
          {constellations.map((node) => (
            <button
              key={node.id}
              onClick={() => {
                setSelectedConstellation(node.id);
                playChimeSound();
              }}
              style={{ left: node.x, top: node.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all group ${
                node.unlocked
                  ? selectedConstellation === node.id
                    ? "bg-pink-500/40 ring-4 ring-pink-400 scale-125"
                    : "bg-purple-900/60 hover:bg-purple-700/70 hover:scale-115 ring-1 ring-purple-300/40"
                  : "bg-slate-900/80 opacity-50 ring-1 ring-slate-700"
              }`}
              title={node.name}
            >
              <Star
                className={`w-4 h-4 ${
                  node.unlocked
                    ? "text-amber-300 fill-amber-300 group-hover:text-white"
                    : "text-slate-500"
                }`}
              />
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap text-[11px] font-medium text-purple-200 px-2 py-0.5 rounded bg-[#0b0817]/90 border border-purple-500/20 shadow">
                {node.name}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Constellation Detail Modal/Card */}
        {selectedConstellation && (
          <div className="mt-4 p-4 rounded-2xl bg-purple-950/60 border border-purple-400/30 animate-in fade-in slide-in-from-bottom-2">
            {(() => {
              const item = constellations.find((c) => c.id === selectedConstellation)!;
              return (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-serif font-bold text-white">{item.name}</span>
                      <span className="text-xs text-purple-300/70 font-mono">· {item.date}</span>
                    </div>
                    <p className="text-xs text-slate-200">{item.story}</p>
                    <p className="text-xs text-pink-300/90 italic">“{item.quote}”</p>
                  </div>
                  <button
                    onClick={() => setSelectedConstellation(null)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 transition-colors whitespace-nowrap"
                  >
                    Close
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Daily Universe Ritual Prompt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Shared Question */}
        <div className="p-6 rounded-3xl glass-panel border border-purple-500/20 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-pink-300 font-medium">
              <MessageCircleHeart className="w-4 h-4 text-pink-400" />
              <span>Daily Universe Prompt</span>
            </div>
            <h3 className="text-base font-serif font-semibold text-white">
              “What was one quiet moment today that made you wish I was sitting next to you?”
            </h3>
            <p className="text-xs text-purple-200/70">
              Answer honestly; your answer unlocks once both partners share.
            </p>
          </div>

          <form onSubmit={handleDailySubmit} className="mt-4 space-y-2.5">
            {submittedPrompt ? (
              <div className="p-3.5 rounded-2xl bg-purple-950/70 border border-purple-500/30 text-xs text-purple-200 space-y-1">
                <span className="font-semibold text-pink-300 block">Your answer is sealed in starlight ✨</span>
                <p>"{dailyResponse || "Looking at the rain on the window with coffee and wanting to hold your hand."}"</p>
                <span className="text-[10px] text-purple-400 block mt-1">
                  Partner's answer revealed at midnight or when they submit!
                </span>
              </div>
            ) : (
              <>
                <textarea
                  value={dailyResponse}
                  onChange={(e) => setDailyResponse(e.target.value)}
                  placeholder="Type your answer softly here..."
                  rows={2}
                  className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  disabled={!dailyResponse.trim()}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:brightness-110 disabled:opacity-40 transition-all shadow-md shadow-purple-900/20"
                >
                  Seal Our Answer (+15 Starlight)
                </button>
              </>
            )}
          </form>
        </div>

        {/* Quick Launchpad to Parallel Activities */}
        <div className="p-6 rounded-3xl glass-panel border border-purple-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium mb-1.5">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Parallel Life Jump</span>
            </div>
            <h3 className="text-base font-serif font-semibold text-white">
              Connect in Real-Time Now
            </h3>
            <p className="text-xs text-purple-200/70 mt-1">
              {couple.parallelSession.status === "active"
                ? `Active ${couple.parallelSession.type} session underway with ${partner.name}!`
                : `Ready to share a quiet virtual coffee or focus session across ${partner.city}?`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={() => onQuickAction("parallel")}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-purple-900/40 border border-white/5 hover:border-purple-400/30 text-center transition-all group"
            >
              <span className="text-xl block mb-1 group-hover:scale-110 transition-transform">☕</span>
              <span className="text-[11px] font-medium text-slate-200 block">Cafe Date</span>
            </button>
            <button
              onClick={() => onQuickAction("parallel")}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-purple-900/40 border border-white/5 hover:border-purple-400/30 text-center transition-all group"
            >
              <span className="text-xl block mb-1 group-hover:scale-110 transition-transform">🕯️</span>
              <span className="text-[11px] font-medium text-slate-200 block">Sync Meal</span>
            </button>
            <button
              onClick={() => onQuickAction("translator")}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-purple-900/40 border border-white/5 hover:border-purple-400/30 text-center transition-all group"
            >
              <span className="text-xl block mb-1 group-hover:scale-110 transition-transform">🕊️</span>
              <span className="text-[11px] font-medium text-slate-200 block">AI Translator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
