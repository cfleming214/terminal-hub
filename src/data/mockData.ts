// Realistic seed content (no lorem, no emoji) mirroring the design references.
import { Favorite, TerminalLine, ChatMessage } from '@/types';

let counter = 0;
export const uid = (prefix = 'id') => `${prefix}_${(counter++).toString(36)}_${Math.round(Math.random() * 1e6).toString(36)}`;

// Initial scrollback shown when a session opens (mirrors screens-b BTerminal).
export const mockTerminalLines: TerminalLine[] = [
  { id: 't1', type: 'info', text: 'Last login: Sun Jun 8 09:14:22 on ttys003' },
  { id: 't2', type: 'prompt', promptText: 'alex@home:~$ ', text: 'cd projects/webapp' },
  { id: 't3', type: 'prompt', promptText: 'alex@home:~/webapp$ ', text: 'npm install' },
  { id: 't4', type: 'dim', text: 'added 247 packages in 3.8s' },
  { id: 't5', type: 'prompt', promptText: 'alex@home:~/webapp$ ', text: 'npm run dev' },
  { id: 't6', type: 'dim', text: '> next dev --turbo' },
  { id: 't7', type: 'output', text: '  ▲ Next.js 14.2.3' },
  { id: 't8', type: 'url', text: '  Local:  http://localhost:3000' },
  { id: 't9', type: 'success', text: '✓ Ready in 892ms' },
];

// Lines streamed in to simulate a live session against the mock bridge.
export const mockStreamLines: TerminalLine[] = [
  { id: 's1', type: 'prompt', promptText: 'alex@home:~/webapp$ ', text: 'git status' },
  { id: 's2', type: 'output', text: 'On branch main' },
  { id: 's3', type: 'output', text: 'Changes not staged for commit:' },
  { id: 's4', type: 'error', text: '  modified:   src/App.tsx' },
  { id: 's5', type: 'dim', text: 'no changes added to commit' },
];

export const mockClaudeSuggestion = {
  text: 'Server running. Run npm run build to catch type errors before deploying.',
  highlight: 'npm run build',
  chips: ['npm run build', 'git status'],
};

export const mockFavorites: Favorite[] = [
  { id: 'f1', command: 'npm run dev', category: 'npm', usageCount: 142 },
  { id: 'f2', command: 'npm run build', category: 'npm', usageCount: 88 },
  { id: 'f3', command: 'git status', category: 'git', usageCount: 213 },
  { id: 'f4', command: 'git push origin main', category: 'git', usageCount: 76 },
  { id: 'f5', command: 'git checkout -b feat/', category: 'git', usageCount: 41 },
  { id: 'f6', command: 'docker ps -a', category: 'docker', usageCount: 59 },
  { id: 'f7', command: 'docker compose up -d', category: 'docker', usageCount: 33 },
  { id: 'f8', command: 'kubectl get pods -n prod', category: 'k8s', usageCount: 27 },
  { id: 'f9', command: 'kubectl logs -f deploy/api', category: 'k8s', usageCount: 19 },
  { id: 'f10', command: 'tail -f /var/log/system.log', category: 'logs', usageCount: 22 },
  { id: 'f11', command: 'ssh alex@192.168.1.102', category: 'ssh', usageCount: 14 },
  { id: 'f12', command: 'node --version', category: 'node', usageCount: 9 },
];

// Seed conversation for the Claude chat screen (mirrors screens-b BClaude).
export const mockChat: ChatMessage[] = [
  {
    id: 'c1',
    role: 'user',
    content: 'Commit to main or make a feature branch?',
    timestamp: '2026-06-08T09:20:00.000Z',
  },
  {
    id: 'c2',
    role: 'assistant',
    content: 'Branch it — keep main stable.\n\ngit checkout -b feat/app-update',
    chips: ['git checkout -b feat/app-update', 'git diff App.tsx'],
    timestamp: '2026-06-08T09:20:04.000Z',
  },
  {
    id: 'c3',
    role: 'user',
    content: 'What commit message format?',
    timestamp: '2026-06-08T09:21:00.000Z',
  },
  {
    id: 'c4',
    role: 'assistant',
    content: 'Conventional commits:\nfeat: new feature\nfix: bug fix\nchore: maintenance',
    timestamp: '2026-06-08T09:21:05.000Z',
  },
];
