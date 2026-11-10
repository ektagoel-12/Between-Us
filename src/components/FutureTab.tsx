import React, { useState, useEffect } from "react";
import { Plane, Home, CheckSquare, Square, Heart, Plus, Calendar, Compass, Sparkles, MapPin } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState, BucketItem } from "../types";
import { playChimeSound, playHeartbeatSound } from "../utils/audio";

interface FutureTabProps {
  couple: CoupleState;
  activePartner: "A" | "B";
  onAddBucketItem: (item: Partial<BucketItem>) => void;
  onToggleBucketItem: (id: string) => void;
  onSendPulse: () => void;
}

export const FutureTab: React.FC<FutureTabProps> = ({
  couple,
  activePartner,
  onAddBucketItem,
  onToggleBucketItem,
  onSendPulse,
}) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "travel" | "home" | "dates" | "life">("all");
  const [showAddBucket, setShowAddBucket] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState<"travel" | "home" | "dates" | "life">("travel");
  const [newYear, setNewYear] = useState("2027");

  // Flight countdown state
  const [countdown, setCountdown] = useState({
    days: 18,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const partner = activePartner === "A" ? couple.partnerB : couple.partnerA;

  const filteredBucket =
    activeCategory === "all"
      ? couple.bucketList
      : couple.bucketList.filter((b) => b.category === activeCategory);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddBucketItem({
      title: newTitle.trim(),
      category: newCat,
      targetYear: newYear,
      author: me.name,
    });

    setNewTitle("");
    setShowAddBucket(false);
    playChimeSound();
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
  };

  const handleToggle = (id: string, wasCompleted: boolean) => {
    onToggleBucketItem(id);
    if (!wasCompleted) {
      playChimeSound();
      playHeartbeatSound();
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#34d399", "#a855f7", "#f43f5e"],
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
          <Plane className="w-6 h-6 text-pink-400" />
          Future Together & Visit Countdown
        </h1>
        <p className="text-xs text-purple-200/70 mt-1">
          The dreams, flights, and future home that make every mile worthwhile
        </p>
      </div>

      {/* Hero Flight Reunion Countdown */}
      <div className="relative rounded-3xl glass-panel border border-purple-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-300 text-xs font-semibold">
              <Plane className="w-3.5 h-3.5" />
              <span>Next Flight Reunion · Flight JL006</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 text-white">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-serif">HND</span>
                <span className="text-xs text-purple-300/80 block">Tokyo Haneda</span>
              </div>
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] text-pink-300 font-mono tracking-wider">6,740 MI</span>
                <div className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 relative my-1">
                  <Plane className="w-3.5 h-3.5 text-white absolute -top-1.5 left-1/2 -translate-x-1/2" />
                </div>
                <span className="text-[10px] text-purple-300/70 font-mono">13h 45m</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-serif">JFK</span>
                <span className="text-xs text-purple-300/80 block">New York JFK</span>
              </div>
            </div>

            <p className="text-xs text-purple-200/70">
              Meeting at Terminal 8 arrivals. First stop: Joe's Pizza & late-night stroll.
            </p>
          </div>

          {/* Big countdown boxes */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-3 sm:p-4 rounded-2xl bg-black/50 border border-purple-500/30 text-center min-w-[62px] sm:min-w-[74px]">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">
                {countdown.days}
              </span>
              <span className="text-[10px] text-purple-300 uppercase tracking-wider">Days</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-black/50 border border-purple-500/30 text-center min-w-[62px] sm:min-w-[74px]">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">
                {countdown.hours}
              </span>
              <span className="text-[10px] text-purple-300 uppercase tracking-wider">Hours</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-black/50 border border-purple-500/30 text-center min-w-[62px] sm:min-w-[74px]">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">
                {countdown.minutes}
              </span>
              <span className="text-[10px] text-purple-300 uppercase tracking-wider">Mins</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-black/50 border border-purple-500/30 text-center min-w-[62px] sm:min-w-[74px]">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-pink-400 block">
                {countdown.seconds}
              </span>
              <span className="text-[10px] text-pink-300 uppercase tracking-wider">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Bucket List Section */}
      <div className="rounded-3xl glass-panel border border-purple-500/25 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              Our Shared Bucket List
            </h2>
            <p className="text-xs text-purple-200/70">
              Every adventure, home dream, and date we are going to conquer
            </p>
          </div>

          <button
            onClick={() => setShowAddBucket(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Dream
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(["all", "travel", "home", "dates", "life"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-xl capitalize transition-all ${
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                  : "bg-black/30 text-purple-300 hover:text-white border border-purple-500/15"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bucket list items */}
        <div className="space-y-2.5">
          {filteredBucket.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                item.completed
                  ? "bg-emerald-950/20 border-emerald-500/30 opacity-75"
                  : "bg-black/30 border-purple-500/20 hover:border-purple-400/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(item.id, item.completed)}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-purple-400" />
                  )}
                </button>
                <div>
                  <span
                    className={`text-xs sm:text-sm font-serif block ${
                      item.completed ? "line-through text-slate-400" : "text-white font-medium"
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.notes && (
                    <span className="text-[11px] text-pink-300/80 block mt-0.5">
                      ✓ {item.notes}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900/40 text-purple-200">
                  {item.targetYear || item.category}
                </span>
                <button
                  onClick={() => {
                    playHeartbeatSound();
                    confetti({ particleCount: 15, spread: 45, origin: { y: 0.7 } });
                  }}
                  className="p-1 text-purple-400 hover:text-pink-400 transition-colors"
                  title="Vote / Love this"
                >
                  <Heart className="w-3.5 h-3.5 fill-pink-500/30 text-pink-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dream Home Inspiration Grid */}
      <div className="rounded-3xl glass-panel border border-purple-500/20 p-6 space-y-4">
        <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
          <Home className="w-5 h-5 text-pink-400" />
          Our Future Home Moodboard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-xl">🌿</span>
            <span className="text-xs font-semibold text-white block">Sunlit Tatami & Books</span>
            <p className="text-[11px] text-purple-200/70">
              Low wooden coffee table, overflowing monstera plants, and room for both our laptops.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-xl">🍳</span>
            <span className="text-xs font-semibold text-white block">Open Chef's Kitchen</span>
            <p className="text-[11px] text-purple-200/70">
              Two ceramic mugs on the drying rack every morning, music playing on speaker.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-xl">🐕</span>
            <span className="text-xs font-semibold text-white block">Miso the Golden Retriever</span>
            <p className="text-[11px] text-purple-200/70">
              Weekend walks in the park where neither of us has to check flight status.
            </p>
          </div>
        </div>
      </div>

      {/* Add Bucket Modal */}
      {showAddBucket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-purple-500/30 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-white">Add to Shared Bucket List</h2>
              <button
                onClick={() => setShowAddBucket(false)}
                className="text-xs text-purple-300 hover:text-white px-2 py-1"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-purple-200 block mb-1">Goal Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rent a cabin in the Swiss Alps"
                  required
                  className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-purple-200 block mb-1">Category</label>
                  <select
                    value={newCat}
                    onChange={(e: any) => setNewCat(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-[#120a28] border border-purple-500/25 text-white focus:outline-none"
                  >
                    <option value="travel">Travel</option>
                    <option value="home">Home</option>
                    <option value="dates">Dates</option>
                    <option value="life">Life</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-purple-200 block mb-1">Target</label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="e.g. 2027"
                    className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs hover:brightness-110 shadow transition-all"
              >
                Add Dream Goal (+10 Starlight)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
