export interface Language {
  id: string;
  name: string;
  flag: string;
  nativeName: string;
}

export interface VoiceCharacter {
  id: string;
  name: string;
  gender: "Female" | "Male";
  category: string;
  avatarUrl: string;
  desc: string;
  geminiVoiceName: string;
  languageSupport: string[];
}

export interface Emotion {
  id: string;
  label: string;
  icon: string;
  promptModifier: string;
}

export interface SavedProject {
  id: string;
  title: string;
  text: string;
  speed: number;
  pitch: number;
  voiceName: string;
  voiceId: string;
  languageId: string;
  emotionId: string;
  engineUsed: string;
  createdAt?: string;
}

export interface UserAccount {
  email: string;
  role: string;
  creditsLeft: number;
  creditsTotal: number;
  planType: string;
  referrals: number;
  earnings: number;
  avatar: string;
}
