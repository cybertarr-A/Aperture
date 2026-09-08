import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  SAMPLE_EPISODE,
  type AspectRatio,
  type Domain,
  type Episode,
  type VoiceId,
} from "@/lib/episode";
import { LIMITS, compactEpisode } from "@/lib/sanitize";
import { readSessionKey, writeSessionKey } from "@/lib/session-key";

type Status = "idle" | "researching" | "ready" | "error";

type StudioState = {
  apiKey: string;
  keyOk: boolean | null;
  domain: Domain;
  topic: string;
  aspectRatio: AspectRatio;
  durationSeconds: 15 | 36;
  voice: VoiceId;
  current: Episode | null;
  library: Episode[];
  status: Status;
  error: string | null;
  audioUrl: string | null;
  setApiKey: (v: string) => void;
  setKeyOk: (v: boolean | null) => void;
  setDomain: (v: Domain) => void;
  setTopic: (v: string) => void;
  setAspectRatio: (v: AspectRatio) => void;
  setDuration: (v: 15 | 36) => void;
  setVoice: (v: VoiceId) => void;
  setStatus: (v: Status) => void;
  setError: (v: string | null) => void;
  setAudioUrl: (v: string | null) => void;
  hydrateSession: () => void;
  clearKey: () => void;
  saveEpisode: (ep: Episode) => void;
  selectEpisode: (id: string) => void;
  removeEpisode: (id: string) => void;
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      apiKey: "",
      keyOk: null,
      domain: "compute",
      topic: "",
      aspectRatio: "9:16",
      durationSeconds: 15,
      voice: "austin",
      current: SAMPLE_EPISODE,
      library: [SAMPLE_EPISODE],
      status: "idle",
      error: null,
      audioUrl: null,
      setApiKey: (apiKey) => {
        writeSessionKey(apiKey);
        set({ apiKey, keyOk: null });
      },
      setKeyOk: (keyOk) => set({ keyOk }),
      setDomain: (domain) => set({ domain }),
      setTopic: (topic) => set({ topic: topic.slice(0, LIMITS.topic) }),
      setAspectRatio: (aspectRatio) => set({ aspectRatio }),
      setDuration: (durationSeconds) => set({ durationSeconds }),
      setVoice: (voice) => set({ voice }),
      setStatus: (status) => set({ status }),
      setError: (error) => set({ error }),
      setAudioUrl: (audioUrl) => {
        const prev = get().audioUrl;
        if (prev) URL.revokeObjectURL(prev);
        set({ audioUrl });
      },
      hydrateSession: () => {
        const apiKey = readSessionKey();
        if (apiKey) set({ apiKey });
      },
      clearKey: () => {
        writeSessionKey("");
        set({ apiKey: "", keyOk: null });
      },
      saveEpisode: (ep) =>
        set((s) => ({
          current: ep,
          library: [compactEpisode(ep), ...s.library.filter((e) => e.id !== ep.id)].slice(
            0,
            LIMITS.library,
          ),
          status: "ready",
          error: null,
          audioUrl: null,
        })),
      selectEpisode: (id) =>
        set((s) => ({
          current: s.library.find((e) => e.id === id) ?? s.current,
          audioUrl: null,
        })),
      removeEpisode: (id) =>
        set((s) => {
          const library = s.library.filter((e) => e.id !== id);
          const current =
            s.current?.id === id ? (library[0] ?? SAMPLE_EPISODE) : s.current;
          return { library, current };
        }),
    }),
    {
      name: "aperture-studio",
      skipHydration: true,
      partialize: (s) => ({
        domain: s.domain,
        topic: s.topic,
        aspectRatio: s.aspectRatio,
        durationSeconds: s.durationSeconds,
        voice: s.voice,
        current: s.current ? compactEpisode(s.current) : null,
        library: s.library.map(compactEpisode).slice(0, LIMITS.library),
      }),
    },
  ),
);
