// Core data models (README §State Management).

export type MachineStatus = 'online' | 'offline' | 'connecting';

export interface Machine {
  id: string;
  name: string;
  hostname: string; // IP or hostname
  username: string;
  port: number;
  isPrimary: boolean;
  status: MachineStatus;
  lastConnected: string; // ISO string; serializable for the store
  cpuPercent?: number;
  memPercent?: number;
}

// Terminal line types drive color (see getLineColor in theme).
export type TerminalLineType = 'prompt' | 'output' | 'dim' | 'url' | 'success' | 'error' | 'info';

export interface TerminalLine {
  id: string;
  type: TerminalLineType;
  text: string;
  promptText?: string; // amber prompt prefix shown before `text`
}

export interface Session {
  machineId: string;
  lines: TerminalLine[];
  claudeSuggestion: string | null;
  claudeChips: string[];
  inputValue: string;
  isConnected: boolean;
}

export interface Favorite {
  id: string;
  command: string;
  category: string;
  usageCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chips?: string[];
  timestamp: string; // ISO string
  streaming?: boolean; // assistant message currently receiving chunks
}

export interface Settings {
  theme: string;
  fontSize: string;
  lineHeight: string;
  autoReconnect: boolean;
  compression: boolean;
  keepalive: string;
  claudeSuggestions: boolean;
  autoSuggest: string;
  contextLines: string;
  useMockBridge: boolean; // when true, the app runs against replayed mock data (no Mac bridge required)
}
