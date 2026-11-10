import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "15mb" }));

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory persistent couple store indexed by coupleCode
interface CoupleStore {
  coupleCode: string;
  partnerA: {
    name: string;
    city: string;
    timezone: string;
    avatar: string;
    weather: { mood: string; note: string; updatedAt: string };
  };
  partnerB: {
    name: string;
    city: string;
    timezone: string;
    avatar: string;
    weather: { mood: string; note: string; updatedAt: string };
  };
  universeLevel: number;
  starlightPoints: number;
  parallelSession: {
    type: "coffee" | "meal" | "study" | null;
    status: "idle" | "active" | "completed";
    startTime: number | null;
    durationMinutes: number;
    activityDetails: string;
  };
  pulseCount: number;
  lastPulse: { from: string; message: string; timestamp: number } | null;
  memories: Array<{
    id: string;
    title: string;
    date: string;
    category: string;
    description: string;
    imageUrl?: string;
    author: string;
    insideJoke?: string;
  }>;
  unsentLetters: Array<{
    id: string;
    title: string;
    recipientCondition: string;
    content: string;
    isOpened: boolean;
    openedAt?: string;
    createdAt: string;
    author: string;
    hasAudio?: boolean;
    audioData?: string;
  }>;
  timeCapsules: Array<{
    id: string;
    title: string;
    unlockDate: string;
    content: string;
    author: string;
    isUnlocked: boolean;
    category: string;
  }>;
  bucketList: Array<{
    id: string;
    title: string;
    category: "travel" | "home" | "dates" | "life";
    completed: boolean;
    targetYear?: string;
    notes?: string;
    votedBy: string[];
  }>;
  gameSessions: Record<string, any>;
}

const coupleDatabases: Map<string, CoupleStore> = new Map();

function getOrCreateCouple(coupleCode: string): CoupleStore {
  const code = (coupleCode || "BETWEEN-US").trim().toUpperCase();
  if (!coupleDatabases.has(code)) {
    coupleDatabases.set(code, {
      coupleCode: code,
      partnerA: {
        name: "Maya",
        city: "Tokyo",
        timezone: "Asia/Tokyo",
        avatar: "🌸",
        weather: {
          mood: "Gentle Rain 🌧️",
          note: "Long design review today, feeling a bit drained and missing your hugs",
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
          note: "Morning coffee ready, thinking about our upcoming trip countdown!",
          updatedAt: new Date().toISOString(),
        },
      },
      universeLevel: 4,
      starlightPoints: 380,
      parallelSession: {
        type: "coffee",
        status: "idle",
        startTime: null,
        durationMinutes: 25,
        activityDetails: "Morning brew & Tokyo sunset wind-down",
      },
      pulseCount: 142,
      lastPulse: {
        from: "Liam",
        message: "Sent a warm heartbeat across 6,700 miles ✨",
        timestamp: Date.now() - 1000 * 60 * 12,
      },
      memories: [
        {
          id: "m-1",
          title: "First Midnight Airport Run",
          date: "2025-10-14",
          category: "Firsts",
          description: "Running through Haneda terminal at 11:45 PM just to hug for 3 minutes before the last train.",
          author: "Maya",
          insideJoke: "The spilled matcha latte incident 😂",
        },
        {
          id: "m-2",
          title: "Synchronized Ramen & Bagel Dinner",
          date: "2025-12-24",
          category: "Milestones",
          description: "Our Christmas Eve virtual dinner across 13 hours time difference. Lit identical candles.",
          author: "Liam",
        },
        {
          id: "m-3",
          title: "Tokyo Tower & Empire State Building Photo Merge",
          date: "2026-03-01",
          category: "Trips",
          description: "Took photos looking at our respective city towers at the exact same minute.",
          author: "Maya",
          insideJoke: "Both wearing the matching wool scarves",
        },
      ],
      unsentLetters: [
        {
          id: "l-1",
          title: "When you feel like distance is winning",
          recipientCondition: "Open When you miss me terribly",
          content: "Remember that every mile between us is just proof of how deep this is. If love could be measured in miles, we've already conquered the earth. Close your eyes, feel your heartbeat—that rhythm matches mine.",
          isOpened: false,
          createdAt: "2026-02-14",
          author: "Liam",
        },
        {
          id: "l-2",
          title: "When work was brutal and your head hurts",
          recipientCondition: "Open When you had a bad day",
          content: "Put down the screen, take off your shoes, and breathe in for 4 seconds. I am sending you the gentlest forehead kiss. Tomorrow is a brand new sunrise.",
          isOpened: false,
          createdAt: "2026-02-28",
          author: "Maya",
        },
        {
          id: "l-3",
          title: "A midnight lullaby from across the sea",
          recipientCondition: "Open When you can't fall asleep",
          content: "Picture our tiny cozy apartment in Kyoto with tatami mats, rain pattering outside, and both of us wrapped in one heavy quilt. You are completely safe with me.",
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
          content: "Two full years of late-night calls, boarding passes, and choosing each other every single morning.",
          author: "Liam",
          isUnlocked: false,
          category: "Anniversary",
        },
        {
          id: "c-2",
          title: "Predictions for the day we finally move in together",
          unlockDate: "2027-01-01",
          content: "I predict Liam will steal 70% of the closet space with his hoodies, and Maya will own at least 14 indoor plants within 48 hours.",
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
  }
  return coupleDatabases.get(code)!;
}

// API Routes

// Couple state retrieval
app.get("/api/couple/:code", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  res.json({ success: true, store });
});

// Update couple profile or weather
app.post("/api/couple/:code/update", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const { partner, weather, profile } = req.body;

  if (partner === "A" && weather) {
    store.partnerA.weather = { ...weather, updatedAt: new Date().toISOString() };
    store.starlightPoints += 10;
  } else if (partner === "B" && weather) {
    store.partnerB.weather = { ...weather, updatedAt: new Date().toISOString() };
    store.starlightPoints += 10;
  }

  if (partner === "A" && profile) {
    store.partnerA = { ...store.partnerA, ...profile };
  } else if (partner === "B" && profile) {
    store.partnerB = { ...store.partnerB, ...profile };
  }

  res.json({ success: true, store });
});

// Send Heartbeat / Pulse / Hug
app.post("/api/couple/:code/pulse", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const { from, message, type } = req.body;
  store.pulseCount += 1;
  store.starlightPoints += 5;
  store.lastPulse = {
    from: from || "Partner",
    message: message || "Sent a warm virtual hug 💜",
    timestamp: Date.now(),
  };

  // Check universe level up
  if (store.starlightPoints >= store.universeLevel * 100) {
    store.universeLevel += 1;
  }

  res.json({ success: true, store });
});

// Parallel session control (coffee, meal, study)
app.post("/api/couple/:code/parallel", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const { type, status, durationMinutes, activityDetails } = req.body;

  store.parallelSession = {
    type: type !== undefined ? type : store.parallelSession.type,
    status: status || "idle",
    startTime: status === "active" ? Date.now() : null,
    durationMinutes: durationMinutes || store.parallelSession.durationMinutes,
    activityDetails: activityDetails || store.parallelSession.activityDetails,
  };

  if (status === "completed") {
    store.starlightPoints += 25;
    if (store.starlightPoints >= store.universeLevel * 100) {
      store.universeLevel += 1;
    }
  }

  res.json({ success: true, store });
});

// Memory Museum creation
app.post("/api/couple/:code/memory", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const { title, date, category, description, imageUrl, author, insideJoke } = req.body;

  const newMemory = {
    id: `m-${Date.now()}`,
    title: title || "Cherished Moment",
    date: date || new Date().toISOString().split("T")[0],
    category: category || "Special",
    description: description || "",
    imageUrl,
    author: author || "Together",
    insideJoke,
  };

  store.memories.unshift(newMemory);
  store.starlightPoints += 20;
  if (store.starlightPoints >= store.universeLevel * 100) {
    store.universeLevel += 1;
  }

  res.json({ success: true, memory: newMemory, store });
});

// Unsent Letters creation and opening
app.post("/api/couple/:code/unsent", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const { title, recipientCondition, content, author, audioData } = req.body;

  const newLetter = {
    id: `l-${Date.now()}`,
    title: title || "Letter for your heart",
    recipientCondition: recipientCondition || "Open When you need love",
    content: content || "",
    isOpened: false,
    createdAt: new Date().toISOString().split("T")[0],
    author: author || "Me",
    hasAudio: Boolean(audioData),
    audioData,
  };

  store.unsentLetters.unshift(newLetter);
  store.starlightPoints += 15;
  res.json({ success: true, letter: newLetter, store });
});

app.post("/api/couple/:code/unsent/:id/open", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const letter = store.unsentLetters.find((l) => l.id === req.params.id);
  if (letter) {
    letter.isOpened = true;
    letter.openedAt = new Date().toISOString();
    store.starlightPoints += 10;
  }
  res.json({ success: true, letter, store });
});

// Time Capsule creation and unlock
app.post("/api/couple/:code/capsule", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const { title, unlockDate, content, author, category } = req.body;

  const newCapsule = {
    id: `c-${Date.now()}`,
    title: title || "Future Surprise",
    unlockDate: unlockDate || new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
    content: content || "",
    author: author || "Partner",
    isUnlocked: false,
    category: category || "Surprise",
  };

  store.timeCapsules.unshift(newCapsule);
  store.starlightPoints += 25;
  res.json({ success: true, capsule: newCapsule, store });
});

app.post("/api/couple/:code/capsule/:id/unlock", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const capsule = store.timeCapsules.find((c) => c.id === req.params.id);
  if (capsule) {
    capsule.isUnlocked = true;
    store.starlightPoints += 30;
  }
  res.json({ success: true, capsule, store });
});

// Bucket List items
app.post("/api/couple/:code/bucket", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const { title, category, targetYear, notes, author } = req.body;

  const newItem = {
    id: `b-${Date.now()}`,
    title: title || "Future Adventure",
    category: category || "travel",
    completed: false,
    targetYear,
    notes,
    votedBy: author ? [author] : ["Maya"],
  };

  store.bucketList.push(newItem);
  store.starlightPoints += 10;
  res.json({ success: true, item: newItem, store });
});

app.post("/api/couple/:code/bucket/:id/toggle", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const item = store.bucketList.find((b) => b.id === req.params.id);
  if (item) {
    item.completed = !item.completed;
    store.starlightPoints += item.completed ? 30 : -10;
  }
  res.json({ success: true, item, store });
});

// Couple Game sessions
app.post("/api/couple/:code/game", (req, res) => {
  const store = getOrCreateCouple(req.params.code);
  const { gameType, payload } = req.body;
  store.gameSessions[gameType] = {
    ...store.gameSessions[gameType],
    ...payload,
    updatedAt: Date.now(),
  };
  store.starlightPoints += 15;
  res.json({ success: true, gameSession: store.gameSessions[gameType], store });
});

// ==========================================
// AI-POWERED EMOTIONAL TRANSLATOR (Gemini 3.8 Flash)
// ==========================================
app.post("/api/gemini/translate-emotion", async (req, res) => {
  const { situation, rawFeelings, partnerName, userName } = req.body;

  if (!situation && !rawFeelings) {
    res.status(400).json({ error: "Please share what you are experiencing." });
    return;
  }

  const prompt = `You are an expert, compassionate couples therapist and emotional translator specialized in long-distance relationships (LDR).
The user is experiencing difficult or tangled emotions towards their long-distance partner.

Context:
User: ${userName || "User"}
Partner: ${partnerName || "Partner"}
What happened / Situation: "${situation || "Unstated situation"}"
Raw unfiltered feelings: "${rawFeelings || "Feeling lonely, anxious, or unheard"}"

Provide an empathetic, non-judgmental translation that honors the user's authentic pain while translating defensive/reactive emotions into vulnerable, tender, and loving communication that draws their long-distance partner closer rather than pushing them away.

Respond with strict JSON with the following schema:
{
  "underlyingNeed": "string (A compassionate 1-2 sentence realization of what the user's heart is truly longing for beneath frustration or fear—e.g. certainty of being chosen, closeness across timezones, gentle reassurance)",
  "partnerPerspective": "string (A gentle, non-defensive insight into what might be happening on their partner's side with love and grace, acknowledging time zone fatigue or work stress without invalidating the user)",
  "phrasings": [
    {
      "tone": "Gentle & Vulnerable",
      "message": "string (A warm, heartfelt message ready to send that expresses love first and vulnerable need second)"
    },
    {
      "tone": "Deep & Direct",
      "message": "string (A clear, grounded, emotionally mature expression of boundary or desire)"
    },
    {
      "tone": "Playful & Soft",
      "message": "string (A lighthearted, affectionate way to bring up the feeling without tension)"
    }
  ],
  "groundingAdvice": "string (A 1-sentence calming somatic tip before sending, e.g., deep breath, hand on chest)",
  "reflectionQuestion": "string (A gentle question to ask themselves to cultivate inner peace)"
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction:
            "You are an empathetic, emotionally wise relationship translator for long-distance couples. You never judge, shame, or blame either partner. You transform friction into intimacy.",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      res.json({ success: true, translation: parsed });
      return;
    } catch (err: any) {
      console.error("Gemini Emotional Translator API error:", err);
      // Fallback to relationship wisdom if API is unavailable
    }
  }

  // Graceful fallback if no Gemini key or offline
  res.json({
    success: true,
    translation: {
      underlyingNeed:
        "Beneath this tension is a tender longing to feel prioritized and emotionally held, especially when miles and time zones make touch impossible.",
      partnerPerspective:
        "When physical proximity is absent, small silences or missed cues feel magnified. Your partner likely cares deeply and may be wrestling with their own exhaustion or timezone disorientation.",
      phrasings: [
        {
          tone: "Gentle & Vulnerable",
          message: `Hey love, I know our days have been out of sync lately, but I miss you deeply and I've been feeling a bit disconnected. Can we carve out 10 uninterrupted minutes tonight just to look at each other and breathe?`,
        },
        {
          tone: "Deep & Direct",
          message: `I love you so much and because I cherish what we're building, I want to be honest: when plans shift without warning, it triggers my longing. I need a little extra reassurance right now.`,
        },
        {
          tone: "Playful & Soft",
          message: `Official notice: My hug deficit has reached critical levels! Sending you a 6,000-mile requisition for one warm voice note whenever you get a free moment today 💌`,
        },
      ],
      groundingAdvice:
        "Place one hand on your collarbone and take three slow exhales before typing, remembering you two are on the same team.",
      reflectionQuestion:
        "What is the loving truth I want them to hear, separate from my immediate fear?",
    },
  });
});

// ==========================================
// AI-POWERED SURPRISE & DATE GENERATOR (Gemini 3.8 Flash)
// ==========================================
app.post("/api/gemini/generate-surprise", async (req, res) => {
  const { category, currentVibe, timeBudget, timeDifferenceHours } = req.body;

  const prompt = `You are a romantic, creative long-distance relationship concierge for couples separated by distance and time zones.
Generate 3 distinct, fresh, ultra-creative, and intimate activities/surprises for the couple.

Category: ${category || "virtual_date"} (options: virtual_date, spontaneous_challenge, deep_talk, love_coupon, memory_ritual)
Current Vibe: ${currentVibe || "cozy and romantic"}
Time Budget: ${timeBudget || "30 minutes"}
Timezone Offset: ${timeDifferenceHours || 13} hours difference between them.

Avoid cliché answers like 'just watch Netflix'. Propose concrete, immersive ideas (e.g. ordering dessert to each other's door simultaneously, synchronized audio tours, two-player drawing games, Google Street View mystery walks, reading chapters aloud, ambient cafe co-working).

Respond with strict JSON with the following schema:
{
  "theme": "string (Evocative title for this surprise set)",
  "surprises": [
    {
      "id": "string",
      "title": "string (Catchy, romantic title)",
      "badge": "string (e.g. '15 Mins' or 'High Romance' or 'Playful')",
      "overview": "string (2-3 sentences explaining the core experience)",
      "stepByStep": ["string (Step 1)", "string (Step 2)", "string (Step 3)"],
      "whyItWorks": "string (Why this specifically bridges distance and fosters intimacy)"
    }
  ]
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction:
            "You create memorable, deeply bonding, and joyful long-distance romance ideas that make distance feel like an adventure rather than a barrier.",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      res.json({ success: true, data: parsed });
      return;
    } catch (err: any) {
      console.error("Gemini Surprise Generator API error:", err);
    }
  }

  // Graceful fallback
  res.json({
    success: true,
    data: {
      theme: "Constellations Across Oceans",
      surprises: [
        {
          id: "s-1",
          title: "The Mystery Doorstep Dessert Swap",
          badge: "Delicious & Fun",
          overview:
            "Without telling the other what you ordered, secretly use an international food delivery app to deliver a late-night dessert or warm morning bakery item to each other's doorsteps at the exact same minute.",
          stepByStep: [
            "Agree on a secret budget and exact delivery time window.",
            "Choose a comfort pastry or signature dessert that reminds you of them.",
            "Hop on video as you unbox your partner's mystery pick together.",
          ],
          whyItWorks:
            "It turns a simple food delivery into an act of physical care where you taste each other's thoughtfulness.",
        },
        {
          id: "s-2",
          title: "The 36-Question Whisper Session",
          badge: "Deep Intimacy",
          overview:
            "Light a single candle in your dark bedrooms, put in wireless earbuds, and take turns asking one question from the psychological 36 Questions That Lead to Love in a soft whisper.",
          stepByStep: [
            "Dim the room lights completely and light one warm candle.",
            "Use earbuds with soft ambient rain playing in the background.",
            "Answer without rushing, maintaining eye contact on video.",
          ],
          whyItWorks:
            "Vocal resonance and soft lighting remove the coldness of digital screens and simulate lying side-by-side in bed.",
        },
        {
          id: "s-3",
          title: "5-Minute Apartment Scavenger Hunt",
          badge: "Playful & Fast",
          overview:
            "Set a 5-minute timer. Both partners must find 3 items in their room: something that smells like you, something you bought while thinking of them, and something that makes you laugh.",
          stepByStep: [
            "Start the synchronized in-app timer.",
            "Scramble to collect your 3 items.",
            "Show-and-tell each artifact with the story behind it.",
          ],
          whyItWorks:
            "Brings their physical living space into your view and triggers spontaneous storytelling.",
        },
      ],
    },
  });
});

// Vite middleware or static serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

setupVite();
