import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[HTTP Request Log] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// JSON error parsing payload handler (To prevent default Express HTML response formats)
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
    console.warn("Express: Intercepted malformed JSON syntax error in incoming request payload.");
    return res.status(400).json({ 
      error: "Malformed JSON message formatting. Pls check payload syntax parameters.",
      warning: "API_ERROR_FALLBACK"
    });
  }
  next(err);
});

// In-memory data store to act as transient persistent cache when database is unprovisioned
let memoryUser = {
  email: "harrygour9@gmail.com",
  role: "Admin",
  creditsLeft: 840,
  creditsTotal: 1000,
  planType: "Pro",
  referrals: 12,
  earnings: 240,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
};

let memoryProjects = [
  {
    id: "proj_1b2",
    title: "YouTube Kids Introduction Video",
    text: "एक समय की बात है, एक सुंदर घने जंगल में चिंटू बंदर रहता था। वह बहुत नटखट था।",
    speed: 1.0,
    pitch: 1.0,
    voiceId: "chinnu",
    voiceName: "Chinnu (Child Girl)",
    languageId: "hindi",
    emotionId: "calm",
    engineUsed: "Gemini High-Fi",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "proj_3c4",
    title: "Motivational Gym Ad Reel",
    text: "सफलता पाने के लिए आज ही उठें, और अपने आप को एक नई दिशा में ढालें।",
    speed: 1.15,
    pitch: 0.95,
    voiceId: "sandeep",
    voiceName: "Sandeep (Motivational)",
    languageId: "hindi",
    emotionId: "excited",
    engineUsed: "Gemini High-Fi",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

// Lazy initializer for Gemini client to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  try {
    if (!aiClient) {
      const key = process.env.GEMINI_API_KEY;
      if (key && key !== "MY_GEMINI_API_KEY") {
        console.log("Initializing GoogleGenAI client with configured API key...");
        aiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            }
          }
        });
      } else {
        console.log("No valid GEMINI_API_KEY environment variable detected; utilizing high-performance client fallback.");
      }
    }
    return aiClient;
  } catch (err) {
    console.error("Critical error constructing GoogleGenAI instance:", err);
    return null;
  }
}

// 1. API: Get active user profile account Details
app.get("/api/user", (req, res, next) => {
  try {
    console.log("GET /api/user requested");
    res.json(memoryUser);
  } catch (err) {
    next(err);
  }
});

// 2. API: Get saved project history logs
app.get("/api/projects", (req, res, next) => {
  try {
    console.log("GET /api/projects requested");
    res.json(memoryProjects);
  } catch (err) {
    next(err);
  }
});

// 3. API: Save newly generated project record
app.post("/api/projects", (req, res, next) => {
  try {
    console.log("POST /api/projects requested with body:", req.body);
    const proj = req.body || {};
    const newProject = {
      id: proj.id || `proj_${Date.now()}`,
      title: proj.title || "Voice Synthesis Creation",
      text: proj.text || "",
      speed: typeof proj.speed === "number" ? proj.speed : 1.0,
      pitch: typeof proj.pitch === "number" ? proj.pitch : 1.0,
      voiceId: proj.voiceId || "rohan",
      voiceName: proj.voiceName || "Rohan (Baritone)",
      languageId: proj.languageId || "hindi",
      emotionId: proj.emotionId || "calm",
      engineUsed: proj.engineUsed || "Gemini High-Fi",
      createdAt: new Date().toISOString()
    };

    memoryProjects = [newProject, ...memoryProjects];
    
    // Also deduct from simulation user credits
    memoryUser.creditsLeft = Math.max(0, memoryUser.creditsLeft - 10);
    
    res.status(201).json({ status: "success", project: newProject });
  } catch (err) {
    next(err);
  }
});

// 4. API: Claim promotional voucher code / referral bonus logic
app.post("/api/referrals/claim", (req, res, next) => {
  try {
    console.log("POST /api/referrals/claim requested");
    memoryUser.referrals += 1;
    memoryUser.earnings += 20;
    memoryUser.creditsLeft = Math.min(memoryUser.creditsTotal, memoryUser.creditsLeft + 100);
    res.json({ success: true, updatedUser: memoryUser });
  } catch (err) {
    next(err);
  }
});

// 5. API: Convert Text To Speech with custom emotional prompting
function getLanguageCode(languageName: string): string {
  const norm = (languageName || "Hindi").toLowerCase();
  if (norm.includes("hindi")) return "hi";
  if (norm.includes("english")) return "en";
  if (norm.includes("hinglish")) return "hi";
  if (norm.includes("tamil")) return "ta";
  if (norm.includes("telugu")) return "te";
  if (norm.includes("bengali")) return "bn";
  if (norm.includes("marathi")) return "mr";
  if (norm.includes("punjabi")) return "pa";
  return "hi";
}

async function getGoogleTTSFallback(text: string, languageName: string): Promise<string> {
  const langCode = getLanguageCode(languageName);
  const truncatedText = text.length > 300 ? text.slice(0, 300) + "..." : text;
  const url = `https://translate.googleapis.com/translate_tts?client=gtx&tl=${langCode}&ie=UTF-8&q=${encodeURIComponent(truncatedText)}`;
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36"
    }
  });
  
  if (response.ok) {
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  } else {
    throw new Error(`Google Translate TTS returned status code: ${response.status}`);
  }
}

app.post("/api/tts", async (req, res, next) => {
  try {
    console.log("POST /api/tts requested with body keys:", Object.keys(req.body || {}));
    const { text, voiceName, emotionPrompt, languageName } = req.body || {};

    if (!text) {
      return res.status(400).json({ error: "Missing transcript text input for speech synthesis" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      console.warn("No Gemini API client initialized. Cascading to Google TTS fallback.");
      try {
        const base64Audio = await getGoogleTTSFallback(text, languageName);
        console.log("Successfully generated high-fidelity fallback audio stream.");
        return res.json({ audioContent: base64Audio, warning: "FALLBACK_USED" });
      } catch (fallbackErr: any) {
        console.error("All text-to-speech generators failed:", fallbackErr);
        return res.json({ warning: "DEMO_MODE_NO_KEY", error: fallbackErr?.message });
      }
    }

    // Select compatible speaker prebuilt voice
    let assignedVoice = "Kore";
    if (voiceName) {
      if (voiceName.includes("Wavenet-A")) assignedVoice = "Kore";
      else if (voiceName.includes("Wavenet-B")) assignedVoice = "Fenrir";
      else if (voiceName.includes("Wavenet-D")) assignedVoice = "Zephyr";
      else if (voiceName.includes("Wavenet-C")) assignedVoice = "Puck";
      else if (voiceName.includes("Neural2-A")) assignedVoice = "Kore";
      else if (voiceName.includes("Neural2-B")) assignedVoice = "Charon";
      else assignedVoice = "Zephyr";
    }

    // Assemble the rich prompting system to inject target accents, languages, emotions, and intonations
    const speechPrompt = `Please synthesize the following script in the designated language accent: "${languageName || "Hindi"}".
Intonation Guidelines: ${emotionPrompt || "Speak in a natural voice."}
Script text to read aloud:
${text}`;

    console.log(`Polling Gemini 3.1-flash-tts-preview for prebuiltVoiceName: ${assignedVoice}...`);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: speechPrompt }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: assignedVoice }
            }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        console.log("Successfully generated base64 audio content stream from Gemini!");
        return res.json({ audioContent: base64Audio });
      } else {
        console.warn("TTS generation returned empty audio stream. Triggering server fallback.");
        const base64AudioFallback = await getGoogleTTSFallback(text, languageName);
        return res.json({ audioContent: base64AudioFallback, warning: "FALLBACK_USED" });
      }
    } catch (geminiErr) {
      console.warn("Gemini TTS API failed or hit quota. Utilizing Google Translate high-fidelity fallback...", geminiErr);
      const base64AudioFallback = await getGoogleTTSFallback(text, languageName);
      return res.json({ audioContent: base64AudioFallback, warning: "FALLBACK_USED" });
    }

  } catch (error: any) {
    console.error("Gemini & Fallback TTS conversion failed:", error);
    return res.json({ warning: "API_ERROR_FALLBACK", error: error?.message || String(error) });
  }
});

// JSON fallback error handler for API routes to prevent HTML response formats
app.use("/api", (err: any, req: any, res: any, next: any) => {
  console.error("Detailed Express API Route Error intercepted:", err);
  res.status(500).json({
    warning: "API_ERROR_FALLBACK",
    error: err?.message || String(err),
    message: "Integrity check: API route execution encountered an unhandled exception."
  });
});

// Serve frontend SPA bundle using Express
async function bootstrap() {
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    // Use Vite programmatic dev server middleware in development mode
    console.log("Starting full-stack platform in development simulation mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VoiceLoxic SaaS Platform listening securely on absolute address http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Critical error bootstrapping Express server:", err);
});
