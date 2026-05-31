import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Sparkles,
  Download,
  Play,
  Pause,
  Sliders,
  Volume2,
  Cpu,
  History,
  Users,
  CreditCard,
  Layers,
  Database,
  Terminal,
  Share2,
  Copy,
  Check,
  TrendingUp,
  Settings,
  Phone,
  Monitor,
  Heart,
  BookOpen,
  DollarSign,
  Gift,
  HelpCircle,
  Menu,
  ChevronRight,
  Shield,
  Zap,
  Globe,
  Radio,
  User,
  Trash2,
  Plus
} from "lucide-react";

import { LANGUAGES, EMOTIONS, VOICE_CHARACTERS, LANGUAGE_SAMPLES, FAQ_ITEMS, TESTIMONIALS, DB_SCHEMAS, API_SPECS } from "./data";
import { Language, VoiceCharacter, Emotion, SavedProject, UserAccount } from "./types";

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"workspace" | "mobile-preview" | "admin" | "website">("workspace");

  // Authentication states
  const [currentUser, setCurrentUser] = useState<UserAccount>({
    email: "harrygour9@gmail.com",
    role: "Admin",
    creditsLeft: 840,
    creditsTotal: 1000,
    planType: "Pro",
    referrals: 12,
    earnings: 240,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  });

  // Workspace configuration state
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceCharacter>(VOICE_CHARACTERS[1]); // Chinnu Child Girl
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>(EMOTIONS[0]); // Calm
  
  const [inputText, setInputText] = useState<string>(LANGUAGE_SAMPLES["hindi"]);
  const [projectTitle, setProjectTitle] = useState<string>("Kids Story Segment 1");
  const [vocalSpeed, setVocalSpeed] = useState<number>(1.0);
  const [vocalPitch, setVocalPitch] = useState<number>(1.0);
  const [format, setFormat] = useState<"mp3" | "wav">("mp3");
  const [engineMode, setEngineMode] = useState<"Gemini High-Fi" | "Web Speech Direct">("Gemini High-Fi");

  // Generation status and audio control states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [vocalSamplesLeft, setVocalSamplesLeft] = useState<number>(84);
  const [generationLog, setGenerationLog] = useState<string[]>([]);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  
  // Simulated Web Speech API states
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // General Notification System
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Marketing and Affiliate section states
  const [promoCodeInput, setPromoCodeInput] = useState<string>("");
  const [referralCodeCopied, setReferralCodeCopied] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);

  // Mobile App Simulation states
  const [mobileText, setMobileText] = useState<string>("चलो बच्चों, आज हम एक प्यारी कहानी सुनेंगे।");
  const [mobileLanguage, setMobileLanguage] = useState<Language>(LANGUAGES[0]);
  const [mobileVoice, setMobileVoice] = useState<VoiceCharacter>(VOICE_CHARACTERS[1]); // Chinnu
  const [mobileIsGenerating, setMobileIsGenerating] = useState<boolean>(false);

  // Admin section states
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>("All");
  const [simulatedRevenue, setSimulatedRevenue] = useState<number>(12840);
  const [adminLogInput, setAdminLogInput] = useState<string>("");

  // Auto-fill test sample text when language changes
  useEffect(() => {
    if (LANGUAGE_SAMPLES[selectedLanguage.id]) {
      setInputText(LANGUAGE_SAMPLES[selectedLanguage.id]);
    }
  }, [selectedLanguage]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Fetch initial profile context & project history
  useEffect(() => {
    fetch("/api/user")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data: UserAccount) => {
        setCurrentUser(data);
      })
      .catch(() => {
        console.log("No dynamic server user endpoint found or offline. Using standard mock context.");
      });

    fetch("/api/projects")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data: SavedProject[]) => {
        setSavedProjects(data);
      })
      .catch(() => {
        console.log("No dynamic server history logs found. Creating procedural placeholder backups.");
      });
  }, []);

  // Update voice configuration to match gender/language support automatically
  const handleVoiceChange = (voice: VoiceCharacter) => {
    setSelectedVoice(voice);
    // Find first supported language of this voice if current language is not supported
    if (!voice.languageSupport.includes(selectedLanguage.id)) {
      const matchLang = LANGUAGES.find(l => voice.languageSupport.includes(l.id));
      if (matchLang) {
        setSelectedLanguage(matchLang);
      }
    }
    showToast(`Loaded voice parameters of ${voice.name}`);
  };

  // Download logic for converted files
  const triggerAudioDownload = async (formatSelected: "mp3" | "wav") => {
    if (!inputText.trim()) {
      showToast("📢 Input text area is currently empty. Please type or load a preset sample!");
      return;
    }

    try {
      showToast("📥 Preparing voice file package for offline download...");
      
      let downloadUrl = audioUrl;
      const isDummyBlob = audioUrl && audioUrl.includes("blob:") && !audioUrl.startsWith("blob:http") ? false : true;

      // If we don't have an audioUrl, or in Web Speech Direct mode, or if it is a dummy Web Speech plain-text blob, 
      // fetch a real sound stream from the backend dynamically.
      if (engineMode === "Web Speech Direct" || !audioUrl) {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: inputText,
            voiceName: selectedVoice.geminiVoiceName || "Kore",
            emotionPrompt: selectedEmotion.promptModifier,
            languageName: selectedLanguage.name
          })
        });
        
        const data = await response.json();
        
        if (data.audioContent) {
          const audioBytesString = atob(data.audioContent);
          const bytesArray = new Uint8Array(audioBytesString.length);
          for (let i = 0; i < audioBytesString.length; i++) {
            bytesArray[i] = audioBytesString.charCodeAt(i);
          }
          const audioBlob = new Blob([bytesArray], { type: `audio/${formatSelected === "mp3" ? "mp3" : "wav"}` });
          downloadUrl = URL.createObjectURL(audioBlob);
        } else {
          throw new Error("Empty voice stream payload from server.");
        }
      }

      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${(projectTitle || "voiceloxic").toLowerCase().replace(/\s+/g, "_")}_output.${formatSelected}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`🎉 Successfully downloaded ${formatSelected.toUpperCase()} voice track!`);
      } else {
        showToast("❌ Direct vocal print export compiled empty. Attempting backup playback simulation!");
      }

    } catch (err) {
      console.error("Direct download system failed:", err);
      showToast("❌ Vocal print package export failed. Please check network connection!");
    }
  };

  // Convert Text into AI Voice
  const handleVoiceGeneration = async () => {
    if (!inputText.trim()) {
      showToast("📢 Input text area is currently empty. Please type or load a preset sample!");
      return;
    }

    setIsGenerating(true);
    setAudioProgress(0);
    setIsPlaying(false);
    
    // Log synthetic diagnostic parameters
    const timestamp = new Date().toLocaleTimeString();
    const entryMsg = `[${timestamp}] Initiated ${engineMode} synthesis for ${inputText.length} characters in ${selectedLanguage.name}.`;
    setGenerationLog((prev) => [entryMsg, ...prev].slice(0, 50));

    // Pause any current playbacks
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    if (engineMode === "Gemini High-Fi") {
      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: inputText,
            voiceName: selectedVoice.geminiVoiceName || "Kore",
            emotionPrompt: selectedEmotion.promptModifier,
            languageName: selectedLanguage.name
          })
        });

        const data = await response.json();

        // 1. Check if Gemini responds with correct Base64 payload
        if (data.audioContent) {
          const audioBytesString = atob(data.audioContent);
          const bytesArray = new Uint8Array(audioBytesString.length);
          for (let i = 0; i < audioBytesString.length; i++) {
            bytesArray[i] = audioBytesString.charCodeAt(i);
          }
          // Gemini high-fi TTS delivers raw PCM sampling or audio chunk. Let's create a dynamic Blob
          const audioBlob = new Blob([bytesArray], { type: "audio/wav" });
          const objectUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(objectUrl);
          
          // Deduct from credits
          setCurrentUser(prev => ({
            ...prev,
            creditsLeft: Math.max(0, prev.creditsLeft - 10)
          }));

          // Post transaction to project database schema
          await saveGeneratedProject(objectUrl, "Gemini High-Fi");
          setIsGenerating(false);
          showToast("✨ Premium high-fidelity AI voice generated via Gemini engine!");
          
          // Auto-start playback on generation
          setTimeout(() => {
            playGeneratedAudio(objectUrl);
          }, 300);

        } else if (data.warning === "DEMO_MODE_NO_KEY" || data.warning === "API_ERROR_FALLBACK") {
          // Fall back gracefully with prompt instructions to browser's built-in Web Speech API synthesis
          setGenerationLog(prev => [
            `[${timestamp}] API Warning/Offline: falling back to high-performance local regional voice synthesis.`,
            ...prev
          ]);
          executeLocalWebSpeechFallback();
        } else {
          executeLocalWebSpeechFallback();
        }

      } catch (err) {
        console.error("Failed server request, falling back to client synthesis", err);
        setGenerationLog(prev => [
          `[${timestamp}] Server dispatch failed. Launching local device synthesis fallback.`,
          ...prev
        ]);
        executeLocalWebSpeechFallback();
      }
    } else {
      // Direct offline speech synthesis setup
      executeLocalWebSpeechFallback();
    }
  };

  // Helper to commit to SaaS saved history database
  const saveGeneratedProject = async (urlStr: string, engineUsed: "Gemini High-Fi" | "Web Speech Direct") => {
    const projectSchema = {
      title: projectTitle || `Voice Clip - ${selectedVoice.name}`,
      text: inputText,
      voiceId: selectedVoice.id,
      voiceName: selectedVoice.name,
      languageId: selectedLanguage.id,
      emotionId: selectedEmotion.id,
      speed: vocalSpeed,
      pitch: vocalPitch,
      engineUsed
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectSchema)
      });
      if (res.ok) {
        const body = await res.json();
        if (body.project) {
          setSavedProjects(prev => [body.project, ...prev]);
        }
      } else {
        // Local state push on fallback
        pushLocalBackupState(projectSchema);
      }
    } catch {
      pushLocalBackupState(projectSchema);
    }
  };

  const pushLocalBackupState = (schema: any) => {
    const localProj: SavedProject = {
      id: `proj_local_${Date.now()}`,
      title: schema.title,
      text: schema.text,
      voiceId: schema.voiceId,
      voiceName: schema.voiceName,
      languageId: schema.languageId,
      emotionId: schema.emotionId,
      speed: schema.speed,
      pitch: schema.pitch,
      engineUsed: schema.engineUsed,
      createdAt: new Date().toISOString()
    };
    setSavedProjects(prev => [localProj, ...prev]);
  };

  // Core Web Speech Synthesis trigger (Works incredibly well online/offline across Indian Locales)
  const executeLocalWebSpeechFallback = () => {
    if (!synthRef.current) {
      setIsGenerating(false);
      showToast("❌ Current platform doesn't support Web Speech Synthesis. Please run on Google Chrome/Safari.");
      return;
    }

    // Stop speaking
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(inputText);
    
    // Map of languages to actual compatible Google/Mac native Indian system voices
    const codeMapping: Record<string, string> = {
      hindi: "hi-IN",
      english: "en-IN",
      hinglish: "hi-IN",
      tamil: "ta-IN",
      telugu: "te-IN",
      bengali: "bn-IN",
      marathi: "mr-IN",
      punjabi: "pa-IN"
    };

    utterance.lang = codeMapping[selectedLanguage.id] || "hi-IN";
    utterance.rate = vocalSpeed;
    utterance.pitch = vocalPitch;

    // Attach system voice matching category / gender
    const voicesList = synthRef.current.getVoices();
    const targetedLanguageCode = codeMapping[selectedLanguage.id] || "hi-IN";
    
    // Find native voice matched with selected target format
    let matchedVoice = voicesList.find(v => 
      v.lang.toLowerCase().includes(targetedLanguageCode.toLowerCase()) && 
      v.name.toLowerCase().includes(selectedVoice.gender.toLowerCase() === "male" ? "male" : "female")
    );

    if (!matchedVoice) {
      matchedVoice = voicesList.find(v => v.lang.toLowerCase().includes(targetedLanguageCode.toLowerCase()));
    }
    
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsGenerating(false);
      setIsPlaying(true);
      setAudioProgress(0);
      showToast("🔊 Playback initiated using local voice matrix.");
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setAudioProgress(100);
    };

    utterance.onerror = (e) => {
      setIsGenerating(false);
      setIsPlaying(false);
      console.error("Synthesizer error", e);
      showToast("⚠️ Synthesis error. Defaulting to pre-generated backup tracks.");
    };

    utteranceRef.current = utterance;
    
    // Create an elegant fake blob/track representation so downloads and seek controls look gorgeous
    const dummyBlob = new Blob([inputText], { type: "audio/mp3" });
    const dummyUrl = URL.createObjectURL(dummyBlob);
    setAudioUrl(dummyUrl);

    // Save project record
    saveGeneratedProject(dummyUrl, "Web Speech Direct");

    // Speak!
    synthRef.current.speak(utterance);
  };

  // Playback control for High-Fi sound waves
  const playGeneratedAudio = (url: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    audioRef.current.src = url;
    audioRef.current.playbackRate = vocalSpeed;
    
    audioRef.current.addEventListener("timeupdate", () => {
      if (audioRef.current) {
        const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setAudioProgress(pct || 0);
      }
    });

    audioRef.current.addEventListener("loadedmetadata", () => {
      if (audioRef.current) {
        setAudioDuration(audioRef.current.duration || 0);
      }
    });

    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
      setAudioProgress(100);
    });

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((e) => {
        console.error("High-Fi track playback failed, triggers fallback speech.", e);
        // Play local synth
        if (synthRef.current && utteranceRef.current) {
          synthRef.current.speak(utteranceRef.current);
          setIsPlaying(true);
        }
      });
  };

  const handlePausePlayback = () => {
    if (engineMode === "Gemini High-Fi" && audioRef.current && audioUrl) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (synthRef.current) {
      synthRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleResumePlayback = () => {
    if (engineMode === "Gemini High-Fi" && audioRef.current && audioUrl) {
      audioRef.current.play();
      setIsPlaying(true);
    } else if (synthRef.current) {
      synthRef.current.resume();
      setIsPlaying(true);
    }
  };

  // Voice sample previews (Listen to character timbre before burning credits)
  const handleVoicePreview = (voice: VoiceCharacter) => {
    if (!synthRef.current) {
      showToast("🔊 Synthesizer preview currently mimicking sounds.");
      return;
    }
    synthRef.current.cancel();
    
    const previewText = `Hello! I am ${voice.name}. Let us create absolute voice magic together.`;
    const previewUtterance = new SpeechSynthesisUtterance(previewText);
    previewUtterance.lang = "en-IN";
    previewUtterance.rate = 1.0;
    
    const voicesList = synthRef.current.getVoices();
    const systemVoice = voicesList.find(v => 
      v.lang.includes("hi-IN") || v.lang.includes("en-IN")
    );
    if (systemVoice) {
      previewUtterance.voice = systemVoice;
    }

    synthRef.current.speak(previewUtterance);
    showToast(`🗣️ Playing quick audio preview for [${voice.name}]`);
  };

  // Claim referral bonuses dynamically
  const claimPromoCode = () => {
    if (!promoCodeInput.trim()) {
      showToast("⚠️ Please specify a valid promotion coupon or referral code first!");
      return;
    }
    
    if (promoCodeInput.toLowerCase() === "loxi100" || promoCodeInput.toLowerCase() === "india50") {
      setCurrentUser(prev => ({
        ...prev,
        creditsLeft: prev.creditsLeft + 200,
        planType: "Pro"
      }));
      setPromoCodeInput("");
      showToast("🎉 Voucher Applied! 200 credits loaded and account status upgraded to PRO.");
    } else {
      // Simulate referral reward API
      fetch("/api/referrals/claim", { method: "POST" })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.updatedUser) {
            setCurrentUser(data.updatedUser);
            showToast("🎁 Referral Claimed! Received 100 extra Credits plus $20 USD credit.");
            setPromoCodeInput("");
          }
        })
        .catch(() => {
          // Local fallback promo credit award
          setCurrentUser(prev => ({
            ...prev,
            creditsLeft: prev.creditsLeft + 100,
            referrals: prev.referrals + 1,
            earnings: prev.earnings + 20
          }));
          setPromoCodeInput("");
          showToast("🎁 Referral Claimed! Received 100 extra Credits plus $20 USD credit.");
        });
    }
  };

  // Copy helper
  const copyToClipboard = (text: string, elementId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(elementId);
    showToast("📋 Code snippet copied to clipboard.");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Flutter Mobile App simulation trigger
  const runMobileTTS = () => {
    if (!mobileText.trim()) return;
    setMobileIsGenerating(true);
    setTimeout(() => {
      setMobileIsGenerating(false);
      showToast("📱 Mobile App Synthesis: Played output through simulated Flutter player!");
      
      // Native reading speaker
      if (synthRef.current) {
        synthRef.current.cancel();
        const testUtterance = new SpeechSynthesisUtterance(mobileText);
        testUtterance.lang = "hi-IN";
        synthRef.current.speak(testUtterance);
      }
    }, 1500);
  };

  // Delete project from history log
  const handleRemoveProject = (id: string) => {
    setSavedProjects(prev => prev.filter(p => p.id !== id));
    showToast("🗑️ Project record deleted from local history.");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-rose-500/30 selection:text-white">
      
      {/* Decorative Blur Background Graphics */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Floating Notification Toast */}
      {toastMsg && (
        <div 
          id="toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center p-4 space-x-3 text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl animate-bounce-short max-w-md backdrop-blur-md"
        >
          <div className="flex-shrink-0 bg-rose-500/20 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-sm font-medium leading-relaxed">{toastMsg}</div>
        </div>
      )}

      {/* Primary Global SaaS Header */}
      <header id="saas-header" className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-4 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-rose-500/20">
            <Mic className="w-5 h-5 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-rose-500 rounded-full border-2 border-zinc-950 flex items-center justify-center">
              <span className="text-[9px] font-black italic">IN</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              VoiceLoxic <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full font-semibold border border-rose-500/20 ml-1.5 uppercase tracking-widest">AI TTS</span>
            </h1>
            <p className="text-[10px] text-zinc-500">Premium Indian AI Voice Generation Hub</p>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <nav className="flex bg-zinc-900/80 p-1 border border-zinc-800 rounded-xl scale-95 sm:scale-100">
          <button 
            id="tab-workspace"
            onClick={() => setActiveTab("workspace")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${activeTab === "workspace" ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Studio Workspace</span>
          </button>
          
          <button 
            id="tab-mobile-preview"
            onClick={() => setActiveTab("mobile-preview")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${activeTab === "mobile-preview" ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile Preview</span>
          </button>

          <button 
            id="tab-admin"
            onClick={() => setActiveTab("admin")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${activeTab === "admin" ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </button>

          <button 
            id="tab-website"
            onClick={() => setActiveTab("website")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${activeTab === "website" ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>SaaS SEO Site</span>
          </button>
        </nav>

        {/* User Credit Counter Panel */}
        <div className="flex items-center space-x-3.5 bg-zinc-900/60 px-3 py-1.5 rounded-xl border border-zinc-800">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="text-[11px] text-zinc-400 whitespace-nowrap">
              Credits: <strong className="text-emerald-400 font-extrabold">{currentUser.creditsLeft}</strong> / {currentUser.creditsTotal}
            </div>
          </div>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center space-x-1">
            <span className="text-[10px] bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black uppercase px-2 py-0.5 rounded tracking-wider">
              {currentUser.planType} TIER
            </span>
          </div>
        </div>
      </header>

      {/* Main SaaS Screen Container */}
      <main className="flex-grow p-4 lg:p-8">

        {/* ================== MODULE 1: AI STUDIO WORKSPACE ================== */}
        {activeTab === "workspace" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-7xl mx-auto">
            
            {/* Top Workspace Banner */}
            <div className="col-span-12 bg-gradient-to-r from-zinc-900 via-rose-950/20 to-zinc-900 border border-zinc-800/80 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full border border-rose-500/20 font-bold uppercase tracking-widest">
                  Studio Workspace
                </span>
                <h2 className="text-xl font-extrabold mt-1.5 tracking-tight flex items-center gap-2">
                  Premium Text To Speech Sandbox <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Synthesize voice samples, apply granular emotions, regulate speed parameters, and export professional regional audio creations.
                </p>
              </div>

              {/* Instant Engine Toggle */}
              <div className="bg-zinc-950 p-1 border border-zinc-800 rounded-xl flex items-center">
                <button
                  id="toggle-engine-gemini"
                  onClick={() => setEngineMode("Gemini High-Fi")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    engineMode === "Gemini High-Fi"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Gemini High-Fi API</span>
                </button>
                <button
                  id="toggle-engine-local"
                  onClick={() => setEngineMode("Web Speech Direct")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    engineMode === "Web Speech Direct"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Direct Browser Speech</span>
                </button>
              </div>
            </div>

            {/* Left Sandbox Column: Core Controls */}
            <div className="xl:col-span-7 space-y-6">
              
              {/* Card 1: Text Prompt Input */}
              <div id="card-text-prompt" className="border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl relative">
                
                {/* Save details input */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <div className="w-full">
                    <label className="text-[11px] font-semibold text-zinc-500 block uppercase tracking-wider mb-1">
                      Project Title Designation
                    </label>
                    <input 
                      id="input-project-title"
                      type="text" 
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. YouTube Kids Story Introduction" 
                      className="w-full bg-zinc-950/60 border border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-200 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs text-zinc-500">Preset Sample:</span>
                    <button
                      id="btn-load-sample"
                      onClick={() => {
                        setInputText(LANGUAGE_SAMPLES[selectedLanguage.id]);
                        showToast(`Refreshed input text with regional [${selectedLanguage.name}] sample`);
                      }}
                      className="text-xs bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <RotateLoader className="w-3 h-3" /> Insert Sample
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    id="textarea-tts-content"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    maxLength={1500}
                    rows={6}
                    placeholder="लिखें या पेस्ट करें... Type or paste your Story, Advert, Podcast text script here to convert it into human-like realistic speech."
                    className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-4 text-sm font-medium text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all leading-relaxed resize-none"
                  />
                  <div className="absolute bottom-3.5 right-4 text-[10px] text-zinc-500 font-mono tracking-wider">
                    {inputText.length} / 1500 characters • {inputText.split(" ").filter(t => t).length} words
                  </div>
                </div>

                {/* Regional Indian Language selector slider button bar */}
                <div className="mt-5">
                  <label className="text-[11px] font-semibold text-zinc-500 block uppercase tracking-wider mb-2">
                    Target Language Accent Matcher ({LANGUAGES.length})
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2">
                    {LANGUAGES.map((lang) => {
                      const isSupported = selectedVoice.languageSupport.includes(lang.id);
                      return (
                        <button
                          key={lang.id}
                          id={`lang-btn-${lang.id}`}
                          onClick={() => {
                            setSelectedLanguage(lang);
                            showToast(`Switched speaking accent to ${lang.name}`);
                          }}
                          className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            selectedLanguage.id === lang.id
                              ? "bg-rose-500/20 border-rose-500 text-white"
                              : "bg-zinc-950/60 border-zinc-900/60 text-zinc-400 hover:bg-zinc-900"
                          } ${!isSupported ? "opacity-42 border-dashed" : ""}`}
                        >
                          <span className="text-base mb-0.5 leading-none">{lang.flag}</span>
                          <span className="text-[10px] font-semibold tracking-wider whitespace-nowrap">{lang.name}</span>
                          <span className="text-[8px] opacity-60 font-medium truncate w-full text-center">{lang.nativeName}</span>
                        </button>
                      );
                    })}
                  </div>
                  {!selectedVoice.languageSupport.includes(selectedLanguage.id) && (
                    <p className="text-[11px] text-amber-400 mt-2">
                      ⚠️ Note: {selectedVoice.name} does not natively support {selectedLanguage.name}. It will attempt to transliterate or apply accents.
                    </p>
                  )}
                </div>
              </div>

              {/* Card 2: Granular Emotion & Character Modulation sliders */}
              <div id="card-voice-effects" className="border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl">
                
                {/* Emotion selector presets */}
                <div className="mb-6">
                  <span className="text-[11px] font-semibold text-zinc-500 block uppercase tracking-wider mb-3">
                    Intonation & Emotion Controls
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {EMOTIONS.map((emo) => (
                      <button
                        key={emo.id}
                        id={`emotion-btn-${emo.id}`}
                        onClick={() => {
                          setSelectedEmotion(emo);
                          showToast(`Emotion modulated to: ${emo.label}`);
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          selectedEmotion.id === emo.id
                            ? "bg-gradient-to-tr from-rose-500/30 to-purple-500/30 border-rose-400 text-white shadow-lg"
                            : "bg-zinc-950/60 border-zinc-900/60 text-zinc-400 hover:bg-zinc-900"
                        }`}
                      >
                        <span className="text-xl mb-1.5">{emo.icon}</span>
                        <span className="text-[10px] font-semibold text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis w-full">{emo.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-rose-400" /> Currently injecting prompt instructions: <strong className="text-zinc-400">"{selectedEmotion.promptModifier}"</strong>
                  </p>
                </div>

                {/* Speed & Pitch Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-800/60">
                  
                  {/* Speed modulation */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5" /> Vocal Speed (Velocity)
                      </label>
                      <span className="text-xs font-mono font-bold text-rose-400">{vocalSpeed.toFixed(2)}x</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-zinc-600 font-semibold uppercase">0.5x</span>
                      <input
                        id="slider-speed"
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.05"
                        value={vocalSpeed}
                        onChange={(e) => setVocalSpeed(parseFloat(e.target.value))}
                        className="flex-grow accent-rose-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs text-zinc-600 font-semibold uppercase">2.0x</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <button 
                        onClick={() => setVocalSpeed(1.0)} 
                        className="text-[9px] text-zinc-500 hover:text-zinc-300 underline"
                      >
                        Reset to default (1.0x)
                      </button>
                      <span className="text-[9px] text-zinc-600">Great for Ads (1.1x)</span>
                    </div>
                  </div>

                  {/* Pitch modulation */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5" /> High Pitch Frequency
                      </label>
                      <span className="text-xs font-mono font-bold text-rose-400">{vocalPitch.toFixed(2)}x</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-zinc-600 font-semibold uppercase">0.5x</span>
                      <input
                        id="slider-pitch"
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={vocalPitch}
                        onChange={(e) => setVocalPitch(parseFloat(e.target.value))}
                        className="flex-grow accent-rose-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs text-zinc-600 font-semibold uppercase">1.5x</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <button 
                        onClick={() => setVocalPitch(1.0)} 
                        className="text-[9px] text-zinc-500 hover:text-zinc-300 underline"
                      >
                        Reset to default (1.0)
                      </button>
                      <span className="text-[9px] text-zinc-600">Lower = Deeper / Higher = Squeak</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Central Action Console */}
              <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                
                {/* Sparkle Glow decoration element */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center space-x-4">
                  <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20 shrink-0">
                    <Sparkles className="w-6 h-6 text-rose-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Synthesize Indian Realistic Speech</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Estimated Cost: <strong className="text-emerald-400 font-extrabold">10 Credits</strong> per click • Instant output stream</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto shrink-0 justify-end">
                  
                  {/* Generate Button */}
                  <button
                    id="btn-generate-tts"
                    onClick={handleVoiceGeneration}
                    disabled={isGenerating}
                    className="flex-grow md:flex-grow-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-500/20 hover:shadow-rose-500/35 transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-t-transparent border-white" />
                        <span>Synthesizing Voice...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4.5 h-4.5 animate-pulse" />
                        <span>Generate Realistic AI Voice</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Unified Output Performance Player Component */}
              {audioUrl && (
                <div id="unified-audio-player" className="border-2 border-rose-500/30 bg-rose-950/10 p-6 rounded-2xl shadow-xl animate-fade-in relative overflow-hidden">
                  
                  {/* Decorative glowing background bars */}
                  <div className="absolute left-0 bottom-0 top-0 w-1.5 bg-gradient-to-b from-rose-500 to-purple-600" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2.5">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
                      <h4 className="text-xs font-black uppercase text-rose-400 tracking-wider">
                        Live Synthesized Voice Output (Ready)
                      </h4>
                    </div>
                    
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 rounded font-bold uppercase">
                      {engineMode === "Gemini High-Fi" ? "GEMINI AI PREVIEW STREAM (24kHz)" : "WEB SPEED DIRECT ENGINE"}
                    </span>
                  </div>

                  {/* Pseudo Waveform Animation playing state representation */}
                  <div className="h-10 bg-zinc-950 p-2 rounded-xl border border-zinc-800/80 flex items-center justify-evenly mb-4 relative overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-r from-rose-500/5 to-purple-500/5" style={{ width: `${audioProgress}%` }}></div>
                    {[...Array(24)].map((_, index) => {
                      const heights = [2, 5, 8, 3, 9, 4, 12, 14, 6, 11, 4, 13, 10, 3, 11, 4, 15, 6, 12, 3, 9, 4, 6, 2];
                      const height = heights[index % heights.length];
                      return (
                        <div
                          key={index}
                          className="w-1 rounded-full bg-rose-500/40 transition-all duration-300"
                          style={{
                            height: isPlaying ? `${height * 2}px` : "4px",
                            animation: isPlaying ? `bounce ${0.6 + (index % 5) * 0.15}s ease-in-out infinite alternate` : "none"
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Play & Modulate controls bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    <div className="flex items-center space-x-3.5 w-full sm:w-auto">
                      {!isPlaying ? (
                        <button
                          id="btn-play-audio"
                          onClick={() => {
                            if (engineMode === "Gemini High-Fi" && audioUrl) {
                              playGeneratedAudio(audioUrl);
                            } else {
                              handleResumePlayback();
                            }
                          }}
                          className="w-12 h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                        >
                          <Play className="w-5.5 h-5.5 fill-current" />
                        </button>
                      ) : (
                        <button
                          id="btn-pause-audio"
                          onClick={handlePausePlayback}
                          className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center border border-zinc-700 shadow-md transition-transform hover:scale-105"
                        >
                          <Pause className="w-5.5 h-5.5" />
                        </button>
                      )}

                      <div>
                        <div className="text-xs font-bold truncate max-w-[200px]">
                          {projectTitle || "Voice Clip Out"}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          Format matches: .MP3 / .WAV stereo outputs
                        </div>
                      </div>
                    </div>

                    {/* Progress slider bar representation */}
                    <div className="flex-grow w-full text-right flex items-center space-x-3">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {Math.floor((audioProgress * audioDuration) / 100).toFixed(0)}s
                      </span>
                      <div className="h-1 bg-zinc-800 rounded-lg flex-grow relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 bg-rose-500" style={{ width: `${audioProgress}%` }}></div>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {audioDuration > 0 ? `${audioDuration.toFixed(1)}s` : "4.5s"}
                      </span>
                    </div>

                    {/* Download option triggers */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="bg-zinc-900 border border-zinc-850 p-1 rounded-xl flex">
                        <button
                          id="format-mp3"
                          onClick={() => setFormat("mp3")}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${format === "mp3" ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                        >
                          MP3
                        </button>
                        <button
                          id="format-wav"
                          onClick={() => setFormat("wav")}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${format === "wav" ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                        >
                          WAV
                        </button>
                      </div>

                      <button
                        id="btn-download-audio"
                        onClick={() => triggerAudioDownload(format)}
                        className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold text-zinc-100 flex items-center space-x-1.5 transition-all shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Right Sandbox Column: Indian Voice Cast */}
            <div className="xl:col-span-5 space-y-6">
              
              <div className="border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl flex flex-col h-full">
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold flex items-center gap-2">
                       Acoustic Cast Directory
                      <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-semibold">
                        {VOICE_CHARACTERS.length} Indian Casts
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Select an AI character profile to play preview samples or synthesize.</p>
                  </div>
                </div>

                {/* Voice grid search categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-2 gap-2.5 overflow-y-auto max-h-[560px] pr-1.5">
                  {VOICE_CHARACTERS.map((char) => {
                    const isSelected = selectedVoice.id === char.id;
                    const supportsCurrentLanguage = char.languageSupport.includes(selectedLanguage.id);

                    return (
                      <div
                        key={char.id}
                        id={`voice-card-${char.id}`}
                        onClick={() => handleVoiceChange(char)}
                        className={`p-3 relative. rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                          isSelected
                            ? "bg-gradient-to-br from-zinc-900 via-rose-950/20 to-zinc-900 border-rose-500 shadow-md scale-[1.01]"
                            : "bg-zinc-950/50 border-zinc-900/60 hover:bg-zinc-900/50"
                        }`}
                      >
                        
                        {/* Background subtle indicators */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                        )}

                        <div className="flex items-start space-x-3">
                          <img
                            src={char.avatarUrl}
                            alt={char.name}
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-800 border border-zinc-700/60 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-black truncate text-zinc-100 flex items-center gap-1.5">
                              {char.name}
                            </h4>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                              <span className="text-[8px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-black tracking-wider uppercase border border-zinc-800">
                                {char.category}
                              </span>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${char.gender === "Female" ? "bg-purple-950/40 text-purple-400 border border-purple-500/20" : "bg-blue-950/40 text-blue-400 border border-blue-500/20"}`}>
                                {char.gender}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[10px] text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                          {char.desc}
                        </p>

                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-zinc-900">
                          
                          {/* Accent info tag */}
                          <div className="text-[8px] text-zinc-500">
                            Prebuilt model: <strong className="text-zinc-400 font-mono font-semibold">{char.geminiVoiceName}</strong>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            {/* Listening sample speaker button */}
                            <button
                              id={`preview-speaker-btn-${char.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVoicePreview(char);
                              }}
                              className="p-1 px-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-[9px] font-black uppercase text-rose-400 flex items-center space-x-1 transition-all"
                              title="Listen to quick voice sample sound"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>Sample</span>
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* Generated History section of SaaS Studio Project Log */}
            <div className="col-span-12 mt-4 relative">
              <div className="border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                      <History className="w-4.5 h-4.5 text-rose-400" /> Recorded Output History ({savedProjects.length} Projects)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Explore your generated voice projects, reload configurations, or download files.</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-zinc-500 font-mono">Simulating AWS S3 Object Secure Storage</span>
                  </div>
                </div>

                {savedProjects.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                    <History className="w-10 h-10 text-zinc-700 mx-auto mb-2 animate-spin-slow" />
                    <h4 className="text-xs font-bold text-zinc-400">Workspace History Log is Empty</h4>
                    <p className="text-[11px] text-zinc-600 mt-1 max-w-sm mx-auto">Generate a voice above to log credentials, script records, configurations, and permanent download URLs.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                          <th className="pb-3 px-4">Title Designation</th>
                          <th className="pb-3 px-4">Prompt Script Synopsis</th>
                          <th className="pb-3 px-4">Modulation Setup</th>
                          <th className="pb-3 px-4">Assigned Voice</th>
                          <th className="pb-3 px-4">Engine</th>
                          <th className="pb-3 px-4 text-right">Actions Log</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 text-xs text-zinc-300">
                        {savedProjects.map((proj) => (
                          <tr key={proj.id} className="hover:bg-zinc-900/30 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-zinc-100 max-w-[200px] truncate">
                              {proj.title}
                            </td>
                            <td className="py-3.5 px-4 max-w-xs truncate text-zinc-400 font-medium italic">
                              "{proj.text}"
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[10px] text-rose-400/90 whitespace-nowrap">
                              Speed: {proj.speed.toFixed(2)}x • Pitch: {proj.pitch.toFixed(2)}x
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="bg-zinc-800/80 px-2 py-1 rounded text-[11px] font-semibold text-zinc-200">
                                {proj.voiceName}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-zinc-500 font-mono text-[10px] whitespace-nowrap">
                              {proj.engineUsed}
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                              <button
                                onClick={() => {
                                  setInputText(proj.text);
                                  setProjectTitle(proj.title);
                                  setVocalSpeed(proj.speed);
                                  setVocalPitch(proj.pitch);
                                  // Find the matched voice Character and language Accent
                                  const vc = VOICE_CHARACTERS.find(c => c.id === proj.voiceId);
                                  if (vc) setSelectedVoice(vc);
                                  const lang = LANGUAGES.find(l => l.id === proj.languageId);
                                  if (lang) setSelectedLanguage(lang);
                                  const emo = EMOTIONS.find(e => e.id === proj.emotionId);
                                  if (emo) setSelectedEmotion(emo);

                                  showToast(`♻️ Reloaded saved settings for: ${proj.title}`);
                                }}
                                className="px-2.5 py-1 rounded bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[10px] font-bold text-zinc-300 transition-all cursor-pointer"
                                title="Restore this project configurations to active sandbox work space."
                              >
                                Restore
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    showToast("📥 Exporting historical voice print...");
                                    const vc = VOICE_CHARACTERS.find(c => c.id === proj.voiceId) || selectedVoice;
                                    const lang = LANGUAGES.find(l => l.id === proj.languageId) || selectedLanguage;
                                    const emo = EMOTIONS.find(e => e.id === proj.emotionId) || selectedEmotion;
                                    
                                    const response = await fetch("/api/tts", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        text: proj.text,
                                        voiceName: vc.geminiVoiceName || "Kore",
                                        emotionPrompt: emo.promptModifier,
                                        languageName: lang.name
                                      })
                                    });
                                    const data = await response.json();
                                    if (data.audioContent) {
                                      const audioBytesString = atob(data.audioContent);
                                      const bytesArray = new Uint8Array(audioBytesString.length);
                                      for (let i = 0; i < audioBytesString.length; i++) {
                                        bytesArray[i] = audioBytesString.charCodeAt(i);
                                      }
                                      const audioBlob = new Blob([bytesArray], { type: "audio/wav" });
                                      const downloadUrl = URL.createObjectURL(audioBlob);
                                      
                                      const link = document.createElement("a");
                                      link.href = downloadUrl;
                                      link.download = `${proj.title.toLowerCase().replace(/\s+/g, "_")}_output.wav`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      showToast(`🎉 Successfully downloaded ${proj.title} file!`);
                                    } else {
                                      showToast("❌ Unable to fetch historical sound bytes.");
                                    }
                                  } catch (error) {
                                    console.error("History download failed", error);
                                    showToast("❌ Failed to compile download.");
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-rose-500 hover:bg-rose-600 text-[10px] font-bold text-white transition-all cursor-pointer"
                                title="Download high-fidelity WAV audio track directly"
                              >
                                Download
                              </button>
                              <button
                                onClick={() => handleRemoveProject(proj.id)}
                                className="p-1 px-2.5 rounded hover:bg-rose-955 border border-transparent hover:border-rose-900 text-[10px] font-bold text-rose-400 transition-all cursor-pointer"
                                title="Delete project record permanently"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}


        {/* ================== MODULE 2: INTERACTIVE MOBILE PREVIEW ================== */}
        {activeTab === "mobile-preview" && (
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Context bar */}
            <div className="bg-gradient-to-r from-zinc-900 via-purple-950/20 to-zinc-900 border border-zinc-800/80 p-5 rounded-2xl">
              <span className="text-xs bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/20 font-bold uppercase tracking-widest">
                Interactive flutter device preview
              </span>
              <h2 className="text-xl font-extrabold mt-1.5 tracking-tight flex items-center gap-2">
                 Cross-Platform Mobile Integration <Phone className="w-5 h-5 text-purple-400 animate-bounce-short" />
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Explore our simulated VoiceLoxic Flutter client integration layout. See how push notifications, TTS streaming, and downloads interface in mobile apps.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Flutter App Controls and Configuration Parameters */}
              <div className="lg:col-span-6 space-y-5">
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-850">
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Flutter Engine Configurator
                  </span>
                  <h3 className="text-base font-bold mt-2">Simulate Mobile Speech Synthesizer</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Apply dynamic changes to the smartphone view below. Press 'Trigger Device Speech' to verify mobile audio responses live.
                  </p>

                  <div className="space-y-4 mt-5">
                    
                    {/* Prompt script text input */}
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-500 text-left block uppercase tracking-wider mb-1">
                        Mobile Text Area
                      </label>
                      <input 
                        id="mobile-input-text"
                        type="text" 
                        value={mobileText} 
                        onChange={(e) => setMobileText(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200"
                        placeholder="हिन्दी पाठ..."
                      />
                    </div>

                    {/* Language selector dropdown */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-zinc-500 text-left block uppercase tracking-wider mb-1">
                          App Language Profile
                        </label>
                        <select 
                          id="mobile-select-lang"
                          value={mobileLanguage.id}
                          onChange={(e) => {
                            const match = LANGUAGES.find(l => l.id === e.target.value);
                            if (match) setMobileLanguage(match);
                          }}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200"
                        >
                          {LANGUAGES.map(l => (
                            <option key={l.id} value={l.id}>{l.flag} {l.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-zinc-500 text-left block uppercase tracking-wider mb-1">
                          App Voice Talent
                        </label>
                        <select 
                          id="mobile-select-voice"
                          value={mobileVoice.id}
                          onChange={(e) => {
                            const match = VOICE_CHARACTERS.find(c => c.id === e.target.value);
                            if (match) setMobileVoice(match);
                          }}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                        >
                          {VOICE_CHARACTERS.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                      💡 Real developer integration uses our client-side Flutter SDK which relies on Dart's asynchronous platform channels linked to ElevenLabs or custom prebuilt models.
                    </p>

                  </div>
                </div>

                {/* Simulated Notification Box */}
                <div className="bg-zinc-900 px-5 py-4 rounded-xl border border-zinc-850 flex items-center space-x-3.5">
                  <div className="bg-amber-400/10 p-2.5 rounded-lg">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Push Notifications active:</h4>
                    <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">Firebase Cloud Messaging (FCM) coordinates instant project logs, backup sync warnings, and limits.</p>
                  </div>
                </div>

              </div>

              {/* Graphical Mobile Skin View */}
              <div className="lg:col-span-6 flex justify-center">
                
                {/* Smartphone skin layout structure */}
                <div className="w-[320px] h-[610px] bg-zinc-950 border-4 border-zinc-800 rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col pt-3">
                  
                  {/* Speaker slot & camera notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-zinc-800 rounded-full flex items-center justify-center z-20">
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full mr-2" />
                    <div className="w-12 h-1 bg-zinc-950 rounded-full" />
                  </div>

                  {/* App Screen container */}
                  <div className="flex-grow bg-zinc-900 flex flex-col justify-between p-4 pt-6 select-none">
                    
                    {/* Header of dynamic app */}
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-6 h-6 rounded bg-rose-500 flex items-center justify-center text-[10px] text-white font-heavy">VL</div>
                        <h4 className="text-[11px] font-black tracking-tight">VoiceLoxic Mobile</h4>
                      </div>
                      
                      <span className="text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-bold font-mono">
                        v2.4.0
                      </span>
                    </div>

                    {/* Content screen stack */}
                    <div className="flex-grow space-y-4">
                      
                      {/* Virtual avatar section */}
                      <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 flex items-center space-x-3">
                        <img 
                          src={mobileVoice.avatarUrl} 
                          alt="avatar" 
                          className="w-12 h-12 rounded-xl object-cover border border-zinc-700/60"
                        />
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Loaded Voice Persona</div>
                          <div className="text-xs font-bold text-zinc-200">{mobileVoice.name}</div>
                          <div className="text-[9px] text-rose-400 mt-0.5">{mobileLanguage.name} • {mobileVoice.gender}</div>
                        </div>
                      </div>

                      {/* Text prompt representation frame */}
                      <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                        <span className="text-[8px] text-zinc-500 block uppercase tracking-wider mb-1 text-left">Mobile Synthesis Script</span>
                        <p className="text-[11px] font-medium text-zinc-300 leading-relaxed max-h-20 overflow-y-auto italic text-left">
                          "{mobileText}"
                        </p>
                      </div>

                      {/* Micro Wave Player design representation */}
                      <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-zinc-500">
                          <span>Synthesizer timeline</span>
                          <span className="font-mono text-zinc-400">0:00 / 0:02</span>
                        </div>
                        
                        <div className="h-1 bg-zinc-900 rounded-lg overflow-hidden">
                          <div className={`h-full bg-purple-500 ${mobileIsGenerating ? "w-2/3 animate-pulse" : "w-0"}`} />
                        </div>
                      </div>

                      {/* Dynamic simulation banner inside smartphone screen */}
                      <div className="bg-gradient-to-r from-purple-950/40 via-zinc-950 to-zinc-950 border border-purple-500/15 p-2 rounded-xl flex items-center space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <div className="text-[8px] text-zinc-400 text-left">
                          Flutter-rendered UI using Cupertino widgets designed beautifully for iOS & Android engines.
                        </div>
                      </div>

                    </div>

                    {/* Bottom Action Trigger inside Phone */}
                    <div className="space-y-2">
                      <button
                        id="mobile-test-tts-btn"
                        onClick={runMobileTTS}
                        disabled={mobileIsGenerating}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-[11px] uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md shadow-purple-500/20 disabled:opacity-50"
                      >
                        {mobileIsGenerating ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-t-transparent border-white" />
                        ) : (
                          <>
                            <Mic className="w-3 h-3" />
                            <span>Trigger Device Speech</span>
                          </>
                        )}
                      </button>

                      <p className="text-[8px] text-zinc-500 text-center uppercase tracking-widest leading-none">
                        Interactive Flutter Emulator
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}


        {/* ================== MODULE 3: ADMIN CONTROL & SCHEMAS ================== */}
        {activeTab === "admin" && (
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            
            {/* Header notification banner info */}
            <div className="bg-gradient-to-r from-zinc-900 via-emerald-950/20 to-zinc-900 border border-zinc-800/80 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold uppercase tracking-widest">
                  Enterprise Admin Control
                </span>
                <h2 className="text-xl font-extrabold mt-1.5 tracking-tight flex items-center gap-2">
                  System Diagnostics & Schema Hub <Shield className="w-5 h-5 text-emerald-400" />
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Analyze SaaS revenue graphs, check normalized MySQL database schema diagrams, track real API usage success metrics, or inspect REST request-response specs.
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-zinc-500 uppercase font-bold">API Security Status</div>
                <div className="text-xs font-black text-emerald-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active 99.98% SLA Secure
                </div>
              </div>
            </div>

            {/* Quick Metrics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] text-zinc-500 uppercase font-black">Monthly SaaS revenue</span>
                <div className="text-xl font-extrabold text-white mt-1">${simulatedRevenue} USD</div>
                <div className="text-[10px] text-emerald-400 mt-0.5 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +18.4% growth this month
                </div>
              </div>

              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] text-zinc-500 uppercase font-black">Active Regional Users</span>
                <div className="text-xl font-extrabold text-white mt-1">5,820</div>
                <span className="text-[10px] text-zinc-500 block mt-0.5">Mostly YouTube & Reel Creators</span>
              </div>

              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] text-zinc-500 uppercase font-black">Total Speech Generations</span>
                <div className="text-xl font-extrabold text-white mt-1">432,500</div>
                <span className="text-[10px] text-zinc-500 block mt-0.5">Across Hindi, Tamil & Punjabi</span>
              </div>

              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] text-zinc-500 uppercase font-black">System API Success Rate</span>
                <div className="text-xl font-extrabold text-emerald-400 mt-1">99.98%</div>
                <span className="text-[10px] text-zinc-500 block mt-0.5">Zero network latency issues</span>
              </div>

            </div>

            {/* Admin actions block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* MySQL Database Scheme Architect Panel */}
              <div className="lg:col-span-7 border border-zinc-850 bg-zinc-900/60 p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4.5 h-4.5 text-rose-400" /> Relational MySQL Database Schemas (Normalized)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Check fully documented MySQL schemas for user plans, tracking credits ledger, and audio uploads metadata.</p>
                </div>

                <div className="space-y-4">
                  {DB_SCHEMAS.map((table) => (
                    <div key={table.name} className="bg-zinc-950 p-4.5 rounded-xl border border-zinc-850">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-xs font-black text-rose-400 flex items-center gap-1.5 font-mono">
                          TABLE: {table.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 italic">{table.description}</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-zinc-900 text-[9px] uppercase tracking-wider text-zinc-400 font-extrabold">
                              <th className="pb-1 px-1">Column Name</th>
                              <th className="pb-1 px-1 font-mono">Type</th>
                              <th className="pb-1 px-1 text-center">Nullable</th>
                              <th className="pb-1 px-1">Functional Description</th>
                            </tr>
                          </thead>
                          <tbody className="text-[10px] text-zinc-300 divide-y divide-zinc-900">
                            {table.columns.map((col) => (
                              <tr key={col.name} className="hover:bg-zinc-900/10">
                                <td className="py-2 px-1 font-bold font-mono text-zinc-200">
                                  {col.name} {col.key && <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 py-0.5 rounded font-black tracking-widest">{col.key}</span>}
                                </td>
                                <td className="py-2 px-1 font-mono text-zinc-400">{col.type}</td>
                                <td className="py-2 px-1 text-center font-mono text-zinc-500">{col.nullable ? "TRUE" : "FALSE"}</td>
                                <td className="py-2 px-1 text-zinc-400 font-medium leading-relaxed">{col.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Developer REST API specifications and logs */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Developer REST APIs documentation view */}
                <div className="border border-zinc-850 bg-zinc-900/60 p-6 rounded-2xl space-y-5">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-4.5 h-4.5 text-rose-400" /> Developer REST APIs Integration Specifications
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Integrate the voice engine via RESTful payloads into Laravel backends, Python scripts, or Android projects.</p>
                  </div>

                  <div className="space-y-4">
                    {API_SPECS.map((spec) => (
                      <div key={spec.path} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 font-mono text-xs">
                            <span className="bg-emerald-500 text-black px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              {spec.method}
                            </span>
                            <span className="text-zinc-200 font-black">{spec.path}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-medium">{spec.description}</p>
                        
                        {/* Headers definition */}
                        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-850 text-[9px] font-mono">
                          <span className="text-zinc-500">Headers:</span>
                          {Object.entries(spec.headers).map(([k, v]) => (
                            <div key={k} className="text-zinc-300 ml-2">"{k}": "{v}"</div>
                          ))}
                        </div>

                        {/* Request Body wrapper */}
                        {spec.requestBody && (
                          <div className="relative">
                            <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mb-1 block">Request payload example</span>
                            <pre className="text-[10px] text-zinc-300 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 font-mono overflow-x-auto leading-relaxed max-h-52 select-text">
                              {spec.requestBody}
                            </pre>
                            <button
                              onClick={() => copyToClipboard(spec.requestBody || "", spec.path + "_req")}
                              className="absolute top-6 right-2 text-[9px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 p-1 px-1.5 rounded"
                            >
                              Copy Pay
                            </button>
                          </div>
                        )}

                        {/* Response Body wrap */}
                        <div className="relative">
                          <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mb-1 block">Expected JSON stream response</span>
                          <pre className="text-[10px] text-zinc-300 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 font-mono overflow-x-auto leading-relaxed max-h-52 select-text">
                            {spec.responseBody}
                          </pre>
                          <button
                            onClick={() => copyToClipboard(spec.responseBody, spec.path + "_resp")}
                            className="absolute top-6 right-2 text-[9px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 p-1 px-1.5 rounded"
                          >
                            Copy Response
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>

                {/* API Request Log viewer */}
                <div className="border border-zinc-850 bg-zinc-900/60 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-emerald-400" /> Active Session Diagnostics Log
                    </h3>
                    <button 
                      onClick={() => {
                        setGenerationLog([]);
                        showToast("Cleared active console diagnostics.");
                      }}
                      className="text-[9px] text-zinc-500 hover:text-zinc-300 underline"
                    >
                      Clear Log
                    </button>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 font-mono text-[10px] text-neutral-400 space-y-2 max-h-[220px] overflow-y-auto leading-relaxed select-text">
                    <div className="text-rose-400">// Diagnostic engine tracing live operations</div>
                    {generationLog.length === 0 ? (
                      <div className="text-zinc-600">No events recorded in active session. Trigger speech synthesis or download actions to feed live logs.</div>
                    ) : (
                      generationLog.map((logLine, index) => (
                        <div key={index} className="border-b border-zinc-900 pb-1">{logLine}</div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}


        {/* ================== MODULE 4: SEO LANDING PAGE SECTIONS & BILLING ================== */}
        {activeTab === "website" && (
          <div className="max-w-6xl mx-auto space-y-12 animate-fade-in text-zinc-200">
            
            {/* HERO INTRODUCTION ATTRACTIONS */}
            <section id="hero-marketing" className="text-center py-12 space-y-6 relative">
              <div className="absolute inset-x-0 -top-10 w-full h-40 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
              
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-black tracking-widest uppercase mb-2">
                🇮🇳 Crafted for Indian Content Creators & Businesses
              </span>

              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Convert Text to Ultra-Realistic <span className="text-rose-500 bg-rose-500/15 border border-rose-500/20 px-3 py-1 rounded-2xl">Indian Voices</span> Instantly
              </h2>

              <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Empower your parodies, YouTube stories, short reels, educational explainers, and marketing campaigns with high-fidelity, emotionally controlled Speech Synthesis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  id="marketing-workspace-cta"
                  onClick={() => setActiveTab("workspace")}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Enter Studio Workspace</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById("plans-pricing");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-sm tracking-wide transition-all"
                >
                  Explore Pricing Plans
                </button>
              </div>

              {/* Dynamic Feature Badges */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 pt-10 max-w-4xl mx-auto">
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 flex items-center space-x-3.5">
                  <div className="text-2xl">🎧</div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-zinc-200">14+ Characters</h4>
                    <p className="text-[10px] text-zinc-500">Child to Older voices</p>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 flex items-center space-x-3.5">
                  <div className="text-2xl">❤️</div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-zinc-200">7 Intonations</h4>
                    <p className="text-[10px] text-zinc-500">Excited, Calms & Angry</p>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 flex items-center space-x-3.5">
                  <div className="text-2xl">⚡</div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-zinc-200">Instant REST API</h4>
                    <p className="text-[10px] text-zinc-500">Zero latency, easy curls</p>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 flex items-center space-x-3.5">
                  <div className="text-2xl">🇮🇳</div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-zinc-200">8 Indian Languages</h4>
                    <p className="text-[10px] text-zinc-500">Hindi, Hinglish & Punjabi</p>
                  </div>
                </div>
              </div>
            </section>


            {/* MARKETING AFFILIATE AND COMMISSION PANEL */}
            <section id="marketing-affiliate" className="border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-black uppercase tracking-wider">
                    <Gift className="w-3.5 h-3.5" /> Referral & Commission Program
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight">
                    Earn $20 USD For Every Creator Referral + Free Credits
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Invite other Hindi podcasters, teachers, or YouTube creators to use VoiceLoxic. They receive <strong className="text-emerald-400 font-extrabold">100 Free credits</strong> instantly, and you earn <strong className="text-white font-heavy">$20 USD real cash</strong> plus premium extensions on their first subscription upgrade!
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black text-left">Your Referral Invitation Link</div>
                    <div className="flex items-center bg-zinc-950 p-2 rounded-xl border border-zinc-850 max-w-md">
                      <span className="text-[10px] font-mono text-zinc-500 px-2 truncate">
                        https://voiceloxic.ai/invite?code=HARRY9
                      </span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("https://voiceloxic.ai/invite?code=HARRY9");
                          setReferralCodeCopied(true);
                          showToast("Referral link copied!");
                          setTimeout(() => setReferralCodeCopied(false), 2000);
                        }}
                        className="ml-auto bg-zinc-900 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-bold text-zinc-100 flex items-center space-x-1 border border-zinc-800"
                      >
                        {referralCodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{referralCodeCopied ? "Copied" : "Copy Link"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 bg-zinc-950 p-6 rounded-xl border border-zinc-850 space-y-4">
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                     Claim Referral / Promo Vouchers
                  </h4>
                  <p className="text-[11px] text-zinc-500">Apply coupon codes (e.g. <strong>INDIA50</strong>, <strong>LOXI100</strong>) to load premium promotional credits instantly.</p>

                  <div className="space-y-3">
                    <input 
                      id="promo-code-input"
                      type="text" 
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="Enter promo coupon or referral code" 
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 font-bold tracking-wider"
                    />

                    <button
                      id="promo-claim-btn"
                      onClick={claimPromoCode}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer shadow"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Validate & Claim Voucher</span>
                    </button>
                  </div>

                  <div className="border-t border-zinc-850 pt-3 flex justify-between text-[11px]">
                    <span className="text-zinc-500">Successful Referrals:</span>
                    <strong className="text-zinc-300 font-extrabold">{currentUser.referrals} Indian creators</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Your Program Earnings:</span>
                    <strong className="text-emerald-400 font-bold">${currentUser.earnings} USD cash</strong>
                  </div>
                </div>
              </div>
            </section>


            {/* DYNAMIC VOICE CUSTOM EXAMPLES / SAMPLER LIST */}
            <section id="features-highlights" className="space-y-6">
              <div className="text-center">
                <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-1 rounded font-black uppercase tracking-wider">
                  Listen & Compare Accents
                </span>
                <h3 className="text-2xl font-extrabold mt-1.5">
                  Natural Acoustics Fitted For Daily Consumption
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Play native pre-compiled speech samples that showcase emotional depth across regions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-zinc-900/60 p-5 rounded-xl border border-zinc-850 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-purple-950/40 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-bold font-mono">
                      CHILD - GIRL ACCENT
                    </span>
                    <span className="text-xs">👶</span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100">Chinnu (Child Girl Hindi)</h4>
                  <p className="text-xs text-zinc-400 font-medium">"एक समय की बात है, एक सुंदर घने जंगल में चिंटू बंदर रहता था।"</p>
                  
                  <div className="pt-2 border-t border-zinc-850 flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500">Panchatantra Stories preset</span>
                    <button 
                      onClick={() => {
                        const ChinnuVoice = VOICE_CHARACTERS[1];
                        setSelectedVoice(ChinnuVoice);
                        setInputText("एक समय की बात है, एक सुंदर घने जंगल में चिंटू बंदर रहता था।");
                        setActiveTab("workspace");
                        showToast("Loaded Chinnu character with kids story preset.");
                      }}
                      className="text-[11px] text-rose-400 font-bold hover:underline"
                    >
                      Use inside Studio
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-5 rounded-xl border border-zinc-850 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-blue-950/40 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold font-mono">
                      ADULT - FEMALE PRESENTATION
                    </span>
                    <span className="text-xs">💼</span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100">Pooja (Warm Presenter Accent)</h4>
                  <p className="text-xs text-zinc-400 font-medium">"Hey guys! Welcome to VoiceLoxic AI workspace. Try writing script templates."</p>
                  
                  <div className="pt-2 border-t border-zinc-850 flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500">Corporate Explainer Ad</span>
                    <button 
                      onClick={() => {
                        const PoojaVoice = VOICE_CHARACTERS[2];
                        setSelectedVoice(PoojaVoice);
                        setInputText("Welcome to VoiceLoxic AI! This is a state-of-the-art TTS engine designed specifically for modern dynamic creators to synthesize realistic voices instantly.");
                        setActiveTab("workspace");
                        showToast("Loaded Pooja character with corporate presentation preset.");
                      }}
                      className="text-[11px] text-rose-400 font-bold hover:underline"
                    >
                      Use inside Studio
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-5 rounded-xl border border-zinc-850 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold font-mono">
                      ADULT - MOTIVATIONAL LEAD
                    </span>
                    <span className="text-xs">🔥</span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100">Sandeep (High Impact Speaker)</h4>
                  <p className="text-xs text-zinc-400 font-medium">"सफलता पाने के लिए आज ही उठें, और अपने आप को एक नई दिशा में ढालें।"</p>
                  
                  <div className="pt-2 border-t border-zinc-850 flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500">Instagram Reels / Short Clips</span>
                    <button 
                      onClick={() => {
                        const SandeepVoice = VOICE_CHARACTERS[9];
                        setSelectedVoice(SandeepVoice);
                        setInputText("सफलता पाने के लिए आज ही उठें, और अपने आप को एक नई दिशा में ढालें।");
                        setActiveTab("workspace");
                        showToast("Loaded Sandeep voice with high-impact reels preset.");
                      }}
                      className="text-[11px] text-rose-400 font-bold hover:underline"
                    >
                      Use inside Studio
                    </button>
                  </div>
                </div>

              </div>
            </section>


            {/* PREMIUM PRICING SUBSCRIPTION MATRIX */}
            <section id="plans-pricing" className="space-y-6 scroll-mt-20">
              <div className="text-center">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-black uppercase tracking-wider">
                  Honest SaaS Pricing
                </span>
                <h3 className="text-2xl font-extrabold mt-1.5">
                  Flexible Scale Options Configured For Every Budget
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Start for free to test regional synthesizers, or scale to high-volume commercial production packages.
                </p>
              </div>

              <div id="pricing-plans-grid" className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Free plan */}
                <div className="border border-zinc-850 bg-zinc-950/50 p-6 rounded-2xl flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="text-xs font-black text-zinc-400 uppercase tracking-widest text-left">Free Tier</div>
                    <div className="text-3xl font-black text-white">$0 <span className="text-xs font-normal text-zinc-500">/ forever</span></div>
                    <p className="text-xs text-zinc-400">Perfect for creators wanting to test synthesis capabilities with simple scripts.</p>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-400">
                    <li className="flex items-center gap-1.5">✔️ 50 Credits / daily free quota</li>
                    <li className="flex items-center gap-1.5">✔️ Access to local browser engine</li>
                    <li className="flex items-center gap-1.5">✔️ Standard MP3 format files</li>
                    <li className="flex items-center gap-1.5 text-zinc-600 font-semibold line-through">❌ Emotional voice synthesis modifiers</li>
                    <li className="flex items-center gap-1.5 text-zinc-600 font-semibold line-through">❌ REST APIs access hooks</li>
                  </ul>

                  <button
                    onClick={() => {
                      setCurrentUser(prev => ({ ...prev, planType: "Free", creditsTotal: 100 }));
                      showToast("Switched user subscription to: FREE");
                    }}
                    className="w-full py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Use Free Tier
                  </button>
                </div>

                {/* Starter plan */}
                <div className="border border-zinc-850 bg-zinc-950/50 p-6 rounded-2xl flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="text-xs font-black text-zinc-400 uppercase tracking-widest text-left">Starter Pack</div>
                    <div className="text-3xl font-black text-white">$9 <span className="text-xs font-normal text-zinc-500">/ monthly</span></div>
                    <p className="text-xs text-zinc-400">Tailored for growing educators, parodists, and storytellers starting out on YouTube.</p>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-400">
                    <li className="flex items-center gap-1.5">✔️ 1,500 Credits monthly limit</li>
                    <li className="flex items-center gap-1.5">✔️ 14+ Premium Gemini AI Voices</li>
                    <li className="flex items-center gap-1.5">✔️ MP3 and high-quality WAV tracks</li>
                    <li className="flex items-center gap-1.5">✔️ Granular Vocal speed controls</li>
                    <li className="flex items-center gap-1.5 text-zinc-650 line-through">❌ REST API connection key</li>
                  </ul>

                  <button
                    onClick={() => {
                      setCurrentUser(prev => ({ ...prev, planType: "Starter", creditsTotal: 1500, creditsLeft: 1210 }));
                      showToast("Selected Starter plan trial! 1,500 monthly credits issued.");
                    }}
                    className="w-full py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Select Starter Pack
                  </button>
                </div>

                {/* Pro plan (Featured) */}
                <div className="border-2 border-rose-500 bg-rose-950/5 p-6 rounded-2xl flex flex-col justify-between space-y-6 relative shadow-xl shadow-rose-500/5">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-500 text-black px-3.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                    Best Value
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-black text-rose-400 uppercase tracking-widest text-left">Professional</div>
                    <div className="text-3xl font-black text-white">$29 <span className="text-xs font-normal text-zinc-500">/ monthly</span></div>
                    <p className="text-xs text-zinc-400">Ideal for full-time creators and social agencies needing commercial-grade high-fidelity outputs.</p>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-center gap-1.5">✔️ 10,000 Premium High-Fi Credits</li>
                    <li className="flex items-center gap-1.5">✔️ Full emotional tone controllers</li>
                    <li className="flex items-center gap-1.5">✔️ Dedicated Indian Hinglish Accent</li>
                    <li className="flex items-center gap-1.5">✔️ Unlimited saved project history</li>
                    <li className="flex items-center gap-1.5">✔️ Standard REST API keys logic</li>
                  </ul>

                  <button
                    onClick={() => {
                      setCurrentUser(prev => ({ ...prev, planType: "pro", creditsTotal: 10000, creditsLeft: 8400 }));
                      showToast("Account status upgraded to PRO! 10,000 monthly credits loaded securely.");
                    }}
                    className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black transition-colors cursor-pointer shadow-lg"
                  >
                    Select Pro Plan
                  </button>
                </div>

                {/* Enterprise plan */}
                <div className="border border-zinc-850 bg-zinc-950/50 p-6 rounded-2xl flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="text-xs font-black text-zinc-400 uppercase tracking-widest text-left">Enterprise Scale</div>
                    <div className="text-3xl font-black text-white">$149 <span className="text-xs font-normal text-zinc-500">/ monthly</span></div>
                    <p className="text-xs text-zinc-400">Designed for marketing agencies, content networks, and automated audio app publishers.</p>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-400">
                    <li className="flex items-center gap-1.5">✔️ Unlimited synthesis throughput</li>
                    <li className="flex items-center gap-1.5">✔️ High-priority dedicated server API</li>
                    <li className="flex items-center gap-1.5">✔️ Customized regional accent models</li>
                    <li className="flex items-center gap-1.5">✔️ 24/7 technical developer support</li>
                    <li className="flex items-center gap-1.5">✔️ AWS S3 private outputs linkage</li>
                  </ul>

                  <button
                    onClick={() => {
                      setCurrentUser(prev => ({ ...prev, planType: "Enterprise", creditsTotal: 999999, creditsLeft: 999999 }));
                      showToast("Enrolled in Enterprise suite! Private API parameters validated.");
                    }}
                    className="w-full py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Get Enterprise Suite
                  </button>
                </div>

              </div>
            </section>


            {/* FAQ ACCORDION SECTION */}
            <section id="faq-accordions" className="max-w-4xl mx-auto space-y-6 pb-12">
              <div className="text-center">
                <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                  Knowledge Hub
                </span>
                <h3 className="text-2xl font-extrabold mt-1.5">
                  Frequently Asked System Inquiries
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Get precise answers about latency, regional voices, permissions, and licensing structures.</p>
              </div>

              <div className="space-y-3">
                {FAQ_ITEMS.map((faq, index) => (
                  <div key={index} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-850 space-y-2">
                    <h4 className="text-sm font-black text-white flex items-start gap-2.5 text-left leading-relaxed">
                      <HelpCircle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                      {faq.q}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed pl-7 text-left">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

      </main>

      {/* Global SaaS Footer */}
      <footer id="saas-global-footer" className="border-t border-zinc-900 bg-zinc-950 text-zinc-500 py-8 px-6 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Mic className="w-4 h-4 text-rose-500" />
            <span className="font-extrabold text-zinc-400">VoiceLoxic AI</span>
            <span>• premium text to speech SaaS ecosystem. All rights reserved.</span>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <a href="#workspace" onClick={(e) => { e.preventDefault(); setActiveTab("workspace"); }} className="hover:text-zinc-300 transition-colors">Studio</a>
            <a href="#mobile-preview" onClick={(e) => { e.preventDefault(); setActiveTab("mobile-preview"); }} className="hover:text-zinc-300 transition-colors">Mobile Preview</a>
            <a href="#admin" onClick={(e) => { e.preventDefault(); setActiveTab("admin"); }} className="hover:text-zinc-300 transition-colors">Database Schemas</a>
            <a href="#apis" onClick={(e) => { e.preventDefault(); setActiveTab("admin"); }} className="hover:text-zinc-300 transition-colors">Developer APIs</a>
          </div>

          <div>
            <span className="text-[10px] bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded inline-block">
              Secure Cloud Run container containerised
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Minimal auxiliary component for re-insert loading rotation
function RotateLoader({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
