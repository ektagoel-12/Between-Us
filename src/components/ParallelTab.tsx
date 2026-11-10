import React, { useState, useEffect } from "react";
import { Coffee, Utensils, BookOpen, Volume2, VolumeX, Play, Pause, RotateCcw, Camera, Sparkles, Send } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState, ParallelSession } from "../types";
import { toggleCafeAmbiance, playChimeSound, playHeartbeatSound } from "../utils/audio";

interface ParallelTabProps {
  couple: CoupleState;
  activePartner: "A" | "B";
  onUpdateSession: (session: Partial<ParallelSession>) => void;
  onSendPulse: () => void;
}

export const ParallelTab: React.FC<ParallelTabProps> = ({
  couple,
  activePartner,
  onUpdateSession,
  onSendPulse,
}) => {
  const [activeMode, setActiveMode] = useState<"coffee" | "meal" | "study">("coffee");
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientAudioOn, setAmbientAudioOn] = useState(false);
  const [myBeverage, setMyBeverage] = useState("Oat Milk Latte ☕");
  const [partnerBeverage, setPartnerBeverage] = useState("Kyoto Drip Coffee 🍵");
  const [myMeal, setMyMeal] = useState("Homemade Spicy Ramen 🍜");
  const [partnerMeal, setPartnerMeal] = useState("Toasted Everything Bagel & Lox 🥯");
  const [momentSnapCaption, setMomentSnapCaption] = useState("");
  const [sharedMoments, setSharedMoments] = useState<
    Array<{ id: string; author: string; text: string; time: string; tag: string }>
  >([
    {
      id: "1",
      author: "Maya",
      text: "Tokyo sunset turning the clouds pastel pink right outside my desk window 🌆",
      time: "10 mins ago",
      tag: "Live Window",
    },
    {
      id: "2",
      author: "Liam",
      text: "Coffee brewed and laptop ready. You look radiant today!",
      time: "24 mins ago",
      tag: "Morning Vibe",
    },
  ]);

  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const partner = activePartner === "A" ? couple.partnerB : couple.partnerA;

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playChimeSound();
            confetti({ particleCount: 35, spread: 70, origin: { y: 0.6 } });
            onUpdateSession({ status: "completed" });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const toggleTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      onUpdateSession({ type: activeMode, status: "active" });
      playChimeSound();
    } else {
      setIsRunning(false);
      onUpdateSession({ status: "idle" });
    }
  };

  const resetTimer = (mins: number) => {
    setIsRunning(false);
    setSecondsRemaining(mins * 60);
    onUpdateSession({ status: "idle", durationMinutes: mins });
  };

  const handleToggleAmbient = () => {
    const newState = !ambientAudioOn;
    setAmbientAudioOn(newState);
    toggleCafeAmbiance(newState);
  };

  const handleCheersToast = () => {
    playChimeSound();
    playHeartbeatSound();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#a855f7", "#fbbf24"],
    });
    onSendPulse();
  };

  const handlePostMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momentSnapCaption.trim()) return;
    const newMoment = {
      id: Date.now().toString(),
      author: me.name,
      text: momentSnapCaption.trim(),
      time: "Just now",
      tag: "Right Now",
    };
    setSharedMoments([newMoment, ...sharedMoments]);
    setMomentSnapCaption("");
    playChimeSound();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
            Parallel Lives
          </h1>
          <p className="text-xs text-purple-200/70 mt-1">
            Share life's everyday rhythms in real-time, whether it's breakfast, coffee, or quiet study
          </p>
        </div>

        {/* Segmented Mode Control */}
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-2xl border border-purple-500/20">
          <button
            onClick={() => {
              setActiveMode("coffee");
              resetTimer(20);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
              activeMode === "coffee"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-purple-300 hover:text-white"
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Cafe Date</span>
          </button>
          <button
            onClick={() => {
              setActiveMode("meal");
              resetTimer(35);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
              activeMode === "meal"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-purple-300 hover:text-white"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Sync Meal</span>
          </button>
          <button
            onClick={() => {
              setActiveMode("study");
              resetTimer(25);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
              activeMode === "study"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-purple-300 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study Focus</span>
          </button>
        </div>
      </div>

      {/* Main Parallel Stage Card */}
      <div className="relative rounded-3xl glass-panel border border-purple-500/25 p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Background Visual for Mode */}
        {activeMode === "coffee" && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="/src/assets/images/parallel_cafe_date_1794344570408.jpg"
              alt="Cafe Date Ambiance"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Synchronized Countdown & Controls */}
          <div className="md:col-span-6 space-y-5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-300 font-medium">
                {activeMode === "coffee"
                  ? "☕ Virtual Coffee Date"
                  : activeMode === "meal"
                  ? "🕯️ Candlelit Meal Swap"
                  : "📚 25-Min Focus Sprint"}
              </span>
              <button
                onClick={handleToggleAmbient}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                  ambientAudioOn
                    ? "bg-purple-600/30 border-purple-400 text-purple-200"
                    : "bg-black/30 border-purple-500/20 text-purple-400 hover:text-purple-200"
                }`}
                title="Toggle cozy lo-fi background sound"
              >
                {ambientAudioOn ? <Volume2 className="w-3.5 h-3.5 text-pink-300" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{ambientAudioOn ? "Sound On" : "Lo-Fi Audio"}</span>
              </button>
            </div>

            {/* Big Timer Display */}
            <div className="space-y-1">
              <span className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-white block">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-xs text-purple-300/70 block">
                {isRunning
                  ? "Synchronized with your partner's clock"
                  : "Paused · Ready whenever both of you are"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <button
                onClick={toggleTimer}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg ${
                  isRunning
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:brightness-110 shadow-purple-900/40"
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause Session
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Start Together
                  </>
                )}
              </button>

              <button
                onClick={() => resetTimer(activeMode === "coffee" ? 20 : activeMode === "meal" ? 35 : 25)}
                className="p-2.5 rounded-2xl bg-black/40 hover:bg-purple-950/50 border border-purple-500/20 text-purple-300 hover:text-white transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleCheersToast}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-purple-900/40 border border-purple-400/25 text-pink-300 text-xs font-medium transition-all"
                title="Send a virtual toast across the distance"
              >
                <span>🥂</span>
                <span>Virtual Toast</span>
              </button>
            </div>
          </div>

          {/* Right: Dual Table Setting */}
          <div className="md:col-span-6 space-y-3">
            <div className="p-4 rounded-2xl bg-[#0e0922]/80 border border-purple-500/20 space-y-3">
              <span className="text-xs font-semibold text-purple-200 block">
                Our Virtual Table Setting
              </span>

              {/* Partner A */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{couple.partnerA.avatar}</span>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {couple.partnerA.name} ({couple.partnerA.city})
                    </span>
                    <span className="text-[11px] text-purple-300/80">
                      {activeMode === "coffee"
                        ? myBeverage
                        : activeMode === "meal"
                        ? myMeal
                        : "Focus: Deep UI Design work"}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono">
                  Online
                </span>
              </div>

              {/* Partner B */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{couple.partnerB.avatar}</span>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {couple.partnerB.name} ({couple.partnerB.city})
                    </span>
                    <span className="text-[11px] text-purple-300/80">
                      {activeMode === "coffee"
                        ? partnerBeverage
                        : activeMode === "meal"
                        ? partnerMeal
                        : "Focus: Backend Architecture sprint"}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono">
                  Online
                </span>
              </div>

              {/* Editable food/drink note */}
              <div className="pt-1 flex gap-2">
                <input
                  type="text"
                  value={activeMode === "coffee" ? myBeverage : myMeal}
                  onChange={(e) =>
                    activeMode === "coffee"
                      ? setMyBeverage(e.target.value)
                      : setMyMeal(e.target.value)
                  }
                  placeholder="Update what you are sipping / eating..."
                  className="flex-1 text-xs px-3 py-1.5 rounded-xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none"
                />
                <button
                  onClick={() => playChimeSound()}
                  className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-medium transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Moments & Snapshot Stream */}
      <div className="rounded-3xl glass-panel border border-purple-500/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-pink-400" />
              Real-Time Moment Snaps
            </h2>
            <p className="text-xs text-purple-200/70">
              Share quick snapshots of your desk, window, coffee, or view right now
            </p>
          </div>
          <span className="text-xs text-purple-300/60">Live feed</span>
        </div>

        {/* Input form */}
        <form onSubmit={handlePostMoment} className="flex gap-2">
          <input
            type="text"
            value={momentSnapCaption}
            onChange={(e) => setMomentSnapCaption(e.target.value)}
            placeholder="Describe what you see right now (e.g. 'Golden sunlight hitting the radiator')..."
            className="flex-1 text-xs px-4 py-2.5 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            disabled={!momentSnapCaption.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold hover:brightness-110 disabled:opacity-40 transition-all shadow-md shadow-purple-900/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </form>

        {/* List of recent moment snaps */}
        <div className="space-y-2.5 pt-1">
          {sharedMoments.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-purple-200">{m.author}</span>
                  <span className="text-[10px] text-purple-400/60">· {m.time}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-md bg-purple-900/40 text-purple-300">
                    {m.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-200">{m.text}</p>
              </div>
              <button
                onClick={() => {
                  playHeartbeatSound();
                  confetti({ particleCount: 15, spread: 45, origin: { y: 0.8 } });
                }}
                className="p-1.5 text-purple-400 hover:text-pink-400 hover:bg-purple-900/30 rounded-lg transition-colors"
                title="Send love to this moment"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
