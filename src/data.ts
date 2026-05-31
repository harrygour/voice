import { Language, VoiceCharacter, Emotion } from "./types";

export const LANGUAGES: Language[] = [
  { id: "hindi", name: "Hindi Accent", flag: "🇮🇳", nativeName: "हिन्दी" },
  { id: "hinglish", name: "Hinglish Mix", flag: "🇮🇳", nativeName: "Hinglish" },
  { id: "english", name: "Indian English", flag: "🇮🇳", nativeName: "English (IN)" },
  { id: "tamil", name: "Tamil Accent", flag: "🇮🇳", nativeName: "தமிழ்" },
  { id: "punjabi", name: "Punjabi Accent", flag: "🇮🇳", nativeName: "ਪੰਜਾਬੀ" },
  { id: "telugu", name: "Telugu Accent", flag: "🇮🇳", nativeName: "తెలుగు" },
  { id: "bengali", name: "Bengali Accent", flag: "🇮🇳", nativeName: "বাংলা" },
  { id: "marathi", name: "Marathi Accent", flag: "🇮🇳", nativeName: "मराठी" },
];

export const EMOTIONS: Emotion[] = [
  { id: "calm", label: "Calm / Storyteller", icon: "😌", promptModifier: "Speak in a calm, soothing, and narrative storyteller tone of voice. Maintain slow cadence and gentle pauses." },
  { id: "excited", label: "High Impact / Ad", icon: "🔥", promptModifier: "Speak with high energy, enthusiasm, and a fast-paced enthusiastic tone. Perfect for marketing commercials and motivational reels." },
  { id: "happy", label: "Joyful / Narrative", icon: "🥳", promptModifier: "Speak in a cheerful, friendly, bright, and warmly welcoming voice. Ideal for educational explainers." },
  { id: "angry", label: "Drama / Intense", icon: "😡", promptModifier: "Speak in an intense, dramatic, urgent, and aggressive manner with strong emphasis." },
  { id: "sad", label: "Melancholic", icon: "😢", promptModifier: "Speak slowly with a somber, emotional, soft, and slightly weeping or heavy-hearted undertone." },
  { id: "professional", label: "Corporate Presenter", icon: "💼", promptModifier: "Speak in a highly professional, informative, clear, and perfectly articulated corporate presenter voice." },
  { id: "whisper", label: "Ssh! Whisper", icon: "🤫", promptModifier: "Speak in an extremely quiet, soft, hushed, breathy whisper tone of voice." },
];

export const VOICE_CHARACTERS: VoiceCharacter[] = [
  {
    id: "rohan",
    name: "Rohan",
    gender: "Male",
    category: "Corporate",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    desc: "A rich, deep, baritone corporate presenter. Ideal for modern news delivery, standard professional audiobooks, and marketing pitches.",
    geminiVoiceName: "en-IN-Wavenet-B",
    languageSupport: ["hindi", "english", "hinglish"],
  },
  {
    id: "chinnu",
    name: "Chinnu",
    gender: "Female",
    category: "Storytelling",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    desc: "A bright, playful, and expressive young child avatar. Perfect for cartoon parodies, fairy tales, and educational videos for kids.",
    geminiVoiceName: "en-IN-Wavenet-A",
    languageSupport: ["hindi", "hinglish", "tamil", "telugu", "punjabi", "bengali", "marathi"],
  },
  {
    id: "pooja",
    name: "Pooja",
    gender: "Female",
    category: "Corporate",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    desc: "Professional, fluent, and clear female presenter. Suitable for corporate explainers, course instructions, and brand promotion audio tracks.",
    geminiVoiceName: "en-IN-Wavenet-D",
    languageSupport: ["hindi", "english", "hinglish"],
  },
  {
    id: "vikram",
    name: "Vikram",
    gender: "Male",
    category: "Storytelling",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    desc: "A mature, traditional storyteller voice. Delivers Panchatantra or classic tales with traditional gravitas and custom character timings.",
    geminiVoiceName: "en-IN-Wavenet-C",
    languageSupport: ["hindi", "bengali", "telugu"],
  },
  {
    id: "ananya",
    name: "Ananya",
    gender: "Female",
    category: "Commercials",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    desc: "Enthusiastic, young-adult modern voice. Great for interactive voice response systems, contemporary Reels, and YouTube Shorts.",
    geminiVoiceName: "en-IN-Neural2-A",
    languageSupport: ["hindi", "hinglish", "english"],
  },
  {
    id: "kabir",
    name: "Kabir",
    gender: "Male",
    category: "Entertainment",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    desc: "Cool, friendly, and casual friend tone. Perfect for lifestyle storytelling, podcasts, conversational humor, and social content.",
    geminiVoiceName: "en-IN-Neural2-B",
    languageSupport: ["hindi", "hinglish"],
  },
  {
    id: "meera",
    name: "Meera",
    gender: "Female",
    category: "Storytelling",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    desc: "Warm maternal tones, perfectly customized for bedtime fairy tales, mythological tales, and audiobooks.",
    geminiVoiceName: "en-IN-Wavenet-F",
    languageSupport: ["hindi", "marathi", "bengali"],
  },
  {
    id: "arjun",
    name: "Arjun",
    gender: "Male",
    category: "Commercials",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    desc: "Premium advertisement and product review tone. Powerful, bold, confident, and highly persuasive voice.",
    geminiVoiceName: "en-IN-Neural2-C",
    languageSupport: ["hindi", "english"],
  },
  {
    id: "preeti",
    name: "Preeti",
    gender: "Female",
    category: "Entertainment",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    desc: "Playful, energetic, and highly dynamic female voice. Tailor-made for regional Indian parodies and audio stories.",
    geminiVoiceName: "en-IN-Standard-D",
    languageSupport: ["hindi", "punjabi", "telugu"],
  },
  {
    id: "sandeep",
    name: "Sandeep",
    gender: "Male",
    category: "Motivational",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    desc: "An incredible motivational speaker. Powerful spikes in volume, with intense, heart-warming pauses that inspire action.",
    geminiVoiceName: "en-IN-Standard-E",
    languageSupport: ["hindi", "hinglish", "punjabi", "telugu", "tamil"],
  },
];

export const LANGUAGE_SAMPLES: Record<string, string> = {
  hindi: "एक सुंदर घने जंगल में चिंटू बंदर रहता था। वह बहुत नटखट था और दिन भर एक पेड़ से दूसरे पेड़ पर कूदता रहता था। एक दिन उसे एक चमकीला जादुई फल मिला!",
  hinglish: "Hey guys! Aaj chaliye hum banate hain ek super cool animinated reel. VoiceLoxic TTS se voice over generate karna bht hi simple aur fast hai. Chaliye try karte hain!",
  english: "Welcome to VoiceLoxic AI! This is a state-of-the-art text to speech experience designed specifically for regional Indian creators. Input your text and hear the magic.",
  tamil: "ஒரு அழகான அடர்ந்த காட்டில் சிந்து என்ற குறும்புக்கார குரங்கு வாழ்ந்து வந்தது. ஒரு நாள் அதற்கு ஒரு மந்திர பழம் கிடைத்தது!",
  punjabi: "ਇੱਕ ਬਹੁਤ ਹੀ ਸੁੰਦਰ ਘਣੇ ਜੰਗਲ ਵਿੱਚ ਚਿੰਟੂ ਬਾਂਦਰ ਰਹਿੰਦਾ ਸੀ। ਉਹ ਬਹੁਤ ਸ਼ਰਾਰਤੀ ਸੀ ਅਤੇ ਸਾਰਾ ਦਿਨ ਰੁੱਖਾਂ ਉੱਤੇ ਟੱਪਦਾ ਰਹਿੰਦਾ ਸੀ।",
  telugu: "ఒక అందమైన దట్టమైన అడవిలో చింటూ కోతి నివసించేది. అది చాలా అల్లరిది. ఒకరోజు దానికి ఒక మాయా పండు దొరికింది!",
  bengali: "একটি সুন্দর গভীর বনে চিন্টু বানর বাস করত। সে খুব দুষ্টু ছিল এবং সারাদিন এক গাছ থেকে অন্য গাছে লাফিয়ে বেড়াত।",
  marathi: "एका सुंदर दाट जंगलात चिंटू नावाचे खोडकर माकड राहत होते. एक दिवस त्याला एक जादुई चमकणारे फळ सापडले!",
};

export const FAQ_ITEMS = [
  {
    q: "How does VoiceLoxic achieve such high-fidelity regional accents?",
    a: "We train customized prosody adapters over Gemini 3.1 TTS models. This captures specific colloquialisms, subtle Hinglish blending, and authentic regional Indian modulations that standard models cannot match."
  },
  {
    q: "Can I use the synthesized voice files commercially on YouTube and Instagram?",
    a: "Absolutely! All tracks generated under Starter, Pro, and Enterprise tiers include full, unrestricted commercial distribution rights, commercial licensing, and protection."
  },
  {
    q: "What is the difference between Gemini High-Fi and Direct Browser Speech?",
    a: "Gemini High-Fi utilizes our server-side deep learning TTS endpoints for natural, emotional speech streaming. Direct Browser Speech utilizes your device's offline SpeechSynthesisEngine for free, fast testing without consuming credits."
  },
  {
    q: "How does the Affiliate & Referral credit logic work?",
    a: "Every registered creator receives a unique referral code. When a friend signs up with it, they get 100 free premium credits, and you earn 20% recurring monthly cash commissions on their upgrade."
  },
];

export const TESTIMONIALS = [
  {
    name: "Aman Sharma",
    role: "YouTube Kids Animator",
    feedback: "Chinnu model's voice is incredible for my Hindi cartoon stories! Saved me thousands on voice actors."
  },
  {
    name: "Deepa Ramani",
    role: "EdTech Course Producer",
    feedback: "Pooja's voice was chosen for our physics series. Student retention rose dramatically after substituting AI voices with VoiceLoxic."
  }
];

export interface ColumnDefinition {
  name: string;
  type: string;
  key?: "PK" | "FK" | "";
  nullable: boolean;
  description: string;
}

export interface DBTable {
  name: string;
  description: string;
  columns: ColumnDefinition[];
}

export const DB_SCHEMAS: DBTable[] = [
  {
    name: "users",
    description: "SaaS accounts master table storing login credentials and subscription tiers",
    columns: [
      { name: "id", type: "BIGINT UNSIGNED AUTO_INCREMENT", key: "PK", nullable: false, description: "Unique auto-generated user primary key" },
      { name: "email", type: "VARCHAR(191) UNIQUE", nullable: false, description: "Normalized email address for login verification" },
      { name: "plan_tier", type: "ENUM('FREE','STARTER','PRO','ENTERPRISE')", nullable: false, description: "Active premium subscription class" },
      { name: "referrals_count", type: "INT UNSIGNED DEFAULT 0", nullable: false, description: "Count of successful user signups referred" },
      { name: "earnings_usd", type: "DECIMAL(10,2) DEFAULT 0.00", nullable: false, description: "Accrued affiliate cash commissions withdrawable" },
      { name: "created_at", type: "TIMESTAMP", nullable: true, description: "Account creation log timestamp" },
    ]
  },
  {
    name: "credits_ledger",
    description: "Auditable credits consumption ledger representing secure transactions",
    columns: [
      { name: "id", type: "BIGINT UNSIGNED AUTO_INCREMENT", key: "PK", nullable: false, description: "Transaction primary key" },
      { name: "user_id", type: "BIGINT UNSIGNED", key: "FK", nullable: false, description: "Foreign key linkage mapping to users table" },
      { name: "quota_authorized", type: "INT", nullable: false, description: "Credits balance granted or removed (+/-)" },
      { name: "balance_after", type: "INT UNSIGNED", nullable: false, description: "Resulting users credit balance for double-entry validation" },
      { name: "activity_type", type: "VARCHAR(50)", nullable: false, description: "Reason: e.g. 'TTS_SYNTHESIS', 'PROMO_CLAIM', 'REFERRAL_REWARD'" },
      { name: "transaction_at", type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable: false, description: "Audit trail timestamp" }
    ]
  },
  {
    name: "audio_projects",
    description: "Contains metadata logs, configured properties, and raw AWS S3 references for generated outputs",
    columns: [
      { name: "id", type: "VARCHAR(64)", key: "PK", nullable: false, description: "SHA-256 generated project unique string identification" },
      { name: "user_id", type: "BIGINT UNSIGNED", key: "FK", nullable: false, description: "Creator reference link in users database table" },
      { name: "title", type: "VARCHAR(255)", nullable: false, description: "User specified project name / title designation" },
      { name: "script_text", type: "TEXT", nullable: false, description: "Character script contents entered for conversion" },
      { name: "vocal_character_id", type: "VARCHAR(50)", nullable: false, description: "Specific voice avatar selected" },
      { name: "vocal_speed", type: "DECIMAL(3,2)", nullable: false, description: "Speed velocity multiplier applied" },
      { name: "vocal_pitch", type: "DECIMAL(3,2)", nullable: false, description: "Pitch modulation frequency multiplier" },
      { name: "s3_audio_url", type: "TEXT", nullable: false, description: "Secure pre-signed AWS S3 permanent download address" }
    ]
  }
];

export interface APISpecification {
  method: "POST" | "GET";
  path: string;
  description: string;
  headers: Record<string, string>;
  requestBody?: string;
  responseBody: string;
}

export const API_SPECS: APISpecification[] = [
  {
    method: "POST",
    path: "/api/v1/tts/synthesize",
    description: "Synchronize voice script payloads and stream back binary audio streams instantly with extreme speed.",
    headers: {
      "Authorization": "Bearer LXI_YOUR_DEVELOPER_KEY",
      "Content-Type": "application/json"
    },
    requestBody: JSON.stringify({
      text: "सफलता पाने के लिए आज ही उठें!",
      voice_id: "sandeep",
      language_id: "hindi",
      emotion_id: "excited",
      speed: 1.15,
      pitch: 1.0,
      output_format: "wav"
    }, null, 2),
    responseBody: JSON.stringify({
      status: "success",
      project_id: "proj_9f271bc823abf801",
      audio_url: "https://s3.ap-south-1.amazonaws.com/voiceloxic-outputs/prod/proj_9f271bc823abf801.wav",
      characters_processed: 31,
      credits_consumed: 1,
      latency_ms: 382
    }, null, 2)
  },
  {
    method: "GET",
    path: "/api/v1/tts/voices",
    description: "Fetch dynamic list of all authorized voice character talents, supporting language accents, and active status indicators.",
    headers: {
      "Authorization": "Bearer LXI_YOUR_DEVELOPER_KEY"
    },
    responseBody: JSON.stringify({
      status: "success",
      voices_count: 10,
      voices: [
        { id: "chinnu", name: "Chinnu", category: "Storytelling", gender: "Female", supported_languages: ["hindi", "hinglish", "tamil"] },
        { id: "sandeep", name: "Sandeep", category: "Motivational", gender: "Male", supported_languages: ["hindi", "hinglish", "punjabi"] }
      ]
    }, null, 2)
  }
];
