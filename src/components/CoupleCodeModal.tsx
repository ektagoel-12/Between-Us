import React, { useState, useEffect } from "react";
import { Copy, Check, Globe2, X, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState } from "../types";
import { playChimeSound } from "../utils/audio";

interface CoupleCodeModalProps {
  isOpen: boolean;
  couple: CoupleState;
  onClose: () => void;
  onJoinCode: (code: string) => void;
}

export const CoupleCodeModal: React.FC<CoupleCodeModalProps> = ({
  isOpen,
  couple,
  onClose,
  onJoinCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(couple.coupleCode);
    setCopied(true);
    playChimeSound();
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    onJoinCode(inputCode.trim().toUpperCase());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-3xl glass-panel border border-purple-400/30 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 shadow-2xl">
        <div className="flex items-center justify-between pb-1 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-serif font-bold text-white">Couple Sanctuary Code</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs text-purple-200 hover:text-white px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Close & Return</span>
          </button>
        </div>

        {/* Current Couple Code Display */}
        <div className="p-5 rounded-2xl bg-black/50 border border-purple-500/30 text-center space-y-2">
          <span className="text-[11px] text-purple-300/80 uppercase tracking-widest block font-medium">
            Your Private Room Code
          </span>
          <span className="text-3xl font-mono font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 block">
            {couple.coupleCode}
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Code Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Invite Code</span>
              </>
            )}
          </button>
        </div>

        {/* Connected Partners Details */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-purple-300/60 block">Partner A</span>
            <span className="font-semibold text-white block mt-0.5">
              {couple.partnerA.avatar} {couple.partnerA.name}
            </span>
            <span className="text-purple-300/80 text-[11px]">{couple.partnerA.city}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-purple-300/60 block">Partner B</span>
            <span className="font-semibold text-white block mt-0.5">
              {couple.partnerB.avatar} {couple.partnerB.name}
            </span>
            <span className="text-purple-300/80 text-[11px]">{couple.partnerB.city}</span>
          </div>
        </div>

        {/* Join Another Couple Code Form */}
        <form onSubmit={handleJoin} className="space-y-2 pt-2 border-t border-white/5">
          <label className="text-xs font-medium text-purple-200 block">
            Pair with another couple code or device:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. US-8822"
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-black/40 border border-purple-500/25 text-white font-mono placeholder-purple-400/40 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition-all"
            >
              Switch Room
            </button>
          </div>
        </form>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-950/40 hover:brightness-110 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Enter Couple Space</span>
          </button>
        </div>
      </div>
    </div>
  );
};
