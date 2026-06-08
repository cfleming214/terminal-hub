// Global app state (Zustand). Shape per AGENTS.md §Zustand Store, extended with favorites + settings.
import { create } from 'zustand';
import { Machine, Session, TerminalLine, ChatMessage, Favorite, Settings } from '@/types';
import { mockFavorites, uid } from '@/data/mockData';

const defaultSettings: Settings = {
  theme: 'Dracula',
  fontSize: '13px',
  lineHeight: '1.6',
  autoReconnect: true,
  compression: true,
  keepalive: '30s',
  claudeSuggestions: true,
  autoSuggest: 'on error',
  contextLines: '50',
  useMockBridge: false,
};

function freshSession(machineId: string): Session {
  return {
    machineId,
    lines: [],
    claudeSuggestion: null,
    claudeChips: [],
    inputValue: '',
    isConnected: false,
  };
}

interface AppStore {
  machines: Machine[];
  activeMachineId: string | null;
  sessions: Record<string, Session>;
  claudeChats: Record<string, ChatMessage[]>;
  favorites: Favorite[];
  settings: Settings;

  // Machines
  addMachine: (m: Omit<Machine, 'id'>) => string;
  setActive: (id: string) => void;
  setPrimary: (id: string) => void;
  updateMachineStats: (id: string, cpuPercent: number, memPercent: number) => void;
  setMachineStatus: (id: string, status: Machine['status']) => void;

  // Sessions / terminal
  ensureSession: (machineId: string) => void;
  appendLine: (machineId: string, line: Omit<TerminalLine, 'id'>) => void;
  setInput: (machineId: string, value: string) => void;
  setConnected: (machineId: string, connected: boolean) => void;
  setClaudeSuggestion: (machineId: string, text: string | null, chips: string[]) => void;

  // Claude chat
  addChatMessage: (machineId: string, msg: Omit<ChatMessage, 'id'>) => string;
  appendChatChunk: (machineId: string, messageId: string, chunk: string) => void;
  finishChatMessage: (machineId: string, messageId: string, chips?: string[]) => void;

  // Favorites
  addFavorite: (command: string, category: string) => void;
  removeFavorite: (id: string) => void;
  incrementFavoriteUsage: (id: string) => void;

  // Settings
  updateSettings: (patch: Partial<Settings>) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  machines: [],
  activeMachineId: null,
  sessions: {},
  claudeChats: {},
  favorites: mockFavorites.map((f) => ({ ...f })),
  settings: defaultSettings,

  addMachine: (m) => {
    const id = uid('m');
    set((s) => ({ machines: [...s.machines, { ...m, id }] }));
    return id;
  },

  setActive: (id) => set({ activeMachineId: id }),

  setPrimary: (id) =>
    set((s) => ({
      machines: s.machines.map((m) => ({ ...m, isPrimary: m.id === id })),
    })),

  updateMachineStats: (id, cpuPercent, memPercent) =>
    set((s) => ({
      machines: s.machines.map((m) => (m.id === id ? { ...m, cpuPercent, memPercent } : m)),
    })),

  setMachineStatus: (id, status) =>
    set((s) => ({
      machines: s.machines.map((m) => (m.id === id ? { ...m, status } : m)),
    })),

  ensureSession: (machineId) =>
    set((s) => (s.sessions[machineId] ? s : { sessions: { ...s.sessions, [machineId]: freshSession(machineId) } })),

  appendLine: (machineId, line) =>
    set((s) => {
      const session = s.sessions[machineId] ?? freshSession(machineId);
      const withLine: Session = { ...session, lines: [...session.lines, { ...line, id: uid('t') }] };
      return { sessions: { ...s.sessions, [machineId]: withLine } };
    }),

  setInput: (machineId, value) =>
    set((s) => {
      const session = s.sessions[machineId] ?? freshSession(machineId);
      return { sessions: { ...s.sessions, [machineId]: { ...session, inputValue: value } } };
    }),

  setConnected: (machineId, connected) =>
    set((s) => {
      const session = s.sessions[machineId] ?? freshSession(machineId);
      return { sessions: { ...s.sessions, [machineId]: { ...session, isConnected: connected } } };
    }),

  setClaudeSuggestion: (machineId, text, chips) =>
    set((s) => {
      const session = s.sessions[machineId] ?? freshSession(machineId);
      return {
        sessions: { ...s.sessions, [machineId]: { ...session, claudeSuggestion: text, claudeChips: chips } },
      };
    }),

  addChatMessage: (machineId, msg) => {
    const id = uid('c');
    set((s) => ({
      claudeChats: { ...s.claudeChats, [machineId]: [...(s.claudeChats[machineId] ?? []), { ...msg, id }] },
    }));
    return id;
  },

  appendChatChunk: (machineId, messageId, chunk) =>
    set((s) => ({
      claudeChats: {
        ...s.claudeChats,
        [machineId]: (s.claudeChats[machineId] ?? []).map((m) =>
          m.id === messageId ? { ...m, content: m.content + chunk } : m
        ),
      },
    })),

  finishChatMessage: (machineId, messageId, chips) =>
    set((s) => ({
      claudeChats: {
        ...s.claudeChats,
        [machineId]: (s.claudeChats[machineId] ?? []).map((m) =>
          m.id === messageId ? { ...m, streaming: false, chips: chips ?? m.chips } : m
        ),
      },
    })),

  addFavorite: (command, category) =>
    set((s) => ({ favorites: [{ id: uid('f'), command, category, usageCount: 0 }, ...s.favorites] })),

  removeFavorite: (id) => set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) })),

  incrementFavoriteUsage: (id) =>
    set((s) => ({
      favorites: s.favorites.map((f) => (f.id === id ? { ...f, usageCount: f.usageCount + 1 } : f)),
    })),

  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
}));
