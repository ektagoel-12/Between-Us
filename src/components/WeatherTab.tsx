import React, { useState } from "react";
import { CloudRain, Sun, CloudLightning, CloudFog, Sparkles, Moon, Heart, Coffee, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState, WeatherMood } from "../types";
import { playHeartbeatSound, playChimeSound } from "../utils/audio";

interface WeatherTabProps {
  couple: CoupleState;
  activePartner: "A" | "B";
  onUpdateWeather: (weather: { mood: string; note: string }) => void;
  onSendComfort: (actionName: string) => void;
}

export const WeatherTab: React.FC<WeatherTabProps> = ({
  couple,
  activePartner,
  onUpdateWeather,
  onSendComfort,
}) => {
  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const partner = activePartner === "A" ? couple.partnerB : couple.partnerA;

  const [selectedMood, setSelectedMood] = useState<string>(me.weather?.mood || "Sunny & Radiant ☀️");
  const [note, setNote] = useState(me.weather?.note || "");
  const [hugActive, setHugActive] = useState(false);
  const [comfortToast, setComfortToast] = useState<string | null>(null);

  const moods = [
    { label: "Sunny & Radiant ☀️", desc: "Happy, energized, and loving life", icon: "☀️", color: "from-amber-500/20 to-orange-500/20" },
    { label: "Gentle Rain 🌧️", desc: "A bit tender, low energy, craving hugs", icon: "🌧️", color: "from-sky-500/20 to-indigo-500/20" },
    { label: "Stormy ⚡", desc: "High stress, work overwhelm, need calm space", icon: "⚡", color: "from-purple-500/20 to-slate-500/20" },
    { label: "Foggy 🌫️", desc: "Exhausted, sleepy, brain foggy", icon: "🌫️", color: "from-slate-500/20 to-zinc-500/20" },
    { label: "Golden Hour ✨", desc: "Warmly daydreaming about you", icon: "✨", color: "from-pink-500/20 to-rose-500/20" },
    { label: "Midnight Starlight 🌙", desc: "Peaceful, quiet, listening to night rain", icon: "🌙", color: "from-indigo-500/20 to-violet-500/20" },
  ];

  const handleSaveWeather = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWeather({ mood: selectedMood, note: note.trim() });
    playChimeSound();
    confetti({ particleCount: 20, spread: 50, origin: { y: 0.6 } });
  };

  const handleSendHug = () => {
    setHugActive(true);
    playHeartbeatSound();
    onSendComfort("10-Second Warm Virtual Hug");
    if (navigator.vibrate) {
      navigator.vibrate([150, 100, 150, 100, 250]);
    }
    setTimeout(() => {
      setHugActive(false);
    }, 4000);
  };

  const handleComfortAction = (action: string, icon: string) => {
    playChimeSound();
    onSendComfort(action);
    setComfortToast(`Sent ${action} ${icon} to ${partner.name}!`);
    setTimeout(() => setComfortToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center justify-center gap-2">
          <Sun className="w-6 h-6 text-amber-300" />
          Relationship Weather
        </h1>
        <p className="text-xs text-purple-200/70">
          Tune in to each other's emotional forecast without asking "Are you okay?" 20 times a day
        </p>
      </div>

      {/* Dual Partner Weather Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Partner's Weather (Liam or Maya) */}
        <div className="rounded-3xl glass-panel border border-pink-400/30 p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{partner.avatar}</span>
              <div>
                <span className="text-sm font-bold text-white font-serif">{partner.name}'s Skies</span>
                <span className="text-[11px] text-purple-300/70 block">{partner.city}</span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 font-medium">
              Live Forecast
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <span className="text-lg font-serif font-bold text-white block">
              {partner.weather?.mood || "Sunny & Radiant ☀️"}
            </span>
            <p className="text-xs text-purple-100/90 leading-relaxed font-serif">
              "{partner.weather?.note || "Thinking about our countdown and excited for our next date!"}"
            </p>
          </div>

          {/* Quick Comfort Actions for Partner */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-medium text-purple-300/80 block">
              Send an instant touch of comfort to {partner.name}:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSendHug}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white text-xs font-semibold shadow-md shadow-pink-900/30 transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>10-Sec Warm Hug</span>
              </button>
              <button
                onClick={() => handleComfortAction("Warm Cup of Tea", "🍵")}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-medium border border-purple-500/20 transition-all"
              >
                <span>🍵</span>
                <span>Brew Tea</span>
              </button>
              <button
                onClick={() => handleComfortAction("Heated Blanket", "🧣")}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-medium border border-purple-500/20 transition-all"
              >
                <span>🧣</span>
                <span>Warm Blanket</span>
              </button>
              <button
                onClick={() => handleComfortAction("Forehead Kiss", "💋")}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-medium border border-purple-500/20 transition-all"
              >
                <span>💋</span>
                <span>Forehead Kiss</span>
              </button>
            </div>
          </div>
        </div>

        {/* My Weather Input Card */}
        <div className="rounded-3xl glass-panel border border-purple-500/25 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{me.avatar}</span>
              <div>
                <span className="text-sm font-bold text-white font-serif">Your Weather ({me.name})</span>
                <span className="text-[11px] text-purple-300/70 block">{me.city}</span>
              </div>
            </div>
            <span className="text-xs text-purple-300/60">Tap to update</span>
          </div>

          <form onSubmit={handleSaveWeather} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2">
              {moods.map((m, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedMood(m.label)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedMood === m.label
                      ? "bg-purple-900/70 border-pink-400 text-white shadow-md shadow-purple-900/30 scale-[1.01]"
                      : "bg-black/30 border-purple-500/20 text-purple-300 hover:text-white hover:bg-purple-950/40"
                  }`}
                >
                  <span className="text-base block mb-0.5">{m.icon}</span>
                  <span className="text-[11px] font-semibold block truncate">{m.label.split(" ")[0]}</span>
                  <span className="text-[10px] text-purple-300/60 block truncate">{m.desc}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] font-medium text-purple-200 block mb-1">
                A gentle note for {partner.name}:
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Long meeting day, just craving some cozy silence with you tonight"
                className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-semibold text-xs hover:brightness-110 shadow-md shadow-purple-900/20 transition-all"
            >
              Broadcast My Forecast (+10 Starlight)
            </button>
          </form>
        </div>
      </div>

      {/* Hug overlay animation */}
      {hugActive && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in">
          <div className="relative flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-rose-500/30 flex items-center justify-center animate-ping" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Heart className="w-20 h-20 text-rose-400 fill-rose-500 animate-pulse" />
              <span className="text-lg font-serif font-bold text-white mt-4">
                Holding {partner.name} close...
              </span>
              <span className="text-xs text-rose-200">6,740 miles dissolving right now ✨</span>
            </div>
          </div>
        </div>
      )}

      {/* Comfort Toast */}
      {comfortToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-purple-950/90 border border-pink-400 text-xs font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          {comfortToast}
        </div>
      )}
    </div>
  );
};
