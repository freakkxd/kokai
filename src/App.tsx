import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ---------------- types & data ---------------- */
type VoyageId = 'soma' | 'nami' | 'kuro' | 'hana';
type SignalMode = 'ambient' | 'tension' | 'resonance';
type SectionId = 'index' | 'manifesto' | 'voyages' | 'method' | 'signal' | 'contact';

interface Voyage {
  id: VoyageId;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  accent: string;
  keywords: string[];
}

interface Toast { id: number; message: string; }

const VOYAGES: Voyage[] = [
  { id: 'soma', index: '01', title: 'SŌMA', subtitle: 'Rituals for a synthetic body', category: 'Interactive identity', year: '2025', description: 'A breathing identity system for a synthetic-body performance lab. Warm film, slow ritual motion, and a site that behaves like skin.', accent: '#e65d3c', keywords: ['BODY', 'MEMORY', 'RITUAL'] },
  { id: 'nami', index: '02', title: 'NAMI', subtitle: 'An interface for restless minds', category: 'Immersive website', year: '2025', description: 'A fluid reading environment for essay culture. Horizontal currents, depth on scroll, and typography that moves like water.', accent: '#6f76ba', keywords: ['FLOW', 'RESPONSE', 'DEPTH'] },
  { id: 'kuro', index: '03', title: 'KURO', subtitle: 'Sound, light, and machine memory', category: 'Motion system', year: '2024', description: 'An audiovisual archive for machine memory. Sharp waveforms, pressure-sensitive light, and echoes rendered as geometry.', accent: '#8da9c7', keywords: ['SOUND', 'PRESSURE', 'ECHO'] },
  { id: 'hana', index: '04', title: 'HANA', subtitle: 'A digital garden after midnight', category: 'Visual experience', year: '2024', description: 'A night garden that grows while you watch. Botanical shapes, patient pacing, and a return loop that never quite repeats.', accent: '#b7e58a', keywords: ['GROW', 'WAIT', 'RETURN'] },
];

const NAV: { id: SectionId; label: string; num: string }[] = [
  { id: 'index', label: 'Index', num: '01' },
  { id: 'voyages', label: 'Voyages', num: '02' },
  { id: 'method', label: 'Method', num: '03' },
  { id: 'signal', label: 'Signal', num: '04' },
  { id: 'contact', label: 'Contact', num: '05' },
];

const RAIL: { id: SectionId; num: string }[] = [
  { id: 'index', num: '01' },
  { id: 'manifesto', num: '02' },
  { id: 'voyages', num: '03' },
  { id: 'method', num: '04' },
  { id: 'signal', num: '05' },
  { id: 'contact', num: '06' },
];

const STEPS = [
  { n: '01', title: 'LISTEN', body: 'We look for the tension beneath the brief.' },
  { n: '02', title: 'FRAME', body: 'We turn a vague feeling into a precise system.' },
  { n: '03', title: 'COMPOSE', body: 'We combine image, sound, motion, and code.' },
  { n: '04', title: 'RELEASE', body: 'We ship something that can keep evolving.' },
];

const SIGNAL_CONF: Record<SignalMode, { freq: number; signal: number; status: string; color: string; speed: number; amp: number; jag: number }> = {
  ambient: { freq: 432, signal: 68, status: 'LISTENING', color: '#8da9c7', speed: 0.9, amp: 34, jag: 0.4 },
  tension: { freq: 587, signal: 86, status: 'HEIGHTENED', color: '#e65d3c', speed: 2.4, amp: 52, jag: 1.6 },
  resonance: { freq: 528, signal: 77, status: 'ALIGNED', color: '#b7e58a', speed: 1.5, amp: 44, jag: 0.8 },
};

const BUDGETS = ['€5k — €10k', '€10k — €25k', '€25k — €50k', '€50k+', 'Not sure yet'];

function useReducedMotion(): boolean {
  const [rm, setRm] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => {
      setRm(mq.matches);
      document.body.classList.toggle('reduce-motion', mq.matches);
    };
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return rm;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: document.body.classList.contains('reduce-motion') ? 'auto' : 'smooth', block: 'start' });
}

/* ---------------- grain ---------------- */
function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}

/* ---------------- intro ---------------- */
function IntroOverlay({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(() => { setLeaving(true); doneRef.current(); window.setTimeout(() => setGone(true), 300); }, 250);
      return () => window.clearTimeout(t);
    }
    const dur = 1200;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        window.setTimeout(() => setLeaving(true), 120);
        window.setTimeout(() => { doneRef.current(); }, 500);
        window.setTimeout(() => setGone(true), 1100);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (gone) return null;
  const label = String(count).padStart(3, '0');
  return (
    <div className={`intro-overlay${leaving ? ' leaving intro-fading' : ''}`} role="status" aria-label="Loading KOKAI" aria-hidden={leaving}>
      <div className="intro-inner" style={{ display: 'contents' }}>
        <div className="intro-top">
          <div><div className="intro-word">KŌKAI</div><div className="intro-sub">DIGITAL VOYAGES / 001</div></div>
          <div className="intro-count" aria-live="off">{label}</div>
        </div>
        <div>
          <div className="intro-bottom"><span className="intro-cal">CALIBRATING THE HORIZON</span><span className="intro-cal">001 — 006</span></div>
          <div className="intro-bar"><i style={{ transform: `scaleX(${count / 100})` }} /></div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- header ---------------- */
function FixedHeader({ active, onMenu, menuOpen }: { active: SectionId; onMenu: () => void; menuOpen: boolean }) {
  return (
    <header className="fixed-header">
      <button className="wordmark" onClick={() => scrollToId('index')} aria-label="KOKAI home — scroll to top">
        <b>KŌKAI</b><span>DIGITAL VOYAGES</span>
      </button>
      <nav className="desktop-nav" aria-label="Primary">
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} aria-current={active === n.id ? 'page' : undefined} className={active === n.id ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollToId(n.id); }}>
            <small>{String(i + 1).padStart(2, '0')}</small>{n.label}<span className="dot" aria-hidden="true" />
          </a>
        ))}
      </nav>
      <div className="header-right">
        <button className="avail" onClick={() => scrollToId('contact')} aria-label="Available for selected projects — go to contact">
          <i aria-hidden="true" /><span className="txt">AVAILABLE FOR SELECTED PROJECTS</span><span className="sr-only">Available for selected projects</span>
        </button>
        <button className="menu-btn" onClick={onMenu} aria-expanded={menuOpen} aria-controls="nav-overlay" aria-label="Open menu">
          MENU<span className="lines" aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </header>
  );
}

/* ---------------- ambient orb ---------------- */
function AmbientOrb({ heroVisible }: { heroVisible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let px = 0, py = 0, tx = 0, ty = 0;
    let scrollY = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = stage.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(r.width * DPR));
      canvas.height = Math.max(1, Math.floor(r.height * DPR));
    };
    resize();
    window.addEventListener('resize', resize);

    type P = { x: number; y: number; r: number; s: number; a: number; o: number };
    const N = 70;
    const parts: P[] = Array.from({ length: N }, (_, i) => ({
      x: (i * 137.5) % 100 / 100, y: (i * 89.3) % 100 / 100,
      r: 0.6 + ((i * 7) % 10) / 10 * 1.6, s: 0.0004 + ((i * 13) % 10) / 10 * 0.0012,
      a: (i / N) * Math.PI * 2, o: 0.25 + ((i * 31) % 10) / 10 * 0.55,
    }));

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    let t = 0;
    const hidden = { v: document.hidden };
    const onVis = () => { hidden.v = document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (hidden.v || !heroVisible) return;
      t += reduced ? 0 : 0.008;
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2 + px * 14 * DPR;
      const cy = H / 2 + py * 14 * DPR - Math.min(scrollY * 0.12 * DPR, 160 * DPR);
      if (stage) stage.style.transform = `translate(-50%, calc(-50% + ${Math.min(scrollY * 0.08, 120)}px))`;
      if (hlRef.current && !reduced) hlRef.current.style.setProperty('--hx', `${34 + px * 10}%`);
      if (hlRef.current && !reduced) hlRef.current.style.setProperty('--hy', `${26 + py * 10}%`);
      for (const p of parts) {
        p.a += p.s * (reduced ? 0 : 1);
        const rad = 0.34 + 0.1 * Math.sin(t * 2 + p.o * 6);
        const x = cx + Math.cos(p.a) * rad * W + px * 22 * DPR * p.o;
        const y = cy + Math.sin(p.a) * rad * H * 0.72 + py * 22 * DPR * p.o;
        const tw = reduced ? p.o : p.o * (0.6 + 0.4 * Math.sin(t * 3 + p.a * 5));
        ctx.beginPath();
        ctx.arc(x, y, p.r * DPR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241,238,232,${Math.max(0, tw).toFixed(3)})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', onScroll); document.removeEventListener('visibilitychange', onVis); };
  }, [heroVisible, reduced]);

  return (
    <div className="orb-stage" ref={stageRef} aria-hidden="true">
      <div className="orb-glow" />
      <canvas className="orb-canvas" ref={canvasRef} />
      <svg className="orbit-svg" viewBox="0 0 560 560">
        <g className="orbit-spin-a" style={{ transformOrigin: '280px 280px', animation: reduced ? 'none' : 'orbRot 26s linear infinite' }}>
          <ellipse className="orbit-ring" cx="280" cy="280" rx="250" ry="92" transform="rotate(-18 280 280)" />
        </g>
        <g style={{ transformOrigin: '280px 280px', animation: reduced ? 'none' : 'orbRotR 38s linear infinite' }}>
          <ellipse className="orbit-ring faint" cx="280" cy="280" rx="212" ry="212" strokeDasharray="2 7" />
        </g>
        <g style={{ transformOrigin: '280px 280px', animation: reduced ? 'none' : 'orbRot 52s linear infinite' }}>
          <ellipse className="orbit-ring faint" cx="280" cy="280" rx="262" ry="120" transform="rotate(24 280 280)" />
          <text className="orbit-label" x="468" y="218">IMAGE</text>
          <text className="orbit-label" x="120" y="356">CODE</text>
          <text className="orbit-label" x="300" y="152">SOUND</text>
          <text className="orbit-label" x="252" y="428">MOTION</text>
        </g>
        <style>{`@keyframes orbRot{to{transform:rotate(360deg)}}@keyframes orbRotR{to{transform:rotate(-360deg)}}`}</style>
      </svg>
      <div className="orb-body" />
      <div className="orb-highlight" ref={hlRef} />
    </div>
  );
}

/* ---------------- hero ---------------- */
function HeroSection({ onExplore, onContact }: { onExplore: () => void; onContact: () => void }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="hero" id="index" ref={ref} aria-label="Intro">
      <div className="hero-bg-word" aria-hidden="true">KŌKAI</div>
      <AmbientOrb heroVisible={heroVisible} />
      <div className="hero-meta"><span>KŌKAI / 001</span><span>TOKYO — YEKATERINBURG</span></div>
      <div className="hero-grid">
        <div>
          <h1>We build worlds<br />between <em>signal</em><br />and silence.</h1>
          <p className="hero-sub">Independent digital studio for immersive identities, interfaces, and experiences that stay with you.</p>
          <div className="hero-ctas">
            <button className="cta-text" data-cursor="ENTER" onClick={onExplore}>Explore the voyages<span className="arr" aria-hidden="true">→</span></button>
            <button className="cta-ghost" data-cursor="ENTER" onClick={onContact}>Start a conversation</button>
          </div>
        </div>
        <div aria-hidden="true" />
      </div>
      <div className="hero-foot">
        <span>SCROLL TO ENTER<div className="scroll-line" /></span>
        <span>001 / 006</span>
      </div>
    </section>
  );
}

/* ---------------- statement ---------------- */
function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = useMemo(() => 'Technology is not the spectacle. The feeling is.'.split(' '), []);
  return (
    <div className="statement-sec" id="manifesto">
      <section className="section" aria-label="Manifesto" ref={ref}>
        <div className="section-label">02 / MANIFESTO</div>
        <div className="statement-grid">
          <div className="mono" style={{ color: 'var(--paper-dim)', fontSize: 11, letterSpacing: '.2em' }}>FEELING<br />BEFORE<br />FORM</div>
          <div>
            <p className={`statement-big word-reveal${vis ? ' visible' : ''}`} aria-label="Technology is not the spectacle. The feeling is.">
              {words.map((w, i) => (
                <span key={i} style={{ transitionDelay: `${i * 70}ms` }} aria-hidden="true">{w}</span>
              ))}
            </p>
            <p className="statement-right" style={{ marginTop: 28 }}>We work where visual culture, sound, code, and motion begin to overlap.</p>
            <p className="statement-muted">KŌKAI creates digital environments that are remembered not because they explain everything, but because they make people feel something before they understand why.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- voyages ---------------- */
function VoyagePreview({ v }: { v: Voyage }) {
  return (
    <>
      {VOYAGES.map((p) => (
        <div key={p.id} className={`voyage-stage stage-${p.id}${p.id === v.id ? ' active' : ''}`} aria-hidden={p.id !== v.id}>
          {p.id === 'soma' && (
            <div aria-hidden="true">
              <div className="organic-blob" style={{ width: 340, height: 340, left: '8%', top: '6%', background: '#ffd9c2' }} />
              <div className="organic-blob" style={{ width: 220, height: 220, right: '10%', top: '30%', background: '#ff8b68', animationDelay: '-4s' }} />
              <svg className="wave-lines" viewBox="0 0 600 300" preserveAspectRatio="none" style={{ width: '100%', height: 220 }}>
                {[0, 1, 2, 3, 4].map((i) => (<path key={i} d={`M0 ${60 + i * 34} C 120 ${30 + i * 34}, 240 ${90 + i * 34}, 360 ${60 + i * 34} S 520 ${40 + i * 30}, 600 ${70 + i * 30}`} fill="none" stroke="rgba(33,15,11,.4)" strokeWidth="1" />))}
              </svg>
            </div>
          )}
          {p.id === 'nami' && (
            <div aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="flow" style={{ top: `${18 + i * 9}%`, opacity: 0.9 - i * 0.1 }} />))}
              <div className="organic-blob" style={{ width: 420, height: 200, left: '10%', top: '12%', background: '#6f76ba', opacity: 0.65 }} />
            </div>
          )}
          {p.id === 'kuro' && (
            <div className="bars" aria-hidden="true">
              {[22, 48, 70, 38, 88, 60, 100, 44, 76, 30, 58, 92, 66, 40, 84, 52, 70, 36].map((h, i) => (
                <i key={i} style={{ height: h, opacity: 0.35 + (h / 160), animation: `wv2 1.1s ease-in-out ${-i * 0.09}s infinite alternate` }} />
              ))}
              <style>{`@keyframes wv2{from{transform:scaleY(.6)}to{transform:scaleY(1)}}`}</style>
            </div>
          )}
          {p.id === 'hana' && (
            <div aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <span key={i} className="petal" style={{ left: `${8 + i * 11}%`, top: `${20 + ((i * 37) % 50)}%`, width: 14 + (i % 3) * 8, height: 20 + (i % 4) * 6, animationDelay: `${-i * 1.1}s`, opacity: 0.35 + (i % 4) * 0.12 }} />
              ))}
              <svg viewBox="0 0 400 300" style={{ position: 'absolute', right: 20, bottom: 90, width: 240, opacity: 0.5 }}>
                <path d="M200 290 C 200 200, 160 160, 90 130 M200 290 C 210 210, 250 170, 320 150 M200 290 C 195 230, 195 180, 200 90" stroke="rgba(183,229,138,.7)" fill="none" strokeWidth="1.5" />
                <ellipse cx="120" cy="150" rx="26" ry="12" fill="rgba(183,229,138,.35)" transform="rotate(-30 120 150)" />
                <ellipse cx="290" cy="170" rx="30" ry="13" fill="rgba(241,238,232,.3)" transform="rotate(24 290 170)" />
              </svg>
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <div className="kw">{p.keywords.join(' / ')}</div>
            <h3>{p.title}</h3>
            <p><strong style={{ fontWeight: 600 }}>{p.subtitle}.</strong> {p.description}</p>
            <div className="voyage-tags"><span>{p.category.toUpperCase()}</span><span>{p.year}</span><span style={{ borderColor: p.accent, color: p.accent }}>{p.index} / 04</span></div>
          </div>
        </div>
      ))}
    </>
  );
}

function VoyagesSection({ activeId, onSelect, notify }: { activeId: VoyageId; onSelect: (v: VoyageId) => void; notify: (m: string) => void }) {
  const active = VOYAGES.find((v) => v.id === activeId) ?? VOYAGES[0];
  const listRef = useRef<HTMLDivElement>(null);

  const onKey = (e: React.KeyboardEvent) => {
    const idx = VOYAGES.findIndex((v) => v.id === activeId);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); onSelect(VOYAGES[(idx + 1) % VOYAGES.length].id); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); onSelect(VOYAGES[(idx - 1 + VOYAGES.length) % VOYAGES.length].id); }
    else if (e.key === 'Escape') { (e.target as HTMLElement).blur(); }
    else if (e.key === 'Enter') { notify(`${active.title} — ${active.subtitle}`); }
  };

  useEffect(() => {
    const hash = `#voyage-${activeId}`;
    try { window.history.replaceState(null, '', hash); } catch { /* ignore */ }
  }, [activeId]);

  return (
    <div id="voyages">
      <section className="section voyages-sec" aria-label="Selected voyages" style={{ maxWidth: 'var(--max-w)' }}>
        <div className="section-label">03 / WORK IN MOTION</div>
        <div className="voyages-head">
          <h2>Selected voyages</h2>
          <span className="voyages-count mono">{active.index} / 04 — {active.category.toUpperCase()}</span>
        </div>
        <div className="voyages-layout">
          <div ref={listRef} role="listbox" aria-label="Voyages" aria-activedescendant={`voyage-${activeId}`} tabIndex={0} onKeyDown={onKey}>
            <div className="voyage-list">
              {VOYAGES.map((v) => (
                <button key={v.id} id={`voyage-${v.id}`} role="option" aria-selected={v.id === activeId}
                  className={`voyage-item${v.id === activeId ? ' active' : ''}`} data-cursor="OPEN"
                  onClick={() => onSelect(v.id)} onFocus={() => { if (v.id !== activeId) onSelect(v.id); }}>
                  <span className="idx">{v.index}</span>
                  <span><h3>{v.title}</h3><div className="sub">{v.subtitle}</div></span>
                  <span className="meta">{v.year}<br />{v.category.split(' ')[0].toUpperCase()}</span>
                  <span className="bar"><i style={{ background: v.accent }} /></span>
                </button>
              ))}
            </div>
            <p className="mono" style={{ fontSize: 10.5, color: 'var(--paper-dim)', letterSpacing: '.16em', marginTop: 14 }}>USE ↑ ↓ TO NAVIGATE — ENTER TO OPEN</p>
          </div>
          <div className="voyage-preview" aria-live="polite" aria-label={`Preview of ${active.title}`}>
            <VoyagePreview v={active} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- process ---------------- */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setVis(true); } }),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, vis };
}

function ProcessSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / (r.height || 1)));
      setProgress(p);
      setActiveStep(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const head = useReveal();
  return (
    <div id="method">
      <section className="section" aria-label="Method">
        <div className="section-label">04 / METHOD</div>
        <div className="process-grid">
          <div className={`process-head reveal${head.vis ? ' visible' : ''}`} ref={head.ref}>
            <h2>Slow ideas.<br />Sharp execution.</h2>
            <p>A precise sequence for turning atmosphere into systems that survive contact with reality.</p>
          </div>
          <div className="timeline" ref={wrapRef} aria-label="Process timeline">
            <div className="timeline-progress" style={{ height: `calc((100% - 12px) * ${progress})` }} aria-hidden="true" />
            {STEPS.map((s, i) => (
              <div key={s.n} className={`step${i <= activeStep ? ' active' : ''}`}>
                <span className="step-marker" aria-hidden="true" />
                <div className="s-idx">{s.n} / 04</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- signal ---------------- */
function SignalSection({ notify }: { notify: (m: string) => void }) {
  const [mode, setMode] = useState<SignalMode>('ambient');
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const distort = useRef(0);
  const conf = SIGNAL_CONF[mode];
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 80);
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  const signalVal = useMemo(() => {
    const w = Math.sin(tick * 0.22) * 3 + Math.sin(tick * 0.061) * 2;
    return Math.max(4, Math.min(99, Math.round(conf.signal + w)));
  }, [tick, conf.signal]);

  const freqVal = useMemo(() => Math.round(conf.freq + Math.sin(tick * 0.15) * 3), [tick, conf.freq]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(r.width * DPR));
      canvas.height = Math.max(1, Math.floor(260 * DPR));
    };
    fit();
    window.addEventListener('resize', fit);
    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += paused ? 0 : 0.03 * conf.speed;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(241,238,232,0.08)';
      ctx.lineWidth = 1;
      for (let y = 0; y < H; y += 26 * DPR) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.beginPath();
      const mid = H / 2;
      for (let x = 0; x <= W; x += 3 * DPR) {
        const nx = x / W;
        const d = distort.current;
        const y = mid
          + Math.sin(nx * 9 + t * 2) * conf.amp * DPR * 0.5
          + Math.sin(nx * 23 - t * 3.1) * conf.jag * 6 * DPR
          + Math.sin(nx * 47 + t * 1.2 + d * 4) * (4 + Math.abs(d) * 26) * DPR * 0.4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = conf.color;
      ctx.lineWidth = 1.6 * DPR;
      ctx.shadowColor = conf.color;
      ctx.shadowBlur = paused ? 0 : 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); };
  }, [conf, paused]);

  return (
    <div className="signal-sec" id="signal">
      <section className="section" aria-label="Signal monitor">
        <div className="section-label">05 / SIGNAL</div>
        <div className="signal-head"><h2>The interface is alive when it listens.</h2></div>
        <div className="monitor">
          <div className="monitor-top" aria-live="polite">
            <span>MODE: <b>{mode.toUpperCase()}</b></span>
            <span>SIGNAL: <b>{signalVal}%</b></span>
            <span>FREQUENCY: <b>{freqVal} Hz</b></span>
            <span>STATUS: <b className="st" style={{ color: paused ? 'var(--paper-dim)' : conf.color }}>{paused ? 'PAUSED' : conf.status}</b></span>
            <span style={{ marginLeft: 'auto' }}>36.19°N — 140.08°E</span>
          </div>
          <div className="signal-canvas-wrap" onPointerMove={(e) => {
            const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            distort.current = ((e.clientX - r.left) / r.width - 0.5) * 2;
          }} onPointerLeave={() => { distort.current = 0; }}>
            <canvas ref={canvasRef} aria-label={`Signal waveform in ${mode} mode`} role="img" />
          </div>
          <div className="monitor-controls">
            <div className="seg-group" role="group" aria-label="Signal mode">
              {(['ambient', 'tension', 'resonance'] as SignalMode[]).map((m) => (
                <button key={m} className="seg-btn" aria-pressed={mode === m} onClick={() => { setMode(m); notify(`Signal mode — ${m}`); }}>
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="ghost-pill" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
              {paused ? 'Resume signal' : 'Pause signal'}
            </button>
            <span className="mono" style={{ marginLeft: 'auto', fontSize: 10.5, letterSpacing: '.18em', color: 'var(--paper-dim)' }}>
              DETERMINISTIC · 80MS · NO AUDIO
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- contact ---------------- */
function ContactModal({ open, onClose, notify }: { open: boolean; onClose: () => void; notify: (m: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [kind, setKind] = useState('Immersive website');
  const [budget, setBudget] = useState('€10k — €25k');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement;
    setSent(false);
    setErrors({});
    document.body.classList.add('locked');
    const t = window.setTimeout(() => firstRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(t); document.removeEventListener('keydown', onKey); document.body.classList.remove('locked'); };
  }, [open, onClose]);

  const close = () => {
    onClose();
    if (sent) { setName(''); setEmail(''); setDetails(''); setSent(false); }
    triggerRef.current?.focus();
  };

  if (!open) return null;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Enter a valid email address.';
    if (details.trim().length < 10) errs.details = 'Describe the idea in at least 10 characters.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSent(true);
    notify('Message received — we will return shortly');
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        {sent ? (
          <div className="success-box">
            <div className="mono" style={{ fontSize: 11, letterSpacing: '.24em', color: 'var(--vermillion)' }}>TRANSMISSION COMPLETE</div>
            <h3 style={{ marginTop: 12 }}>Message received.</h3>
            <p style={{ color: '#5c5852', marginTop: 8 }}>We will return to you shortly.</p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn-dark" onClick={close} data-cursor="CLOSE">Close</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '.24em', color: '#77736d' }}>NEW INQUIRY / KŌKAI</div>
            <h2 id="contact-title" style={{ marginTop: 6 }}>Begin a conversation</h2>
            <div className="field">
              <label htmlFor="cf-name">NAME *</label>
              <input id="cf-name" ref={firstRef} value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cf-name-err' : undefined} autoComplete="name" />
              {errors.name && <div className="err" id="cf-name-err" role="alert">{errors.name}</div>}
            </div>
            <div className="field">
              <label htmlFor="cf-email">EMAIL *</label>
              <input id="cf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'cf-email-err' : undefined} autoComplete="email" />
              {errors.email && <div className="err" id="cf-email-err" role="alert">{errors.email}</div>}
            </div>
            <div className="field">
              <label htmlFor="cf-kind">WHAT ARE WE MAKING?</label>
              <select id="cf-kind" value={kind} onChange={(e) => setKind(e.target.value)}>
                <option>Immersive website</option>
                <option>Interactive identity</option>
                <option>Motion system</option>
                <option>Visual experience</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="field">
              <label id="cf-budget-label">BUDGET RANGE</label>
              <div className="budget-row" role="group" aria-labelledby="cf-budget-label">
                {BUDGETS.map((b) => (<button key={b} type="button" className="budget-pill" aria-pressed={budget === b} onClick={() => setBudget(b)}>{b}</button>))}
              </div>
            </div>
            <div className="field">
              <label htmlFor="cf-details">DETAILS *</label>
              <textarea id="cf-details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe the idea, problem, or atmosphere..." aria-invalid={!!errors.details} aria-describedby={errors.details ? 'cf-details-err' : undefined} />
              {errors.details && <div className="err" id="cf-details-err" role="alert">{errors.details}</div>}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-plain" onClick={close} data-cursor="CLOSE">Cancel</button>
              <button type="submit" className="btn-dark" data-cursor="ENTER">Send inquiry</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ContactSection({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="contact-sec" id="contact">
      <div className="contact-paper">
        <div className="mono" style={{ fontSize: 11, letterSpacing: '.26em', color: '#77736d', marginBottom: 22 }}>06 / CONTACT</div>
        <h2>Ready to make<br />something impossible<br />to ignore?</h2>
        <p className="sub">Tell us what you are trying to change. We will find the right shape for it.</p>
        <button className="begin-btn" onClick={onOpen} data-cursor="ENTER">Begin a conversation<span aria-hidden="true">→</span></button>
        <div className="contact-meta"><span>HELLO@KOKAI.STUDIO</span><span>TOKYO — YEKATERINBURG</span><span>RESPONSE WITHIN 48H</span></div>
      </div>
    </div>
  );
}

function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <footer className="footer" aria-label="Footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div><div className="footer-brand">KŌKAI</div><div className="footer-tag">Digital voyages for unusual minds.</div></div>
          <nav className="footer-links" aria-label="Footer">
            {NAV.map((n) => (<button key={n.id} onClick={() => scrollToId(n.id)}>{n.label}</button>))}
          </nav>
          <div className="footer-links" aria-label="Social">
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }}>Instagram</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }}>Are.na</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }}>Vimeo</a>
            <a href="mailto:hello@kokai.studio">Email</a>
          </div>
        </div>
        <div className="footer-legal"><span>© 2026 KŌKAI STUDIO</span><span>MADE BETWEEN PLACES</span></div>
        <div className={`footer-giant${vis ? ' visible' : ''}`} ref={ref} aria-hidden="true"><span>KŌKAI</span></div>
      </div>
    </footer>
  );
}

/* ---------------- progress rail / overlay / cursor / toast ---------------- */
function ProgressRail({ active, progress }: { active: SectionId; progress: number }) {
  return (
    <nav className="progress-rail" aria-label="Page progress">
      <div className="progress-fill" style={{ height: `${140 + progress * 120}px` }} aria-hidden="true" />
      {RAIL.map((r) => (
        <button key={r.id} className={`rail-btn${active === r.id ? ' active' : ''}`} aria-current={active === r.id ? 'true' : undefined}
          aria-label={`Go to ${r.id}`} onClick={() => scrollToId(r.id)}>{r.num}</button>
      ))}
    </nav>
  );
}

function NavigationOverlay({ open, onClose }: { open: boolean; onClose: (id: SectionId) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('locked');
    const el = ref.current;
    const btns = el ? Array.from(el.querySelectorAll<HTMLButtonElement>('button')) : [];
    btns[1]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') (btns[0] as HTMLButtonElement)?.click();
      if (e.key === 'Tab' && btns.length) {
        const first = btns[0]; const last = btns[btns.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('locked'); };
  }, [open ]);
  if (!open) return null;
  return (
    <div className="nav-overlay" id="nav-overlay" ref={ref} role="dialog" aria-modal="true" aria-label="Menu">
      <div className="nav-overlay-top">
        <span className="mono" style={{ letterSpacing: '.3em', fontSize: 11, color: 'var(--paper-dim)' }}>KŌKAI — NAVIGATION</span>
        <button className="ghost-pill" onClick={() => onClose('index')} data-cursor="CLOSE" aria-label="Close menu">CLOSE ✕</button>
      </div>
      <nav className="nav-links" aria-label="Menu">
        {NAV.map((n, i) => (
          <button key={n.id} style={{ animationDelay: `${i * 70}ms` }} onClick={() => onClose(n.id)}>
            <small>0{i + 1}</small> {n.label.toUpperCase()}
          </button>
        ))}
      </nav>
      <div className="mono" style={{ marginTop: 'auto', fontSize: 10.5, letterSpacing: '.22em', color: 'var(--paper-dim)' }}>TOKYO — YEKATERINBURG · 2026</div>
    </div>
  );
}

function CustomCursor({ enabled }: { enabled: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('MOVE');
  const [big, setBig] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.body.classList.add('fine-pointer');
    let raf = 0;
    let mx = -100, my = -100, rx = -100, ry = -100, lx = -100, ly = -100;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY; setVisible(true);
      const t = (e.target as HTMLElement).closest?.('[data-cursor], a, button');
      const v = (e.target as HTMLElement).closest?.('[data-cursor]')?.getAttribute('data-cursor');
      if (v) { setLabel(v); setBig(true); }
      else if (t) { setLabel('ENTER'); setBig(true); }
      else { setLabel('MOVE'); setBig(false); }
    };
    const onLeave = () => setVisible(false);
    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      lx += (mx - lx) * 0.1; ly += (my - ly) * 0.1;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      if (labelRef.current) labelRef.current.style.transform = `translate(${lx}px,${ly}px) translate(14px,14px)`;
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('pointermove', onMove); document.documentElement.removeEventListener('pointerleave', onLeave); document.body.classList.remove('fine-pointer'); };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" style={{ display: visible ? 'block' : 'none' }}>
      <div className="custom-cursor-dot" ref={dotRef} />
      <div className={`custom-cursor-ring${big ? ' big' : ''}`} ref={ringRef} />
      <div className="custom-cursor-label" ref={labelRef}>{label}</div>
    </div>
  );
}

function ToastLayer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: number) => void }) {
  return (
    <div className="toast-layer" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className="toast" role="status">
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--vermillion)', flex: 'none' }} />
          {t.message}
          <button onClick={() => onClose(t.id)} aria-label="Dismiss notification">✕</button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- app ---------------- */
let toastSeq = 1;

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [active, setActive] = useState<SectionId>('index');
  const [progress, setProgress] = useState(0);
  const [voyage, setVoyage] = useState<VoyageId>(() => {
    const h = window.location.hash.replace('#voyage-', '');
    return (['soma', 'nami', 'kuro', 'hana'] as VoyageId[]).includes(h as VoyageId) ? (h as VoyageId) : 'soma';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  useReducedMotion();

  const notify = useCallback((message: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t.slice(-2), { id, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  useEffect(() => {
    const ids: SectionId[] = ['index', 'manifesto', 'voyages', 'method', 'signal', 'contact'];
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id as SectionId); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [introDone]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const closeMenuTo = (id: SectionId) => { setMenuOpen(false); window.setTimeout(() => scrollToId(id), 60); };

  return (
    <div className="kokai-root">
      <a className="skip-link" href="#main">Skip to content</a>
      <IntroOverlay onDone={() => setIntroDone(true)} />
      <FixedHeader active={active} onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      <ProgressRail active={active} progress={progress} />
      <main className="page-main" id="main">
        <HeroSection onExplore={() => scrollToId('voyages')} onContact={() => setModalOpen(true)} />
        <StatementSection />
        <VoyagesSection activeId={voyage} onSelect={(v) => { setVoyage(v); }} notify={notify} />
        <ProcessSection />
        <SignalSection notify={notify} />
        <ContactSection onOpen={() => setModalOpen(true)} />
      </main>
      <Footer />
      <NavigationOverlay open={menuOpen} onClose={closeMenuTo} />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} notify={notify} />
      <CustomCursor enabled={introDone} />
      <GrainOverlay />
      <ToastLayer toasts={toasts} onClose={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}
