import React, { useEffect, useState } from "react";
import { Heart, Moon, Sun, Sparkles, Users, Globe2, Bell, Smartphone } from "lucide-react";
import { CoupleState, PartnerProfile } from "../types";
import { playHeartbeatSound } from "../utils/audio";

interface HeaderProps {
  couple: CoupleState;
  activePartner: "A" | "B";
  onSwitchPartner: (partner: "A" | "B") => void;
  onSendPulse: () => void;
  onOpenCodeModal: () => void;
  notificationCount: number;
  onToggleNotificationTray: () => void;
  onOpenMobileGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  couple,
  activePartner,
  onSwitchPartner,
  onSendPulse,
  onOpenCodeModal,
  notificationCount,
  onToggleNotificationTray,
  onOpenMobileGuide,
}) => {
  const [now, setNow] = useState(new Date());
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format times in timezones
  const formatTime = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now);
    } catch {
      return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  };

  const getIsNight = (timeZone: string) => {
    try {
      const hourStr = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        hour12: false,
      }).format(now);
      const hour = parseInt(hourStr, 10);
      return hour >= 20 || hour < 6;
    } catch {
      return false;
    }
  };

  const handlePulseClick = () => {
    setPulsing(true);
    playHeartbeatSound();
    onSendPulse();
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    setTimeout(() => setPulsing(false), 1200);
  };

  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const partner = activePartner === "A" ? couple.partnerB : couple.partnerA;

  return (
    <header className="sticky top-0 z-40 bg-[#0d091e]/90 backdrop-blur-xl border-b border-purple-500/15 transition-all">
      {/* Top micro bar for timezones & connection */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs border-b border-white/[0.04]">
        {/* World Clocks */}
        <div className="flex items-center gap-3 md:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-sm">{couple.partnerA.avatar}</span>
            <span className="font-medium text-slate-200">{couple.partnerA.name}</span>
            <span className="text-slate-400">({couple.partnerA.city})</span>
            <span className="font-mono text-purple-200 font-semibold ml-0.5">
              {formatTime(couple.partnerA.timezone)}
            </span>
            {getIsNight(couple.partnerA.timezone) ? (
              <Moon className="w-3 h-3 text-indigo-400 inline" />
            ) : (
              <Sun className="w-3 h-3 text-amber-300 inline" />
            )}
          </div>

          <span className="text-purple-400/40 hidden sm:inline">⇄</span>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-sm">{couple.partnerB.avatar}</span>
            <span className="font-medium text-slate-200">{couple.partnerB.name}</span>
            <span className="text-slate-400">({couple.partnerB.city})</span>
            <span className="font-mono text-purple-200 font-semibold ml-0.5">
              {formatTime(couple.partnerB.timezone)}
            </span>
            {getIsNight(couple.partnerB.timezone) ? (
              <Moon className="w-3 h-3 text-indigo-400 inline" />
            ) : (
              <Sun className="w-3 h-3 text-amber-300 inline" />
            )}
          </div>
        </div>

        {/* Sync Rate & Couple Code */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCodeModal}
            className="flex items-center gap-1.5 text-purple-300 hover:text-purple-100 transition-colors py-0.5 px-2 rounded-md hover:bg-purple-900/30"
            title="Manage Couple Connection Code"
          >
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono tracking-wider font-medium">{couple.coupleCode}</span>
          </button>

          <div className="h-3 w-px bg-purple-500/20" />

          <button
            onClick={() => onSwitchPartner(activePartner === "A" ? "B" : "A")}
            className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded-md hover:bg-purple-800/30 transition-colors text-[11px]"
            title="Switch partner view for simulation or dual-device test"
          >
            <Users className="w-3 h-3 text-purple-300" />
            <span className="text-slate-400">View as</span>
            <span className="font-medium text-purple-200">
              {activePartner === "A" ? `${couple.partnerA.name}` : `${couple.partnerB.name}`}
            </span>
          </button>

          <div className="h-3 w-px bg-purple-500/20 hidden sm:block" />

          {onOpenMobileGuide && (
            <button
              onClick={onOpenMobileGuide}
              className="hidden sm:flex items-center gap-1 text-pink-300 hover:text-pink-100 px-2 py-0.5 rounded-md hover:bg-purple-800/30 transition-colors text-[11px]"
              title="Mobile & Publishing Architecture Guide"
            >
              <Smartphone className="w-3 h-3 text-pink-400" />
              <span>Mobile & Backend</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-purple-300/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-serif flex items-center gap-2">
              Between Us
            </span>
            <span className="text-[11px] text-purple-300/70 -mt-0.5 block">
              Level {couple.universeLevel} Cosmos · {couple.starlightPoints} Starlight
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification bell */}
          <button
            onClick={onToggleNotificationTray}
            className="relative p-2.5 rounded-xl text-purple-200 hover:bg-purple-900/30 hover:text-white transition-colors"
            title="Moments & Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#0d091e]" />
            )}
          </button>

          {/* Send Pulse / Miss You CTA */}
          <button
            onClick={handlePulseClick}
            disabled={pulsing}
            className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
              pulsing
                ? "bg-rose-500 text-white scale-105 shadow-rose-500/50"
                : "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white hover:brightness-110 shadow-purple-900/30 active:scale-95"
            }`}
          >
            <Heart
              className={`w-4 h-4 fill-current transition-transform duration-300 ${
                pulsing ? "scale-125 animate-ping text-rose-200" : "group-hover:scale-110"
              }`}
            />
            <span className="whitespace-nowrap">
              {pulsing ? "Sent Heartbeat! 💓" : "Miss You"}
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] bg-black/25 rounded-md text-pink-200 font-mono">
              {couple.pulseCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
