import React, { useState } from "react";
import { Smartphone, Apple, Check, Copy, ExternalLink, X, Server, Database, Cloud, Bell } from "lucide-react";
import confetti from "canvas-confetti";
import { playChimeSound } from "../utils/audio";

interface MobileGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileGuideModal: React.FC<MobileGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"platform" | "backend">("platform");

  if (!isOpen) return null;

  const appUrl = window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    playChimeSound();
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-3xl glass-panel border border-purple-400/30 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-pink-400" />
            <h2 className="text-lg font-serif font-bold text-white">
              Mobile & Publishing Architecture
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white p-1 rounded-lg hover:bg-purple-900/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-purple-500/20">
          <button
            onClick={() => setActiveTab("platform")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === "platform"
                ? "bg-purple-600 text-white shadow-md"
                : "text-purple-300 hover:text-white"
            }`}
          >
            Android & iOS Support
          </button>
          <button
            onClick={() => setActiveTab("backend")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === "backend"
                ? "bg-purple-600 text-white shadow-md"
                : "text-purple-300 hover:text-white"
            }`}
          >
            Backend & Publishing
          </button>
        </div>

        {activeTab === "platform" ? (
          <div className="space-y-4">
            {/* Direct App Link */}
            <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/25 space-y-2">
              <span className="text-[11px] text-purple-300 font-medium block">
                Open on your iPhone or Android phone right now:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 text-xs px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/20 text-purple-200 font-mono"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shadow hover:brightness-110"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Platform breakdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* iOS */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Apple className="w-5 h-5 text-slate-100" />
                  <span className="text-xs font-bold text-white">Apple iOS (iPhone / iPad)</span>
                </div>
                <ul className="text-[11px] text-purple-200/80 space-y-1.5">
                  <li>• Open link in <strong>Safari</strong> on iPhone.</li>
                  <li>• Tap the <strong>Share</strong> button (box with up arrow).</li>
                  <li>• Tap <strong>Add to Home Screen</strong>.</li>
                  <li>• Launches full-screen like a native App Store app with no Safari address bar!</li>
                </ul>
              </div>

              {/* Android */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Android (Pixel, Samsung, etc.)</span>
                </div>
                <ul className="text-[11px] text-purple-200/80 space-y-1.5">
                  <li>• Open link in <strong>Google Chrome</strong>.</li>
                  <li>• Tap the <strong>⋮ (Menu)</strong> in top right.</li>
                  <li>• Tap <strong>Add to Home screen</strong> or <strong>Install App</strong>.</li>
                  <li>• Installed directly as a standalone Android app with vibration & audio support!</li>
                </ul>
              </div>
            </div>

            {/* Native Store Packaging Note */}
            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 space-y-1">
              <span className="font-semibold text-pink-300 block">Can it also go to the App Store & Google Play?</span>
              <p className="text-[11px] leading-relaxed text-purple-200/80">
                Yes! Because this application is written in clean, modern React + TypeScript + Tailwind, it can be wrapped in <strong>Capacitor</strong> (`npx cap add ios` / `npx cap add android`) or <strong>TWA (Trusted Web Activity)</strong> to publish directly to the Apple App Store and Google Play Store as native binaries with zero code rewrites.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* How Backend Works */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-bold text-white">1. Current Backend (Full-Stack Express)</span>
              </div>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                The app runs a full Express server in <code className="text-pink-300">server.ts</code> with live REST endpoints for couple synchronization (<code className="text-purple-300">/api/couple/:code</code>) and secure server-side Google Gemini 3.8 Flash calls (<code className="text-purple-300">/api/gemini/translate-emotion</code>, <code className="text-purple-300">/api/gemini/generate-surprise</code>).
              </p>
            </div>

            {/* Publishing to Production */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">2. Hosting & Deployment</span>
              </div>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                When you deploy or publish, the build command is <code className="text-pink-300 font-mono">npm run build</code> and the production start command is <code className="text-pink-300 font-mono">node server.ts</code>. You can deploy it to <strong>Google Cloud Run</strong>, <strong>Render</strong>, <strong>Railway</strong>, or <strong>AWS ECS</strong> with a single click.
              </p>
            </div>

            {/* Database Persistence */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold text-white">3. Persistent Database for Millions of Couples</span>
              </div>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                For permanent cloud storage across app updates, connect <strong>Firebase Firestore</strong> or <strong>Supabase (PostgreSQL)</strong>. All data structures (<code className="text-purple-300">memories</code>, <code className="text-purple-300">unsentLetters</code>, <code className="text-purple-300">timeCapsules</code>, <code className="text-purple-300">weather</code>) are structured to map directly to document collections or SQL tables.
              </p>
            </div>

            {/* Push Notifications */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-white">4. Lock-Screen Push Notifications</span>
              </div>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                Push notifications when someone sends a heartbeat or letter can be enabled using <strong>Firebase Cloud Messaging (FCM)</strong> or the standard <strong>Web Push API</strong>. The service worker in <code className="text-purple-300 font-mono">manifest.json</code> is pre-configured to receive background pings on both iOS and Android lock screens.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold transition-colors"
        >
          Got It, Back to App
        </button>
      </div>
    </div>
  );
};
