import React from "react";
import { Bell, Heart, Mail, Sparkles, X } from "lucide-react";
import { CoupleState } from "../types";

interface NotificationItem {
  id: string;
  type: "pulse" | "letter" | "weather" | "parallel";
  title: string;
  message: string;
  time: string;
}

interface NotificationTrayProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const NotificationTray: React.FC<NotificationTrayProps> = ({
  notifications,
  isOpen,
  onClose,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-4 z-50 w-80 sm:w-96 rounded-3xl glass-panel border border-purple-400/30 p-5 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-pink-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Moments & Whispers
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={onClear}
              className="text-[11px] text-purple-300 hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-white p-1 rounded-lg hover:bg-purple-900/30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-xs text-purple-300/60">
            No unread whispers right now. Send a heartbeat to your partner! 💜
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-pink-300 flex items-center gap-1.5">
                  {n.type === "pulse" && <Heart className="w-3 h-3 fill-pink-500" />}
                  {n.type === "letter" && <Mail className="w-3 h-3 text-indigo-400" />}
                  {n.title}
                </span>
                <span className="text-[10px] text-purple-400/60">{n.time}</span>
              </div>
              <p className="text-slate-200 text-[11px] leading-relaxed">{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
