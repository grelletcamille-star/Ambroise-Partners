'use client';

import { useEffect, useRef, useState, useCallback, useMemo, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { COMPANY } from './lib/company';
import LogoMark from './components/LogoMark';

/* Height of the scroll-driven DNA animation before the page moves on. */
/* The hero is no longer pinned: it scrolls like any section, and the DNA disperses while the
   background lightens over the first half-screen of scroll. Pinning it left a large empty screen
   to scroll through before the next section. */
const HERO_PROGRESS_SHARE = 0.5;

/* ─── Animated illustrations for the three approach pillars ───
   One canvas per pillar: a turning DNA helix, a globe swinging between the Americas and Asia with
   live links from Paris, and a mandate gauge running round its milestones. The loop only runs while the canvas is on screen, and
   draws a single still frame when the visitor prefers reduced motion. */

/* Land mask for the globe: one point every ~4° (lat,lon), generated from Natural Earth 110m
   (world-atlas `land-110m`). 671 points, enough to read the continents at this size. */
const LAND = '-52,-70;-48,-72;-48,-66;-44,-69;-44,170;-40,-70;-40,-65;-40,175;-36,-71;-36,-66;-36,-61;-36,141;-36,146;-32,-67;-32,-62;-32,-57;-32,-53;-32,23;-32,28;-32,117;-32,122;-32,127;-32,136;-32,141;-32,145;-32,150;-28,-67;-28,-62;-28,-58;-28,-53;-28,19;-28,24;-28,28;-28,114;-28,119;-28,124;-28,128;-28,133;-28,137;-28,142;-28,146;-28,151;-24,-66;-24,-62;-24,-57;-24,-53;-24,-49;-24,17;-24,21;-24,26;-24,30;-24,35;-24,118;-24,122;-24,126;-24,131;-24,135;-24,140;-24,144;-24,148;-20,-69;-20,-65;-20,-61;-20,-57;-20,-52;-20,-48;-20,-44;-20,16;-20,20;-20,24;-20,29;-20,33;-20,46;-20,122;-20,126;-20,131;-20,135;-20,139;-20,144;-20,148;-16,-72;-16,-68;-16,-63;-16,-59;-16,-55;-16,-51;-16,-47;-16,-43;-16,16;-16,20;-16,24;-16,28;-16,32;-16,36;-16,49;-16,128;-16,132;-16,136;-16,145;-12,-74;-12,-70;-12,-65;-12,-61;-12,-57;-12,-53;-12,-49;-12,-45;-12,-41;-12,16;-12,20;-12,24;-12,29;-12,33;-12,37;-12,143;-8,-79;-8,-75;-8,-71;-8,-67;-8,-63;-8,-59;-8,-55;-8,-51;-8,-47;-8,-43;-8,-39;-8,14;-8,18;-8,22;-8,26;-8,30;-8,34;-8,38;-8,111;-8,115;-8,139;-8,143;-8,147;-8,159;-4,-80;-4,-76;-4,-72;-4,-68;-4,-64;-4,-60;-4,-56;-4,-52;-4,-48;-4,-44;-4,-40;-4,12;-4,16;-4,20;-4,24;-4,29;-4,33;-4,37;-4,105;-4,137;-4,141;-4,153;0,-80;0,-76;0,-72;0,-68;0,-64;0,-60;0,-56;0,-52;0,12;0,16;0,20;0,24;0,28;0,32;0,36;0,40;0,100;0,112;0,116;0,120;0,128;4,-76;4,-72;4,-68;4,-64;4,-60;4,-56;4,-52;4,12;4,16;4,20;4,24;4,29;4,33;4,37;4,41;4,45;4,97;4,117;8,-75;8,-71;8,-67;8,-63;8,-10;8,-6;8,-2;8,2;8,6;8,10;8,14;8,18;8,22;8,26;8,30;8,34;8,38;8,42;8,46;8,123;12,-86;12,-12;12,-8;12,-4;12,0;12,4;12,8;12,12;12,16;12,20;12,24;12,29;12,33;12,37;12,41;12,78;12,106;16,-97;16,-93;16,-14;16,-9;16,-5;16,-1;16,3;16,7;16,11;16,16;16,20;16,24;16,28;16,32;16,36;16,45;16,49;16,74;16,78;16,95;16,99;16,103;16,107;20,-103;20,-99;20,-14;20,-10;20,-5;20,-1;20,3;20,7;20,12;20,16;20,20;20,24;20,29;20,33;20,41;20,46;20,50;20,54;20,75;20,80;20,84;20,97;20,101;20,105;24,-110;24,-106;24,-101;24,-14;24,-9;24,-5;24,0;24,4;24,8;24,13;24,17;24,21;24,26;24,30;24,35;24,39;24,43;24,48;24,52;24,56;24,70;24,74;24,78;24,83;24,87;24,91;24,96;24,100;24,105;24,109;24,113;24,118;28,-108;28,-103;28,-98;28,-12;28,-8;28,-3;28,1;28,6;28,10;28,15;28,19;28,24;28,28;28,33;28,37;28,42;28,47;28,56;28,60;28,65;28,69;28,74;28,78;28,83;28,87;28,92;28,96;28,101;28,105;28,110;28,114;28,119;32,-114;32,-109;32,-105;32,-100;32,-95;32,-90;32,-86;32,-81;32,-5;32,-1;32,4;32,9;32,13;32,23;32,37;32,42;32,46;32,51;32,56;32,61;32,65;32,70;32,75;32,79;32,84;32,89;32,94;32,98;32,103;32,108;32,112;32,117;32,131;36,-121;36,-116;36,-111;36,-106;36,-101;36,-96;36,-91;36,-86;36,-81;36,-76;36,3;36,8;36,38;36,42;36,47;36,52;36,57;36,62;36,67;36,72;36,77;36,82;36,87;36,92;36,97;36,102;36,107;36,112;36,117;36,127;36,136;40,-123;40,-117;40,-112;40,-107;40,-102;40,-96;40,-91;40,-86;40,-81;40,-76;40,-8;40,-2;40,24;40,29;40,34;40,39;40,45;40,55;40,60;40,65;40,71;40,76;40,81;40,86;40,92;40,97;40,102;40,107;40,112;40,118;40,123;44,-119;44,-113;44,-108;44,-102;44,-97;44,-91;44,-85;44,-80;44,-74;44,4;44,20;44,26;44,42;44,54;44,59;44,65;44,70;44,76;44,81;44,87;44,92;44,98;44,104;44,109;44,115;44,120;44,126;44,131;44,143;48,-120;48,-114;48,-108;48,-102;48,-96;48,-90;48,-84;48,-78;48,-72;48,-66;48,-54;48,-1;48,5;48,11;48,17;48,23;48,29;48,35;48,41;48,47;48,53;48,59;48,65;48,71;48,77;48,83;48,89;48,95;48,101;48,107;48,113;48,119;48,125;48,131;48,137;52,-122;52,-115;52,-109;52,-102;52,-96;52,-89;52,-83;52,-76;52,-70;52,-63;52,-57;52,-5;52,8;52,15;52,21;52,28;52,34;52,41;52,47;52,54;52,60;52,67;52,73;52,80;52,86;52,93;52,99;52,106;52,112;52,119;52,125;52,132;52,138;52,158;56,-159;56,-130;56,-123;56,-116;56,-108;56,-101;56,-94;56,-73;56,-66;56,13;56,27;56,35;56,42;56,49;56,56;56,63;56,70;56,78;56,85;56,92;56,99;56,106;56,113;56,120;56,128;56,135;56,156;60,-164;60,-156;60,-140;60,-132;60,-124;60,-116;60,-108;60,-100;60,-76;60,12;60,36;60,44;60,52;60,60;60,68;60,76;60,84;60,92;60,100;60,108;60,116;60,124;60,132;60,140;60,148;60,164;64,-153;64,-144;64,-134;64,-125;64,-116;64,-107;64,-98;64,-71;64,-43;64,12;64,30;64,39;64,48;64,57;64,66;64,75;64,85;64,94;64,103;64,112;64,121;64,130;64,139;64,148;64,158;64,167;64,176;68,-180;68,-159;68,-148;68,-137;68,-127;68,-116;68,-105;68,-95;68,-84;68,-73;68,-52;68,-41;68,23;68,34;68,44;68,55;68,66;68,76;68,87;68,98;68,108;68,119;68,130;68,140;68,151;68,162;68,172;72,-123;72,-111;72,-100;72,-89;72,-77;72,-54;72,-43;72,-31;72,71;72,83;72,94;72,106;72,117;72,140;76,-100;76,-54;76,-43;76,-31;76,-20;76,60;76,94;76,106;76,140'.split(';').map(p => p.split(',').map(Number) as [number, number]);

/* Healthcare and capital hubs linked from Paris. Real coordinates: the globe projects them, so they
   always sit on the right continent. `side` places the label (0 = dot only, too close to Paris). */
const HUB = { name: 'Paris', lat: 48.86, lon: 2.35 };
const CITIES = [
  { name: 'London', lat: 51.51, lon: -0.13, side: 0, office: true },
  { name: 'Basel', lat: 47.56, lon: 7.59, side: 0 },
  { name: 'Boston', lat: 42.36, lon: -71.06, side: 0 },
  { name: 'New York', lat: 40.71, lon: -74.01, side: 2 },
  { name: 'San Francisco', lat: 37.77, lon: -122.42, side: -1 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69, side: 1 },
  { name: 'Hong Kong', lat: 22.32, lon: 114.17, side: 1 },
  { name: 'Dubai', lat: 25.2, lon: 55.27, side: 1 },
  { name: 'São Paulo', lat: -23.55, lon: -46.63, side: -1 },
];

const NAVY = '3,10,36', BLUE = '42,92,184', SLATE = '91,107,138', FAINT = '213,221,233';
const rgba = (c: string, a: number) => `rgba(${c},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
const D2R = Math.PI / 180;

function ApproachAnim({ type }: { type: 'dna' | 'globe' | 'execution' }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, raf = 0, visible = false, start = 0;
    /* canvas cannot read CSS variables: take the page's resolved font stack instead */
    const SANS = getComputedStyle(document.body).fontFamily || 'sans-serif';

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ── DNA: two strands turning around a horizontal axis ── */
    const drawDna = (t: number) => {
      const x0 = 26, x1 = W - 26, cy = H / 2, A = H * 0.27;
      const k = (Math.PI * 4) / (x1 - x0), w = t * 0.9;
      const rungs = Math.round((x1 - x0) / 13);
      for (let i = 0; i <= rungs; i++) {
        const x = x0 + ((x1 - x0) * i) / rungs, ph = k * (x - x0) + w;
        const ya = cy + A * Math.sin(ph), yb = cy - A * Math.sin(ph);
        ctx.strokeStyle = rgba(FAINT, 0.55 + 0.45 * Math.abs(Math.cos(ph)));
        ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(x, ya); ctx.lineTo(x, yb); ctx.stroke();
      }
      for (const off of [0, Math.PI]) {
        for (let x = x0; x < x1; x += 2) {
          const ph = k * (x - x0) + w + off, ph2 = k * (x + 2 - x0) + w + off;
          const depth = (Math.cos(ph) + 1) / 2; // 1 = front
          ctx.strokeStyle = off === 0 ? rgba(NAVY, 0.25 + 0.75 * depth) : rgba(SLATE, 0.2 + 0.7 * depth);
          ctx.lineWidth = 0.8 + 1.1 * depth;
          ctx.beginPath(); ctx.moveTo(x, cy + A * Math.sin(ph)); ctx.lineTo(x + 2, cy + A * Math.sin(ph2)); ctx.stroke();
        }
      }
      for (let i = 0; i <= rungs; i += 3) {
        const x = x0 + ((x1 - x0) * i) / rungs, ph = k * (x - x0) + w;
        for (const off of [0, Math.PI]) {
          const depth = (Math.cos(ph + off) + 1) / 2;
          if (depth < 0.55) continue;
          ctx.fillStyle = i % 2 ? rgba(BLUE, depth) : rgba(NAVY, depth);
          ctx.beginPath(); ctx.arc(x, cy + A * Math.sin(ph + off), 1.6 + 1.8 * depth, 0, Math.PI * 2); ctx.fill();
        }
      }
    };

    /* ── Globe: orthographic projection, centre swinging between the Americas and Asia ── */
    const drawGlobe = (t: number) => {
      const R = Math.min(H * 0.46, W * 0.26), cx = W / 2, cy = H / 2 + 2;
      const lam0 = (-15 + 75 * Math.sin((t * Math.PI * 2) / 28)) * D2R, phi0 = 38 * D2R;
      const sp0 = Math.sin(phi0), cp0 = Math.cos(phi0);
      const proj = (lat: number, lon: number, lift = 1) => {
        const p = lat * D2R, l = lon * D2R - lam0, cp = Math.cos(p), spp = Math.sin(p);
        const cosc = sp0 * spp + cp0 * cp * Math.cos(l);
        return { x: cx + R * lift * cp * Math.sin(l), y: cy - R * lift * (cp0 * spp - sp0 * cp * Math.cos(l)), z: cosc };
      };
      // sphere
      const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(1, rgba(FAINT, 0.35));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      // graticule
      ctx.strokeStyle = rgba(FAINT, 0.9); ctx.lineWidth = 0.7;
      const line = (pts: { x: number; y: number; z: number }[]) => {
        ctx.beginPath(); let pen = false;
        for (const q of pts) { if (q.z > 0) { if (pen) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); pen = true; } else pen = false; }
        ctx.stroke();
      };
      for (let lon = -180; lon < 180; lon += 30) line(Array.from({ length: 37 }, (_, i) => proj(-90 + i * 5, lon)));
      for (let lat = -60; lat <= 60; lat += 30) line(Array.from({ length: 73 }, (_, i) => proj(lat, -180 + i * 5)));
      // land
      for (const [lat, lon] of LAND) {
        const q = proj(lat, lon);
        if (q.z <= 0) continue;
        ctx.fillStyle = rgba(SLATE, 0.18 + 0.55 * q.z);
        ctx.beginPath(); ctx.arc(q.x, q.y, 0.75 + 0.55 * q.z, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = rgba(NAVY, 0.85); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      // arcs from Paris (great circle, lifted above the surface)
      const hub = proj(HUB.lat, HUB.lon);
      const v = (lat: number, lon: number) => [Math.cos(lat * D2R) * Math.cos(lon * D2R), Math.cos(lat * D2R) * Math.sin(lon * D2R), Math.sin(lat * D2R)];
      const a0 = v(HUB.lat, HUB.lon);
      CITIES.forEach((c, i) => {
        const a1 = v(c.lat, c.lon);
        const om = Math.acos(a0[0] * a1[0] + a0[1] * a1[1] + a0[2] * a1[2]);
        const N = 48, pts: { x: number; y: number; z: number }[] = [];
        for (let j = 0; j <= N; j++) {
          const f = j / N, s1 = Math.sin((1 - f) * om) / Math.sin(om), s2 = Math.sin(f * om) / Math.sin(om);
          const x = s1 * a0[0] + s2 * a1[0], y = s1 * a0[1] + s2 * a1[1], z = s1 * a0[2] + s2 * a1[2];
          const lat = Math.asin(z) / D2R, lon = Math.atan2(y, x) / D2R;
          pts.push(proj(lat, lon, 1 + (0.05 + Math.min(0.13, om * 0.12)) * Math.sin(Math.PI * f)));
        }
        const end = proj(c.lat, c.lon);
        const vis = Math.min(hub.z, end.z);
        if (vis > -0.05) {
          ctx.setLineDash([3, 3]); ctx.lineDashOffset = -t * 14;
          ctx.strokeStyle = rgba(BLUE, 0.35 + 0.6 * Math.max(0, vis)); ctx.lineWidth = 1.3;
          ctx.beginPath(); let pen = false;
          for (const q of pts) { if (q.z > 0) { if (pen) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); pen = true; } else pen = false; }
          ctx.stroke(); ctx.setLineDash([]);
          // travelling pulse
          const f = (t * 0.32 + i * 0.19) % 1, q = pts[Math.round(f * N)];
          if (q.z > 0) { ctx.fillStyle = rgba(BLUE, 0.9 * Math.max(0, vis)); ctx.beginPath(); ctx.arc(q.x, q.y, 1.8, 0, Math.PI * 2); ctx.fill(); }
        }
        if (end.z > 0) {
          /* London is the firm's second office: same navy as Paris */
          ctx.fillStyle = 'office' in c ? rgba(NAVY, 0.4 + 0.6 * end.z) : rgba(BLUE, 0.35 + 0.65 * end.z);
          ctx.beginPath(); ctx.arc(end.x, end.y, 'office' in c ? 3 : 2.6, 0, Math.PI * 2); ctx.fill();
          if (c.side !== 0 && end.z > 0.18) {
            ctx.font = `500 9px ${SANS}`;
            ctx.fillStyle = rgba('95,95,95', Math.min(1, (end.z - 0.18) * 3));
            /* side: -1 label on the left, 1 on the right, 2 underneath (New York, which sits close to Paris) */
            ctx.textAlign = c.side === 2 ? 'center' : c.side > 0 ? 'left' : 'right';
            if (c.side === 2) ctx.fillText(c.name, end.x, end.y + 13);
            else ctx.fillText(c.name, end.x + c.side * 6, end.y + ('office' in c ? 6 : 3));
          }
        }
      });
      if (hub.z > 0) {
        ctx.fillStyle = rgba(BLUE, 0.18); ctx.beginPath(); ctx.arc(hub.x, hub.y, 6 + 2 * Math.sin(t * 2.4), 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = rgba(NAVY, 1); ctx.beginPath(); ctx.arc(hub.x, hub.y, 3.6, 0, Math.PI * 2); ctx.fill();
        ctx.font = `600 9px ${SANS}`; ctx.fillStyle = rgba(NAVY, Math.min(1, hub.z * 3)); ctx.textAlign = 'center';
        /* Paris and London sit a few pixels apart: one label for the two offices */
        ctx.fillText('Paris · London', hub.x, hub.y - 9);
      }
    };

    /* ── Execution: a mandate running to completion. The arc sweeps round, each milestone lights up as
       it is passed, a check closes the cycle, then it starts again. ── */
    const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
    const MILESTONES = ['Mandate', 'Preparation', 'Outreach', 'Due diligence', 'Closing'], CYCLE = 7.5;
    const drawExecution = (t: number) => {
      const cx = W / 2, cy = H / 2 + 6, R = Math.min(H * 0.31, W * 0.17);
      const tc = t % CYCLE, p = ease(tc / 4.2), fade = tc > 6.6 ? 1 - (tc - 6.6) / 0.9 : 1;
      const a0 = -Math.PI / 2;
      // track + progress
      ctx.strokeStyle = rgba(FAINT, 1); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = rgba(NAVY, 0.9 * fade); ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx, cy, R, a0, a0 + Math.PI * 2 * p); ctx.stroke(); ctx.lineCap = 'butt';
      // milestones
      ctx.font = `500 9px ${SANS}`; ctx.textBaseline = 'middle';
      for (let i = 0; i < MILESTONES.length; i++) {
        const f = i / MILESTONES.length, a = a0 + Math.PI * 2 * f, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        const lit = p >= f - 0.001, since = (p - f) * 4.2;
        if (lit && since < 0.8) { ctx.fillStyle = rgba(BLUE, 0.25 * (1 - since / 0.8) * fade); ctx.beginPath(); ctx.arc(x, y, 5 + 10 * since, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = lit ? rgba(BLUE, fade) : '#fff';
        ctx.strokeStyle = lit ? rgba(BLUE, fade) : rgba(SLATE, 0.8); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const lx = cx + (R + 12) * Math.cos(a), ly = cy + (R + 12) * Math.sin(a);
        ctx.textAlign = Math.abs(Math.cos(a)) < 0.2 ? 'center' : Math.cos(a) > 0 ? 'left' : 'right';
        ctx.fillStyle = lit ? rgba(NAVY, 0.55 + 0.45 * fade) : rgba('95,95,95', 0.7);
        ctx.fillText(MILESTONES[i], lx, Math.abs(Math.cos(a)) < 0.2 ? ly - 4 : ly);
      }
      ctx.textBaseline = 'alphabetic';
      // centre: check once the cycle closes
      const c = ease((tc - 4.3) / 0.5) * fade;
      ctx.fillStyle = rgba(NAVY, c); ctx.beginPath(); ctx.arc(cx, cy, R * 0.42 * (0.7 + 0.3 * c), 0, Math.PI * 2); ctx.fill();
      if (c > 0.05) {
        const k = R * 0.16;
        ctx.strokeStyle = rgba('255,255,255', c); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(cx - k, cy); ctx.lineTo(cx - k * 0.3, cy + k * 0.7); ctx.lineTo(cx + k * 1.05, cy - k * 0.75); ctx.stroke();
        ctx.lineCap = 'butt';
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      if (type === 'dna') drawDna(t); else if (type === 'globe') drawGlobe(t); else drawExecution(t);
    };
    const loop = (now: number) => {
      if (!start) start = now;
      draw((now - start) / 1000);
      if (visible) raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(() => { resize(); if (still) draw(8); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      if (still) { draw(8); return; }
      if (e.isIntersecting && !visible) { visible = true; raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting) { visible = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.15 });
    io.observe(canvas);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [type]);

  return <canvas ref={ref} className="approach-anim" aria-hidden="true" />;
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
    <section id="domains" style={{ background: 'var(--accent-bg)', padding: '4.5rem 2.5vw 3rem' }}>
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
        {/* Sectors, right under the photos and on the same light background */}
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
    </section>
  );
}

/* ─── Services Section ─── */
/* Four service lines, same names everywhere (hero, cards, footer, deck). */
/* Line icons (24×24, stroke) for the four business lines */
const SVC_ICONS: Record<string, ReactNode> = {
  ma: <><circle cx="9" cy="12" r="5.5" /><circle cx="15" cy="12" r="5.5" /></>,
  capital: <><path d="M3 17l6-6 4 4 7-7" /><path d="M14 8h6v6" /></>,
  licensing: <><rect x="2.5" y="9" width="11" height="6" rx="3" /><rect x="10.5" y="9" width="11" height="6" rx="3" /></>,
  advisory: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
};

const SERVICES = [
  { id: 'ma', title: 'M&A Advisory', description: 'Sell-side, buy-side and transaction advisory across the global healthcare ecosystem. We design and manage disciplined processes focused on value maximisation and execution certainty.', tags: ['Sell-side', 'Buy-side', 'Carve-outs', 'Cross-border'] },
  { id: 'capital', title: 'Capital Raising', description: 'Equity financings from seed to growth stage and public markets. We identify the specialist healthcare investors, venture, growth and private equity funds, best placed to secure the right capital at the right valuation.', tags: ['Series A–D', 'Growth Equity', 'Private Placements', 'IPO & Follow-on'] },
  { id: 'licensing', title: 'Partnerships & Licensing', description: 'Identification, negotiation and structuring of licensing agreements, co-development partnerships and commercial collaborations with pharma and medtech corporates.', tags: ['Licensing', 'Co‑development', 'Commercialisation', 'JVs'] },
  { id: 'advisory', title: 'Corporate Advisory', description: 'Independent strategic advice to management teams and boards on financing strategy, business development, portfolio and capital structure, tailored to each stage of a company’s lifecycle.', tags: ['Strategy', 'Valuation', 'Governance', 'Investor Relations'] },
];

function ServicesSection() {
  return (
    <section id="services" style={{ background: 'var(--accent-bg)', padding: '4.5rem 2.5vw' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="section-head reveal">
          <span className="eyebrow">What we do</span>
          <h2 className="section-title">Our Services</h2>
          <p className="section-lede">We partner with healthcare companies at every stage, delivering tailored strategic and transactional advisory.</p>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s, i) => (
            <article key={s.id} className={`svc-card reveal reveal-d${i + 1}`}>
              <div className="svc-top">
                <span className="svc-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{SVC_ICONS[s.id]}</svg>
                </span>
                <span className="svc-num">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.description}</p>
              <ul className="svc-tags" aria-label={`${s.title} services`}>
                {s.tags.map(tag => <li key={tag}>{tag}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Key figures (shown under the team) ─── */
const FIGURES = [
  { value: '$90bn+', label: 'transaction value advised' },
  { value: '15+', label: 'years in healthcare investment banking' },
  { value: '100+', label: 'healthcare companies advised' },
];

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
      {/* Key figures, under the team they belong to */}
      <div className="team-figures reveal">
        {FIGURES.map(f => (
          <div key={f.label} className="team-figure">
            <span className="team-figure-value">{f.value}</span>
            <span className="team-figure-label">{f.label}</span>
          </div>
        ))}
      </div>
      <p className="team-figures-note">Including transactions executed by team members in previous roles.</p>
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
    const PARTICLE_COUNT = isMobile ? 18000 : 40000;
    let W = 0, H = 0, scrollProgress = 0, raf = 0;

    let fadeEl: HTMLElement | null = null;

    /* Hero height — update on resize so the animation always fills the viewport */
    let lastW = window.innerWidth;
    const updateHeroH = () => {
      const h = window.innerHeight;
      hero.style.height = `${h}px`;
      hero.style.minHeight = `${h}px`;
      wrapper.style.height = `${h}px`;
    };

    const wrapper = document.createElement('div');
    wrapper.id = 'hero-wrapper';
    wrapper.style.cssText = `position:relative;height:${window.innerHeight}px;`;
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
      /* The helix runs up the right-hand side, clear of the centred headline (it used to cross it). */
      const SX0 = W*0.66, SY0 = H*1.04;
      const SX1 = W*1.02, SY1 = -H*0.04;
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
        /* The DNA disperses while the hero lightens from navy to slate to the next section's light
           background, so the two meet without a seam as Services comes up. The particles are drawn
           above that gradient (canvas z-index 2), so the scattered dots stay visible on the way down. */
        const fadeOpacity = Math.min(Math.max(scrollProgress / 0.4, 0), 1);
        fadeEl.style.opacity = String(fadeOpacity);
        /* Fade the headline and tags out before the background turns light */
        const contentOpacity = String(Math.max(0, 1 - fadeOpacity * 1.6));
        if (heroContent) heroContent.style.opacity = contentOpacity;
      }
      raf=requestAnimationFrame(animate);
    }

    const onScroll=()=>{ scrollProgress=Math.min(Math.max(window.scrollY/(window.innerHeight*HERO_PROGRESS_SHARE),0),1); };
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
        /* Type scale: two families (Lora for headings, DM Sans for text), two weights each, six sizes */
        :root{--fs-display:clamp(2.8rem,4.8vw,4.6rem);--fs-h2:clamp(1.8rem,2.6vw,2.4rem);--fs-h3:1.25rem;--fs-lead:1.08rem;--fs-body:.98rem;--fs-small:.875rem;--fs-xs:.75rem;
          /* one corner radius for every box (cards, photos, fields); buttons stay pill-shaped */
          --radius:8px;}
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
        body{font-family:var(--sans);background:var(--white);color:var(--ink);overflow-x:hidden;font-size:var(--fs-body);line-height:1.65;-webkit-font-smoothing:antialiased;}
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
        .logo-ap{font-family:var(--serif);font-weight:400;font-size:var(--fs-h3);letter-spacing:-.01em;color:#fff;transition:color .35s;}
        .logo-sep{width:1px;height:16px;background:rgba(255,255,255,0.25);transition:background .35s;}
        .logo-name{display:flex;flex-direction:column;gap:4px;font-size:var(--fs-xs);letter-spacing:.28em;text-transform:uppercase;line-height:1;color:#fff;transition:color .35s;}
        .logo-l1{font-weight:500;}
        .logo-l2{font-weight:400;}
        .logo-mark{width:37px;height:35px;color:#fff;flex-shrink:0;transition:color .35s;}
        .nav-scrolled .logo-mark{color:var(--navy);}
        .nav-scrolled .logo-name{color:var(--navy);}
        .nav-links{display:flex;gap:1.2rem;align-items:center;}
        .nav-links a{font-size:var(--fs-small);font-weight:500;color:#fff;padding:.5rem 1rem;transition:color .18s;letter-spacing:.02em;}
        .nav-links a:hover{color:#fff;}
        .nav-cta{
          margin-left:.5rem;
          background:#fff!important;color:var(--ink)!important;
          padding:.5rem 1.15rem!important;border-radius:9999px;
          display:inline-flex;align-items:center;justify-content:center;
          font-size:var(--fs-small)!important;font-weight:500!important;
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
        #hero-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;}
        /* Muted navy → slate → the light background of the next section (a saturated blue looked loud) */
        #hero-fade{
          position:absolute;inset:0;z-index:1;pointer-events:none;
          background:linear-gradient(to top,
            #f7fbfe 0%,
            #eef2f8 3%,
            #dde4ef 7%,
            #c6d0e0 11%,
            #a6b3ca 16%,
            #8292b0 21%,
            #627497 26%,
            #485a7e 31%,
            #334566 36%,
            #213252 42%,
            #142240 48%,
            #0a1530 53%,
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
          font-family:var(--serif);font-weight:400;
          font-size:var(--fs-display);
          line-height:1.06;letter-spacing:-.015em;margin-bottom:1.4rem;
          max-width:100%;margin-left:auto;margin-right:auto;
          opacity:0;animation:fadeUp .9s .3s var(--ease) forwards;
        }
        .hero-h1 strong{
          display:block;font-family:var(--serif);font-weight:400;font-style:italic;
          font-size:clamp(3.2rem,5.5vw,5.2rem);line-height:1.08;letter-spacing:-.02em;
        }
        .hero-tags{
          display:flex;gap:.4rem;flex-wrap:wrap;justify-content:center;
          margin:1.4rem 0 1.2rem;
          opacity:0;animation:fadeUp .9s .45s var(--ease) forwards;
        }
        .hero-tags span{
          position:relative;font-size:var(--fs-body);font-weight:500;letter-spacing:.06em;
          color:#fff;padding:0 .2rem;
        }
        .hero-tags span:not(:last-child)::after{
          content:'';display:inline-block;width:1px;height:14px;
          background:rgba(255,255,255,.5);margin:0 .65rem;
          position:relative;top:2px;
        }
        .hero-sub{font-size:var(--fs-body);color:rgba(255,255,255,.58);max-width:42ch;margin:0 0 1.8rem;font-weight:400;line-height:1.72;opacity:0;animation:fadeUp .9s .6s var(--ease) forwards;}
        .btn-primary{background:#fff;color:var(--ink);padding:.85rem 2rem;border-radius:100px;font-size:var(--fs-small);font-weight:500;letter-spacing:.01em;transition:transform .22s var(--ease),box-shadow .22s;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.25);}
        .btn-secondary{background:transparent;color:rgba(255,255,255,.88);padding:.85rem 2rem;border-radius:100px;font-size:var(--fs-small);font-weight:400;letter-spacing:.01em;border:1px solid rgba(255,255,255,.28);transition:border-color .2s,background .2s;}
        .btn-secondary:hover{border-color:rgba(255,255,255,.55);background:rgba(255,255,255,.07);}
        .hero-footnote{margin-top:1.2rem;font-size:var(--fs-xs);color:rgba(255,255,255,.38);font-weight:400;opacity:0;animation:fadeUp .9s .9s var(--ease) forwards;}

        .hero-content{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;will-change:opacity;}
        .hero-bottom{display:flex;flex-direction:column;align-items:center;gap:1.4rem;}
        .hero-tags span{text-shadow:0 1px 12px rgba(3,10,36,.6);}

        /* ── KEY FIGURES ── */
        #services{position:relative;z-index:3;}

        /* ── SERVICES CARDS ── */
        .svc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem;}
        .svc-card{display:flex;flex-direction:column;gap:.9rem;border:1px solid var(--line);border-radius:var(--radius);padding:1.6rem 1.4rem 1.5rem;background:#fff;transition:border-color .25s,box-shadow .25s;}
        .svc-card{position:relative;overflow:hidden;}
        .svc-card::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--navy),var(--blue));transform:scaleX(0);transform-origin:left;transition:transform .45s var(--ease);}
        .svc-card:hover{border-color:#c9d3e3;box-shadow:0 18px 40px rgba(3,10,36,.09);}
        .svc-card.visible:hover{transform:translateY(-4px);}
        .svc-card:hover::before{transform:scaleX(1);}
        .svc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:.4rem;}
        .svc-icon{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#eaf0f8;color:var(--navy);transition:background .3s,color .3s;}
        .svc-card:hover .svc-icon{background:var(--navy);color:#fff;}
        .svc-num{font-family:var(--sans);font-size:var(--fs-xs);font-weight:500;letter-spacing:.08em;color:var(--blue);}
        .svc-title{font-family:var(--serif);font-weight:400;font-size:var(--fs-h3);letter-spacing:-.01em;line-height:1.15;}
        .svc-desc{color:var(--muted);font-size:var(--fs-body);line-height:1.65;font-weight:400;flex-grow:1;}
        .svc-tags{display:flex;flex-wrap:wrap;list-style:none;padding-top:.9rem;border-top:1px solid var(--line);font-size:var(--fs-xs);color:var(--muted);line-height:1.8;}
        .svc-tags li:not(:last-child)::after{content:'·';margin:0 .45rem;color:#b5bfcf;}

        /* ── TEAM ── */
        .team-sec{background:var(--navy);color:#fff;padding:4.5rem 2.5vw 4.8rem;}
        .team-head{text-align:center;max-width:820px;margin:0 auto 2.8rem;}
        .team-sec .eyebrow{color:rgba(255,255,255,.6);}
        .team-sec .section-title{color:#fff;margin-left:0;}
        .team-figures{display:flex;justify-content:center;gap:clamp(2.5rem,7vw,6rem);max-width:900px;margin:3.2rem auto 0;padding-top:2.2rem;border-top:1px solid rgba(255,255,255,.12);text-align:center;}
        .team-figure{display:flex;flex-direction:column;gap:.3rem;}
        .team-figure-value{font-family:var(--serif);font-size:var(--fs-h2);line-height:1;color:#fff;}
        .team-figure-label{font-size:var(--fs-xs);color:rgba(255,255,255,.6);}
        .team-figures-note{text-align:center;margin-top:1.2rem;font-size:var(--fs-xs);color:rgba(255,255,255,.4);}
        .team-row{display:flex;justify-content:center;gap:clamp(3rem,9vw,8rem);flex-wrap:wrap;}
        .member{display:flex;flex-direction:column;align-items:center;text-align:center;}
        .member-photo{width:clamp(150px,13vw,190px);height:auto;aspect-ratio:1;border-radius:50%;object-fit:cover;box-shadow:0 0 0 6px rgba(255,255,255,.06);}
        .member-name{font-family:var(--serif);font-weight:400;font-size:var(--fs-h3);letter-spacing:-.01em;margin-top:1.3rem;}
        .member-role{font-size:var(--fs-xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-top:.35rem;}
        .member-link{display:inline-flex;align-items:center;gap:.4rem;margin-top:.8rem;font-size:var(--fs-small);font-weight:500;color:rgba(255,255,255,.75);transition:color .2s;}
        .member-link:hover{color:#fff;}

        /* ── SECTIONS ── */
        .section{max-width:1200px;margin:0 auto;padding:7rem 2.5vw;color:var(--ink);}
        .section-bg{background:var(--white);}
        .eyebrow{display:block;font-family:var(--sans);font-size:var(--fs-xs);font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.4rem;}
        .section-title{font-family:var(--serif);font-weight:400;font-size:var(--fs-h2);line-height:1.1;letter-spacing:-.02em;margin-bottom:.3rem;margin-left:-.05em;}
        .section-lede{font-family:var(--sans);color:var(--muted);font-size:var(--fs-lead);max-width:100%;font-weight:400;line-height:1.65;letter-spacing:-.01em;}
        .section-head{margin-bottom:2rem;}

        /* ── APPROACH ── */
        .approach-panels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2.4rem;}
        .approach-panel{display:flex;flex-direction:column;background:transparent;}
        .approach-panel+.approach-panel .approach-text{border-top:none;}
        .approach-text{padding:1.2rem 0 0;display:flex;flex-direction:column;justify-content:center;border-right:none;}
        .approach-num{font-family:var(--serif);font-style:italic;font-size:var(--fs-body);color:#162d50;margin-bottom:.8rem;display:block;}
        .approach-title{font-family:var(--serif);font-weight:400;font-size:var(--fs-h3);letter-spacing:-.01em;margin-bottom:.7rem;line-height:1.15;}
        .approach-desc{color:var(--muted);font-size:var(--fs-body);line-height:1.65;font-weight:400;}
        .approach-canvas-wrap{order:-1;background:transparent;overflow:hidden;position:relative;height:clamp(120px,15vh,160px);border-bottom:1px solid var(--line);}

        .approach-anim{position:absolute;inset:0;width:100%;height:100%;display:block;}

        /* ── VALUES ── */
        .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#fff;}
        .value-card{background:var(--accent-bg);padding:1.8rem 1.6rem;transition:background .25s;}
        .value-card:hover{background:#e8ecf2;}
        .value-tag{display:inline-block;font-size:.65rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);border:1px solid var(--blue);padding:.2rem .6rem;border-radius:100px;margin-bottom:.8rem;}
        .value-title{font-family:var(--serif);font-weight:400;font-size:var(--fs-h3);letter-spacing:-.01em;margin-bottom:.6rem;line-height:1.2;}
        .value-desc{color:var(--muted);font-size:var(--fs-body);line-height:1.7;font-weight:400;}

        /* ── METHOD ── */
        .method-list{border-top:1px solid var(--line);}
        .method-step{display:grid;grid-template-columns:70px 1fr;align-items:center;gap:1rem;padding:.55rem 0;border-bottom:1px solid var(--line);}
        .step-num{font-family:var(--serif);font-style:normal;font-size:var(--fs-h3);color:#162d50;font-weight:400;letter-spacing:-.02em;}
        .step-body h4{font-family:var(--serif);font-weight:400;font-size:var(--fs-h3);letter-spacing:-.01em;margin-bottom:.3rem;}
        .step-body p{color:var(--muted);font-size:var(--fs-body);line-height:1.6;font-weight:400;}

        /* ── ABOUT ── */
        .about-split{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start;}
        .about-lede{color:var(--muted);font-size:var(--fs-body);line-height:1.7;margin-top:1.2rem;font-weight:400;letter-spacing:-.01em;}
        .about-links{display:flex;gap:1rem;margin-top:2.5rem;flex-wrap:wrap;}
        .btn-dark{background:var(--navy);color:#fff;padding:.9rem 2rem;border-radius:100px;font-size:var(--fs-xs);font-weight:500;letter-spacing:.04em;transition:background .22s,transform .2s,box-shadow .22s;}
        .btn-dark:hover{background:var(--navy-hover);transform:translateY(-2px);box-shadow:0 10px 26px rgba(3,10,36,.2);}
        .btn-outline{display:inline-flex;align-items:center;white-space:nowrap;border:1.5px solid #cfd5df;color:var(--ink);padding:.8rem 1.7rem;border-radius:100px;font-size:var(--fs-xs);font-weight:500;letter-spacing:.04em;transition:border-color .22s,color .22s;}
        .btn-outline:hover{border-color:var(--blue);color:var(--blue);}
        .about-dark{background:var(--dark);border-radius:var(--radius);padding:3.5rem 3rem;color:#fff;position:relative;overflow:hidden;}
        .about-dark-label{font-family:var(--serif);font-weight:400;font-size:var(--fs-h3);letter-spacing:-.01em;margin-bottom:1.5rem;position:relative;}
        .about-dark::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;background:radial-gradient(circle,rgba(3,10,36,.22) 0%,transparent 70%);border-radius:50%;}

        /* ── CONTACT ── */
        .form-msg{text-align:center;padding:1rem 1.5rem;border-radius:var(--radius);font-family:var(--sans);font-size:var(--fs-small);font-weight:400;animation:svcFadeUp .4s ease both;}
        .form-msg--ok{background:#f0faf0;color:#1a7a2e;border:1px solid #c3e6c3;}
        .form-msg--err{background:#fdf0f0;color:#a12;border:1px solid #e6c3c3;}
        .submit-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}
        .contact-wrap{max-width:700px;margin:0 auto;padding:3.5rem 2.5vw;text-align:center;display:flex;flex-direction:column;align-items:center;}
        .contact-form{margin-top:2rem;text-align:left;display:flex;flex-direction:column;gap:.9rem;width:100%;max-width:600px;}
        .fl{display:block;font-size:var(--fs-xs);font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.45rem;}
        .fi,.ft{width:100%;background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:.9rem 1.15rem;font-family:var(--sans);font-size:var(--fs-body);color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s;}
        .fi:focus,.ft:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(3,10,36,.1);}
        .ft{min-height:90px;resize:vertical;}
        .fc{display:flex;gap:.7rem;align-items:flex-start;font-size:var(--fs-xs);color:var(--muted);cursor:pointer;line-height:1.55;font-weight:400;}
        .fc input{margin-top:3px;flex-shrink:0;accent-color:var(--blue);}
        .submit-btn{align-self:center;background:var(--navy);color:#fff;border:1.5px solid var(--navy);padding:1rem 3rem;border-radius:9999px;font-family:var(--sans);font-size:var(--fs-small);font-weight:500;letter-spacing:.02em;cursor:pointer;transition:background .22s,transform .2s,box-shadow .22s,color .22s,border-color .22s;}
        .submit-btn:hover{background:var(--navy-hover);border-color:var(--navy-hover);transform:translateY(-2px);box-shadow:0 10px 28px rgba(3,10,36,.2);}

        /* ── SERVICES TABS ── */
        .svc-tabs{display:flex;border-bottom:1px solid var(--line);justify-content:space-between;overflow:hidden;margin-top:4.5rem;}
        .svc-tab{cursor:pointer;position:relative;padding:0 0 20px 0;background:none;border:none;outline:none;-webkit-appearance:none;appearance:none;white-space:nowrap;font-family:var(--serif);font-size:var(--fs-h3);font-weight:400;color:var(--muted);letter-spacing:-.01em;transition:color .35s ease;}
        .svc-tab::after{content:'';position:absolute;bottom:-1.5px;left:0;width:100%;height:2px;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(0.25,0.1,0.25,1);}
        .svc-tab:hover{color:var(--ink);}
        .svc-tab:hover::after{transform:scaleX(1);}
        .svc-tab--active{color:var(--ink);}
        .svc-tab--active::after{transform:scaleX(1);}
        .svc-panel-anim{animation:svcFadeUp .4s cubic-bezier(0.25,0.1,0.25,1) forwards;}
        @keyframes svcFadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}

        /* ── SECTOR TICKER ── */
        .sector-ticker{background:transparent;border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;padding:.6rem 0;margin:1.6rem -2.5vw 0;white-space:nowrap;}
        .sector-ticker-track{display:flex;width:max-content;animation:tickerScroll 180s linear infinite;}
        .sector-ticker-set{display:flex;gap:0;flex-shrink:0;}
        .sector-ticker-item{font-size:var(--fs-xs);font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--ink);padding:0 2.8rem;opacity:1;display:flex;align-items:center;gap:.7rem;}
        .sector-ticker-item::before{content:'';width:4px;height:4px;border-radius:50%;border:1px solid #162d50;flex-shrink:0;}
        @keyframes tickerScroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

        /* ── FOOTER ── */
        footer{background:#030a24;color:#fff;padding:3rem 2.5vw 2rem;}
        .footer-inner{max-width:1200px;margin:0 auto;}

        .footer-top{display:grid;grid-template-columns:1fr auto;gap:4rem;padding-bottom:2rem;border-bottom:1px solid rgba(255,255,255,.08);align-items:start;}
        .footer-logo-wrap{display:flex;align-items:center;gap:.7rem;margin-bottom:.8rem;}
        .footer-logo{font-family:var(--serif);font-weight:400;font-size:var(--fs-h3);color:#fff;letter-spacing:-.01em;}
        .footer-logo-sep{width:1px;height:14px;background:rgba(255,255,255,.25);}
        .footer-brand-name{display:flex;flex-direction:column;gap:4px;font-size:var(--fs-xs);letter-spacing:.28em;text-transform:uppercase;line-height:1;color:#fff;}
        .footer-mark{width:36px;height:34px;color:#fff;flex-shrink:0;}
        .footer-brand-desc{font-size:var(--fs-small);line-height:1.7;color:rgba(255,255,255,.72);font-weight:400;max-width:28ch;margin-bottom:1rem;}
        .footer-contact{display:flex;flex-direction:column;gap:.3rem;}
        .footer-contact a,.footer-contact span{font-size:var(--fs-xs);color:rgba(255,255,255,.72);font-weight:400;transition:color .18s;}
        .footer-contact a:hover{color:#fff;}

        .footer-links{display:flex;gap:3.5rem;flex-wrap:wrap;}
        .footer-col-title{font-size:.65rem;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-bottom:.9rem;}
        .footer-col a{display:block;font-size:var(--fs-small);color:rgba(255,255,255,.75);margin-bottom:.55rem;transition:color .18s;font-weight:400;}
        .footer-col a:hover{color:#fff;}

        .footer-bottom{padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8rem;}
        .footer-copy{font-size:var(--fs-xs);color:rgba(255,255,255,.6);letter-spacing:.03em;}

        /* ── DOMAINS GRID ── */
        .domains-grid{display:flex;gap:6px;height:clamp(260px,40vh,360px);}
        .domain-card{position:relative;border-radius:var(--radius);overflow:hidden;flex-grow:1;flex-shrink:1;flex-basis:0;min-width:0;cursor:pointer;transition:flex-grow .5s var(--ease),flex-shrink .5s var(--ease),box-shadow .4s ease;}
        .domain-card--shrunk{flex-grow:.7;flex-shrink:1;}
        .domain-card--active{flex-grow:2;flex-shrink:0;box-shadow:0 12px 30px rgba(0,0,0,.18);}
        .domain-img{position:absolute;inset:0;transition:transform .55s cubic-bezier(0.16,1,0.3,1);}
                .domain-card--active .domain-img{transform:scale(1.03);}
        .domain-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.05) 50%,transparent 100%);transition:background .35s ease;}
        .domain-card--active .domain-overlay{background:linear-gradient(to top,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.08) 60%,transparent 100%);}
        .domain-label{position:absolute;bottom:0;left:0;right:0;padding:.9rem 1rem;transition:padding .5s var(--ease);}
        .domain-card--active .domain-label{padding:1.4rem 1.6rem;}
        .domain-num{display:none;}
        .domain-name{font-family:var(--serif);font-weight:400;font-size:var(--fs-h3);line-height:1.2;letter-spacing:-0.01em;color:#fff;margin:0;text-shadow:0 1px 10px rgba(0,0,0,0.4);white-space:nowrap;transition:font-size .5s var(--ease);}
        .domain-card--shrunk .domain-name{font-size:var(--fs-xs);}
        .domain-card--active .domain-name{font-size:var(--fs-h3);}
        .domain-desc{font-family:var(--sans);font-size:0rem;line-height:1.5;color:rgba(255,255,255,.92);font-weight:400;margin:0;max-height:0;opacity:0;overflow:hidden;transition:max-height .5s var(--ease),opacity .4s ease,margin .4s var(--ease),font-size .5s var(--ease);}
        .domain-card--active .domain-desc{max-height:200px;opacity:1;margin-top:.6rem;font-size:var(--fs-body);}

        /* ── DOMAINS CAROUSEL (v2) ── */
        .domains-alt-section{background:#fff;padding:5.5rem 2.5vw;overflow:hidden;}
        .dalt-nav{display:flex;align-items:center;gap:8px;margin-top:2.5rem;max-width:900px;margin-left:auto;margin-right:auto;}
        .dalt-arrow{width:42px;height:42px;border-radius:50%;border:1.5px solid var(--line);background:#fff;color:var(--ink);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .2s,color .2s;}
        .dalt-arrow:hover:not(:disabled){border-color:var(--blue);color:var(--blue);}
        .dalt-arrow:disabled{opacity:.25;cursor:default;}
        .dalt-tabs{display:flex;gap:0;overflow-x:auto;flex:1;scrollbar-width:none;-ms-overflow-style:none;position:relative;padding-bottom:3px;}
        .dalt-tabs::-webkit-scrollbar{display:none;}
        .dalt-tab{white-space:nowrap;padding:10px 16px;font-size:var(--fs-small);border:none;background:none;font-family:var(--sans);cursor:pointer;color:var(--muted);font-weight:400;transition:color .25s ease;letter-spacing:.01em;}
        .dalt-tab:hover{color:var(--ink);}
        .dalt-tab.active{color:var(--ink);font-weight:500;}
        .dalt-indicator{position:absolute;bottom:0;height:2px;background:var(--ink);border-radius:1px;transition:left .4s cubic-bezier(0.33,1,0.68,1),width .4s cubic-bezier(0.33,1,0.68,1);pointer-events:none;}
        .dalt-carousel{width:100%;margin-top:2.5rem;position:relative;height:460px;}
        .dalt-card{position:absolute;left:50%;top:50%;border-radius:var(--radius);overflow:hidden;transition:transform .7s cubic-bezier(0.33,1,0.68,1),opacity .5s ease,width .7s cubic-bezier(0.33,1,0.68,1),height .7s cubic-bezier(0.33,1,0.68,1),box-shadow .5s ease;will-change:transform,opacity,width,height;}
        .dalt-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.05) 45%,transparent 100%);}
        .dalt-card-label{position:absolute;bottom:0;left:0;right:0;padding:1.5rem 1.3rem;transition:opacity .3s ease;}
        .dalt-card-name{font-family:var(--serif);font-weight:400;font-size:var(--fs-body);line-height:1.2;color:#fff;margin:0;text-shadow:0 1px 10px rgba(0,0,0,0.4);}
        .dalt-active-label{text-align:center;margin-top:.5rem;transition:opacity .35s ease,transform .35s ease;}
        .dalt-active-label span{font-family:var(--serif);font-weight:400;font-size:var(--fs-h3);letter-spacing:-.01em;color:var(--ink);}

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
          .nav-cta{padding:.55rem 1.3rem!important;font-size:var(--fs-xs)!important;white-space:nowrap;}
          .approach-panels{grid-template-columns:1fr;gap:1.8rem;}
          .values-grid{grid-template-columns:1fr;}
          .about-split{grid-template-columns:1fr;gap:3rem;}
          .method-step{grid-template-columns:60px 1fr;}
          .step-arrow{display:none;}
          .svc-tab{font-size:var(--fs-body);padding:0 0 14px 0;}
          .svc-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
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
          .logo-mark{width:31px;height:29px;}
          .logo-name{font-size:var(--fs-xs);letter-spacing:.24em;}
          .logo-sep{height:13px;}
          .nav-cta{padding:.48rem 1.1rem!important;font-size:var(--fs-xs)!important;}

          /* Hero */
          .hero{padding:0!important;}
          .hero-h1{font-size:clamp(2rem,8vw,3rem);}
          .hero-inner{padding-top:3rem;padding-bottom:1rem;}
          .btn-primary,.btn-secondary{padding:.65rem 1.3rem;font-size:var(--fs-xs);}
          .hero-tags span{font-size:var(--fs-xs);}
          .hero-tags{gap:.35rem 1rem;max-width:340px;margin-left:auto;margin-right:auto;}
          .hero-tags span:not(:last-child)::after{display:none;}
          .hero-content{padding:0 16px;}
          .hero-line-1,.hero-line-2{display:inline!important;}
          .hero-line-1::after{content:' ';}

          /* Sections global */
          .section{padding:3rem 4vw;}
          .section-title{font-size:var(--fs-h2);margin-left:0;}
          .section-lede{font-size:var(--fs-lead);}
          .section-head{margin-bottom:1.5rem;}
          .eyebrow{font-size:.62rem;margin-bottom:.5rem;}

          /* New sections */
          .team-figures{gap:1.4rem;margin-top:2.4rem;}
          .team-figure-value{font-size:1.5rem;}
          .svc-grid{grid-template-columns:1fr;}
          .svc-card{padding:1.5rem 1.3rem 1.4rem;}
          .svc-title{font-size:var(--fs-h3);}
          .svc-desc{font-size:var(--fs-body);}
          .team-row{gap:2.2rem;}
          .member-photo{width:132px;}
          .member-name{font-size:var(--fs-h3);margin-top:1rem;}
          #team,#services{padding:3rem 4vw!important;}

          /* Services */
          .svc-tabs{flex-direction:column;gap:0;border-bottom:none;margin-top:1.5rem!important;overflow:visible;}
          .svc-tab{font-size:var(--fs-body);padding:10px 0;white-space:nowrap;text-align:left;border-bottom:1px solid var(--line);}
          .svc-tab::after{bottom:0;}
          .svc-desc{font-size:var(--fs-body)!important;line-height:1.7!important;}
          .svc-panel-anim{padding:32px 0!important;gap:28px!important;}

          /* Ticker */
          .sector-ticker{margin:1.2rem -4vw 0!important;}

          /* Approach */
          .approach-text{padding:1rem 0 0;}
          .approach-title{font-size:var(--fs-h3);}
          .approach-desc{font-size:var(--fs-small);}
          .approach-canvas-wrap{height:120px;}
          .value-card{padding:1.4rem 1.2rem;}
          .value-title{font-size:var(--fs-h3);}
          .value-desc{font-size:var(--fs-small);}
          .value-tag{font-size:.58rem;padding:.15rem .5rem;}

          /* Domains */
          .domains-grid{height:auto;gap:8px;flex-wrap:wrap;}
          .domain-card{flex:1 1 45%!important;aspect-ratio:4/3;}
          .domain-card--shrunk{flex:1 1 45%!important;}
          .domain-card--active{flex:1 1 45%!important;}
          .domain-label{padding:.7rem .7rem;text-align:left;}
          .domain-name{font-size:var(--fs-small);transition:none;white-space:normal;text-align:left;}
          .domain-card--shrunk .domain-name{font-size:var(--fs-small);}
          .domain-card--active .domain-name{font-size:var(--fs-small);}
          .domain-desc{max-height:80px!important;opacity:1!important;margin-top:.2rem!important;font-size:.65rem!important;line-height:1.4!important;text-align:left;}
          .domain-card--active .domain-desc{max-height:80px;opacity:1;margin-top:.2rem;font-size:.65rem;}

          /* Domains carousel */
          .domains-alt-section{padding:3rem 4vw;}
          .dalt-carousel{height:340px;}
          .dalt-arrow{width:36px;height:36px;}
          .dalt-tab{font-size:var(--fs-xs);padding:5px 8px;}
          .dalt-active-label span{font-size:var(--fs-body);}

          /* Method */
          .method-step{grid-template-columns:48px 1fr;gap:1.2rem;padding:1.2rem 0;}
          .step-num{font-size:var(--fs-h3);}
          .step-body h4{font-size:var(--fs-h3);}
          .step-body p{font-size:var(--fs-small);}

          /* Contact */
          .contact-wrap{padding:2.5rem 4vw;}
          .fi,.ft{padding:.75rem 1rem;font-size:var(--fs-small);}
          .submit-btn{padding:.8rem 2rem;font-size:var(--fs-xs);}

          /* Footer */
          footer{padding:2.5rem 4vw 2rem;}
          .footer-top{grid-template-columns:1fr;gap:2rem;}
          .footer-links{gap:1.5rem 2.5rem;}
          .footer-bottom{flex-direction:column;align-items:flex-start;gap:.6rem;}
        }
        @media(max-width:480px){
          /* Services */
          .svc-tab{font-size:var(--fs-small);padding:8px 0;}

          /* Ticker */
          .sector-ticker{padding:.7rem 0;}
          .sector-ticker-item{font-size:.6rem;padding:0 1.2rem;}

          /* Approach */
          .approach-title{font-size:var(--fs-body);}
          .approach-desc{font-size:var(--fs-small);}
          .value-title{font-size:var(--fs-body);}
          .value-desc{font-size:var(--fs-small);}

          /* Domains carousel */
          .dalt-carousel{height:300px;}
          .dalt-arrow{width:30px;height:30px;}
          .dalt-tab{font-size:.65rem;padding:4px 6px;}
          .dalt-active-label span{font-size:var(--fs-body);}

          /* Method */
          .method-step{grid-template-columns:36px 1fr;gap:1rem;}
          .step-num{font-size:var(--fs-h3);}
          .step-body h4{font-size:var(--fs-body);}
          .step-body p{font-size:var(--fs-xs);}

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
          .domain-name{font-size:var(--fs-small);}
          .domain-desc{font-size:.65rem!important;}
          .domains-grid{gap:6px;}
          .dalt-carousel{height:260px;}

          /* Services */
          .svc-tab{font-size:var(--fs-small);}
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
        </div>
        </div>
      </header>

      {/* SERVICES */}
      <ServicesSection />

      {/* APPROACH */}
      <div style={{ background: 'var(--white)', width: '100%' }}>
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
            <div className="approach-canvas-wrap"><ApproachAnim type="dna" /></div>
          </div>
          <div className="approach-panel reveal reveal-d1">
            <div className="approach-text">
              <div className="approach-title">Targeted Global Network</div>
              <p className="approach-desc">A curated global network of leading healthcare-focused investors, pharma and medtech corporates, and strategic acquirers worldwide. Developed through years of active involvement in the sector, it provides direct access to the right counterparties and ensures focused, relevant engagement.</p>
            </div>
            <div className="approach-canvas-wrap"><ApproachAnim type="globe" /></div>
          </div>
          <div className="approach-panel reveal reveal-d2">
            <div className="approach-text">
              <div className="approach-title">Execution Excellence</div>
              <p className="approach-desc">The rigour and standards developed over decades within top-tier investment banks, combined with the flexibility and hands-on dedication. Every process is conducted with discipline, discretion and a strong focus on outcomes.</p>
            </div>
            <div className="approach-canvas-wrap"><ApproachAnim type="execution" /></div>
          </div>
        </div>
      </div>
      </section>
      </div>

      <ExpertiseSection />

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
