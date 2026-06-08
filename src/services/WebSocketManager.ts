// One persistent connection per machine, real (WebSocket) or mock. Handles reconnect with
// exponential backoff and multicasts server messages to all subscribed screens.
import { Machine } from '@/types';
import { BRIDGE_PORT, ClientMessage, ServerMessage, ConnectionStatus } from './bridgeProtocol';
import { MockBridge } from './MockBridge';

type MessageListener = (msg: ServerMessage) => void;
type StatusListener = (status: ConnectionStatus) => void;

interface Connection {
  ws: WebSocket | null;
  mock: MockBridge | null;
  status: ConnectionStatus;
  messageListeners: Set<MessageListener>;
  statusListeners: Set<StatusListener>;
  retries: number;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  closedByUser: boolean;
  useMock: boolean;
  url: string;
}

const MAX_BACKOFF = 15000;

class BridgeManager {
  private connections = new Map<string, Connection>();

  connect(machine: Machine, useMock: boolean) {
    const existing = this.connections.get(machine.id);
    const url = `ws://${machine.hostname}:${BRIDGE_PORT}`;
    if (existing && existing.useMock === useMock && existing.url === url) return;
    if (existing) this.teardown(machine.id);

    const conn: Connection = {
      ws: null,
      mock: null,
      status: 'connecting',
      messageListeners: new Set(),
      statusListeners: new Set(),
      retries: 0,
      reconnectTimer: null,
      closedByUser: false,
      useMock,
      url,
    };
    // Preserve listeners from a prior connection so subscribers survive a reconnect/mode switch.
    if (existing) {
      conn.messageListeners = existing.messageListeners;
      conn.statusListeners = existing.statusListeners;
    }
    this.connections.set(machine.id, conn);
    this.open(machine.id);
  }

  private open(machineId: string) {
    const conn = this.connections.get(machineId);
    if (!conn) return;
    this.setStatus(conn, 'connecting');

    if (conn.useMock) {
      conn.mock = new MockBridge((msg) => this.dispatch(machineId, msg));
      // MockBridge emits a 'connected' message which flips status below.
      return;
    }

    try {
      const ws = new WebSocket(conn.url);
      conn.ws = ws;
      ws.onopen = () => {
        conn.retries = 0;
        this.setStatus(conn, 'connected');
      };
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(String(event.data)) as ServerMessage;
          this.dispatch(machineId, msg);
        } catch {
          // ignore malformed frames
        }
      };
      ws.onerror = () => this.setStatus(conn, 'error');
      ws.onclose = () => {
        this.setStatus(conn, 'disconnected');
        if (!conn.closedByUser) this.scheduleReconnect(machineId);
      };
    } catch {
      this.setStatus(conn, 'error');
      this.scheduleReconnect(machineId);
    }
  }

  private scheduleReconnect(machineId: string) {
    const conn = this.connections.get(machineId);
    if (!conn || conn.closedByUser) return;
    const delay = Math.min(MAX_BACKOFF, 600 * 2 ** conn.retries);
    conn.retries += 1;
    conn.reconnectTimer = setTimeout(() => this.open(machineId), delay);
  }

  private dispatch(machineId: string, msg: ServerMessage) {
    const conn = this.connections.get(machineId);
    if (!conn) return;
    if (msg.type === 'connected') this.setStatus(conn, 'connected');
    if (msg.type === 'error') this.setStatus(conn, 'error');
    conn.messageListeners.forEach((l) => l(msg));
  }

  private setStatus(conn: Connection, status: ConnectionStatus) {
    conn.status = status;
    conn.statusListeners.forEach((l) => l(status));
  }

  send(machineId: string, msg: ClientMessage) {
    const conn = this.connections.get(machineId);
    if (!conn) return;
    if (conn.useMock) {
      conn.mock?.send(msg);
    } else if (conn.ws && conn.ws.readyState === WebSocket.OPEN) {
      conn.ws.send(JSON.stringify(msg));
    }
  }

  subscribe(machineId: string, onMessage: MessageListener, onStatus: StatusListener): () => void {
    const conn = this.connections.get(machineId);
    if (!conn) return () => {};
    conn.messageListeners.add(onMessage);
    conn.statusListeners.add(onStatus);
    onStatus(conn.status); // emit current status immediately
    return () => {
      conn.messageListeners.delete(onMessage);
      conn.statusListeners.delete(onStatus);
    };
  }

  getStatus(machineId: string): ConnectionStatus {
    return this.connections.get(machineId)?.status ?? 'disconnected';
  }

  private teardown(machineId: string) {
    const conn = this.connections.get(machineId);
    if (!conn) return;
    if (conn.reconnectTimer) clearTimeout(conn.reconnectTimer);
    conn.mock?.close();
    if (conn.ws) {
      conn.ws.onclose = null;
      conn.ws.close();
    }
  }

  disconnect(machineId: string) {
    const conn = this.connections.get(machineId);
    if (!conn) return;
    conn.closedByUser = true;
    this.teardown(machineId);
    this.connections.delete(machineId);
  }
}

export const bridgeManager = new BridgeManager();
