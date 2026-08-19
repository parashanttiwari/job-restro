const paths = {
  search: (
    <>
      <circle cx="8.5" cy="8.5" r="5.5" />
      <line x1="17" y1="17" x2="13.2" y2="13.2" />
    </>
  ),
  pin: (
    <>
      <path d="M10 18s6-5.6 6-10.2a6 6 0 10-12 0C4 12.4 10 18 10 18z" />
      <circle cx="10" cy="7.8" r="2.1" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="14" height="9" rx="1.5" />
      <path d="M7 7V5.5A1.5 1.5 0 018.5 4h3A1.5 1.5 0 0113 5.5V7" />
    </>
  ),
  clock: (
    <>
      <circle cx="10" cy="10" r="7" />
      <polyline points="10,6 10,10 13,12" />
    </>
  ),
  upload: (
    <>
      <polyline points="6.2,9 10,5.2 13.8,9" />
      <line x1="10" y1="5.2" x2="10" y2="14" />
      <path d="M4 14.5v1.3a2 2 0 002 2h8a2 2 0 002-2v-1.3" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="10" cy="10" r="7.8" />
      <polyline points="6.3,10.3 9,13 14,7.5" />
    </>
  ),
  x: (
    <>
      <line x1="5" y1="5" x2="15" y2="15" />
      <line x1="15" y1="5" x2="5" y2="15" />
    </>
  ),
  chevronDown: <polyline points="5,7.5 10,12.5 15,7.5" />,
  user: (
    <>
      <circle cx="10" cy="6.5" r="3.2" />
      <path d="M3.5 17c1-3.8 4-5.5 6.5-5.5s5.5 1.7 6.5 5.5" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="9" width="11" height="8" rx="1.5" />
      <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="14" height="10" rx="1.5" />
      <polyline points="3.5,6 10,11 16.5,6" />
    </>
  ),
  tag: (
    <>
      <path d="M10.6 3.5H5.7A2.2 2.2 0 003.5 5.7v4.9c0 .58.23 1.14.64 1.55l7.6 7.6a2.2 2.2 0 003.1 0l5.1-5.1a2.2 2.2 0 000-3.1l-7.6-7.6a2.2 2.2 0 00-1.54-.64z" />
      <circle cx="7.5" cy="7.5" r="1.3" />
    </>
  ),
  globe: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <ellipse cx="10" cy="10" rx="3.4" ry="7.5" />
      <line x1="2.5" y1="10" x2="17.5" y2="10" />
    </>
  ),
  logOut: (
    <>
      <path d="M8 4H5.5A1.5 1.5 0 004 5.5v9A1.5 1.5 0 005.5 16H8" />
      <line x1="13.5" y1="10" x2="7.5" y2="10" />
      <polyline points="11,7 14,10 11,13" />
    </>
  ),
  arrowRight: (
    <>
      <line x1="4" y1="10" x2="15" y2="10" />
      <polyline points="11,6 15,10 11,14" />
    </>
  ),
  chefHat: (
    <>
      <circle cx="10" cy="7.2" r="4.7" />
      <rect x="5.3" y="12" width="9.4" height="5" rx="1" />
    </>
  ),
  bread: (
    <>
      <rect x="3.5" y="8.5" width="13" height="8" rx="4" />
      <line x1="6.8" y1="8.5" x2="6" y2="5.3" />
      <line x1="10" y1="8.5" x2="10" y2="4.8" />
      <line x1="13.2" y1="8.5" x2="14" y2="5.3" />
    </>
  ),
  cocktail: (
    <>
      <path d="M4 4h12l-6 8z" strokeLinejoin="round" />
      <line x1="10" y1="12" x2="10" y2="16.5" />
      <line x1="6.5" y1="16.5" x2="13.5" y2="16.5" />
    </>
  ),
  tray: (
    <>
      <ellipse cx="10" cy="14.7" rx="7.3" ry="1.7" />
      <circle cx="7.2" cy="8.5" r="2.2" />
      <circle cx="13.2" cy="9.6" r="1.7" />
    </>
  ),
  droplet: <path d="M10 2.5c3.2 4.3 6 8 6 11.3a6 6 0 11-12 0c0-3.3 2.8-7 6-11.3z" />,
  fork: (
    <>
      <line x1="6" y1="2.5" x2="6" y2="9" />
      <line x1="4.5" y1="2.5" x2="4.5" y2="6.5" />
      <line x1="7.5" y1="2.5" x2="7.5" y2="6.5" />
      <line x1="6" y1="9" x2="6" y2="17.5" />
      <path d="M14 2.5v6.5a2.2 2.2 0 002.2 2.2h0V17.5" strokeLinejoin="round" />
      <path d="M14 2.5v6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="4.5" width="13" height="12.5" rx="1.5" />
      <line x1="7" y1="3" x2="7" y2="6" />
      <line x1="13" y1="3" x2="13" y2="6" />
    </>
  ),
  menu: (
    <>
      <line x1="3.5" y1="6" x2="16.5" y2="6" />
      <line x1="3.5" y1="10" x2="16.5" y2="10" />
      <line x1="3.5" y1="14" x2="16.5" y2="14" />
    </>
  ),
  arrowLeft: (
    <>
      <line x1="16" y1="10" x2="5" y2="10" />
      <polyline points="9,6 5,10 9,14" />
    </>
  ),
  chevronLeft: <polyline points="12.5,5 7.5,10 12.5,15" />,
  chevronRight: <polyline points="7.5,5 12.5,10 7.5,15" />,
  star: (
    <path
      d="M10 2.6l2.2 4.6 5 .7-3.6 3.6.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.6 5-.7z"
      strokeLinejoin="round"
    />
  ),
  quote: (
    <>
      <path d="M4 12.5c0-3.4 1.6-5.7 4.4-7l.9 1.7c-1.9.9-2.7 2-2.9 3.3.4-.2.8-.3 1.3-.3 1.5 0 2.6 1.1 2.6 2.6 0 1.6-1.2 2.7-2.8 2.7-1.9 0-3.5-1.4-3.5-3z" />
      <path d="M12 12.5c0-3.4 1.6-5.7 4.4-7l.9 1.7c-1.9.9-2.7 2-2.9 3.3.4-.2.8-.3 1.3-.3 1.5 0 2.6 1.1 2.6 2.6 0 1.6-1.2 2.7-2.8 2.7-1.9 0-3.5-1.4-3.5-3z" />
    </>
  ),
  phone: (
    <path d="M5.3 3.5h2.4l1 3.4-1.7 1.4a10.5 10.5 0 004.7 4.7l1.4-1.7 3.4 1v2.4c0 1-.8 1.8-1.8 1.7-6-.5-10.8-5.3-11.3-11.3-.1-1 .7-1.8 1.7-1.8z" strokeLinejoin="round" />
  ),
  send: (
    <>
      <path d="M17 3L2.5 9.3 9 11l1.7 6.5z" strokeLinejoin="round" />
      <line x1="17" y1="3" x2="9" y2="11" />
    </>
  ),
  sparkle: (
    <>
      <path d="M9.5 2.5c.4 2.6 1 4 1.7 4.9.7.9 2 1.5 4.6 1.9-2.6.4-3.9 1-4.6 1.9-.7.9-1.3 2.3-1.7 4.9-.4-2.6-1-4-1.7-4.9-.7-.9-2-1.5-4.6-1.9 2.6-.4 3.9-1 4.6-1.9.7-.9 1.3-2.3 1.7-4.9z" strokeLinejoin="round" />
      <path d="M16 13.2c.2 1.3.5 2 .9 2.5.4.5 1 .7 2.3 1-1.3.2-1.9.5-2.3 1-.4.5-.7 1.2-.9 2.5-.2-1.3-.5-2-.9-2.5-.4-.5-1-.7-2.3-1 1.3-.2 1.9-.5 2.3-1 .4-.5.7-1.2.9-2.5z" strokeLinejoin="round" />
    </>
  ),
  play: <path d="M6.5 4.5l9 5.5-9 5.5z" strokeLinejoin="round" />,
};

export default function Icon({ name, size = 18, className = '', strokeWidth = 1.6 }) {
  const content = paths[name];
  if (!content) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
