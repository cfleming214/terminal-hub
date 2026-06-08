// screens-a.jsx — Direction A: "Raw Signal"
// Pure terminal aesthetic — amber on black, JetBrains Mono throughout

const aM = '"JetBrains Mono", "Fira Code", monospace';
const aBg  = '#0a0a0a';
const aBg2 = '#101010';
const aBg3 = '#161616';
const aAmber      = '#f59e0b';
const aAmberFaint = 'rgba(245,158,11,0.1)';
const aAmberBd    = 'rgba(245,158,11,0.25)';
const aGreen = '#6ee7b7';
const aBlue  = '#93c5fd';
const aText  = '#c4c4c4';
const aDim   = '#484848';
const aBd    = '#1c1c1c';

function ACursor() {
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 14,
      background: aAmber,
      animation: 'blink 1.1s step-end infinite',
      verticalAlign: 'middle',
    }} />
  );
}

function ANav({ title, sub, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 18px', borderBottom: `1px solid ${aBd}`,
      background: aBg,
    }}>
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M6 1L1 6l5 5" stroke={aDim} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: aM, fontSize: 13, fontWeight: 600, color: aAmber }}>{title}</div>
        {sub && <div style={{ fontFamily: aM, fontSize: 10.5, color: aDim, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────
function ALogin() {
  return (
    <div style={{ background: aBg, fontFamily: aM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 24px 20px', borderBottom: `1px solid ${aBd}` }}>
        <div style={{ fontSize: 10, color: aDim, letterSpacing: 4, marginBottom: 10 }}>TERMINALHUB v1.0</div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -1 }}>
          <span style={{ color: aAmber }}>TERMINAL</span><span style={{ color: aText }}>HUB</span>
        </div>
        <div style={{ fontSize: 11, color: aDim, marginTop: 6 }}>remote terminal controller</div>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[['hostname','192.168.1.100'],['username','alex'],['ssh_key','~/.ssh/id_rsa'],['port','22']].map(([lbl, val]) => (
          <div key={lbl}>
            <div style={{ fontSize: 10, color: aDim, letterSpacing: 2, marginBottom: 5 }}>{lbl.toUpperCase()}</div>
            <div style={{ background: aBg3, border: `1px solid ${aBd}`, padding: '10px 14px', fontSize: 13, color: aText, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{val}</span>
              {lbl === 'ssh_key' && <span style={{ fontSize: 10, color: aAmber }}>CHANGE</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '4px 24px' }}>
        <div style={{ background: aAmber, padding: '14px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#000', letterSpacing: 3 }}>
          CONNECT →
        </div>
      </div>

      <div style={{ padding: '14px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: aDim }}>+ register new machine</span>
      </div>

      <div style={{ margin: '0 24px', padding: '10px 12px', background: aBg3, border: `1px solid ${aBd}` }}>
        <div style={{ fontSize: 9.5, color: aDim, letterSpacing: 2, marginBottom: 4 }}>LAST FINGERPRINT</div>
        <div style={{ fontSize: 10, color: aDim }}>SHA256:kx3mN7qPzA1vWbYcRdT...</div>
      </div>
    </div>
  );
}

// ── DEVICES ────────────────────────────────────────────────────
function ADevices() {
  const ms = [
    { name: 'MacBook Pro', user: 'alex', ip: '192.168.1.100', st: 'online', since: '2m',  load: '12%', primary: true  },
    { name: 'Mac Studio',  user: 'alex', ip: '192.168.1.102', st: 'online', since: '5h',  load: '34%', primary: false },
    { name: 'Work MacBook',user:'alopez',ip: '10.0.1.44',     st: 'online', since: '1d',  load: '8%',  primary: false },
    { name: 'Mac Mini',    user: 'alex', ip: '192.168.1.105', st: 'offline',since: '3d',  load: '--',  primary: false },
  ];
  return (
    <div style={{ background: aBg, fontFamily: aM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${aBd}` }}>
        <div style={{ fontSize: 10, color: aDim, letterSpacing: 3 }}>MACHINES</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>
          <span style={{ color: aAmber }}>3</span>
          <span style={{ fontSize: 12, color: aDim, fontWeight: 400, marginLeft: 8 }}>online · 1 offline</span>
        </div>
      </div>

      <div style={{ display: 'flex', padding: '6px 20px', fontSize: 9.5, color: aDim, letterSpacing: 2, borderBottom: `1px solid ${aBd}` }}>
        <div style={{ flex: 1 }}>HOST</div>
        <div style={{ width: 48, textAlign: 'right' }}>LOAD</div>
        <div style={{ width: 64, textAlign: 'right' }}>STATUS</div>
      </div>

      <div style={{ flex: 1 }}>
        {ms.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', borderBottom: `1px solid ${aBd}`, background: m.primary ? aAmberFaint : 'transparent' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: m.primary ? aAmber : aText, fontWeight: m.primary ? 600 : 400, display: 'flex', alignItems: 'center', gap: 8 }}>
                {m.name}
                {m.primary && <span style={{ fontSize: 9, color: aAmber, letterSpacing: 1 }}>PRIMARY</span>}
              </div>
              <div style={{ fontSize: 10.5, color: aDim, marginTop: 2 }}>{m.user}@{m.ip}</div>
            </div>
            <div style={{ width: 48, textAlign: 'right', fontSize: 11, color: aDim }}>{m.load}</div>
            <div style={{ width: 64, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.st === 'online' ? aGreen : '#2a2a2a', boxShadow: m.st === 'online' ? `0 0 5px ${aGreen}` : 'none' }} />
              <span style={{ fontSize: 10, color: m.st === 'online' ? aGreen : aDim }}>{m.st}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 20px', borderTop: `1px solid ${aBd}` }}>
        <div style={{ fontSize: 12, color: aDim, textAlign: 'center' }}>
          <span style={{ color: aAmber }}>+</span> add machine
        </div>
      </div>
    </div>
  );
}

// ── TERMINAL (KEY SCREEN) ──────────────────────────────────────
function ATerminal() {
  const lines = [
    { t:'info', text:'Last login: Sun Jun 8 09:14:22 on ttys003' },
    { t:'blank' },
    { t:'cmd', p:'alex@home:~$ ', c:'cd projects/webapp' },
    { t:'cmd', p:'alex@home:~/webapp$ ', c:'npm install' },
    { t:'out', text:'added 247 packages in 3.8s', col: aDim },
    { t:'blank' },
    { t:'cmd', p:'alex@home:~/webapp$ ', c:'npm run dev' },
    { t:'out', text:'> webapp@0.1.0 dev',  col: aDim },
    { t:'out', text:'> next dev --turbo',  col: aDim },
    { t:'blank' },
    { t:'out', text:'  ▲ Next.js 14.2.3',              col: aText },
    { t:'out', text:'  Local:  http://localhost:3000',  col: aBlue },
    { t:'blank' },
    { t:'out', text:'✓ Ready in 892ms', col: aGreen },
    { t:'blank' },
    { t:'cmd', p:'alex@home:~/webapp$ ', c:null, cursor: true },
  ];

  return (
    <div style={{ background: aBg, fontFamily: aM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <ANav title="MacBook Pro" sub="alex@192.168.1.100 · ssh" right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: aGreen, boxShadow: `0 0 6px ${aGreen}` }} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={aDim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>
      } />

      <div style={{ flex: 1, padding: '12px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 0 }}>
        {lines.map((ln, i) => {
          if (ln.t === 'blank') return <div key={i} style={{ height: 5 }} />;
          if (ln.t === 'info')  return <div key={i} style={{ fontSize: 10.5, color: aDim, marginBottom: 6, lineHeight: 1.5 }}>{ln.text}</div>;
          if (ln.t === 'out')   return <div key={i} style={{ fontSize: 11.5, color: ln.col, lineHeight: 1.55 }}>{ln.text}</div>;
          return (
            <div key={i} style={{ fontSize: 11.5, lineHeight: 1.55 }}>
              <span style={{ color: aAmber, fontWeight: 600 }}>{ln.p}</span>
              {ln.c && <span style={{ color: aText }}>{ln.c}</span>}
              {ln.cursor && <ACursor />}
            </div>
          );
        })}

        {/* Claude suggestion */}
        <div style={{ marginTop: 14, border: `1px solid ${aAmberBd}`, background: aAmberFaint, padding: '10px 14px' }}>
          <div style={{ fontSize: 9.5, color: aAmber, letterSpacing: 2, marginBottom: 7, fontWeight: 700 }}>✦ CLAUDE</div>
          <div style={{ fontSize: 11.5, color: aText, lineHeight: 1.65 }}>
            Server is running. Try <span style={{ color: aAmber }}>`npm run build`</span> to catch type errors before pushing.
          </div>
          <div style={{ display: 'flex', gap: 7, marginTop: 9, flexWrap: 'wrap' }}>
            {['npm run build', 'git status', 'git diff'].map(cmd => (
              <div key={cmd} style={{ fontSize: 10, padding: '3px 8px', border: `1px solid ${aAmberBd}`, color: aAmber }}>{cmd}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div style={{ padding: '10px 18px', borderTop: `1px solid ${aBd}`, background: aBg2, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: aAmber, fontSize: 15, fontWeight: 600 }}>›</span>
        <div style={{ flex: 1, fontSize: 13, color: aText }}>git push origin main</div>
        <div style={{ background: aAmber, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: '#000', letterSpacing: 1 }}>RUN</div>
      </div>
    </div>
  );
}

// ── CLAUDE CHAT ────────────────────────────────────────────────
function AClaude() {
  return (
    <div style={{ background: aBg, fontFamily: aM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <ANav title="✦ Claude" sub="MacBook Pro · terminal context" />

      <div style={{ padding: '10px 18px', background: aBg3, borderBottom: `1px solid ${aBd}` }}>
        <div style={{ fontSize: 9.5, color: aDim, letterSpacing: 2, marginBottom: 6 }}>CONTEXT</div>
        {[
          { p:'alex@home:~/webapp$ ', c:'npm run dev' },
          { o:'✓ Ready in 892ms', col: aGreen },
          { p:'alex@home:~/webapp$ ', c:'git status' },
          { o:'modified: src/App.tsx', col: aDim },
        ].map((l, i) => (
          <div key={i} style={{ fontSize: 10.5, lineHeight: 1.5, color: l.col || aText }}>
            {l.p && <span style={{ color: aAmber }}>{l.p}</span>}
            {l.c || l.o}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
        <div style={{ alignSelf: 'flex-end', maxWidth: '82%' }}>
          <div style={{ fontSize: 9.5, color: aDim, textAlign: 'right', marginBottom: 4 }}>you</div>
          <div style={{ background: aAmberFaint, border: `1px solid ${aAmberBd}`, padding: '9px 12px', fontSize: 12, color: aText, lineHeight: 1.6 }}>
            Commit to main or make a feature branch?
          </div>
        </div>

        <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
          <div style={{ fontSize: 9.5, color: aAmber, marginBottom: 4 }}>✦ claude</div>
          <div style={{ background: aBg3, border: `1px solid ${aBd}`, padding: '9px 12px', fontSize: 12, color: aText, lineHeight: 1.6 }}>
            Branch it — keep <span style={{ color: aAmber }}>main</span> stable.<br /><br />
            <span style={{ color: aGreen }}>git checkout -b feat/app-update</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {['git checkout -b feat/app-update', 'git diff App.tsx'].map(c => (
              <div key={c} style={{ fontSize: 9.5, padding: '3px 8px', border: `1px solid ${aBd}`, color: aDim }}>{c}</div>
            ))}
          </div>
        </div>

        <div style={{ alignSelf: 'flex-end', maxWidth: '82%' }}>
          <div style={{ fontSize: 9.5, color: aDim, textAlign: 'right', marginBottom: 4 }}>you</div>
          <div style={{ background: aAmberFaint, border: `1px solid ${aAmberBd}`, padding: '9px 12px', fontSize: 12, color: aText, lineHeight: 1.6 }}>
            What commit message format?
          </div>
        </div>

        <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
          <div style={{ fontSize: 9.5, color: aAmber, marginBottom: 4 }}>✦ claude</div>
          <div style={{ background: aBg3, border: `1px solid ${aBd}`, padding: '9px 12px', fontSize: 12, color: aText, lineHeight: 1.6 }}>
            Use conventional commits:<br />
            <span style={{ color: aAmber }}>feat:</span><span style={{ color: aDim }}> new feature</span><br />
            <span style={{ color: aAmber }}>fix:</span><span style={{ color: aDim }}> bug fix</span><br />
            <span style={{ color: aAmber }}>chore:</span><span style={{ color: aDim }}> maintenance</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '10px 18px', borderTop: `1px solid ${aBd}`, background: aBg2, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, fontSize: 12, color: aDim }}>Ask Claude... <ACursor /></div>
        <div style={{ background: aAmber, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: '#000' }}>→</div>
      </div>
    </div>
  );
}

// ── FAVORITES ──────────────────────────────────────────────────
function AFavorites() {
  const cmds = [
    ['npm','#f59e0b','npm run dev'],
    ['npm','#f59e0b','npm run build'],
    ['git','#93c5fd','git status'],
    ['git','#93c5fd','git push origin main'],
    ['docker','#34d399','docker ps -a'],
    ['k8s','#a78bfa','kubectl get pods -n prod'],
    ['logs','#fb923c','tail -f /var/log/nginx/access.log'],
    ['ssh','#f472b6','ssh -i ~/.ssh/id_rsa user@server'],
  ];
  return (
    <div style={{ background: aBg, fontFamily: aM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <ANav title="FAVORITES" sub="8 saved commands" right={<span style={{ fontSize: 12, color: aAmber }}>+ ADD</span>} />

      <div style={{ padding: '10px 16px 8px', borderBottom: `1px solid ${aBd}` }}>
        <div style={{ background: aBg3, padding: '8px 12px', fontSize: 12, color: aDim, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>/</span> search commands...
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {cmds.map(([cat, col, cmd], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: `1px solid ${aBd}` }}>
            <div style={{ fontSize: 11, color: aDim, width: 14, textAlign: 'right' }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: aText }}>{cmd}</div>
              <span style={{ fontSize: 9, padding: '1px 5px', marginTop: 3, display: 'inline-block', background: `${col}18`, color: col }}>{cat}</span>
            </div>
            <div style={{ background: aBg3, padding: '5px 10px', fontSize: 10, color: aDim }}>▶</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SETTINGS ───────────────────────────────────────────────────
function ASettings() {
  const groups = [
    ['APPEARANCE', [['theme','dracula'],['font_family','JetBrains Mono'],['font_size','13px'],['line_height','1.6']]],
    ['CONNECTION', [['timeout','30s'],['keepalive','yes'],['compression','yes'],['reconnect','auto']]],
    ['CLAUDE',     [['suggestions','enabled'],['context_lines','50'],['auto_suggest','on_error'],['model','claude-3-5-sonnet']]],
    ['SSH',        [['default_key','~/.ssh/id_rsa'],['agent','keychain'],['auth_method','publickey']]],
  ];
  return (
    <div style={{ background: aBg, fontFamily: aM, paddingTop: 60, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <ANav title="SETTINGS" />
      <div style={{ flex: 1, overflow: 'hidden', paddingTop: 6 }}>
        {groups.map(([sec, rows]) => (
          <div key={sec}>
            <div style={{ padding: '8px 20px 4px', fontSize: 9.5, color: aDim, letterSpacing: 3 }}>── {sec} ──────────────────</div>
            {rows.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', padding: '7px 20px', fontSize: 12 }}>
                <span style={{ color: aDim, width: 140, flexShrink: 0 }}>{k}</span>
                <span style={{ color: aAmber }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ALogin, ADevices, ATerminal, AClaude, AFavorites, ASettings });
