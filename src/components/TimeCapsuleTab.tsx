import React, { useState } from "react";
import { Hourglass, Lock, Unlock, Plus, Sparkles, Key, Calendar } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState, TimeCapsule } from "../types";
import { playChimeSound, playHeartbeatSound } from "../utils/audio";

interface TimeCapsuleTabProps {
  couple: CoupleState;
  activePartner: "A" | "B";
  onAddCapsule: (capsule: Partial<TimeCapsule>) => void;
  onUnlockCapsule: (id: string) => void;
}

export const TimeCapsuleTab: React.FC<TimeCapsuleTabProps> = ({
  couple,
  activePartner,
  onAddCapsule,
  onUnlockCapsule,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [openedCapsule, setOpenedCapsule] = useState<TimeCapsule | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [unlockDate, setUnlockDate] = useState("2026-12-31");
  const [category, setCategory] = useState("Anniversary");
  const [content, setContent] = useState("");

  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const partner = activePartner === "A" ? couple.partnerB : couple.partnerA;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddCapsule({
      title: title.trim(),
      unlockDate,
      category,
      content: content.trim(),
      author: me.name,
    });

    setTitle("");
    setContent("");
    setShowAdd(false);
    playChimeSound();
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
  };

  const handleOpenCapsule = (capsule: TimeCapsule) => {
    onUnlockCapsule(capsule.id);
    setOpenedCapsule({ ...capsule, isUnlocked: true });
    playChimeSound();
    playHeartbeatSound();
    confetti({
      particleCount: 50,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#ec4899", "#a855f7", "#fbbf24", "#38bdf8"],
    });
  };

  const getDaysUntil = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const now = Date.now();
    const diff = target - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
            <Hourglass className="w-6 h-6 text-amber-300" />
            Time Capsules
          </h1>
          <p className="text-xs text-purple-200/70 mt-1">
            Sealed surprises, letters, and predictions locked until future anniversaries and milestones
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-semibold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-purple-900/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Bury New Capsule</span>
        </button>
      </div>

      {/* Capsules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {couple.timeCapsules.map((capsule) => {
          const daysLeft = getDaysUntil(capsule.unlockDate);
          return (
            <div
              key={capsule.id}
              className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                capsule.isUnlocked
                  ? "bg-purple-950/40 border-pink-400/40"
                  : "bg-black/50 border-purple-500/25 hover:border-purple-400/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 font-medium">
                  {capsule.category}
                </span>

                <div
                  className={`p-2 rounded-xl border ${
                    capsule.isUnlocked
                      ? "bg-pink-500/20 border-pink-400 text-pink-300"
                      : "bg-black/40 border-purple-500/30 text-amber-300"
                  }`}
                >
                  {capsule.isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-serif font-bold text-white">{capsule.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-purple-300/70 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Unlocks on {capsule.unlockDate}</span>
                </div>
              </div>

              {capsule.isUnlocked ? (
                <div className="p-3.5 rounded-2xl bg-purple-900/30 border border-purple-400/20 text-xs sm:text-sm text-purple-100 font-serif whitespace-pre-wrap">
                  "{capsule.content}"
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-amber-300 font-mono">
                    ⏳ {daysLeft} days remaining
                  </span>
                  <button
                    onClick={() => handleOpenCapsule(capsule)}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 transition-colors"
                  >
                    <Key className="w-3 h-3 text-amber-300" /> Test Key
                  </button>
                </div>
              )}

              <div className="text-[11px] text-purple-400/60 pt-2 border-t border-white/5">
                Burying partner: {capsule.author}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bury Capsule Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-purple-500/30 p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-amber-300" />
                Seal a Future Time Capsule
              </h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-xs text-purple-300 hover:text-white px-2 py-1 rounded-lg hover:bg-purple-900/30"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-purple-200 block mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. For our wedding anniversary or move-in day"
                  required
                  className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-purple-200 block mb-1">
                    Unlock Date
                  </label>
                  <input
                    type="date"
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    required
                    className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-purple-200 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-[#120a28] border border-purple-500/25 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Anniversary">Anniversary</option>
                    <option value="Future Move">Future Move</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Secret Letter">Secret Letter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-purple-200 block mb-1">
                  Secret Message or Prediction
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="What secret message or prediction do you want future you two to uncover?"
                  required
                  className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-semibold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-purple-900/30 transition-all"
              >
                Lock Capsule in Time (+25 Starlight)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
