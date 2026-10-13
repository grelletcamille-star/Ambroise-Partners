/* Ambroise Partners monogram (Oct 2026): the drawn A of the original mark, with a smaller P
   (52 %) tucked under its right leg; the two feet share one serif. Proportions about 1:1, so it
   also works as a favicon. Single colour: it takes the text colour of its parent. */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="9 0 105 100" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <polygon points="47,10 54,10 81,88 71,88" />
        <polygon points="47,10 50,10 25.5,88 22,88" />
        <rect x="13" y="86.5" width="19" height="3" />
        <rect x="65" y="86.5" width="29.8" height="3" />
        <g transform="translate(35 42.96) scale(0.52)">
          <rect x="99" y="10" width="9" height="78" />
          <rect x="93" y="10" width="6" height="4" />
          <path d="M108 11.5 H123 C138 11.5 145 21 145 33 C145 45 138 54.5 123 54.5 H108" stroke="currentColor" strokeWidth="4.4" fill="none" />
        </g>
      </g>
      <path d="M32 63 Q48 56 64 63" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  );
}
