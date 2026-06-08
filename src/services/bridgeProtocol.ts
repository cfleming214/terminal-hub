// Wire protocol between the app and the Mac bridge server. Keep in sync with bridge-server/index.js.
import { TerminalLineType } from '@/types';

export const BRIDGE_PORT = 8765;

export interface WireLine {
  type: TerminalLineType;
  text: string;
  promptText?: string;
}

// App → bridge
export type ClientMessage =
  | { type: 'input'; text: string } // run a command in the shell
  | { type: 'claude'; context: string[]; prompt: string; machineName: string };

// Bridge → app
export type ServerMessage =
  | { type: 'output'; line: WireLine }
  | { type: 'claude_chunk'; text: string }
  | { type: 'claude_done'; chips?: string[] }
  | { type: 'heartbeat'; cpu: number; mem: number }
  | { type: 'connected' }
  | { type: 'error'; message: string };

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
