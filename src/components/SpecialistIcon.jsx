const iconPaths = {
  team: (
    <>
      <ellipse cx="24" cy="24" rx="19" ry="9" transform="rotate(-32 24 24)" />
      <ellipse cx="24" cy="24" rx="19" ry="9" transform="rotate(32 24 24)" />
      <path d="m24 15 2.2 6.8L33 24l-6.8 2.2L24 33l-2.2-6.8L15 24l6.8-2.2L24 15Z" />
      <circle cx="24" cy="24" r="2.2" />
    </>
  ),
  finance: (
    <>
      <path d="M16 9.5h11l6.5 6.5V37a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 12.5 37V12A2.5 2.5 0 0 1 15 9.5Z" />
      <path d="M27 10v6h6M17.5 21h11M17.5 25h7M18 35v-4m5 4v-7m5 7v-5" />
    </>
  ),
  assistant: (
    <>
      <path d="M11 11.5A4.5 4.5 0 0 1 15.5 7h17a4.5 4.5 0 0 1 4.5 4.5v17a4.5 4.5 0 0 1-4.5 4.5H23l-8.5 7v-7.6a4.5 4.5 0 0 1-3.5-4.4v-16Z" />
      <path d="M24 30.5s-9-5.2-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.8-9 11-9 11Z" />
    </>
  ),
  hr: (
    <>
      <circle cx="19" cy="17" r="5" />
      <circle cx="31" cy="19" r="4" />
      <path d="M8.5 37a10.5 10.5 0 0 1 21 0M27 29a8 8 0 0 1 12.5 6.5" />
      <path d="m34 7 .9 2.7 2.6.9-2.6.9L34 15l-.9-2.5-2.6-.9 2.6-.9L34 7Z" />
    </>
  ),
  sales: (
    <g transform="translate(-2 0)">
      <path d="M9 39.5h31M12.5 35V25h6v10m5 0V17h6v18m5 0V10h6v25" />
      <path d="m12 19 9-6 7 2 10-8m-6 0h6v6" />
      <circle cx="12.5" cy="19" r="1.5" />
    </g>
  ),
};

export default function SpecialistIcon({ type = "team", className = "h-full w-full" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 48 48"
    >
      {iconPaths[type] || iconPaths.team}
    </svg>
  );
}
