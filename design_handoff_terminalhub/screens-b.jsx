// screens-b.jsx — Direction B: "Pulse"
// Deep navy + amber glow + glass panels — JetBrains Mono throughout

const bM    = '"JetBrains Mono", "Fira Code", monospace';
const bBg   = '#060d1f';
const bBg2  = '#0b1526';
const bCard = 'rgba(255,255,255,0.04)';
const bBd   = 'rgba(255,255,255,0.07)';
const bAmber      = '#f59e0b';
const bAmberFaint = 'rgba(245,158,11,0.09)';
const bAmberBd    = 'rgba(245,158,11,0.22)';
const bAmberGlow  = '0 0 22px rgba(245,158,11,0.22)';
const bTeal   = '#34d399';
const bBlue   = '#60a5fa';
const bPurple = '#a78bfa';
const bText   = '#e2e8f0';
const bMid    = '#4a6180';
const bDim    = '#253349';

function BCursor() {
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 15,
      background: bAmber,
      animation: 'blink 1.1s step-end infinite',
      verticalAlign: 'middle',
      boxShadow: `0 0 7px ${bAmber}`,
    }} />
  );
}

function BNav({ title, sub, pulse = true }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 18px', borderBottom: `1px solid ${bBd}`,
    }}>
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M6 1L1 6l5 5" stroke={bMid} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: bM, fontSize: 13, fontWeight: 600, color: bText }}>{title}</div>
        {sub && <div style={{ fontFamily: bM, fontSize: 10.5, color: bMid, marginTop: 2 }}>{sub}</div>}
      </div>
      {pulse && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: bAmber, boxShadow: `0 0 8px ${bAmber}, 0 0 16px rgba(245,158,11,0.3)` }} />
        </div>
      )}
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────
function BLogin() {
  return (
    <div style={{ background: bBg, fontFamily: bM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ padding: '28px 0 24px', textAlign: 'center', position: 'relative', width: '100%' }}>
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 10, color: bMid, letterSpacing: 4, marginBottom: 14 }}>TERMINALHUB</div>
        <div style={{ width: 58, height: 58, borderRadius: '50%', border: `1.5px solid rgba(245,158,11,0.55)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: bAmberGlow, background: bAmberFaint }}>
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <path d="M2 1l6 7-6 7" stroke={bAmber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 15h9" stroke={bAmber} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: bText, letterSpacing: -0.5 }}>
          Terminal<span style={{ color: bAmber }}>Hub</span>
        </div>
        <div style={{ fontSize: 10.5, color: bMid, marginTop: 5 }}>remote terminal controller</div>
      </div>

      <div style={{ width: '100%', padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 11, boxSizing: 'border-box' }}>
        {[['hostname','192.168.1.100'],['username','alex'],['ssh_key','~/.ssh/id_rsa'],['port','22']].map(([lbl, val]) => (
          <div key={lbl}>
            <div style={{ fontSize: 10, color: bMid, letterSpacing: 1.5, marginBottom: 5 }}>{lbl.toUpperCase()}</div>
            <div style={{ background: bCard, border: `1px solid ${bBd}`, borderRadius: 10, padding: '11px 14px', fontSize: 13, color: bText, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{val}</span>
              {lbl === 'ssh_key' && <span style={{ fontSize: 10, color: bAmber }}>CHANGE</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ width: '100%', padding: '18px 22px 0', boxSizing: 'border-box' }}>
        <div style={{ background: bAmber, borderRadius: 12, padding: '14px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#000', letterSpacing: 2, boxShadow: bAmberGlow }}>
          CONNECT
        </div>
      </div>

      <div style={{ padding: '14px', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: bMid }}>+ register new machine</span>
      </div>
    </div>
  );
}

// ── DEVICES ────────────────────────────────────────────────────
function BDevices() {
  const ms = [
    { name: 'MacBook Pro',  user: 'alex',   ip: '192.168.1.100', st: 'online',  cpu: 12, mem: 68, since: '2m',  primary: true  },
    { name: 'Mac Studio',   user: 'alex',   ip: '192.168.1.102', st: 'online',  cpu: 34, mem: 45, since: '5h',  primary: false },
    { name: 'Work MacBook', user: 'alopez', ip: '10.0.1.44',     st: 'online',  cpu: 8,  mem: 32, since: '1d',  primary: false },
    { name: 'Mac Mini',     user: 'alex',   ip: '192.168.1.105', st: 'offline', cpu: 0,  mem: 0,  since: '3d',  primary: false },
  ];
  return (
    <div style={{ background: bBg, fontFamily: bM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${bBd}` }}>
        <div style={{ fontSize: 11, color: bMid, letterSpacing: 2, marginBottom: 4 }}>YOUR MACHINES</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: bText }}>
          3 <span style={{ fontSize: 14, fontWeight: 400, color: bMid }}>connected</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        {ms.map((m, i) => (
          <div key={i} style={{ background: m.primary ? `rgba(245,158,11,0.08)` : bCard, border: `1px solid ${m.primary ? bAmberBd : bBd}`, borderRadius: 14, padding: '13px 15px', boxShadow: m.primary ? `0 0 20px rgba(245,158,11,0.1)` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: m.st === 'online' ? 10 : 0 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: m.primary ? bAmber : bText }}>{m.name}</div>
                <div style={{ fontSize: 10.5, color: bMid, marginTop: 2 }}>{m.user}@{m.ip}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.st === 'online' ? bAmber : bDim, boxShadow: m.st === 'online' ? `0 0 8px ${bAmber}` : 'none' }} />
                <span style={{ fontSize: 10.5, color: m.st === 'online' ? bAmber : bMid }}>{m.st}</span>
              </div>
            </div>
            {m.st === 'online' && (
              <div style={{ display: 'flex', gap: 14 }}>
                {[['CPU', m.cpu, bTeal], ['MEM', m.mem, bBlue]].map(([lbl, val, col]) => (
                  <div key={lbl} style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 9.5, color: bMid }}>{lbl}</span>
                      <span style={{ fontSize: 9.5, color: col }}>{val}%</span>
                    </div>
                    <div style={{ height: 3, background: bBd, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${val}%`, height: '100%', background: col, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 14px', borderTop: `1px solid ${bBd}` }}>
        <div style={{ border: `1px dashed rgba(245,158,11,0.2)`, borderRadius: 12, padding: '11px', textAlign: 'center', fontSize: 12, color: bMid, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ color: bAmber }}>+</span> add machine
        </div>
      </div>
    </div>
  );
}

// ── TERMINAL (KEY SCREEN) ──────────────────────────────────────
function BTerminal() {
  const lines = [
    { t:'info', text:'Last login: Sun Jun 8 09:14:22 on ttys003' },
    { t:'blank' },
    { t:'cmd', p:'alex@home:~$ ', c:'cd projects/webapp' },
    { t:'cmd', p:'alex@home:~/webapp$ ', c:'npm install' },
    { t:'out', text:'added 247 packages in 3.8s', col: bMid },
    { t:'blank' },
    { t:'cmd', p:'alex@home:~/webapp$ ', c:'npm run dev' },
    { t:'out', text:'> next dev --turbo', col: bMid },
    { t:'blank' },
    { t:'out', text:'  ▲ Next.js 14.2.3',              col: bText },
    { t:'out', text:'  Local:  http://localhost:3000',  col: bBlue },
    { t:'blank' },
    { t:'out', text:'✓ Ready in 892ms', col: bTeal },
    { t:'blank' },
    { t:'cmd', p:'alex@home:~/webapp$ ', c: null, cursor: true },
  ];

  return (
    <div style={{ background: bBg, fontFamily: bM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <BNav title="MacBook Pro" sub="alex@192.168.1.100 · ssh" />

      {/* Glass terminal area */}
      <div style={{ flex: 1, margin: '10px 14px 8px', background: bCard, border: `1px solid ${bBd}`, borderRadius: 16, padding: '14px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Live badge */}
        <div style={{ position: 'absolute', top: 11, right: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: bAmber, boxShadow: `0 0 5px ${bAmber}` }} />
          <span style={{ fontSize: 9, color: bMid, letterSpacing: 1 }}>LIVE</span>
        </div>

        {lines.map((ln, i) => {
          if (ln.t === 'blank') return <div key={i} style={{ height: 4 }} />;
          if (ln.t === 'info')  return <div key={i} style={{ fontSize: 10, color: bMid, marginBottom: 6, lineHeight: 1.5 }}>{ln.text}</div>;
          if (ln.t === 'out')   return <div key={i} style={{ fontSize: 11.5, color: ln.col, lineHeight: 1.55 }}>{ln.text}</div>;
          return (
            <div key={i} style={{ fontSize: 11.5, lineHeight: 1.55 }}>
              <span style={{ color: bAmber, fontWeight: 600 }}>{ln.p}</span>
              {ln.c && <span style={{ color: bText }}>{ln.c}</span>}
              {ln.cursor && <BCursor />}
            </div>
          );
        })}
      </div>

      {/* Claude suggestion card */}
      <div style={{ margin: '0 14px 9px', background: bAmberFaint, border: `1px solid ${bAmberBd}`, borderRadius: 14, padding: '11px 14px', boxShadow: `0 0 24px rgba(245,158,11,0.1)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: bAmber, boxShadow: `0 0 6px ${bAmber}` }} />
          <span style={{ fontSize: 10, color: bAmber, letterSpacing: 1.5, fontWeight: 600 }}>CLAUDE</span>
        </div>
        <div style={{ fontSize: 12, color: bText, lineHeight: 1.65 }}>
          Server running. Run <span style={{ color: bAmber }}>npm run build</span> to catch type errors before deploying.
        </div>
        <div style={{ display: 'flex', gap: 7, marginTop: 10, flexWrap: 'wrap' }}>
          {['npm run build', 'git status'].map(cmd => (
            <div key={cmd} style={{ fontSize: 10.5, padding: '5px 11px', background: 'rgba(245,158,11,0.1)', border: `1px solid ${bAmberBd}`, borderRadius: 20, color: bAmber }}>{cmd}</div>
          ))}
        </div>
      </div>

      {/* Floating pill input */}
      <div style={{ margin: '0 14px 14px', background: bCard, border: `1px solid ${bBd}`, borderRadius: 30, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: bAmber, fontSize: 15 }}>›</span>
        <div style={{ flex: 1, fontSize: 13, color: bText }}>git push origin main</div>
        <div style={{ background: bAmber, borderRadius: 20, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: '#000' }}>RUN</div>
      </div>
    </div>
  );
}

// ── CLAUDE CHAT ────────────────────────────────────────────────
function BClaude() {
  return (
    <div style={{ background: bBg, fontFamily: bM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <BNav title="✦ Claude" sub="MacBook Pro session" />

      {/* Context panel */}
      <div style={{ margin: '10px 14px 0', background: bCard, border: `1px solid ${bBd}`, borderRadius: 14, padding: '12px 14px' }}>
        <div style={{ fontSize: 9.5, color: bMid, letterSpacing: 2, marginBottom: 8 }}>TERMINAL CONTEXT</div>
        {[
          { p:'alex@home:~/webapp$ ', c:'npm run dev' },
          { o:'✓ Ready in 892ms', col: bTeal },
          { p:'alex@home:~/webapp$ ', c:'git status' },
          { o:'modified: src/App.tsx', col: bMid },
        ].map((l, i) => (
          <div key={i} style={{ fontSize: 10.5, lineHeight: 1.5, color: l.col || bText }}>
            {l.p && <span style={{ color: bAmber }}>{l.p}</span>}
            {l.c || l.o}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        <div style={{ alignSelf: 'flex-end', maxWidth: '84%' }}>
          <div style={{ fontSize: 9.5, color: bMid, textAlign: 'right', marginBottom: 4 }}>you</div>
          <div style={{ background: 'rgba(245,158,11,0.1)', border: `1px solid ${bAmberBd}`, borderRadius: '14px 14px 4px 14px', padding: '10px 13px', fontSize: 12, color: bText, lineHeight: 1.6 }}>
            Commit to main or make a feature branch?
          </div>
        </div>

        <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: bAmber, boxShadow: `0 0 4px ${bAmber}` }} />
            <span style={{ fontSize: 9.5, color: bAmber }}>claude</span>
          </div>
          <div style={{ background: bCard, border: `1px solid ${bBd}`, borderRadius: '4px 14px 14px 14px', padding: '10px 13px', fontSize: 12, color: bText, lineHeight: 1.6 }}>
            Branch it — keep <span style={{ color: bAmber }}>main</span> stable.<br /><br />
            <span style={{ color: bTeal }}>git checkout -b feat/app-update</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {['git checkout -b feat/app-update', 'git diff App.tsx'].map(c => (
              <div key={c} style={{ fontSize: 9.5, padding: '4px 9px', background: bCard, border: `1px solid ${bBd}`, borderRadius: 20, color: bMid }}>{c}</div>
            ))}
          </div>
        </div>

        <div style={{ alignSelf: 'flex-end', maxWidth: '84%' }}>
          <div style={{ fontSize: 9.5, color: bMid, textAlign: 'right', marginBottom: 4 }}>you</div>
          <div style={{ background: 'rgba(245,158,11,0.1)', border: `1px solid ${bAmberBd}`, borderRadius: '14px 14px 4px 14px', padding: '10px 13px', fontSize: 12, color: bText, lineHeight: 1.6 }}>
            What commit message format?
          </div>
        </div>

        <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: bAmber, boxShadow: `0 0 4px ${bAmber}` }} />
            <span style={{ fontSize: 9.5, color: bAmber }}>claude</span>
          </div>
          <div style={{ background: bCard, border: `1px solid ${bBd}`, borderRadius: '4px 14px 14px 14px', padding: '10px 13px', fontSize: 12, color: bText, lineHeight: 1.6 }}>
            Conventional commits:<br />
            <span style={{ color: bAmber }}>feat:</span><span style={{ color: bMid }}> new feature</span><br />
            <span style={{ color: bAmber }}>fix:</span><span style={{ color: bMid }}> bug fix</span><br />
            <span style={{ color: bAmber }}>chore:</span><span style={{ color: bMid }}> maintenance</span>
          </div>
        </div>
      </div>

      <div style={{ margin: '0 14px 14px', background: bCard, border: `1px solid ${bBd}`, borderRadius: 30, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, fontSize: 12, color: bMid }}>Ask Claude... <BCursor /></div>
        <div style={{ background: bAmber, borderRadius: 20, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: '#000' }}>→</div>
      </div>
    </div>
  );
}

// ── FAVORITES ──────────────────────────────────────────────────
function BFavorites() {
  const cats = ['all', 'git', 'npm', 'docker', 'k8s'];
  const cmds = [
    ['npm run dev', 'npm', bAmber],
    ['npm run build', 'npm', bAmber],
    ['git status', 'git', bBlue],
    ['git push origin main', 'git', bBlue],
    ['docker ps -a', 'docker', bTeal],
    ['kubectl get pods -n prod', 'k8s', bPurple],
  ];
  return (
    <div style={{ background: bBg, fontFamily: bM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <BNav title="Favorites" sub="12 saved commands" />

      <div style={{ display: 'flex', gap: 7, padding: '11px 14px', borderBottom: `1px solid ${bBd}`, overflow: 'hidden' }}>
        {cats.map((cat, i) => (
          <div key={cat} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, background: i === 0 ? bAmber : bCard, color: i === 0 ? '#000' : bMid, border: `1px solid ${i === 0 ? bAmber : bBd}`, fontWeight: i === 0 ? 700 : 400, flexShrink: 0 }}>{cat}</div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
        {cmds.map(([cmd, cat, col], i) => (
          <div key={i} style={{ background: bCard, border: `1px solid ${bBd}`, borderRadius: 12, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: bText }}>{cmd}</div>
              <span style={{ fontSize: 9.5, padding: '2px 7px', marginTop: 4, display: 'inline-block', background: `${col}18`, color: col, borderRadius: 10 }}>{cat}</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: bAmberFaint, border: `1px solid ${bAmberBd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: bAmber }}>▶</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SETTINGS ───────────────────────────────────────────────────
function BSettings() {
  const groups = [
    { title: 'Appearance', rows: [{ k:'Theme', v:'Dracula', toggle:false }, { k:'Font Size', v:'13px', toggle:false }, { k:'Line Height', v:'1.6', toggle:false }] },
    { title: 'Connection', rows: [{ k:'Auto-reconnect', v:true, toggle:true }, { k:'Compression', v:true, toggle:true }, { k:'Keepalive', v:'30s', toggle:false }] },
    { title: 'Claude', rows: [{ k:'Suggestions', v:true, toggle:true }, { k:'Auto-suggest', v:'on error', toggle:false }, { k:'Context lines', v:'50', toggle:false }] },
  ];
  return (
    <div style={{ background: bBg, fontFamily: bM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <BNav title="Settings" pulse={false} />

      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        {groups.map(group => (
          <div key={group.title} style={{ background: bCard, border: `1px solid ${bBd}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '9px 14px 5px', fontSize: 10, color: bMid, letterSpacing: 2 }}>
              {group.title.toUpperCase()}
            </div>
            {group.rows.map((row, i) => (
              <div key={row.k} style={{ display: 'flex', alignItems: 'center', padding: '11px 14px', borderTop: i === 0 ? `1px solid ${bBd}` : 'none' }}>
                <span style={{ flex: 1, fontSize: 13, color: bText }}>{row.k}</span>
                {row.toggle ? (
                  <div style={{ width: 44, height: 26, borderRadius: 13, background: row.v ? bAmber : bDim, position: 'relative', boxShadow: row.v ? `0 0 8px rgba(245,158,11,0.3)` : 'none' }}>
                    <div style={{ position: 'absolute', top: 3, left: row.v ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12, color: bAmber }}>{row.v}</span>
                    <svg width="5" height="9" viewBox="0 0 5 9" fill="none"><path d="M1 1l3 3.5-3 3.5" stroke={bMid} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { BLogin, BDevices, BTerminal, BClaude, BFavorites, BSettings });
