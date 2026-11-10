import React, { useState } from "react";
import { Camera, Calendar, Sparkles, Plus, Image as ImageIcon, Heart, Tag } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState, Memory } from "../types";
import { playChimeSound } from "../utils/audio";

interface MuseumTabProps {
  couple: CoupleState;
  activePartner: "A" | "B";
  onAddMemory: (memory: Partial<Memory>) => void;
}

export const MuseumTab: React.FC<MuseumTabProps> = ({
  couple,
  activePartner,
  onAddMemory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Milestones");
  const [description, setDescription] = useState("");
  const [insideJoke, setInsideJoke] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const categories = ["All", "Firsts", "Trips", "Milestones", "Silly Moments"];

  const filteredMemories =
    selectedCategory === "All"
      ? couple.memories
      : couple.memories.filter((m) => m.category === selectedCategory);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddMemory({
      title: title.trim(),
      date,
      category,
      description: description.trim(),
      insideJoke: insideJoke.trim() || undefined,
      imageUrl: imageUrl.trim() || "/src/assets/images/hero_couple_starlight_1794344570405.jpg",
      author: me.name,
    });

    setTitle("");
    setDescription("");
    setInsideJoke("");
    setImageUrl("");
    setShowAddModal(false);
    playChimeSound();
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
            <Camera className="w-6 h-6 text-pink-400" />
            Memory Museum & Milestone Timeline
          </h1>
          <p className="text-xs text-purple-200/70 mt-1">
            An interactive archive of firsts, inside jokes, reunions, and quiet victories over distance
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-semibold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-purple-900/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exhibit</span>
        </button>
      </div>

      {/* Museum Milestone Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl glass-panel border border-purple-500/20 text-center">
          <span className="text-[11px] text-purple-300/70 block">Days in Love</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-white">412</span>
          <span className="text-[10px] text-pink-300 block">Since Day 1</span>
        </div>
        <div className="p-4 rounded-3xl glass-panel border border-purple-500/20 text-center">
          <span className="text-[11px] text-purple-300/70 block">Airport Hugs</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-white">6</span>
          <span className="text-[10px] text-indigo-300 block">Gate reunions</span>
        </div>
        <div className="p-4 rounded-3xl glass-panel border border-purple-500/20 text-center">
          <span className="text-[11px] text-purple-300/70 block">Time Capsules</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-white">
            {couple.timeCapsules.length}
          </span>
          <span className="text-[10px] text-amber-300 block">Sealed for future</span>
        </div>
        <div className="p-4 rounded-3xl glass-panel border border-purple-500/20 text-center">
          <span className="text-[11px] text-purple-300/70 block">Next Touchdown</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-pink-300">18 Days</span>
          <span className="text-[10px] text-rose-300 block">Counting every minute</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "bg-black/40 text-purple-300 hover:text-white border border-purple-500/15"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exhibits Timeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            onClick={() => setSelectedMemory(mem)}
            className="cursor-pointer rounded-3xl bg-[#130b2c]/80 border border-purple-500/20 hover:border-pink-400/50 p-4 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/40 group flex flex-col justify-between"
          >
            {/* Memory Visual / Polaroid Frame */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/5">
              <img
                src={mem.imageUrl || "/src/assets/images/hero_couple_starlight_1794344570405.jpg"}
                alt={mem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-purple-200 backdrop-blur-md">
                {mem.category}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-purple-300/70">
                <span>{mem.date}</span>
                <span>By {mem.author}</span>
              </div>
              <h3 className="text-base font-serif font-bold text-white group-hover:text-pink-200 transition-colors">
                {mem.title}
              </h3>
              <p className="text-xs text-purple-200/80 line-clamp-2 leading-relaxed">
                {mem.description}
              </p>
            </div>

            {mem.insideJoke && (
              <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-pink-300 font-medium">
                <Tag className="w-3 h-3 text-pink-400 shrink-0" />
                <span className="truncate">{mem.insideJoke}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-purple-500/30 p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-pink-400" />
                Archive a Cherished Milestone
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-purple-300 hover:text-white px-2 py-1 rounded-lg hover:bg-purple-900/30"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-purple-200 block mb-1">
                  Memory Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midnight Airport Reunion in Tokyo"
                  required
                  className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-purple-200 block mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-purple-200 block mb-1">
                    Exhibit Hall
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-[#120a28] border border-purple-500/25 text-white focus:outline-none focus:border-purple-400"
                  >
                    {categories.filter((c) => c !== "All").map((c, i) => (
                      <option key={i} value={c} className="bg-[#120a28] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-purple-200 block mb-1">
                  The Story & Significance
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What happened? How did it feel to be in the same space?"
                  required
                  className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-purple-200 block mb-1">
                  Inside Joke / Secret Tag (Optional)
                </label>
                <input
                  type="text"
                  value={insideJoke}
                  onChange={(e) => setInsideJoke(e.target.value)}
                  placeholder="e.g. The infamous spilled matcha latte 😂"
                  className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-semibold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-purple-900/30 transition-all"
              >
                Place in Museum (+20 Starlight)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-pink-400/40 p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
              <img
                src={selectedMemory.imageUrl || "/src/assets/images/hero_couple_starlight_1794344570405.jpg"}
                alt={selectedMemory.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-md">
                {selectedMemory.category} · {selectedMemory.date}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-white">
                  {selectedMemory.title}
                </h2>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="text-xs text-purple-300 hover:text-white px-2 py-1 rounded-lg hover:bg-purple-900/30"
                >
                  Close
                </button>
              </div>

              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-serif whitespace-pre-wrap">
                {selectedMemory.description}
              </p>

              {selectedMemory.insideJoke && (
                <div className="p-3 rounded-xl bg-pink-500/15 border border-pink-400/25 text-xs text-pink-300 font-medium">
                  Secret Inside Joke: {selectedMemory.insideJoke}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
