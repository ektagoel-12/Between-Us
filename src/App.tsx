import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Heart,
  Globe2,
  Coffee,
  Mail,
  Dice5,
  Sun,
  Camera,
  Hourglass,
  Plane,
  Gift,
  Compass,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Header } from "./components/Header";
import { UniverseTab } from "./components/UniverseTab";
import { ParallelTab } from "./components/ParallelTab";
import { TranslatorTab } from "./components/TranslatorTab";
import { UnsentTab } from "./components/UnsentTab";
import { GamesTab } from "./components/GamesTab";
import { WeatherTab } from "./components/WeatherTab";
import { MuseumTab } from "./components/MuseumTab";
import { TimeCapsuleTab } from "./components/TimeCapsuleTab";
import { FutureTab } from "./components/FutureTab";
import { SurpriseTab } from "./components/SurpriseTab";
import { CoupleCodeModal } from "./components/CoupleCodeModal";
import { NotificationTray } from "./components/NotificationTray";
import { MobileGuideModal } from "./components/MobileGuideModal";
import { CoupleState, UnsentLetter, Memory, TimeCapsule, BucketItem, ParallelSession } from "./types";
import { playChimeSound, playHeartbeatSound } from "./utils/audio";

export default function App() {
  const [activePartner, setActivePartner] = useState<"A" | "B">("A");
  const [activeTab, setActiveTab] = useState<
    | "universe"
    | "parallel"
    | "translator"
    | "unsent"
    | "games"
    | "weather"
    | "museum"
    | "capsules"
    | "future"
    | "surprise"
  >("universe");

  const [coupleCode, setCoupleCode] = useState("BETWEEN-US");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showMobileGuide, setShowMobileGuide] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "pulse" | "letter" | "weather" | "parallel";
      title: string;
      message: string;
      time: string;
    }>
  >([
    {
      id: "n-1",
      type: "pulse",
      title: "Heartbeat Arrived",
      message: "Liam sent a heartbeat pulse across 6,740 miles! 💓",
      time: "10 mins ago",
    },
    {
      id: "n-2",
      type: "letter",
      title: "New Unsent Letter Sealed",
      message: "Maya sealed an 'Open When' letter in crimson wax ✨",
      time: "1 hour ago",
    },
  ]);

  // Initial Couple State
  const [couple, setCouple] = useState<CoupleState>({
    coupleCode: "BETWEEN-US",
    partnerA: {
      name: "Maya",
      city: "Tokyo",
      timezone: "Asia/Tokyo",
      avatar: "🌸",
      weather: {
        mood: "Gentle Rain 🌧️",
        note: "Long design sprint today, missing your laugh across the ocean",
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    },
    partnerB: {
      name: "Liam",
      city: "New York",
      timezone: "America/New_York",
      avatar: "☕",
      weather: {
        mood: "Sunny & Radiant ☀️",
        note: "Morning coffee ready, excited for our parallel study session!",
        updatedAt: new Date().toISOString(),
      },
    },
    universeLevel: 4,
    starlightPoints: 380,
    parallelSession: {
      type: "coffee",
      status: "idle",
      startTime: null,
      durationMinutes: 20,
      activityDetails: "Quiet morning brew & dusk conversation",
    },
    pulseCount: 142,
    lastPulse: {
      from: "Liam",
      message: "Sent a warm heartbeat across 6,740 miles ✨",
      timestamp: Date.now() - 1000 * 60 * 12,
    },
    memories: [
      {
        id: "m-1",
        title: "First Midnight Airport Run",
        date: "2025-10-14",
        category: "Firsts",
        description:
          "Running through Haneda terminal at 11:45 PM just to hug for 3 minutes before the last train.",
        imageUrl: "/src/assets/images/hero_couple_starlight_1794344570405.jpg",
        author: "Maya",
        insideJoke: "The spilled matcha latte incident 😂",
      },
      {
        id: "m-2",
        title: "Synchronized Ramen & Bagel Dinner",
        date: "2025-12-24",
        category: "Milestones",
        description:
          "Our Christmas Eve virtual dinner across 13 hours time difference. Lit identical candles.",
        imageUrl: "/src/assets/images/parallel_cafe_date_1794344570408.jpg",
        author: "Liam",
      },
      {
        id: "m-3",
        title: "Tokyo Tower & Empire State Building Photo Merge",
        date: "2026-03-01",
        category: "Trips",
        description:
          "Took photos looking at our respective city towers at the exact same minute.",
        imageUrl: "/src/assets/images/hero_couple_starlight_1794344570405.jpg",
        author: "Maya",
        insideJoke: "Both wearing the matching wool scarves",
      },
    ],
    unsentLetters: [
      {
        id: "l-1",
        title: "When you feel like distance is winning",
        recipientCondition: "Open When you miss me terribly",
        content:
          "Remember that every mile between us is just proof of how deep this is. If love could be measured in miles, we've already conquered the earth. Close your eyes, feel your heartbeat—that rhythm matches mine.",
        isOpened: false,
        createdAt: "2026-02-14",
        author: "Liam",
      },
      {
        id: "l-2",
        title: "When work was brutal and your head hurts",
        recipientCondition: "Open When you had a bad day",
        content:
          "Put down the screen, take off your shoes, and breathe in for 4 seconds. I am sending you the gentlest forehead kiss. Tomorrow is a brand new sunrise.",
        isOpened: false,
        createdAt: "2026-02-28",
        author: "Maya",
      },
      {
        id: "l-3",
        title: "A midnight lullaby from across the sea",
        recipientCondition: "Open When you can't fall asleep",
        content:
          "Picture our tiny cozy apartment in Kyoto with tatami mats, rain pattering outside, and both of us wrapped in one heavy quilt. You are completely safe with me.",
        isOpened: false,
        createdAt: "2026-03-10",
        author: "Liam",
      },
    ],
    timeCapsules: [
      {
        id: "c-1",
        title: "Our 2nd Anniversary Letter & Secret Montage",
        unlockDate: "2026-11-20",
        content:
          "Two full years of late-night calls, boarding passes, and choosing each other every single morning.",
        author: "Liam",
        isUnlocked: false,
        category: "Anniversary",
      },
      {
        id: "c-2",
        title: "Predictions for the day we finally move in together",
        unlockDate: "2027-01-01",
        content:
          "I predict Liam will steal 70% of the closet space with his hoodies, and Maya will own at least 14 indoor plants within 48 hours.",
        author: "Maya",
        isUnlocked: false,
        category: "Future Move",
      },
    ],
    bucketList: [
      {
        id: "b-1",
        title: "Catch cherry blossoms together in Shinjuku Gyoen",
        category: "travel",
        completed: false,
        targetYear: "Spring 2027",
        votedBy: ["Maya", "Liam"],
      },
      {
        id: "b-2",
        title: "Cook homemade gnocchi over a 3-hour video date without burning garlic",
        category: "dates",
        completed: true,
        targetYear: "2026",
        notes: "Achieved on Feb 2nd! Liam's sauce was legendary.",
        votedBy: ["Maya", "Liam"],
      },
      {
        id: "b-3",
        title: "Rent a secluded cabin in Norway to watch Northern Lights",
        category: "travel",
        completed: false,
        targetYear: "Winter 2027",
        votedBy: ["Maya", "Liam"],
      },
      {
        id: "b-4",
        title: "Adopt a golden retriever named Miso",
        category: "home",
        completed: false,
        votedBy: ["Maya", "Liam"],
      },
    ],
    gameSessions: {},
  });

  // Fetch couple state from server
  useEffect(() => {
    fetch(`/api/couple/${coupleCode}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.store) {
          setCouple(data.store);
        }
      })
      .catch((e) => console.log("Local state fallback active", e));
  }, [coupleCode]);

  // Handlers
  const handleSendPulse = async () => {
    const sender = activePartner === "A" ? couple.partnerA.name : couple.partnerB.name;
    const receiver = activePartner === "A" ? couple.partnerB.name : couple.partnerA.name;

    setCouple((prev) => ({
      ...prev,
      pulseCount: prev.pulseCount + 1,
      starlightPoints: prev.starlightPoints + 5,
      lastPulse: {
        from: sender,
        message: `Sent a warm heartbeat across 6,740 miles to ${receiver} ✨`,
        timestamp: Date.now(),
      },
    }));

    // Add notification
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        type: "pulse",
        title: "Heartbeat Pulse Sent",
        message: `${sender} sent a warm heartbeat to ${receiver} 💓`,
        time: "Just now",
      },
      ...prev,
    ]);

    try {
      await fetch(`/api/couple/${coupleCode}/pulse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: sender }),
      });
    } catch (e) {
      // offline/fallback
    }
  };

  const handleUpdateWeather = async (weather: { mood: string; note: string }) => {
    const partnerKey = activePartner === "A" ? "partnerA" : "partnerB";
    setCouple((prev) => ({
      ...prev,
      [partnerKey]: {
        ...prev[partnerKey],
        weather: { ...weather, updatedAt: new Date().toISOString() },
      },
      starlightPoints: prev.starlightPoints + 10,
    }));

    try {
      await fetch(`/api/couple/${coupleCode}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner: activePartner, weather }),
      });
    } catch (e) {}
  };

  const handleSendComfort = (actionName: string) => {
    const sender = activePartner === "A" ? couple.partnerA.name : couple.partnerB.name;
    const receiver = activePartner === "A" ? couple.partnerB.name : couple.partnerA.name;

    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        type: "weather",
        title: "Comfort Arrived",
        message: `${sender} sent ${actionName} to ${receiver}! ✨`,
        time: "Just now",
      },
      ...prev,
    ]);
  };

  const handleUpdateSession = async (session: Partial<ParallelSession>) => {
    setCouple((prev) => ({
      ...prev,
      parallelSession: { ...prev.parallelSession, ...session },
      starlightPoints:
        session.status === "completed" ? prev.starlightPoints + 25 : prev.starlightPoints,
    }));

    try {
      await fetch(`/api/couple/${coupleCode}/parallel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });
    } catch (e) {}
  };

  const handleAddMemory = async (mem: Partial<Memory>) => {
    const newMem: Memory = {
      id: `m-${Date.now()}`,
      title: mem.title || "Cherished Moment",
      date: mem.date || new Date().toISOString().split("T")[0],
      category: mem.category || "Milestones",
      description: mem.description || "",
      imageUrl: mem.imageUrl,
      author: mem.author || "Together",
      insideJoke: mem.insideJoke,
    };

    setCouple((prev) => ({
      ...prev,
      memories: [newMem, ...prev.memories],
      starlightPoints: prev.starlightPoints + 20,
    }));

    try {
      await fetch(`/api/couple/${coupleCode}/memory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mem),
      });
    } catch (e) {}
  };

  const handleAddLetter = async (letter: Partial<UnsentLetter>) => {
    const newL: UnsentLetter = {
      id: `l-${Date.now()}`,
      title: letter.title || "Letter for your heart",
      recipientCondition: letter.recipientCondition || "Open When you need love",
      content: letter.content || "",
      isOpened: false,
      createdAt: new Date().toISOString().split("T")[0],
      author: letter.author || "Me",
      hasAudio: letter.hasAudio,
      audioData: letter.audioData,
    };

    setCouple((prev) => ({
      ...prev,
      unsentLetters: [newL, ...prev.unsentLetters],
      starlightPoints: prev.starlightPoints + 15,
    }));

    try {
      await fetch(`/api/couple/${coupleCode}/unsent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(letter),
      });
    } catch (e) {}
  };

  const handleOpenLetter = async (id: string) => {
    setCouple((prev) => ({
      ...prev,
      unsentLetters: prev.unsentLetters.map((l) =>
        l.id === id ? { ...l, isOpened: true, openedAt: new Date().toISOString() } : l
      ),
      starlightPoints: prev.starlightPoints + 10,
    }));

    try {
      await fetch(`/api/couple/${coupleCode}/unsent/${id}/open`, { method: "POST" });
    } catch (e) {}
  };

  const handleAddCapsule = async (cap: Partial<TimeCapsule>) => {
    const newC: TimeCapsule = {
      id: `c-${Date.now()}`,
      title: cap.title || "Future Surprise",
      unlockDate:
        cap.unlockDate || new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
      content: cap.content || "",
      author: cap.author || "Partner",
      isUnlocked: false,
      category: cap.category || "Surprise",
    };

    setCouple((prev) => ({
      ...prev,
      timeCapsules: [newC, ...prev.timeCapsules],
      starlightPoints: prev.starlightPoints + 25,
    }));

    try {
      await fetch(`/api/couple/${coupleCode}/capsule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cap),
      });
    } catch (e) {}
  };

  const handleUnlockCapsule = async (id: string) => {
    setCouple((prev) => ({
      ...prev,
      timeCapsules: prev.timeCapsules.map((c) =>
        c.id === id ? { ...c, isUnlocked: true } : c
      ),
      starlightPoints: prev.starlightPoints + 30,
    }));

    try {
      await fetch(`/api/couple/${coupleCode}/capsule/${id}/unlock`, { method: "POST" });
    } catch (e) {}
  };

  const handleAddBucketItem = async (item: Partial<BucketItem>) => {
    const newB: BucketItem = {
      id: `b-${Date.now()}`,
      title: item.title || "Adventure",
      category: item.category || "travel",
      completed: false,
      targetYear: item.targetYear,
      notes: item.notes,
      votedBy: item.author ? [item.author] : ["Maya"],
    };

    setCouple((prev) => ({
      ...prev,
      bucketList: [newB, ...prev.bucketList],
      starlightPoints: prev.starlightPoints + 10,
    }));

    try {
      await fetch(`/api/couple/${coupleCode}/bucket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } catch (e) {}
  };

  const handleToggleBucketItem = async (id: string) => {
    setCouple((prev) => ({
      ...prev,
      bucketList: prev.bucketList.map((b) =>
        b.id === id ? { ...b, completed: !b.completed } : b
      ),
    }));

    try {
      await fetch(`/api/couple/${coupleCode}/bucket/${id}/toggle`, { method: "POST" });
    } catch (e) {}
  };

  const tabs = [
    { id: "universe", label: "Universe", icon: Sparkles },
    { id: "parallel", label: "Parallel", icon: Coffee },
    { id: "translator", label: "AI Translator", icon: Heart },
    { id: "unsent", label: "Unsent", icon: Mail },
    { id: "games", label: "Games", icon: Dice5 },
    { id: "weather", label: "Weather", icon: Sun },
    { id: "museum", label: "Museum", icon: Camera },
    { id: "capsules", label: "Capsules", icon: Hourglass },
    { id: "future", label: "Future", icon: Plane },
    { id: "surprise", label: "Surprise AI", icon: Gift },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0b0817] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Header */}
      <Header
        couple={couple}
        activePartner={activePartner}
        onSwitchPartner={(p) => {
          setActivePartner(p);
          playChimeSound();
        }}
        onSendPulse={handleSendPulse}
        onOpenCodeModal={() => setShowCodeModal(true)}
        onOpenMobileGuide={() => setShowMobileGuide(true)}
        notificationCount={notifications.length}
        onToggleNotificationTray={() => setShowNotifications(!showNotifications)}
      />

      {/* Universal Navigation Ribbon for all 10 screens */}
      <nav className="sticky top-[85px] z-30 bg-[#0d091e]/90 backdrop-blur-md border-b border-purple-500/15">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center gap-1.5 py-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest px-2 shrink-0 hidden sm:inline">
            Screens:
          </span>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  playChimeSound();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600/40 to-pink-600/40 text-white border border-pink-400/50 shadow-md shadow-purple-950/40 scale-[1.02]"
                    : "text-purple-300/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-pink-400" : "text-purple-400"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-12">
        {activeTab === "universe" && (
          <UniverseTab
            couple={couple}
            activePartner={activePartner}
            onSendPulse={handleSendPulse}
            onQuickAction={(tabName: any) => setActiveTab(tabName)}
          />
        )}

        {activeTab === "parallel" && (
          <ParallelTab
            couple={couple}
            activePartner={activePartner}
            onUpdateSession={handleUpdateSession}
            onSendPulse={handleSendPulse}
          />
        )}

        {activeTab === "translator" && (
          <TranslatorTab
            couple={couple}
            activePartner={activePartner}
            onSendUnsentLetter={(title, content) =>
              handleAddLetter({
                title,
                content,
                recipientCondition: "Open When we had a disagreement",
                author: activePartner === "A" ? couple.partnerA.name : couple.partnerB.name,
              })
            }
          />
        )}

        {activeTab === "unsent" && (
          <UnsentTab
            couple={couple}
            activePartner={activePartner}
            onAddLetter={handleAddLetter}
            onOpenLetter={handleOpenLetter}
          />
        )}

        {activeTab === "games" && (
          <GamesTab
            couple={couple}
            activePartner={activePartner}
            onSendPulse={handleSendPulse}
          />
        )}

        {activeTab === "weather" && (
          <WeatherTab
            couple={couple}
            activePartner={activePartner}
            onUpdateWeather={handleUpdateWeather}
            onSendComfort={handleSendComfort}
          />
        )}

        {activeTab === "museum" && (
          <MuseumTab
            couple={couple}
            activePartner={activePartner}
            onAddMemory={handleAddMemory}
          />
        )}

        {activeTab === "capsules" && (
          <TimeCapsuleTab
            couple={couple}
            activePartner={activePartner}
            onAddCapsule={handleAddCapsule}
            onUnlockCapsule={handleUnlockCapsule}
          />
        )}

        {activeTab === "future" && (
          <FutureTab
            couple={couple}
            activePartner={activePartner}
            onAddBucketItem={handleAddBucketItem}
            onToggleBucketItem={handleToggleBucketItem}
            onSendPulse={handleSendPulse}
          />
        )}

        {activeTab === "surprise" && (
          <SurpriseTab couple={couple} activePartner={activePartner} />
        )}
      </main>

      {/* Mobile Bottom Tab Bar (thumb-zone ergonomics, all 10 reachable) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d091e]/95 backdrop-blur-xl border-t border-purple-500/20 px-2 py-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-around gap-1 min-w-max px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playChimeSound();
                }}
                className={`min-h-[44px] min-w-[54px] px-2 flex flex-col items-center justify-center transition-all ${
                  isActive ? "text-pink-400 font-semibold" : "text-purple-300/70 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-pink-400 scale-110" : ""}`} />
                <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals & Trays */}
      <CoupleCodeModal
        isOpen={showCodeModal}
        couple={couple}
        onClose={() => setShowCodeModal(false)}
        onJoinCode={(newCode) => setCoupleCode(newCode)}
      />

      <NotificationTray
        notifications={notifications}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onClear={() => setNotifications([])}
      />

      <MobileGuideModal
        isOpen={showMobileGuide}
        onClose={() => setShowMobileGuide(false)}
      />
    </div>
  );
}
