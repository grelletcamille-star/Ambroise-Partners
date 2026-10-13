/* Ambroise Partners monogram: a drawn A (thin and thick strokes, curved crossbar) followed by a P
   in the same style (logo option A with the P, Oct 2026). Proportions 1.6:1.
   Single colour: it takes the text colour of its parent. */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 100" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <polygon points="47,10 54,10 81,88 71,88" />
        <polygon points="47,10 50,10 25.5,88 22,88" />
        <rect x="13" y="86.5" width="19" height="3" />
        <rect x="65" y="86.5" width="23" height="3" />
        <rect x="99" y="10" width="9" height="78" />
        <rect x="93" y="10" width="6" height="3" />
        <rect x="92" y="86.5" width="23" height="3" />
      </g>
      <path d="M32 63 Q48 56 64 63" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M108 11.5 H123 C138 11.5 145 21 145 33 C145 45 138 54.5 123 54.5 H108" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  );
}
