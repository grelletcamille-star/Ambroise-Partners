'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { COMPANY } from './lib/company';
import LogoMark from './components/LogoMark';

/* Height of the scroll-driven DNA animation before the page moves on. */
const STICKY_DESKTOP = 360;
const STICKY_MOBILE = 220;
const stickyPx = () => (window.innerWidth <= 600 ? STICKY_MOBILE : STICKY_DESKTOP);

/* ─── Line illustrations for the three approach pillars ───
   Drawn in SVG (crisp at any size, no animation loop running in the background). Lines draw in
   and nodes appear when the panel scrolls into view (`.visible`, set by the reveal observer). */
const hexPts = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 180) * (60 * k - 90);
    return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)] as [number, number];
  });

function ScienceArt() {
  const r = 21, w = r * Math.sqrt(3);
  const Y = 50;
  const rings = [hexPts(150, Y, r), hexPts(150 + w, Y, r), hexPts(150 + w / 2, Y + 1.5 * r, r)];
  const key = (p: number[]) => p.join(',');
  const atoms = new Map<string, [number, number]>();
  const bonds = new Set<string>();
  rings.forEach(ring => ring.forEach((p, k) => {
    atoms.set(key(p), p);
    const q = ring[(k + 1) % 6];
    const e = [key(p), key(q)].sort().join('|');
    bonds.add(e);
  }));
  const bondList = [...bonds].map(e => e.split('|').map(k => atoms.get(k)!));
  const atomList = [...atoms.values()];
  // side chains: from the left ring and from the lower ring
  const L = rings[0][4], D = rings[2][3], U = rings[1][1];
  const chains: [number, number][][] = [
    [L, [L[0] - 22, L[1] - 12], [L[0] - 44, L[1]]],
    [D, [D[0] - 10, D[1] + 18]],
    [U, [U[0] + 22, U[1] - 12], [U[0] + 44, U[1]]],
  ];
  return (
    <svg className="apx" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <circle cx="168" cy="68" r="62" className="apx-faint" />
      <circle cx="168" cy="68" r="42" className="apx-faint apx-dash" />
      <g className="apx-float">
        {bondList.map(([p, q], i) => (
          <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} pathLength={1} className="apx-line apx-draw" style={{ ['--d' as string]: `${i * 0.04}s` }} />
        ))}
        {/* inner double bonds */}
        {[rings[0], rings[1], rings[2]].map((ring, i) => {
          const [p, q] = [ring[(i * 2) % 6], ring[(i * 2 + 1) % 6]];
          const c = i === 0 ? [150, Y] : i === 1 ? [150 + w, Y] : [150 + w / 2, Y + 1.5 * r];
          const sh = (v: number[]) => [c[0] + (v[0] - c[0]) * 0.72, c[1] + (v[1] - c[1]) * 0.72];
          const [a2, b2] = [sh(p), sh(q)];
          return <line key={`d${i}`} x1={a2[0]} y1={a2[1]} x2={b2[0]} y2={b2[1]} pathLength={1} className="apx-line apx-thin apx-draw" style={{ ['--d' as string]: `${0.6 + i * 0.1}s` }} />;
        })}
        {chains.map((c, i) => (
          <polyline key={`c${i}`} points={c.map(p => p.join(',')).join(' ')} pathLength={1} className="apx-line apx-draw" style={{ ['--d' as string]: `${0.7 + i * 0.12}s` }} />
        ))}
        {atomList.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={2.6} className="apx-atom apx-pop" style={{ ['--d' as string]: `${0.3 + i * 0.03}s` }} />
        ))}
        {chains.map((c, i) => {
          const end = c[c.length - 1];
          return <circle key={`e${i}`} cx={end[0]} cy={end[1]} r={4.2} className="apx-accent apx-pop apx-pulse" style={{ ['--d' as string]: `${1.1 + i * 0.12}s` }} />;
        })}
        <text x={chains[0][2][0] - 8} y={chains[0][2][1] + 3} textAnchor="end" className="apx-chem">N</text>
        <text x={chains[1][1][0] + 9} y={chains[1][1][1] + 8} textAnchor="middle" className="apx-chem">O</text>
        <text x={chains[2][2][0] + 8} y={chains[2][2][1] + 3} className="apx-chem">OH</text>
      </g>
    </svg>
  );
}

function NetworkArt() {
  const cx = 180, cy = 75;
  const on = (deg: number, rx: number, ry: number): [number, number] => {
    const a = (deg * Math.PI) / 180;
    return [+(cx + rx * Math.cos(a)).toFixed(1), +(cy + ry * Math.sin(a)).toFixed(1)];
  };
  const hubs = [
    { deg: 200, label: 'Investors', anchor: 'end', dx: -9, dy: 3 },
    { deg: 320, label: 'Pharma', anchor: 'start', dx: 9, dy: -2 },
    { deg: 25, label: 'MedTech', anchor: 'start', dx: 9, dy: 6 },
    { deg: 140, label: 'Acquirers', anchor: 'end', dx: -9, dy: 8 },
  ].map(h => ({ ...h, p: on(h.deg, 132, 52) }));
  const minor = [255, 280, 80, 105, 350, 170].map(d => on(d, 132, 52));
  const inner = [230, 300, 50, 120].map(d => on(d, 70, 28));
  return (
    <svg className="apx" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <ellipse cx={cx} cy={cy} rx="132" ry="52" className="apx-faint" />
      <ellipse cx={cx} cy={cy} rx="70" ry="28" className="apx-faint apx-dash" />
      {hubs.map((h, i) => (
        <g key={h.label}>
          <path id={`net-l${i}`} d={`M${cx} ${cy} L${h.p[0]} ${h.p[1]}`} pathLength={1} className="apx-line apx-draw" style={{ ['--d' as string]: `${0.2 + i * 0.15}s` }} />
          <circle r="2.2" className="apx-spark">
            <animateMotion dur={`${2.6 + i * 0.4}s`} repeatCount="indefinite" begin={`${1.4 + i * 0.5}s`} path={`M${cx} ${cy} L${h.p[0]} ${h.p[1]}`} />
          </circle>
        </g>
      ))}
      {minor.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.2" className="apx-atom apx-pop" style={{ ['--d' as string]: `${0.5 + i * 0.06}s` }} />)}
      {inner.map((p, i) => <circle key={`i${i}`} cx={p[0]} cy={p[1]} r="1.8" className="apx-dot apx-pop" style={{ ['--d' as string]: `${0.4 + i * 0.06}s` }} />)}
      {hubs.map((h, i) => (
        <g key={`h${h.label}`} className="apx-pop" style={{ ['--d' as string]: `${0.7 + i * 0.15}s` }}>
          <circle cx={h.p[0]} cy={h.p[1]} r="4.6" className="apx-accent" />
          <text x={h.p[0] + h.dx} y={h.p[1] + h.dy} textAnchor={h.anchor as 'start' | 'end'} className="apx-label">{h.label}</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="15" className="apx-hub-ring apx-pulse" />
      <circle cx={cx} cy={cy} r="11" className="apx-hub" />
      <text x={cx} y={cy + 3.6} textAnchor="middle" className="apx-hub-text">AP</text>
    </svg>
  );
}

function ExecutionArt() {
  const steps = ['Mandate', 'Preparation', 'Outreach', 'Due diligence', 'Closing'];
  const x0 = 34, x1 = 326, y = 92;
  const xs = steps.map((_, i) => x0 + ((x1 - x0) * i) / (steps.length - 1));
  return (
    <svg className="apx" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* rising value line above the timeline */}
      <path d={`M${x0} 72 C 120 70, 170 64, 220 54 S 300 38, ${x1} 32`} pathLength={1} className="apx-line apx-thin apx-draw" style={{ ['--d' as string]: '0.2s', ['--t' as string]: '1.6s' }} />
      <path d={`M${x0} 72 C 120 70, 170 64, 220 54 S 300 38, ${x1} 32 L ${x1} 72 L ${x0} 72 Z`} className="apx-area apx-pop" style={{ ['--d' as string]: '1.2s' }} />
      <line x1={x0} y1={y} x2={x1} y2={y} className="apx-track" />
      <line x1={x0} y1={y} x2={x1} y2={y} pathLength={1} className="apx-line apx-progress apx-draw" style={{ ['--d' as string]: '0.3s', ['--t' as string]: '1.8s' }} />
      {xs.map((x, i) => {
        const last = i === steps.length - 1;
        return (
          <g key={steps[i]} className="apx-pop" style={{ ['--d' as string]: `${0.35 + i * 0.4}s` }}>
            <circle cx={x} cy={y} r={last ? 9 : 5.5} className={last ? 'apx-accent apx-pulse' : 'apx-step'} />
            {last && <path d={`M${x - 3.6} ${y + 0.2} l2.6 2.6 l4.8 -5.2`} className="apx-check" />}
            <text x={x} y={y + 24} textAnchor="middle" className="apx-label">{steps[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Expertise Section ─── */
const DOMAINS = [
  { id:1, name:'Biotechnology',        image:'/images/biotechnology.jpg',        color:'#e8e4f0', desc:'Novel therapeutic modalities, including biologics, gene and cell therapies, RNA-based treatments and advanced scientific platforms.' },
  { id:2, name:'Pharmaceuticals',     image:'/images/pharmaceuticals.jpg',     color:'#e4e8f0', desc:'Branded, specialty and generic medicines across development and commercial portfolios.' },
  { id:3, name:'Medical Devices',     image:'/images/medical-devices.jpg',     color:'#e4f0e8', desc:'Medical technologies, including robotic systems, clinical equipment, diagnostic devices and implantable solutions.' },
  { id:4, name:'Digital Health',      image:'/images/digital-health.jpg',      color:'#e4e8ff', desc:'Software, artificial intelligence and data-driven healthcare platforms.' },
  { id:5, name:'Healthcare Services', image:'/images/healthcare-services.jpg', color:'#f0e4ea', desc:'Provider networks, CROs, CDMOs and integrated healthcare service platforms.' },
  { id:6, name:'Consumer Health',     image:'/images/consumer-health.jpg',     color:'#f0ece4', desc:'Over-the-counter medicines, dietary supplements and other consumer health products.' },
];

function ExpertiseSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section id="domains" style={{ background: 'var(--accent-bg)', padding: '4.5rem 2.5vw' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="section-head reveal">
          <span className="eyebrow">What we cover</span>
          <h2 className="section-title">Our Areas of Expertise</h2>
          <p className="section-lede">Dedicated expertise across the healthcare ecosystem, from early-stage scientific platforms to scaled commercial organisations.</p>
        </div>
        <div className="domains-grid reveal" onMouseLeave={() => setHovered(null)}>
          {DOMAINS.map((dom, i) => {
            const isActive = hovered === i;
            const isShrunk = hovered !== null && !isActive;
            return (
              <div
                key={dom.id}
                className={`domain-card${isActive ? ' domain-card--active' : ''}${isShrunk ? ' domain-card--shrunk' : ''}`}
                onMouseEnter={() => setHovered(i)}
              >
                <Image src={dom.image} alt={dom.name} fill style={{ objectFit: 'cover' }} sizes="(max-width:600px) 50vw, 20vw" className="domain-img" />
                <div className="domain-tint" aria-hidden="true" />
                <div className="domain-overlay" />
                <div className="domain-label">
                  <h3 className="domain-name">{dom.name}</h3>
                  <p className="domain-desc">{dom.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Services Section ─── */
/* Four service lines, same names everywhere (hero, cards, footer, deck). */
const SERVICES = [
  { id: 'ma', title: 'M&A Advisory', description: 'Sell-side, buy-side and transaction advisory across the global healthcare ecosystem. We design and manage disciplined processes focused on value maximisation and execution certainty.', tags: ['Sell-side', 'Buy-side', 'Carve-outs', 'Cross-border'] },
  { id: 'capital', title: 'Capital Raising', description: 'Equity financings from seed to growth stage and public markets. We identify the specialist healthcare investors, venture, growth and private equity funds, best placed to secure the right capital at the right valuation.', tags: ['Series A–D', 'Growth Equity', 'Private Placements', 'IPO & Follow-on'] },
  { id: 'licensing', title: 'Partnerships & Licensing', description: 'Identification, negotiation and structuring of licensing agreements, co-development partnerships and commercial collaborations with pharma and medtech corporates.', tags: ['Licensing', 'Co‑development', 'Commercialisation', 'JVs'] },
  { id: 'advisory', title: 'Corporate Advisory', description: 'Independent strategic advice to management teams and boards on financing strategy, business development, portfolio and capital structure, tailored to each stage of a company’s lifecycle.', tags: ['Strategy', 'Valuation', 'Governance', 'Investor Relations'] },
];

function ServicesSection() {
  return (
    <section id="services" style={{ background: 'var(--white)', padding: '4.5rem 2.5vw' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="section-head reveal">
          <span className="eyebrow">What we do</span>
          <h2 className="section-title">Our Services</h2>
          <p className="section-lede">We partner with healthcare companies at every stage, delivering tailored strategic and transactional advisory.</p>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s, i) => (
            <article key={s.id} className={`svc-card reveal reveal-d${i + 1}`}>
              <span className="svc-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.description}</p>
              <ul className="svc-tags" aria-label={`${s.title} services`}>
                {s.tags.map(tag => <li key={tag} className="svc-tag">{tag}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Key figures (shown under the hero) ─── */
const FIGURES = [
  { value: '$90bn+', label: 'transaction value advised' },
  { value: '15+', label: 'years in healthcare investment banking' },
  { value: '100+', label: 'healthcare companies advised' },
  { value: 'Paris · London', label: 'offices', small: true },
];

/* Two placements for the same figures: inside the bottom of the hero on desktop (visible on load,
   fades out with the headline), and as a band under the hero on phones, where the hero has no room. */
function HeroStats() {
  return (
    <div className="hero-stats" aria-label="Key figures">
      <div className="hero-stats-inner">
        {FIGURES.map(f => (
          <div key={f.label} className="hero-stat">
            <span className="hero-stat-value">{f.value}</span>
            <span className="hero-stat-label">{f.label}</span>
          </div>
        ))}
      </div>
      <p className="hero-stats-note">Including transactions executed by team members in previous roles.</p>
    </div>
  );
}

function FiguresBand() {
  return (
    <section className="figures" aria-label="Key figures">
      <div className="figures-inner">
        {FIGURES.map(f => (
          <div key={f.label} className="figure reveal">
            <span className={`figure-value${f.small ? ' figure-value--sm' : ''}`}>{f.value}</span>
            <span className="figure-label">{f.label}</span>
          </div>
        ))}
      </div>
      <p className="figures-note">Including transactions executed by team members in previous roles.</p>
    </section>
  );
}

/* ─── Team ─── */
type Member = { name: string; role: string; photo: string; linkedin: string };

/* Photos: square, grayscale, light grey background, in /public/team/. */
const TEAM: Member[] = [
  { name: 'Camille Grellet', role: 'Founding Partner', photo: '/team/camille.jpg', linkedin: 'https://www.linkedin.com/in/camille-grellet-694b785b/' },
  { name: 'Thomas Guillot', role: 'Senior Scientific Advisor', photo: '/team/thomas.jpg', linkedin: 'https://www.linkedin.com/in/thomas-g-4956631b/' },
];

function TeamSection() {
  return (
    <section id="team" className="team-sec">
      <div className="section-head team-head reveal">
        <span className="eyebrow">Our team</span>
        <h2 className="section-title">A senior team, directly involved at every stage</h2>
      </div>
      <div className="team-row">
        {TEAM.map((m, i) => (
          <article key={m.name} className={`member reveal reveal-d${i + 1}`}>
            <Image src={m.photo} alt={m.name} width={200} height={200} className="member-photo" />
            <h3 className="member-name">{m.name}</h3>
            <p className="member-role">{m.role}</p>
            <a className="member-link" href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`}>
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
              LinkedIn
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Domains Carousel (alternative version) ─── */
const DOMAINS_ALT = [
  { name:'Biotechnology',              image:'/images/biotechnology.jpg' },
  { name:'Pharmaceuticals',            image:'/images/pharmaceuticals.jpg' },
  { name:'Medical Devices',            image:'/images/medical-devices.jpg' },
  { name:'Digital Health',             image:'/images/digital-health.jpg' },
  { name:'Healthcare Services',        image:'/images/healthcare-services.jpg' },
  { name:'Consumer Health',            image:'/images/consumer-health.jpg' },
];

/* Carousel arc geometry — parameterised for responsive sizing */
const carouselScaleF = (r: number) => 1 / (1 + r * 0.28);

function buildCumulativeX(baseW: number, gap: number, centerW: number) {
  const cumX: number[] = [0];
  /* First step: center card half-width → gap → first neighbour half-width */
  cumX.push(centerW / 2 + gap + (baseW * carouselScaleF(1)) / 2);
  for (let i = 1; i < 7; i++) {
    cumX.push(cumX[i] + (baseW * carouselScaleF(i)) / 2 + gap + (baseW * carouselScaleF(i + 1)) / 2);
  }
  return cumX;
}

function getSlotStyle(rel: number, baseW: number, baseH: number, cumX: number[], yFactor: number, centerW: number, centerH: number) {
  const absRel = Math.abs(rel);
  if (absRel > 7) return null;
  const x = (rel >= 0 ? 1 : -1) * cumX[absRel];
  const y = absRel * absRel * yFactor;
  const rot = rel * 2.5;
  const scale = carouselScaleF(absRel);
  const w = absRel === 0 ? centerW : Math.round(baseW * scale);
  const h = absRel === 0 ? centerH : Math.round(baseH * scale);
  const opacity = Math.max(0.12, 1 - absRel * 0.16);
  const z = 20 - absRel;
  const sa = Math.max(0.02, 0.12 - absRel * 0.02);
  const shadow = `0 ${Math.max(2, 12 - absRel * 2)}px ${Math.max(6, 40 - absRel * 6)}px rgba(0,0,0,${sa.toFixed(3)})`;
  return { x, y, w, h, rot, opacity, z, shadow };
}

function ExpertiseSectionAlt() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [labelVisible, setLabelVisible] = useState(true);
  const tabsRef = useRef<HTMLDivElement>(null);
  const total = DOMAINS_ALT.length;

  /* Responsive card dimensions — center card is square & wider */
  const [dims, setDims] = useState({ w: 250, h: 350, gap: 20, yF: 8, cW: 400, cH: 400 });
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw <= 480)      setDims({ w: 140, h: 196, gap: 10, yF: 4, cW: 220, cH: 220 });
      else if (vw <= 600) setDims({ w: 170, h: 238, gap: 14, yF: 5, cW: 270, cH: 270 });
      else if (vw <= 960) setDims({ w: 210, h: 294, gap: 16, yF: 6, cW: 340, cH: 340 });
      else                setDims({ w: 250, h: 350, gap: 20, yF: 8, cW: 400, cH: 400 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cumX = useMemo(() => buildCumulativeX(dims.w, dims.gap, dims.cW), [dims.w, dims.gap, dims.cW]);

  const navigate = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= total || newIndex === activeIndex) return;
    setLabelVisible(false);
    setActiveIndex(newIndex);
    setTimeout(() => setLabelVisible(true), 280);
  }, [activeIndex, total]);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!tabsRef.current) return;
    const tabEl = tabsRef.current.children[activeIndex] as HTMLElement;
    if (tabEl) {
      const container = tabsRef.current;
      const scrollLeft = tabEl.offsetLeft - container.offsetWidth / 2 + tabEl.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      setIndicatorStyle({ left: tabEl.offsetLeft, width: tabEl.offsetWidth });
    }
  }, [activeIndex]);

  /* Render ALL cards — far ones naturally fade & shrink into the margins */
  const visibleCards: { catIndex: number; rel: number }[] = [];
  for (let i = 0; i < total; i++) {
    visibleCards.push({ catIndex: i, rel: i - activeIndex });
  }

  return (
    <section className="domains-alt-section" id="domains-alt">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }} className="reveal">
          <span className="eyebrow">What we cover</span>
          <h2 className="section-title">Our Spheres of Competence</h2>
          <p className="section-lede">Our advisory spans the full spectrum of healthcare innovation.</p>
        </div>

        {/* Tabs with nav arrows */}
        <div className="dalt-nav reveal">
          <button className="dalt-arrow" onClick={() => navigate(activeIndex - 1)} disabled={activeIndex === 0}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
          </button>
          <div className="dalt-tabs" ref={tabsRef}>
            {DOMAINS_ALT.map((dom, i) => (
              <button key={dom.name} className={`dalt-tab${i === activeIndex ? ' active' : ''}`} onClick={() => navigate(i)}>
                {dom.name}
              </button>
            ))}
            <div className="dalt-indicator" style={{ left: indicatorStyle.left, width: indicatorStyle.width }} />
          </div>
          <button className="dalt-arrow" onClick={() => navigate(activeIndex + 1)} disabled={activeIndex === total - 1}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
          </button>
        </div>

        {/* Carousel */}
        <div className="dalt-carousel">
          {visibleCards.map(({ catIndex, rel }) => {
            const slot = getSlotStyle(rel, dims.w, dims.h, cumX, dims.yF, dims.cW, dims.cH);
            if (!slot) return null;
            const absRel = Math.abs(rel);
            const isCenter = rel === 0;
            const dom = DOMAINS_ALT[catIndex];
            return (
              <div
                key={catIndex}
                className="dalt-card"
                onClick={() => !isCenter && navigate(catIndex)}
                style={{
                  width: slot.w,
                  height: slot.h,
                  transform: `translateX(${slot.x - slot.w / 2}px) translateY(${slot.y - slot.h / 2}px) rotate(${slot.rot}deg)`,
                  zIndex: slot.z,
                  opacity: slot.opacity,
                  boxShadow: slot.shadow,
                  cursor: isCenter ? 'default' : 'pointer',
                }}
              >
                <Image src={dom.image} alt={dom.name} fill style={{ objectFit: 'cover' }} sizes="(max-width:600px) 50vw, 20vw" />
                <div className="dalt-card-overlay" />
                {absRel <= 2 && (
                  <div className="dalt-card-label" style={{ opacity: isCenter ? 1 : 0.5 }}>
                    <h3 className="dalt-card-name">{dom.name}</h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active domain name below carousel */}
        <div className="dalt-active-label" style={{ opacity: labelVisible ? 1 : 0, transform: labelVisible ? 'translateY(0)' : 'translateY(8px)' }}>
          <span>{DOMAINS_ALT[activeIndex].name}</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Main component ─── */
export default function AmbroisePartnersModern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef   = useRef<HTMLElement>(null);
  const navRef    = useRef<HTMLDivElement>(null);

  /* ── Dismiss loading screen after hydration ── */
  useEffect(() => {
    const loader = document.getElementById('page-loader');
    if (loader) { loader.classList.add('done'); setTimeout(() => loader.remove(), 500); }
  }, []);

  /* ── Reveal ── */
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) { nodes.forEach(n => n.classList.add('visible')); return; }

    const check = () => {
      const vh = window.innerHeight;
      nodes.forEach(n => {
        if (n.classList.contains('visible')) return;
        const r = n.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) n.classList.add('visible');
      });
    };

    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );
    check();
    nodes.forEach(n => { if (!n.classList.contains('visible')) io.observe(n); });

    window.addEventListener('scroll', check, { passive: true });
    const t = setTimeout(() => nodes.forEach(n => n.classList.add('visible')), 1800);
    return () => { io.disconnect(); clearTimeout(t); window.removeEventListener('scroll', check); };
  }, []);

  /* ── Transparent nav while hero is in view ── */
  useEffect(() => {
    const navOuter = navRef.current;
    const hero = heroRef.current;
    if (!navOuter || !hero) return;

    const onScroll = () => {
      navOuter.classList.toggle('nav-scrolled', window.scrollY > hero.offsetHeight - 80);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── DNA particle system ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d')!;
    const isMobile = window.innerWidth <= 600;
    const heroContent = hero.querySelector<HTMLElement>('.hero-content');
    const heroStats = hero.querySelector<HTMLElement>('.hero-stats');
    const PARTICLE_COUNT = isMobile ? 18000 : 40000;
    const STICKY_PX = stickyPx();
    let W = 0, H = 0, scrollProgress = 0, raf = 0;

    let fadeEl: HTMLElement | null = null;

    /* Hero height — update on resize so the animation always fills the viewport */
    let lastW = window.innerWidth;
    const updateHeroH = () => {
      const h = window.innerHeight;
      hero.style.height = `${h}px`;
      hero.style.minHeight = `${h}px`;
      wrapper.style.height = `${h + STICKY_PX}px`;
      /* The next section slides up over the pinned hero from the first pixel of scroll, instead of
         the hero playing out first and a blank screen scrolling by after it. */
      wrapper.style.marginBottom = `-${STICKY_PX}px`;
    };

    const wrapper = document.createElement('div');
    wrapper.id = 'hero-wrapper';
    wrapper.style.cssText = `position:relative;height:${window.innerHeight + STICKY_PX}px;`;
    hero.parentNode!.insertBefore(wrapper, hero);
    wrapper.appendChild(hero);
    hero.style.position = 'sticky';
    hero.style.top = '0';
    updateHeroH();

    fadeEl = document.createElement('div');
    fadeEl.id = 'hero-fade';
    hero.appendChild(fadeEl);

    /* Typed arrays for SoA particle data — avoids per-particle objects & GC */
    let pDnaX: Float32Array, pDnaY: Float32Array;
    let pDispX: Float32Array, pDispY: Float32Array;
    let pSpd: Float32Array, pPh: Float32Array;
    let pSize: Float32Array, pAlpha: Float32Array;
    let pX: Float32Array, pY: Float32Array;
    /* Alpha buckets for batched drawing (10 buckets) */
    const ALPHA_BUCKETS = 10;

    function buildParticles() {
      const N = PARTICLE_COUNT;
      pDnaX = new Float32Array(N); pDnaY = new Float32Array(N);
      pDispX = new Float32Array(N); pDispY = new Float32Array(N);
      pSpd = new Float32Array(N); pPh = new Float32Array(N);
      pSize = new Float32Array(N); pAlpha = new Float32Array(N);
      pX = new Float32Array(N); pY = new Float32Array(N);

      const ref = Math.max(W, H * 0.5);
      const SX0 = W*0.15, SY0 = H*1.02;
      const SX1 = W*0.85, SY1 = -H*0.02;
      const dvx = SX1-SX0, dvy = SY1-SY0, spineLen = Math.sqrt(dvx*dvx+dvy*dvy);
      const tx = dvx/spineLen, ty = dvy/spineLen;
      const px = -ty, py = tx;
      const TURNS = 3.5;
      const TWO_PI = Math.PI * 2;

      for (let i = 0; i < N; i++) {
        const frac = Math.random();
        const perspective = 0.35 + frac * 0.65;
        const AMP = ref * 0.09 * perspective;
        const sx = SX0 + tx * spineLen * frac;
        const sy = SY0 + ty * spineLen * frac;
        const isA = Math.random() < 0.5;
        const angle = frac * TURNS * TWO_PI + (isA ? 0 : Math.PI);
        const cosA = Math.cos(angle);
        const coreX = sx + px * cosA * AMP;
        const coreY = sy + py * cosA * AMP;

        let targetX = coreX, targetY = coreY;
        if (Math.random() < 0.10) {
          const otherCos = Math.cos(frac * TURNS * TWO_PI + (isA ? Math.PI : 0));
          const otherX = sx + px * otherCos * AMP;
          const otherY = sy + py * otherCos * AMP;
          const t2 = Math.random();
          targetX = coreX + (otherX - coreX) * t2;
          targetY = coreY + (otherY - coreY) * t2;
        }

        const u1 = Math.max(Math.random(), 1e-5);
        const mag = Math.sqrt(-2.0 * Math.log(u1));
        const scA = Math.random() * TWO_PI;
        const sigma = Math.pow(Math.random(), 0.65) * ref * 0.018 * perspective;
        const dnaX = targetX + Math.cos(scA) * mag * sigma;
        const dnaY = targetY + Math.sin(scA) * mag * sigma;

        const dist = Math.sqrt((dnaX - targetX)**2 + (dnaY - targetY)**2);
        const coreness = 1 - Math.min(dist / (ref * 0.018), 1);
        const isBright = Math.random() < 0.07;
        const sizeScale = 0.5 + perspective * 0.5;

        pDnaX[i] = dnaX; pDnaY[i] = dnaY;
        pDispX[i] = Math.random() * W; pDispY[i] = Math.random() * H;
        pSpd[i] = Math.random() * 0.10 + 0.025;
        pPh[i] = Math.random() * TWO_PI;
        pSize[i] = isBright
          ? (Math.random() * 0.9 + 0.4) * sizeScale
          : (Math.random() * 0.35 + 0.05) * sizeScale;
        pAlpha[i] = isBright
          ? Math.random() * 0.5 + 0.38
          : Math.max(0.01, coreness * coreness * (Math.random() * 0.65 + 0.12) + Math.random() * 0.025);
        pX[i] = dnaX; pY[i] = dnaY;
      }
    }

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function animate() {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, W * dpr, H * dpr);
      const t = Date.now() * .001;
      const prog = scrollProgress;
      const eased = prog < .5 ? 2*prog*prog : 1 - Math.pow(-2*prog+2, 2)/2;
      const N = PARTICLE_COUNT;
      const TWO_PI = Math.PI * 2;

      /* Update all positions (tight numeric loop) */
      const wobbleScale = 1.5 + eased * 2.0;
      const wobbleScaleY = 1.2 + eased * 1.8;
      for (let i = 0; i < N; i++) {
        const baseX = pDnaX[i] + (pDispX[i] - pDnaX[i]) * eased;
        const baseY = pDnaY[i] + (pDispY[i] - pDnaY[i]) * eased;
        const phase = t * pSpd[i] + pPh[i];
        pX[i] = baseX + Math.sin(phase) * wobbleScale;
        pY[i] = baseY + Math.cos(phase * 0.88) * wobbleScaleY;
      }

      /* Draw batched by alpha bucket — drastically reduces fillStyle switches */
      const alphaFade = 1 - eased * 0.3;
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        const lo = b / ALPHA_BUCKETS, hi = (b + 1) / ALPHA_BUCKETS;
        const bucketAlpha = ((lo + hi) / 2) * alphaFade;
        ctx.fillStyle = `rgba(255,255,255,${bucketAlpha.toFixed(3)})`;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          if (pAlpha[i] >= lo && pAlpha[i] < hi) {
            ctx.moveTo(pX[i] + pSize[i], pY[i]);
            ctx.arc(pX[i], pY[i], pSize[i], 0, TWO_PI);
          }
        }
        ctx.fill();
      }
      if (fadeEl) {
        /* The hero no longer fades to white: the next section slides over it (see wrapper margin).
           The headline, buttons and figures only dim slightly, so the hero stays readable while covered. */
        fadeEl.style.opacity = '0';
        const contentOpacity = String(1 - scrollProgress * 0.45);
        if (heroContent) heroContent.style.opacity = contentOpacity;
        if (heroStats) heroStats.style.opacity = contentOpacity;
      }
      raf=requestAnimationFrame(animate);
    }

    const onScroll=()=>{ scrollProgress=Math.min(Math.max(window.scrollY/STICKY_PX,0),1); };
    window.addEventListener('scroll',onScroll,{passive:true});

    const onResize = () => {
      const curW = window.innerWidth;
      /* On mobile, skip height-only changes (address-bar toggle) */
      if (curW !== lastW || curW > 600) { updateHeroH(); lastW = curW; }
      resize();
    };
    window.addEventListener('resize', onResize);

    /* Safari may report wrong offsetWidth/Height on first paint.
       Run resize() after layout is guaranteed stable. */
    const ensureReady = () => {
      resize();
      if (W === 0 || H === 0) {
        requestAnimationFrame(ensureReady);
      } else {
        animate();
      }
    };
    if (document.readyState === 'complete') {
      ensureReady();
    } else {
      window.addEventListener('load', ensureReady, { once: true });
    }

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll',onScroll);
      window.removeEventListener('resize',onResize);
      if(fadeEl && fadeEl.parentNode) fadeEl.parentNode.removeChild(fadeEl);
      if(wrapper.parentNode){wrapper.parentNode.insertBefore(hero,wrapper);wrapper.parentNode.removeChild(wrapper);}
      hero.style.position=''; hero.style.top='';
      hero.style.height=''; hero.style.minHeight='';
    };
  }, []);

  const [sending, setSending] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setFormStatus('idle');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { setFormStatus('success'); form.reset(); }
      else { setFormStatus('error'); }
    } catch { setFormStatus('error'); }
    setSending(false);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Ambroise Partners',
    description: 'Strategic and transactional advisory for healthcare companies.',
    url: 'https://www.ambroisepartners.com',
    email: COMPANY.email,
    address: { '@type': 'PostalAddress', streetAddress: '7 rue Paul Saunière', postalCode: '75016', addressLocality: 'Paris', addressCountry: 'FR' },
    founder: { '@type': 'Person', name: 'Camille Grellet' },
    sameAs: [COMPANY.linkedin],
    areaServed: 'Global',
    serviceType: SERVICES.map(s => s.title),
    industry: 'Healthcare',
  };

  return (
    <>
      {/* Covers the page until the hero animation is ready (removed in the first effect above) */}
      <div id="page-loader" className="page-loader" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        a,button{-webkit-tap-highlight-color:transparent;}

        :root {
          --white:  #ffffff;
          --ink:    #1A1A1A;
          --blue:   #2a5cb8;
          --muted:  #6B6B6B;
          --line:   #E5E5E3;
          --dark:   #0D0D0D;
          --accent-bg: #F7FBFE;
          --navy:   #030a24;
          --navy-hover: #0b1a4a;
          --sans:   var(--font-sans),-apple-system,sans-serif;
          --serif:  var(--font-serif),Georgia,serif;
          --ease:   cubic-bezier(0.22,0.61,0.36,1);
        }

        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--white);color:var(--ink);overflow-x:hidden;font-size:17px;line-height:1.65;-webkit-font-smoothing:antialiased;}
        a{color:inherit;text-decoration:none;}

        /* ── NAV ── */
        .nav-outer{position:fixed;top:0;left:0;right:0;z-index:300;pointer-events:none;}
        nav{
          pointer-events:all;width:100%;padding:0 4vw;height:64px;
          display:flex;align-items:center;justify-content:space-between;
          background:transparent;border-bottom:1px solid transparent;
          transition:background .35s var(--ease), border-color .35s var(--ease), box-shadow .35s var(--ease);
        }
        .logo-wrap{display:flex;align-items:center;gap:.7rem;}
        .logo-ap{font-family:'Lora',Georgia,serif;font-weight:500;font-size:1.55rem;letter-spacing:-.01em;color:#fff;transition:color .35s;}
        .logo-sep{width:1px;height:16px;background:rgba(255,255,255,0.25);transition:background .35s;}
        .logo-name{display:flex;flex-direction:column;gap:4px;font-size:.78rem;letter-spacing:.28em;text-transform:uppercase;line-height:1;color:#fff;transition:color .35s;}
        .logo-l1{font-weight:600;}
        .logo-l2{font-weight:400;}
        .logo-mark{width:56px;height:35px;color:#fff;flex-shrink:0;transition:color .35s;}
        .nav-scrolled .logo-mark{color:var(--navy);}
        .nav-scrolled .logo-name{color:var(--navy);}
        .nav-links{display:flex;gap:1.2rem;align-items:center;}
        .nav-links a{font-size:.88rem;font-weight:500;color:#fff;padding:.5rem 1rem;transition:color .18s;letter-spacing:.02em;}
        .nav-links a:hover{color:#fff;}
        .nav-cta{
          margin-left:.5rem;
          background:#fff!important;color:var(--ink)!important;
          padding:.65rem 1.7rem!important;border-radius:9999px;
          display:inline-flex;align-items:center;justify-content:center;
          font-size:.85rem!important;font-weight:600!important;
          border:1.5px solid #fff;
          transition:background .22s!important,color .22s!important,box-shadow .22s!important,border-color .18s var(--ease),border-radius .18s var(--ease);
        }
        .nav-cta:hover{background:#fff!important;color:var(--ink)!important;border-color:#fff;border-radius:9999px;}
        .nav-scrolled nav{background:#fff;border-bottom:1px solid var(--line);box-shadow:0 1px 12px rgba(0,0,0,0.06);}
        .nav-scrolled .logo-ap{color:var(--ink);}
        .nav-scrolled .logo-sep{background:var(--line);}
        .nav-scrolled .nav-links a{color:var(--muted);}
        .nav-scrolled .nav-links a:hover{color:var(--ink);}
        .nav-scrolled .nav-cta{background:var(--navy)!important;color:#fff!important;border-radius:9999px;border-color:var(--navy);}
        .nav-scrolled .nav-cta:hover,.nav-scrolled .nav-cta:active{background:var(--navy-hover)!important;border-color:var(--navy-hover);}

        /* ── HERO ── */
        .hero{
          position:relative;min-height:100vh;min-height:100dvh;overflow:hidden;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:0 4vw;color:#fff;
          /* Richer deep-navy background with subtle radial warmth for life-science feel */
          background:radial-gradient(ellipse 80% 60% at 50% 40%, #05122e 0%, #020a1e 50%, #010510 100%);
        }
        #hero-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;}
        #hero-fade{
          position:absolute;inset:0;z-index:1;pointer-events:none;
          background:linear-gradient(to top,
            #ffffff 0%,
            #fcfdff 1%,
            #f8faff 2%,
            #f0f4ff 4%,
            #e0eaff 6%,
            #d0e0ff 8%,
            #b8d2f5 11%,
            #a0c2f0 14%,
            #7aacec 18%,
            #5a90d8 22%,
            #3e74c8 25%,
            #2a5cb8 28%,
            #1e48a0 32%,
            #143690 36%,
            #0a1880 42%,
            #071260 48%,
            #050e42 53%,
            #030a24 58%,
            rgba(3,10,36,0.85) 62%,
            rgba(3,10,36,0.7) 65%,
            rgba(3,10,36,0.55) 68%,
            rgba(3,10,36,0.4) 71%,
            rgba(3,10,36,0.28) 74%,
            rgba(3,10,36,0.16) 77%,
            rgba(3,10,36,0.08) 80%,
            rgba(3,10,36,0.03) 84%,
            transparent 88%
          );
          opacity:0;
          transition:opacity 0.05s linear;
        }
        .hero-inner{
          position:relative;z-index:2;
          max-width:1500px;
          padding-top:5rem;
          padding-bottom:0;
          text-align:center;
        }
        .hero-h1{
          font-family:'Lora',Georgia,serif;font-weight:500;
          font-size:clamp(2.8rem,4.8vw,4.6rem);
          line-height:1.06;letter-spacing:-.015em;margin-bottom:1.4rem;
          max-width:100%;margin-left:auto;margin-right:auto;
          opacity:0;animation:fadeUp .9s .3s var(--ease) forwards;
        }
        .hero-h1 strong{
          display:block;font-family:'Lora',Georgia,serif;font-weight:500;font-style:italic;
          font-size:clamp(3.2rem,5.5vw,5.2rem);line-height:1.08;letter-spacing:-.02em;
        }
        .hero-tags{
          display:flex;gap:.4rem;flex-wrap:wrap;justify-content:center;
          margin:1.4rem 0 1.2rem;
          opacity:0;animation:fadeUp .9s .45s var(--ease) forwards;
        }
        .hero-tags span{
          position:relative;font-size:.95rem;font-weight:500;letter-spacing:.06em;
          color:#fff;padding:0 .2rem;
        }
        .hero-tags span:not(:last-child)::after{
          content:'';display:inline-block;width:1px;height:14px;
          background:rgba(255,255,255,.5);margin:0 .65rem;
          position:relative;top:2px;
        }
        .hero-sub{font-size:1rem;color:rgba(255,255,255,.58);max-width:42ch;margin:0 0 1.8rem;font-weight:300;line-height:1.72;opacity:0;animation:fadeUp .9s .6s var(--ease) forwards;}
        .hero-ctas{display:flex;gap:.8rem;flex-wrap:wrap;justify-content:center;opacity:0;animation:fadeUp .9s .75s var(--ease) forwards;}
        .btn-primary{background:#fff;color:var(--ink);padding:.85rem 2rem;border-radius:100px;font-size:.85rem;font-weight:500;letter-spacing:.01em;transition:transform .22s var(--ease),box-shadow .22s;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.25);}
        .btn-secondary{background:transparent;color:rgba(255,255,255,.88);padding:.85rem 2rem;border-radius:100px;font-size:.85rem;font-weight:400;letter-spacing:.01em;border:1px solid rgba(255,255,255,.28);transition:border-color .2s,background .2s;}
        .btn-secondary:hover{border-color:rgba(255,255,255,.55);background:rgba(255,255,255,.07);}
        .hero-footnote{margin-top:1.2rem;font-size:.78rem;color:rgba(255,255,255,.38);font-weight:300;opacity:0;animation:fadeUp .9s .9s var(--ease) forwards;}

        .hero-content{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;will-change:opacity;}
        .hero-bottom{display:flex;flex-direction:column;align-items:center;gap:1.4rem;}
        .hero-tags span{text-shadow:0 1px 12px rgba(3,10,36,.6);}

        /* ── KEY FIGURES ── */
        .hero-content{padding-bottom:6.5rem;}
        .hero-stats{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:0 4vw 1.6rem;will-change:opacity;}
        .hero-stats-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid rgba(255,255,255,.16);}
        .hero-stat{display:flex;flex-direction:column;gap:.3rem;padding:1.2rem 1rem 0 1.2rem;border-left:1px solid rgba(255,255,255,.12);}
        .hero-stat:first-child{border-left:none;padding-left:0;}
        .hero-stat-value{font-family:var(--serif);font-weight:400;font-size:clamp(1.5rem,2.2vw,2rem);line-height:1.05;letter-spacing:-.01em;color:#fff;}
        .hero-stat-label{font-size:.8rem;color:rgba(255,255,255,.62);line-height:1.4;}
        .hero-stats-note{max-width:1200px;margin:.9rem auto 0;font-size:.68rem;color:rgba(255,255,255,.4);}
        .figures{display:none;}
        .figures,#services{position:relative;z-index:3;box-shadow:0 -18px 40px rgba(1,5,16,.18);}
        .figures{background:var(--white);border-bottom:1px solid var(--line);padding:3.2rem 2.5vw 2rem;}
        .figures-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.5rem;}
        .figure{display:flex;flex-direction:column;gap:.35rem;padding-left:1.2rem;border-left:1px solid var(--line);}
        .figure-value{font-family:var(--serif);font-weight:400;font-size:clamp(2rem,3.4vw,2.9rem);line-height:1.05;letter-spacing:-.02em;color:var(--navy);}
        .figure-value--sm{font-size:clamp(1.4rem,2.2vw,1.9rem);padding-top:.5rem;}
        .figure-label{font-size:.88rem;color:var(--muted);font-weight:400;line-height:1.45;}
        .figures-note{max-width:1200px;margin:1.8rem auto 0;font-size:.75rem;color:var(--muted);}

        /* ── SERVICES CARDS ── */
        .svc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem;}
        .svc-card{display:flex;flex-direction:column;gap:.9rem;border:1px solid var(--line);border-radius:6px;padding:1.6rem 1.4rem 1.5rem;background:#fff;transition:border-color .25s,box-shadow .25s;}
        .svc-card:hover{border-color:#c9d3e3;box-shadow:0 12px 30px rgba(3,10,36,.06);}
        .svc-num{font-family:var(--serif);font-style:italic;font-size:1rem;color:var(--blue);}
        .svc-title{font-family:var(--serif);font-weight:400;font-size:1.35rem;letter-spacing:-.01em;line-height:1.15;}
        .svc-desc{color:var(--muted);font-size:.95rem;line-height:1.65;font-weight:300;flex-grow:1;}
        .svc-tags{display:flex;flex-wrap:wrap;gap:6px;list-style:none;padding-top:.4rem;}

        /* ── TEAM ── */
        .team-sec{background:var(--navy);color:#fff;padding:4.5rem 2.5vw 4.8rem;}
        .team-head{text-align:center;max-width:820px;margin:0 auto 2.8rem;}
        .team-sec .eyebrow{color:rgba(255,255,255,.6);}
        .team-sec .section-title{color:#fff;margin-left:0;}
        .team-row{display:flex;justify-content:center;gap:clamp(3rem,9vw,8rem);flex-wrap:wrap;}
        .member{display:flex;flex-direction:column;align-items:center;text-align:center;}
        .member-photo{width:clamp(150px,13vw,190px);height:auto;aspect-ratio:1;border-radius:50%;object-fit:cover;box-shadow:0 0 0 6px rgba(255,255,255,.06);}
        .member-name{font-family:var(--serif);font-weight:400;font-size:1.4rem;letter-spacing:-.01em;margin-top:1.3rem;}
        .member-role{font-size:.78rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-top:.35rem;}
        .member-link{display:inline-flex;align-items:center;gap:.45rem;margin-top:1rem;padding:.45rem .95rem;border:1px solid rgba(255,255,255,.25);border-radius:4px;font-size:.8rem;font-weight:500;color:#fff;transition:background .2s,border-color .2s;}
        .member-link:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.45);}

        /* ── SECTIONS ── */
        .section{max-width:1200px;margin:0 auto;padding:7rem 2.5vw;color:var(--ink);}
        .section-bg{background:var(--white);}
        .eyebrow{display:block;font-family:var(--sans);font-size:.75rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.4rem;}
        .section-title{font-family:var(--serif);font-weight:400;font-size:clamp(1.9rem,2.6vw,2.5rem);line-height:1.1;letter-spacing:-.02em;margin-bottom:.3rem;margin-left:-.05em;}
        .section-lede{font-family:var(--sans);color:var(--muted);font-size:1.08rem;max-width:100%;font-weight:300;line-height:1.65;letter-spacing:-.01em;}
        .section-head{margin-bottom:2rem;}

        /* ── APPROACH ── */
        .approach-panels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2.4rem;}
        .approach-panel{display:flex;flex-direction:column;background:var(--accent-bg);}
        .approach-panel+.approach-panel .approach-text{border-top:none;}
        .approach-text{padding:1.2rem 0 0;display:flex;flex-direction:column;justify-content:center;border-right:none;}
        .approach-num{font-family:var(--serif);font-style:italic;font-size:1.1rem;color:#162d50;margin-bottom:.8rem;display:block;}
        .approach-title{font-family:var(--serif);font-weight:400;font-size:1.3rem;letter-spacing:-.01em;margin-bottom:.7rem;line-height:1.15;}
        .approach-desc{color:var(--muted);font-size:.98rem;line-height:1.65;font-weight:300;}
        .approach-canvas-wrap{order:-1;background:var(--accent-bg);overflow:hidden;position:relative;height:clamp(120px,15vh,160px);border-bottom:1px solid var(--line);}

        /* Approach illustrations */
        .apx{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}
        .apx-line{fill:none;stroke:var(--navy);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round;}
        .apx-thin{stroke-width:.9;stroke:#5b6b8a;}
        .apx-faint{fill:none;stroke:#d5dde9;stroke-width:1;}
        .apx-dash{stroke-dasharray:2 4;}
        .apx-track{stroke:#d5dde9;stroke-width:2;stroke-linecap:round;}
        .apx-progress{stroke-width:2;}
        .apx-area{fill:rgba(42,92,184,.07);stroke:none;}
        .apx-atom{fill:#fff;stroke:var(--navy);stroke-width:1.2;}
        .apx-dot{fill:#9aa8c0;}
        .apx-step{fill:#fff;stroke:var(--navy);stroke-width:1.4;}
        .apx-accent{fill:var(--blue);}
        .apx-spark{fill:var(--blue);opacity:.85;}
        .apx-check{fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}
        .apx-hub{fill:var(--navy);}
        .apx-hub-ring{fill:none;stroke:var(--blue);stroke-width:1;opacity:.5;}
        .apx-hub-text{font-family:var(--serif);font-size:9.5px;fill:#fff;letter-spacing:.02em;}
        .apx-label{font-family:var(--sans);font-size:9.5px;fill:#5f5f5f;letter-spacing:.01em;}
        .apx-chem{font-family:var(--serif);font-style:italic;font-size:11px;fill:var(--blue);}
        .apx-draw{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset var(--t,.9s) var(--ease) var(--d,0s);}
        .apx-pop{opacity:0;transform:scale(.4);transform-box:fill-box;transform-origin:center;transition:opacity .5s ease var(--d,0s),transform .5s var(--ease) var(--d,0s);}
        .visible .apx-draw{stroke-dashoffset:0;}
        .visible .apx-pop{opacity:1;transform:none;}
        .visible .apx-float{animation:apxFloat 7s ease-in-out 2s infinite;}
        .visible .apx-pulse{animation:apxPulse 2.8s ease-in-out 2s infinite;}
        @keyframes apxFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes apxPulse{0%,100%{opacity:1;}50%{opacity:.55;}}
        @media (prefers-reduced-motion:reduce){.apx-draw{stroke-dashoffset:0;transition:none;}.apx-pop{opacity:1;transform:none;transition:none;}.apx-float,.apx-pulse{animation:none!important;}.apx-spark{display:none;}}

        /* ── VALUES ── */
        .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#fff;}
        .value-card{background:var(--accent-bg);padding:1.8rem 1.6rem;transition:background .25s;}
        .value-card:hover{background:#e8ecf2;}
        .value-tag{display:inline-block;font-size:.65rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);border:1px solid var(--blue);padding:.2rem .6rem;border-radius:100px;margin-bottom:.8rem;}
        .value-title{font-family:var(--serif);font-weight:400;font-size:1.4rem;letter-spacing:-.01em;margin-bottom:.6rem;line-height:1.2;}
        .value-desc{color:var(--muted);font-size:1.125rem;line-height:1.7;font-weight:300;}

        /* ── METHOD ── */
        .method-list{border-top:1px solid var(--line);}
        .method-step{display:grid;grid-template-columns:70px 1fr;align-items:center;gap:1rem;padding:.55rem 0;border-bottom:1px solid var(--line);}
        .step-num{font-family:var(--serif);font-style:normal;font-size:2.2rem;color:#162d50;font-weight:400;letter-spacing:-.02em;}
        .step-body h4{font-family:var(--serif);font-weight:400;font-size:1.2rem;letter-spacing:-.01em;margin-bottom:.3rem;}
        .step-body p{color:var(--muted);font-size:.98rem;line-height:1.6;font-weight:300;}

        /* ── ABOUT ── */
        .about-split{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start;}
        .about-lede{color:var(--muted);font-size:1rem;line-height:1.7;margin-top:1.2rem;font-weight:300;letter-spacing:-.01em;}
        .about-links{display:flex;gap:1rem;margin-top:2.5rem;flex-wrap:wrap;}
        .btn-dark{background:var(--navy);color:#fff;padding:.9rem 2rem;border-radius:100px;font-size:.75rem;font-weight:500;letter-spacing:.04em;transition:background .22s,transform .2s,box-shadow .22s;}
        .btn-dark:hover{background:var(--navy-hover);transform:translateY(-2px);box-shadow:0 10px 26px rgba(3,10,36,.2);}
        .btn-outline{display:inline-flex;align-items:center;white-space:nowrap;border:1.5px solid #cfd5df;color:var(--ink);padding:.8rem 1.7rem;border-radius:100px;font-size:.8rem;font-weight:500;letter-spacing:.04em;transition:border-color .22s,color .22s;}
        .btn-outline:hover{border-color:var(--blue);color:var(--blue);}
        .about-dark{background:var(--dark);border-radius:4px;padding:3.5rem 3rem;color:#fff;position:relative;overflow:hidden;}
        .about-dark-label{font-family:var(--serif);font-weight:400;font-size:1.2rem;letter-spacing:-.01em;margin-bottom:1.5rem;position:relative;}
        .about-dark::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;background:radial-gradient(circle,rgba(3,10,36,.22) 0%,transparent 70%);border-radius:50%;}

        /* ── CONTACT ── */
        .form-msg{text-align:center;padding:1rem 1.5rem;border-radius:8px;font-family:var(--sans);font-size:.9rem;font-weight:400;animation:svcFadeUp .4s ease both;}
        .form-msg--ok{background:#f0faf0;color:#1a7a2e;border:1px solid #c3e6c3;}
        .form-msg--err{background:#fdf0f0;color:#a12;border:1px solid #e6c3c3;}
        .submit-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}
        .contact-wrap{max-width:700px;margin:0 auto;padding:3.5rem 2.5vw;text-align:center;display:flex;flex-direction:column;align-items:center;}
        .contact-form{margin-top:2rem;text-align:left;display:flex;flex-direction:column;gap:.9rem;width:100%;max-width:600px;}
        .fl{display:block;font-size:.7rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.45rem;}
        .fi,.ft{width:100%;background:#fff;border:1px solid var(--line);border-radius:4px;padding:.9rem 1.15rem;font-family:var(--sans);font-size:.95rem;color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s;}
        .fi:focus,.ft:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(3,10,36,.1);}
        .ft{min-height:90px;resize:vertical;}
        .fc{display:flex;gap:.7rem;align-items:flex-start;font-size:.75rem;color:var(--muted);cursor:pointer;line-height:1.55;font-weight:300;}
        .fc input{margin-top:3px;flex-shrink:0;accent-color:var(--blue);}
        .submit-btn{align-self:center;background:var(--navy);color:#fff;border:1.5px solid var(--navy);padding:1rem 3rem;border-radius:9999px;font-family:var(--sans);font-size:.85rem;font-weight:600;letter-spacing:.02em;cursor:pointer;transition:background .22s,transform .2s,box-shadow .22s,color .22s,border-color .22s;}
        .submit-btn:hover{background:var(--navy-hover);border-color:var(--navy-hover);transform:translateY(-2px);box-shadow:0 10px 28px rgba(3,10,36,.2);}

        /* ── SERVICES TABS ── */
        .svc-tabs{display:flex;border-bottom:1px solid var(--line);justify-content:space-between;overflow:hidden;margin-top:4.5rem;}
        .svc-tab{cursor:pointer;position:relative;padding:0 0 20px 0;background:none;border:none;outline:none;-webkit-appearance:none;appearance:none;white-space:nowrap;font-family:var(--serif);font-size:1.4rem;font-weight:400;color:var(--muted);letter-spacing:-.01em;transition:color .35s ease;}
        .svc-tab::after{content:'';position:absolute;bottom:-1.5px;left:0;width:100%;height:2px;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(0.25,0.1,0.25,1);}
        .svc-tab:hover{color:var(--ink);}
        .svc-tab:hover::after{transform:scaleX(1);}
        .svc-tab--active{color:var(--ink);}
        .svc-tab--active::after{transform:scaleX(1);}
        .svc-tag{padding:5px 11px;border-radius:100px;font-size:.72rem;font-weight:500;letter-spacing:.02em;border:none;color:var(--navy);background:#e9eef6;transition:all .3s ease;font-family:var(--sans);white-space:nowrap;animation:svcFadeUp .35s cubic-bezier(0.25,0.1,0.25,1) both;}
        .svc-tag:hover{background:#dde5f1;}
        .svc-panel-anim{animation:svcFadeUp .4s cubic-bezier(0.25,0.1,0.25,1) forwards;}
        @keyframes svcFadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}

        /* ── SECTOR TICKER ── */
        .sector-ticker{background:var(--white);border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;padding:.5rem 0;margin-top:3rem;margin-bottom:5rem;white-space:nowrap;}
        .sector-ticker-track{display:flex;width:max-content;animation:tickerScroll 180s linear infinite;}
        .sector-ticker-set{display:flex;gap:0;flex-shrink:0;}
        .sector-ticker-item{font-size:.78rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--ink);padding:0 2.8rem;opacity:1;display:flex;align-items:center;gap:.7rem;}
        .sector-ticker-item::before{content:'';width:4px;height:4px;border-radius:50%;border:1px solid #162d50;flex-shrink:0;}
        @keyframes tickerScroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

        /* ── FOOTER ── */
        footer{background:#030a24;color:#fff;padding:3rem 2.5vw 2rem;}
        .footer-inner{max-width:1200px;margin:0 auto;}

        .footer-top{display:grid;grid-template-columns:1fr auto;gap:4rem;padding-bottom:2rem;border-bottom:1px solid rgba(255,255,255,.08);align-items:start;}
        .footer-logo-wrap{display:flex;align-items:center;gap:.7rem;margin-bottom:.8rem;}
        .footer-logo{font-family:var(--serif);font-weight:500;font-size:1.4rem;color:#fff;letter-spacing:-.01em;}
        .footer-logo-sep{width:1px;height:14px;background:rgba(255,255,255,.25);}
        .footer-brand-name{display:flex;flex-direction:column;gap:4px;font-size:.78rem;letter-spacing:.28em;text-transform:uppercase;line-height:1;color:#fff;}
        .footer-mark{width:54px;height:34px;color:#fff;flex-shrink:0;}
        .footer-brand-desc{font-size:.82rem;line-height:1.7;color:rgba(255,255,255,.72);font-weight:300;max-width:28ch;margin-bottom:1rem;}
        .footer-contact{display:flex;flex-direction:column;gap:.3rem;}
        .footer-contact a,.footer-contact span{font-size:.78rem;color:rgba(255,255,255,.72);font-weight:300;transition:color .18s;}
        .footer-contact a:hover{color:#fff;}

        .footer-links{display:flex;gap:3.5rem;flex-wrap:wrap;}
        .footer-col-title{font-size:.65rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-bottom:.9rem;}
        .footer-col a{display:block;font-size:.85rem;color:rgba(255,255,255,.75);margin-bottom:.55rem;transition:color .18s;font-weight:300;}
        .footer-col a:hover{color:#fff;}

        .footer-bottom{padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8rem;}
        .footer-copy{font-size:.72rem;color:rgba(255,255,255,.6);letter-spacing:.03em;}

        /* ── DOMAINS GRID ── */
        .domains-grid{display:flex;gap:6px;height:clamp(260px,40vh,360px);}
        .domain-card{position:relative;border-radius:4px;overflow:hidden;flex-grow:1;flex-shrink:1;flex-basis:0;min-width:0;cursor:pointer;transition:flex-grow .5s var(--ease),flex-shrink .5s var(--ease),box-shadow .4s ease;}
        .domain-card--shrunk{flex-grow:.7;flex-shrink:1;}
        .domain-card--active{flex-grow:2;flex-shrink:0;box-shadow:0 12px 30px rgba(0,0,0,.18);}
        .domain-img{position:absolute;inset:0;transition:transform .55s cubic-bezier(0.16,1,0.3,1);filter:grayscale(1) contrast(1.05) brightness(1.18);}
        .domain-tint{position:absolute;inset:0;background:linear-gradient(165deg,#a9c4ee 0%,#4f7fcc 50%,#0d2257 100%);mix-blend-mode:multiply;opacity:.9;transition:opacity .45s ease;}
        .domain-card--active .domain-tint{opacity:.78;}
        .domain-card--active .domain-img{transform:scale(1.03);}
        .domain-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.05) 50%,transparent 100%);transition:background .35s ease;}
        .domain-card--active .domain-overlay{background:linear-gradient(to top,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.08) 60%,transparent 100%);}
        .domain-label{position:absolute;bottom:0;left:0;right:0;padding:.9rem 1rem;transition:padding .5s var(--ease);}
        .domain-card--active .domain-label{padding:1.4rem 1.6rem;}
        .domain-num{display:none;}
        .domain-name{font-family:var(--serif);font-weight:500;font-size:1.15rem;line-height:1.2;letter-spacing:-0.01em;color:#fff;margin:0;text-shadow:0 1px 10px rgba(0,0,0,0.4);white-space:nowrap;transition:font-size .5s var(--ease);}
        .domain-card--shrunk .domain-name{font-size:.8rem;}
        .domain-card--active .domain-name{font-size:1.5rem;}
        .domain-desc{font-family:var(--sans);font-size:0rem;line-height:1.5;color:rgba(255,255,255,.92);font-weight:300;margin:0;max-height:0;opacity:0;overflow:hidden;transition:max-height .5s var(--ease),opacity .4s ease,margin .4s var(--ease),font-size .5s var(--ease);}
        .domain-card--active .domain-desc{max-height:200px;opacity:1;margin-top:.6rem;font-size:.95rem;}

        /* ── DOMAINS CAROUSEL (v2) ── */
        .domains-alt-section{background:#fff;padding:5.5rem 2.5vw;overflow:hidden;}
        .dalt-nav{display:flex;align-items:center;gap:8px;margin-top:2.5rem;max-width:900px;margin-left:auto;margin-right:auto;}
        .dalt-arrow{width:42px;height:42px;border-radius:50%;border:1.5px solid var(--line);background:#fff;color:var(--ink);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .2s,color .2s;}
        .dalt-arrow:hover:not(:disabled){border-color:var(--blue);color:var(--blue);}
        .dalt-arrow:disabled{opacity:.25;cursor:default;}
        .dalt-tabs{display:flex;gap:0;overflow-x:auto;flex:1;scrollbar-width:none;-ms-overflow-style:none;position:relative;padding-bottom:3px;}
        .dalt-tabs::-webkit-scrollbar{display:none;}
        .dalt-tab{white-space:nowrap;padding:10px 16px;font-size:.84rem;border:none;background:none;font-family:var(--sans);cursor:pointer;color:var(--muted);font-weight:400;transition:color .25s ease;letter-spacing:.01em;}
        .dalt-tab:hover{color:var(--ink);}
        .dalt-tab.active{color:var(--ink);font-weight:500;}
        .dalt-indicator{position:absolute;bottom:0;height:2px;background:var(--ink);border-radius:1px;transition:left .4s cubic-bezier(0.33,1,0.68,1),width .4s cubic-bezier(0.33,1,0.68,1);pointer-events:none;}
        .dalt-carousel{width:100%;margin-top:2.5rem;position:relative;height:460px;}
        .dalt-card{position:absolute;left:50%;top:50%;border-radius:4px;overflow:hidden;transition:transform .7s cubic-bezier(0.33,1,0.68,1),opacity .5s ease,width .7s cubic-bezier(0.33,1,0.68,1),height .7s cubic-bezier(0.33,1,0.68,1),box-shadow .5s ease;will-change:transform,opacity,width,height;}
        .dalt-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.05) 45%,transparent 100%);}
        .dalt-card-label{position:absolute;bottom:0;left:0;right:0;padding:1.5rem 1.3rem;transition:opacity .3s ease;}
        .dalt-card-name{font-family:var(--serif);font-weight:500;font-size:1.1rem;line-height:1.2;color:#fff;margin:0;text-shadow:0 1px 10px rgba(0,0,0,0.4);}
        .dalt-active-label{text-align:center;margin-top:.5rem;transition:opacity .35s ease,transform .35s ease;}
        .dalt-active-label span{font-family:var(--serif);font-weight:500;font-size:1.6rem;letter-spacing:-.01em;color:var(--ink);}

        /* ── REVEAL ── */
        .reveal{opacity:0;transform:translateY(20px);transition:opacity .65s var(--ease),transform .65s var(--ease);}
        .reveal.visible{opacity:1;transform:translateY(0);}
        .reveal-d1{transition-delay:.1s;}
        .reveal-d2{transition-delay:.18s;}
        .reveal-d3{transition-delay:.26s;}
        .reveal-d4{transition-delay:.34s;}
        .reveal-d5{transition-delay:.42s;}
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}

        /* ── RESPONSIVE ── */
        @media(max-width:960px){
          .nav-links a:not(.nav-cta){display:none;}
          .nav-cta{padding:.55rem 1.3rem!important;font-size:.78rem!important;white-space:nowrap;}
          .approach-panels{grid-template-columns:1fr;gap:1.8rem;}
          .values-grid{grid-template-columns:1fr;}
          .about-split{grid-template-columns:1fr;gap:3rem;}
          .method-step{grid-template-columns:60px 1fr;}
          .step-arrow{display:none;}
          .svc-tab{font-size:1rem;padding:0 0 14px 0;}
          .svc-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
          .figures-inner{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:2rem;}
          .domains-grid{height:300px;gap:6px;}
          .domain-card--active{flex-grow:2;}
          .dalt-carousel{height:400px;}
          .domains-alt-section{padding:5rem 2.5vw;}
        }
        @media(max-width:600px){
          /* Disable min-height on mobile */
          #services,#domains,#approach,#method{min-height:auto!important;margin-top:0!important;}

          /* Nav */
          nav{padding:0 4vw;height:56px;}
          .logo-mark{width:46px;height:29px;}
          .logo-name{font-size:.68rem;letter-spacing:.24em;}
          .logo-sep{height:13px;}
          .nav-cta{padding:.48rem 1.1rem!important;font-size:.72rem!important;}

          /* Hero */
          .hero{padding:0!important;}
          .hero-h1{font-size:clamp(2rem,8vw,3rem);}
          .hero-inner{padding-top:3rem;padding-bottom:1rem;}
          .hero-ctas{gap:.6rem;}
          .btn-primary,.btn-secondary{padding:.65rem 1.3rem;font-size:.78rem;}
          .hero-tags span{font-size:.72rem;}
          .hero-tags{gap:.35rem 1rem;max-width:340px;margin-left:auto;margin-right:auto;}
          .hero-tags span:not(:last-child)::after{display:none;}
          .hero-content{padding:0 16px;}
          .hero-line-1,.hero-line-2{display:inline!important;}
          .hero-line-1::after{content:' ';}

          /* Sections global */
          .section{padding:3rem 4vw;}
          .section-title{font-size:clamp(1.5rem,5.5vw,2rem);margin-left:0;}
          .section-lede{font-size:1rem;}
          .section-head{margin-bottom:1.5rem;}
          .eyebrow{font-size:.62rem;margin-bottom:.5rem;}

          /* New sections */
          .figures{display:block;padding:2.4rem 4vw 1.6rem;}
          .hero-stats{display:none;}
          .hero-content{padding-bottom:0;}
          .figure{padding-left:.9rem;}
          .svc-grid{grid-template-columns:1fr;}
          .svc-card{padding:1.5rem 1.3rem 1.4rem;}
          .svc-title{font-size:1.35rem;}
          .svc-desc{font-size:.95rem;}
          .team-row{gap:2.2rem;}
          .member-photo{width:132px;}
          .member-name{font-size:1.2rem;margin-top:1rem;}
          #team,#services{padding:3rem 4vw!important;}

          /* Services */
          .svc-tabs{flex-direction:column;gap:0;border-bottom:none;margin-top:1.5rem!important;overflow:visible;}
          .svc-tab{font-size:1rem;padding:10px 0;white-space:nowrap;text-align:left;border-bottom:1px solid var(--line);}
          .svc-tab::after{bottom:0;}
          .svc-tag{font-size:.75rem;padding:6px 14px;}
          .svc-desc{font-size:15px!important;line-height:1.7!important;}
          .svc-panel-anim{padding:32px 0!important;gap:28px!important;}

          /* Ticker */
          .sector-ticker{margin-top:2rem!important;}

          /* Approach */
          .approach-text{padding:1rem 0 0;}
          .approach-title{font-size:1.15rem;}
          .approach-desc{font-size:.9rem;}
          .approach-canvas-wrap{height:120px;}
          .value-card{padding:1.4rem 1.2rem;}
          .value-title{font-size:1.2rem;}
          .value-desc{font-size:.9rem;}
          .value-tag{font-size:.58rem;padding:.15rem .5rem;}

          /* Domains */
          .domains-grid{height:auto;gap:8px;flex-wrap:wrap;}
          .domain-card{flex:1 1 45%!important;aspect-ratio:4/3;}
          .domain-card--shrunk{flex:1 1 45%!important;}
          .domain-card--active{flex:1 1 45%!important;}
          .domain-label{padding:.7rem .7rem;text-align:left;}
          .domain-name{font-size:.85rem;transition:none;white-space:normal;text-align:left;}
          .domain-card--shrunk .domain-name{font-size:.85rem;}
          .domain-card--active .domain-name{font-size:.85rem;}
          .domain-desc{max-height:80px!important;opacity:1!important;margin-top:.2rem!important;font-size:.65rem!important;line-height:1.4!important;text-align:left;}
          .domain-card--active .domain-desc{max-height:80px;opacity:1;margin-top:.2rem;font-size:.65rem;}

          /* Domains carousel */
          .domains-alt-section{padding:3rem 4vw;}
          .dalt-carousel{height:340px;}
          .dalt-arrow{width:36px;height:36px;}
          .dalt-tab{font-size:.72rem;padding:5px 8px;}
          .dalt-active-label span{font-size:1.1rem;}

          /* Method */
          .method-step{grid-template-columns:48px 1fr;gap:1.2rem;padding:1.2rem 0;}
          .step-num{font-size:1.8rem;}
          .step-body h4{font-size:1.15rem;}
          .step-body p{font-size:.88rem;}

          /* Contact */
          .contact-wrap{padding:2.5rem 4vw;}
          .fi,.ft{padding:.75rem 1rem;font-size:.88rem;}
          .submit-btn{padding:.8rem 2rem;font-size:.8rem;}

          /* Footer */
          footer{padding:2.5rem 4vw 2rem;}
          .footer-top{grid-template-columns:1fr;gap:2rem;}
          .footer-links{gap:1.5rem 2.5rem;}
          .footer-bottom{flex-direction:column;align-items:flex-start;gap:.6rem;}
        }
        @media(max-width:480px){
          /* Services */
          .svc-tab{font-size:.9rem;padding:8px 0;}
          .svc-tag{font-size:.65rem;padding:5px 10px;}

          /* Ticker */
          .sector-ticker{padding:.7rem 0;}
          .sector-ticker-item{font-size:.6rem;padding:0 1.2rem;}

          /* Approach */
          .approach-title{font-size:1.05rem;}
          .approach-desc{font-size:.82rem;}
          .value-title{font-size:1.1rem;}
          .value-desc{font-size:.82rem;}

          /* Domains carousel */
          .dalt-carousel{height:300px;}
          .dalt-arrow{width:30px;height:30px;}
          .dalt-tab{font-size:.65rem;padding:4px 6px;}
          .dalt-active-label span{font-size:1rem;}

          /* Method */
          .method-step{grid-template-columns:36px 1fr;gap:1rem;}
          .step-num{font-size:1.5rem;}
          .step-body h4{font-size:1rem;}
          .step-body p{font-size:.78rem;}

          /* Contact */
          .contact-wrap{padding:1.5rem 4vw;}
        }
        @media(max-width:380px){
          .logo-name{display:none;}
          .logo-sep{display:none;}
          .hero-h1{font-size:clamp(1.8rem,7vw,2.4rem);}

          /* Ticker */
          .sector-ticker-item{font-size:.55rem;padding:0 .8rem;}

          /* Domains */
          .domain-card{flex:1 1 45%!important;}
          .domain-card--shrunk{flex:1 1 45%!important;}
          .domain-card--active{flex:1 1 45%!important;}
          .domain-name{font-size:.82rem;}
          .domain-desc{font-size:.65rem!important;}
          .domains-grid{gap:6px;}
          .dalt-carousel{height:260px;}

          /* Services */
          .svc-tab{font-size:.85rem;}
        }
      `}</style>

      {/* NAV */}
      <div className="nav-outer" ref={navRef}>
        <nav>
          <a href="#top" className="logo-wrap" aria-label="Ambroise Partners home">
            <LogoMark className="logo-mark" />
            <span className="logo-name"><span className="logo-l1">Ambroise</span><span className="logo-l2">Partners</span></span>
          </a>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#approach">Approach</a>
            <a href="#domains">Expertise</a>
            <a href="#team">Team</a>
            <a href="#contact" className="nav-cta">Contact us</a>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <header className="hero" id="top" ref={heroRef}>
        <canvas id="hero-canvas" ref={canvasRef} />
        <div className="hero-content">
        <div className="hero-inner">
          <h1 className="hero-h1">
            <span className="hero-line hero-line-1" style={{display:'block'}}>Independent strategic and</span>
            <span className="hero-line hero-line-2" style={{display:'block'}}>financial advisory dedicated</span>
            <span className="hero-line hero-line-3" style={{display:'block'}}><em>to healthcare innovation</em></span>
          </h1>
        </div>
        <div className="hero-bottom">
          <div className="hero-tags">
            <span>M&amp;A Advisory</span><span>Capital Raising</span><span>Partnerships &amp; Licensing</span><span>Corporate Advisory</span>
          </div>
          <div className="hero-ctas">
            <a href="#contact" className="btn-primary">Discuss your project</a>
            <a href="#services" className="btn-secondary">Our services</a>
          </div>
        </div>
        </div>
        <HeroStats />
      </header>

      <FiguresBand />

      {/* SERVICES */}
      <ServicesSection />

      {/* APPROACH */}
      <div style={{ background: 'var(--accent-bg)', width: '100%' }}>
      <section style={{ padding: '4.5rem 2.5vw' }} id="approach">
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="section-head reveal">
          <span className="eyebrow">What sets us apart</span>
          <h2 className="section-title">Our Approach</h2>
          <p className="section-lede">A unique combination of scientific depth, strategic networks and institutional-grade execution; purpose-built for healthcare companies.</p>
        </div>
        <div className="approach-panels">
          <div className="approach-panel reveal">
            <div className="approach-text">
              <div className="approach-title">Scientific &amp; Technical Expertise</div>
              <p className="approach-desc">Advanced medical and scientific training enables the rigorous assessment of complex technologies and the crafting of clear, differentiated equity stories that resonate with specialist investors and strategic partners.</p>
            </div>
            <div className="approach-canvas-wrap"><ScienceArt /></div>
          </div>
          <div className="approach-panel reveal reveal-d1">
            <div className="approach-text">
              <div className="approach-title">Targeted Global Network</div>
              <p className="approach-desc">A curated global network of leading healthcare-focused investors, pharma and medtech corporates, and strategic acquirers worldwide. Developed through years of active involvement in the sector, it provides direct access to the right counterparties and ensures focused, relevant engagement.</p>
            </div>
            <div className="approach-canvas-wrap"><NetworkArt /></div>
          </div>
          <div className="approach-panel reveal reveal-d2">
            <div className="approach-text">
              <div className="approach-title">Execution Excellence</div>
              <p className="approach-desc">The rigour and standards developed over decades within top-tier investment banks, combined with the flexibility and hands-on dedication. Every process is conducted with discipline, discretion and a strong focus on outcomes.</p>
            </div>
            <div className="approach-canvas-wrap"><ExecutionArt /></div>
          </div>
        </div>
      </div>
      </section>
      </div>

      <ExpertiseSection />

      {/* SECTOR TICKER */}
      <div className="sector-ticker">
        <div className="sector-ticker-track">
          {[...Array(2)].map((_, copy) => (
            <div key={copy} className="sector-ticker-set" aria-hidden={copy > 0}>
              {['Oncology','Rare Diseases','Immunology','Neuroscience','Gene Therapy','Cell Therapy','Biologics','Biosimilars','Specialty Pharma','Generics','Vaccines','Radiopharma','Robotics','Diagnostics','AI Health','Digital Therapeutics','CRO','CDMO','OTC'].map((s, i) => (
                <span key={i} className="sector-ticker-item">{s}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* METHOD */}
      <div style={{ background: 'var(--white)', width: '100%' }}>
      <section style={{ padding: '4.5rem 2.5vw' }} id="method">
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="section-head reveal">
          <span className="eyebrow">What drives results</span>
          <h2 className="section-title">Our Proven Process</h2>
          <p className="section-lede">A structured and disciplined approach applied to every mandate, designed to maximise outcomes while ensuring clarity, alignment, and efficiency at every stage.</p>
        </div>
        <div className="method-list">
          {[
            ['01','Strategic Assessment',  'In-depth analysis of positioning, technology, pipeline, competitive landscape and transaction objectives to identify key value drivers and determine the optimal transaction approach.'],
            ['02','Deal Preparation',      'Development of a compelling equity story, detailed business plan and comprehensive financial analyses, together with the preparation of high-quality marketing materials and a fully organised data room.'],
            ['03','Targeted Outreach','Identification and confidential engagement of the most relevant strategic acquirers, financial investors or strategic partners.'],
            ['04','Process Management','End-to-end coordination of due diligence, Q&A sessions and advisor interactions to maintain alignment and execution momentum.'],
            ['05','Closing','Negotiation of final terms and coordination of closing mechanisms through to signature and completion.'],
          ].map(([num,title,copy])=>(
            <div className="method-step reveal" key={num}>
              <div className="step-num">{num}</div>
              <div className="step-body"><h4>{title}</h4><p>{copy}</p></div>
            </div>
          ))}
        </div>
      </div>
      </section>
      </div>

      <TeamSection />

      {/* CONTACT */}
      <div style={{background:'var(--white)'}} id="contact">
        <div className="contact-wrap">
          <div className="reveal">
            <span className="eyebrow">Get in touch</span>
            <h2 className="section-title">Let&apos;s discuss your project</h2>
            <p className="section-lede" style={{margin:'1rem auto 0',textAlign:'center'}}>
              Reach out to explore how we can help you achieve your strategic objectives.
            </p>
          </div>
          <form className="contact-form reveal" onSubmit={handleSubmit}>
            <div><label className="fl">Name</label><input name="name" className="fi" type="text" required placeholder="Your full name"/></div>
            <div><label className="fl">Email</label><input name="email" className="fi" type="email" required placeholder="you@company.com"/></div>
            <div><label className="fl">Subject</label><input name="subject" className="fi" type="text" required placeholder="How can we help?"/></div>
            <div><label className="fl">Message</label><textarea name="message" className="ft" required placeholder="Describe your project…"/></div>
            <label className="fc"><input type="checkbox" required/><span>I agree that my information will be processed to answer my request.</span></label>
            <button type="submit" className={`submit-btn${formStatus === 'success' ? ' submit-btn--ok' : ''}${formStatus === 'error' ? ' submit-btn--err' : ''}`} disabled={sending || formStatus === 'success'}>{sending ? 'Sending...' : formStatus === 'success' ? 'Message sent!' : formStatus === 'error' ? 'Error — try again' : 'Send message'}</button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">

          {/* ── Main grid: brand + links ── */}
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo-wrap">
                <LogoMark className="footer-mark" />
                <span className="footer-brand-name"><span className="logo-l1">Ambroise</span><span className="logo-l2">Partners</span></span>
              </div>
              <p className="footer-brand-desc">
                Healthcare-focused advisory
              </p>
              <div className="footer-contact">
                <span>Paris · London</span>
                <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-col">
                <div className="footer-col-title">Services</div>
                <a href="#services">M&amp;A Advisory</a>
                <a href="#services">Capital Raising</a>
                <a href="#services">Partnerships &amp; Licensing</a>
                <a href="#services">Corporate Advisory</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Company</div>
                <a href="#services">Services</a>
                <a href="#approach">Approach</a>
                <a href="#domains">Expertise</a>
                <a href="#method">Process</a>
                <a href="#team">Team</a>
                    <a href="#contact">Contact</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Legal</div>
                <a href="/legal">Legal notice</a>
                <a href="/privacy">Privacy policy</a>
                <a href="/cookies">Cookie policy</a>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="footer-bottom">
            <div className="footer-copy">© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</div>
            <div className="footer-copy">{COMPANY.legalFormShort} with a share capital of {COMPANY.shareCapital} · {COMPANY.rcs}</div>
          </div>

        </div>
      </footer>
    </>
  );
}
