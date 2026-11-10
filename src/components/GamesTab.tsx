import React, { useState } from "react";
import { Dice5, HelpCircle, Flame, MessageSquareQuote, Shuffle, CheckCircle2, Trophy, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { CoupleState } from "../types";
import { playChimeSound, playHeartbeatSound } from "../utils/audio";

interface GamesTabProps {
  couple: CoupleState;
  activePartner: "A" | "B";
  onSendPulse: () => void;
}

export const GamesTab: React.FC<GamesTabProps> = ({
  couple,
  activePartner,
  onSendPulse,
}) => {
  const [selectedGame, setSelectedGame] = useState<
    "would_you_rather" | "trivia" | "truth_or_dare" | "deep_talk" | "guess_answer"
  >("would_you_rather");

  const me = activePartner === "A" ? couple.partnerA : couple.partnerB;
  const partner = activePartner === "A" ? couple.partnerB : couple.partnerA;

  // Would You Rather state
  const [wyrIndex, setWyrIndex] = useState(0);
  const [myWyrChoice, setMyWyrChoice] = useState<"A" | "B" | null>(null);
  const [revealedWyr, setRevealedWyr] = useState(false);

  const wyrQuestions = [
    {
      qA: "Have a surprise 48-hour spontaneous visit tomorrow",
      qB: "Wait 4 months for an uninterrupted 3-week vacation in Europe",
      partnerPick: "A",
    },
    {
      qA: "Communicate only through handwritten postal letters for a month",
      qB: "Communicate only through 5-minute daily video calls with no texting",
      partnerPick: "B",
    },
    {
      qA: "Wake up at 4:30 AM every day to match their morning coffee",
      qB: "Stay awake until 2:00 AM every night to catch their evening sunset",
      partnerPick: "B",
    },
    {
      qA: "Wear matching goofy matching outfits every single day on our next trip",
      qB: "Let partner plan 100% of the entire itinerary without giving you any clues",
      partnerPick: "B",
    },
    {
      qA: "Have our dream home right now in a random small town",
      qB: "Live in our dream metropolis (Tokyo/NYC) but in a cozy studio apartment for 3 years",
      partnerPick: "B",
    },
  ];

  // Truth or Dare state
  const [todType, setTodType] = useState<"truth" | "dare" | null>(null);
  const [todIndex, setTodIndex] = useState(0);

  const truths = [
    "What was the exact millisecond you realized you were undeniably in love with me?",
    "What is the silliest thing you've done in your room while on a phone call with me?",
    "If you could teleport to my bedroom for exactly 60 seconds right now, what would you do first?",
    "What's one quirky habit of mine you find secretly adorable?",
    "What is your favorite memory of us when things didn't go according to plan?",
  ];

  const dares = [
    "Record a 15-second voice note singing the chorus of our favorite song without holding back.",
    "Take a spontaneous selfie right now making the most ridiculous face and text it to me.",
    "Put your phone down, walk to your window, look at the moon, and text me what it looks like.",
    "Send me a voice note describing what my scent smells like from memory.",
    "Order me a surprise snack on a delivery app for tomorrow without asking what I want.",
  ];

  // Deep Talk state
  const [deepIndex, setDeepIndex] = useState(0);
  const deepQuestions = [
    "What is something you are silently grieving or navigating right now that you haven't fully voiced?",
    "In what ways has loving each other across distance changed who you are as a person?",
    "When we finally close the distance for good, what is the quiet ordinary morning ritual you dream about most?",
    "What is one fear you had about us that has dissolved over time?",
    "How can I love you better this coming month in the specific timezone you're in?",
  ];

  const handleWyrPick = (choice: "A" | "B") => {
    setMyWyrChoice(choice);
    setRevealedWyr(true);
    playChimeSound();
    if (choice === wyrQuestions[wyrIndex].partnerPick) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleNextWyr = () => {
    setMyWyrChoice(null);
    setRevealedWyr(false);
    setWyrIndex((prev) => (prev + 1) % wyrQuestions.length);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center justify-center gap-2">
          <Dice5 className="w-6 h-6 text-pink-400" />
          Couple Games & Deep Sparks
        </h1>
        <p className="text-xs text-purple-200/70">
          Playful intimacy without pressure or guilt streaks. Discover each other anew.
        </p>
      </div>

      {/* Game Selector Bar */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-purple-500/20 max-w-xl mx-auto flex-wrap">
        <button
          onClick={() => setSelectedGame("would_you_rather")}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
            selectedGame === "would_you_rather"
              ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
              : "text-purple-300 hover:text-white"
          }`}
        >
          Would You Rather
        </button>
        <button
          onClick={() => setSelectedGame("truth_or_dare")}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
            selectedGame === "truth_or_dare"
              ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
              : "text-purple-300 hover:text-white"
          }`}
        >
          Truth or Dare
        </button>
        <button
          onClick={() => setSelectedGame("deep_talk")}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
            selectedGame === "deep_talk"
              ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
              : "text-purple-300 hover:text-white"
          }`}
        >
          Deep Talk Roulette
        </button>
      </div>

      {/* GAME 1: WOULD YOU RATHER */}
      {selectedGame === "would_you_rather" && (
        <div className="rounded-3xl glass-panel border border-purple-500/25 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 font-medium">
              Round {wyrIndex + 1} of {wyrQuestions.length}
            </span>
            <button
              onClick={handleNextWyr}
              className="flex items-center gap-1 text-xs text-purple-300 hover:text-white px-3 py-1 rounded-xl bg-purple-900/40 hover:bg-purple-800 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" /> Next Question
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-center text-white">
            Would You Rather...
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option A */}
            <button
              onClick={() => handleWyrPick("A")}
              className={`p-6 rounded-3xl border text-left transition-all duration-300 flex flex-col justify-between space-y-4 ${
                myWyrChoice === "A"
                  ? "bg-purple-900/60 border-purple-300 shadow-xl shadow-purple-900/50 scale-[1.02]"
                  : "bg-black/40 border-purple-500/20 hover:border-purple-400/40 hover:bg-purple-950/30"
              }`}
            >
              <span className="text-xs font-bold text-pink-300 block">OPTION A</span>
              <p className="text-base font-serif text-white leading-snug">
                {wyrQuestions[wyrIndex].qA}
              </p>
              {revealedWyr && (
                <div className="pt-2 border-t border-white/10 text-xs">
                  {wyrQuestions[wyrIndex].partnerPick === "A" ? (
                    <span className="text-emerald-300 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {partner.name} also picked this! (+20 Starlight)
                    </span>
                  ) : (
                    <span className="text-purple-300/70">
                      {partner.name} picked Option B
                    </span>
                  )}
                </div>
              )}
            </button>

            {/* Option B */}
            <button
              onClick={() => handleWyrPick("B")}
              className={`p-6 rounded-3xl border text-left transition-all duration-300 flex flex-col justify-between space-y-4 ${
                myWyrChoice === "B"
                  ? "bg-purple-900/60 border-purple-300 shadow-xl shadow-purple-900/50 scale-[1.02]"
                  : "bg-black/40 border-purple-500/20 hover:border-purple-400/40 hover:bg-purple-950/30"
              }`}
            >
              <span className="text-xs font-bold text-pink-300 block">OPTION B</span>
              <p className="text-base font-serif text-white leading-snug">
                {wyrQuestions[wyrIndex].qB}
              </p>
              {revealedWyr && (
                <div className="pt-2 border-t border-white/10 text-xs">
                  {wyrQuestions[wyrIndex].partnerPick === "B" ? (
                    <span className="text-emerald-300 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {partner.name} also picked this! (+20 Starlight)
                    </span>
                  ) : (
                    <span className="text-purple-300/70">
                      {partner.name} picked Option A
                    </span>
                  )}
                </div>
              )}
            </button>
          </div>

          {revealedWyr && (
            <div className="text-center pt-2">
              <span className="text-xs text-purple-200/80">
                {myWyrChoice === wyrQuestions[wyrIndex].partnerPick
                  ? "✨ Soul sync achieved! You both treasure the same choice."
                  : "💫 Beautiful contrast! Great conversation starter for tonight's call."}
              </span>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: TRUTH OR DARE */}
      {selectedGame === "truth_or_dare" && (
        <div className="rounded-3xl glass-panel border border-purple-500/25 p-6 sm:p-8 space-y-6 text-center">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" />
              LDR Truth or Dare
            </h2>
            <p className="text-xs text-purple-200/70">
              Sweet confessions and playful challenges designed specifically for miles apart
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setTodType("truth");
                setTodIndex((prev) => (prev + 1) % truths.length);
                playChimeSound();
              }}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-950/40 transition-all hover:scale-105"
            >
              Draw Truth 🕊️
            </button>
            <button
              onClick={() => {
                setTodType("dare");
                setTodIndex((prev) => (prev + 1) % dares.length);
                playHeartbeatSound();
                confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
              }}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition-all hover:scale-105"
            >
              Draw Dare 🔥
            </button>
          </div>

          {todType && (
            <div className="p-6 rounded-3xl bg-black/40 border border-purple-500/30 max-w-lg mx-auto space-y-3 animate-in fade-in zoom-in-95">
              <span className="text-xs font-bold text-pink-300 uppercase tracking-widest block">
                {todType === "truth" ? "🕊️ Your Truth Prompt" : "🔥 Your Virtual Dare"}
              </span>
              <p className="text-base sm:text-lg font-serif text-white leading-relaxed">
                “{todType === "truth" ? truths[todIndex] : dares[todIndex]}”
              </p>
              <button
                onClick={() => {
                  playChimeSound();
                  confetti({ particleCount: 20, spread: 60, origin: { y: 0.6 } });
                }}
                className="text-xs px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-medium transition-colors"
              >
                Mark Completed with {partner.name} (+15 Starlight)
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 3: DEEP TALK ROULETTE */}
      {selectedGame === "deep_talk" && (
        <div className="rounded-3xl glass-panel border border-purple-500/25 p-6 sm:p-8 space-y-6 text-center">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center justify-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-indigo-400" />
              Deep Talk Roulette
            </h2>
            <p className="text-xs text-purple-200/70">
              Questions crafted by relationship psychologists to create soul-deep intimacy
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-purple-950/60 to-black/60 border border-purple-400/30 max-w-xl mx-auto space-y-4">
            <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase block">
              Question #{deepIndex + 1}
            </span>
            <p className="text-lg sm:text-xl font-serif text-white leading-relaxed">
              “{deepQuestions[deepIndex]}”
            </p>

            <button
              onClick={() => {
                setDeepIndex((prev) => (prev + 1) % deepQuestions.length);
                playChimeSound();
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-semibold hover:brightness-110 shadow-lg shadow-purple-900/30 mx-auto transition-all"
            >
              <Shuffle className="w-4 h-4" /> Spin New Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
