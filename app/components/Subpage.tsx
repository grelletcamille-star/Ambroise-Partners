import type { ReactNode } from 'react';
import Link from 'next/link';
import { COMPANY } from '../lib/company';
import LogoMark from './LogoMark';

export function Wordmark() {
  return (
    <span className="wordmark" aria-label="Ambroise Partners">
      <LogoMark className="wordmark-mark" />
      <span className="wordmark-name" aria-hidden="true"><span className="wordmark-l1">Ambroise</span><span className="wordmark-l2">Partners</span></span>
    </span>
  );
}

export function SubpageNav() {
  return (
    <header className="sp-nav">
      <div className="sp-nav-inner">
        <Link href="/" aria-label="Ambroise Partners home"><Wordmark /></Link>
        <nav className="sp-links" aria-label="Main">
          <Link href="/#services">Services</Link>
          <Link href="/#team">Team</Link>
          <Link href="/#contact" className="sp-cta">Contact us</Link>
        </nav>
      </div>
    </header>
  );
}

export function SubpageFooter() {
  return (
    <footer className="sp-footer">
      <div className="sp-footer-inner">
        <Link href="/" aria-label="Ambroise Partners home"><Wordmark /></Link>
        <nav className="sp-footer-links" aria-label="Footer">
          <Link href="/legal">Legal notice</Link>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/cookies">Cookie policy</Link>
          <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </nav>
        <p className="sp-footer-legal">
          © {new Date().getFullYear()} {COMPANY.name} · {COMPANY.legalFormShort} with a share capital of {COMPANY.shareCapital} · {COMPANY.rcs} · Paris · London
        </p>
      </div>
    </footer>
  );
}

export default function Subpage({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <>
      <SubpageNav />
      <main>
        <div className="sp-hero">
          <div className="sp-hero-inner">
            {eyebrow && <span className="sp-eyebrow">{eyebrow}</span>}
            <h1>{title}</h1>
            {intro && <p>{intro}</p>}
          </div>
        </div>
        {children}
      </main>
      <SubpageFooter />
    </>
  );
}
