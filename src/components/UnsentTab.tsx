import React, { useState, useRef } from "react";
import { Mail, Mic, MicOff, Lock, Unlock, Play, Square, Plus, Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState, UnsentLetter } from "../types";
import { playChimeSound, playHeartbeatSound, VoiceRecorder } from "../utils/audio";

interface UnsentTabProps {
  couple: CoupleState;
  activePartner: "A" | "B";
  onAddLetter: (letter: Partial<UnsentLetter>) => void;
  onOpenLetter: (id: string) => void;
}

export const UnsentTab: React.FC<UnsentTabProps> = ({
  couple,
  activePartner,
  onAddLetter,
  onOpenLetter,
}) => {
  const [showCompose, setShowCompose] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<UnsentLetter | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [condition, setCondition] = useState("Open When you miss me terribly");
  const [content, setContent] = useState("");
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<VoiceRecorder | null>(null);

  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const partner = activePartner === "A" ? couple.partnerB : couple.partnerA;

  const conditions = [
    "Open When you miss me terribly",
    "Open When you had a bad day",
    "Open When you can't fall asleep",
    "Open When we had a disagreement",
    "Open When you need a reminder of how much I love you",
    "Open When you feel proud of yourself",
  ];

  const handleStartRecording = async () => {
    try {
      const rec = new VoiceRecorder();
      recorderRef.current = rec;
      await rec.start();
      setIsRecording(true);
      playHeartbeatSound();
    } catch (err) {
      console.error("Recording error:", err);
      alert("Microphone permission needed to record voice note.");
    }
  };

  const handleStopRecording = async () => {
    if (!recorderRef.current) return;
    try {
      const dataUrl = await recorderRef.current.stop();
      setRecordedAudio(dataUrl);
      setIsRecording(false);
      playChimeSound();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const handleCreateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddLetter({
      title: title.trim(),
      recipientCondition: condition,
      content: content.trim(),
      author: me.name,
      audioData: recordedAudio || undefined,
      hasAudio: Boolean(recordedAudio),
    });

    setTitle("");
    setContent("");
    setRecordedAudio(null);
    setShowCompose(false);
    playChimeSound();
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
  };

  const handleUnseal = (letter: UnsentLetter) => {
    if (!letter.isOpened) {
      onOpenLetter(letter.id);
      playChimeSound();
      playHeartbeatSound();
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#ec4899", "#a855f7", "#e9d5ff", "#f43f5e"],
      });
    }
    setSelectedLetter({ ...letter, isOpened: true });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-pink-400" />
            Unsent Universe & Audio Notes
          </h1>
          <p className="text-xs text-purple-200/70 mt-1">
            Words saved for the exact moment your partner needs them most. Sealed in virtual wax.
          </p>
        </div>

        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-semibold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-purple-900/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Write "Open When" Letter</span>
        </button>
      </div>

      {/* Grid of Envelopes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {couple.unsentLetters.map((letter) => (
          <div
            key={letter.id}
            onClick={() => handleUnseal(letter)}
            className={`cursor-pointer rounded-3xl p-5 border transition-all duration-300 relative group overflow-hidden flex flex-col justify-between ${
              letter.isOpened
                ? "bg-[#140d2a]/70 border-purple-400/30 hover:border-purple-300/60"
                : "bg-gradient-to-br from-[#1a1138]/90 via-[#130b2c]/90 to-[#0e0822] border-purple-500/30 hover:border-pink-400/50 hover:shadow-xl hover:shadow-purple-900/30 hover:-translate-y-1"
            }`}
          >
            {/* Wax seal badge */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-medium text-pink-300 px-2.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-400/20">
                {letter.recipientCondition}
              </span>

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border shadow-sm ${
                  letter.isOpened
                    ? "bg-purple-900/40 border-purple-400/30 text-purple-300"
                    : "bg-gradient-to-tr from-rose-600 to-pink-500 border-rose-300/50 text-white group-hover:scale-110 transition-transform"
                }`}
                title={letter.isOpened ? "Unsealed" : "Sealed Wax"}
              >
                {letter.isOpened ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div className="my-4 space-y-1">
              <h3 className="text-base font-serif font-bold text-white group-hover:text-pink-200 transition-colors">
                {letter.title}
              </h3>
              <p className="text-xs text-purple-200/70 line-clamp-2">
                {letter.isOpened ? letter.content : "Sealed message. Tap to break the wax seal..."}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-purple-300/60 pt-2 border-t border-white/5">
              <span>From {letter.author}</span>
              <div className="flex items-center gap-2">
                {letter.hasAudio && (
                  <span className="text-pink-300 flex items-center gap-1">
                    <Mic className="w-3 h-3" /> Voice Memo
                  </span>
                )}
                <span>{letter.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Letter Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-purple-500/30 p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-400" />
                Seal an "Open When" Letter
              </h2>
              <button
                onClick={() => setShowCompose(false)}
                className="text-xs text-purple-300 hover:text-white px-2 py-1 rounded-lg hover:bg-purple-900/30"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateLetter} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-purple-200 block mb-1">
                  Envelope Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. For when the world feels too loud"
                  required
                  className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-purple-200 block mb-1">
                  Open When Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl bg-[#120a28] border border-purple-500/25 text-white focus:outline-none focus:border-purple-400"
                >
                  {conditions.map((c, i) => (
                    <option key={i} value={c} className="bg-[#120a28] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-purple-200 block mb-1">
                  Letter Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Pour your heart out. What do they need to hear when they open this?"
                  required
                  className="w-full text-xs p-3 rounded-2xl bg-black/40 border border-purple-500/25 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Optional Voice Note Recording */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-200 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-pink-400" /> Attach a Voice Note (Optional)
                  </span>
                  {recordedAudio && (
                    <span className="text-[11px] text-emerald-300 font-medium">✓ Audio recorded</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold animate-pulse"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" /> Stop & Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-medium border border-purple-400/30"
                    >
                      <Mic className="w-3.5 h-3.5 text-pink-400" />
                      {recordedAudio ? "Re-record Voice Memo" : "Record Voice Note"}
                    </button>
                  )}
                  {recordedAudio && (
                    <audio controls src={recordedAudio} className="h-8 max-w-[200px]" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-semibold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-purple-900/30 transition-all"
              >
                Seal with Crimson Wax (+15 Starlight)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Read Letter Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-pink-400/30 p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-medium">
                {selectedLetter.recipientCondition}
              </span>
              <button
                onClick={() => setSelectedLetter(null)}
                className="text-xs text-purple-300 hover:text-white px-2 py-1 rounded-lg hover:bg-purple-900/30"
              >
                Close
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-serif font-bold text-white">{selectedLetter.title}</h2>
              <span className="text-[11px] text-purple-300/60 block">
                Written with love by {selectedLetter.author} · {selectedLetter.createdAt}
              </span>
            </div>

            {/* Letter prose */}
            <div className="p-4 rounded-2xl bg-black/30 border border-purple-500/20 text-sm sm:text-base text-slate-100 font-serif leading-relaxed whitespace-pre-wrap">
              {selectedLetter.content}
            </div>

            {/* Audio player if present */}
            {selectedLetter.audioData && (
              <div className="p-3.5 rounded-2xl bg-purple-950/70 border border-purple-500/30 space-y-1.5">
                <span className="text-xs text-pink-300 font-medium flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" /> Voice Memo from {selectedLetter.author}
                </span>
                <audio controls src={selectedLetter.audioData} className="w-full h-9" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
