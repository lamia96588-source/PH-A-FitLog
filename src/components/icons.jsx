/**
 * Tiny inline SVG icons — zero dependencies.
 * All icons inherit color via currentColor and size via className.
 */

const STROKE_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export function ClockIcon(props) {
  return (
    <svg {...STROKE_PROPS} {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}

export function FlameIcon(props) {
  return (
    <svg {...STROKE_PROPS} {...props}>
      <path d="M12 3c.7 2.6-.8 4-1.9 5.6C9 10.2 8 11.7 8 13.5a4 4 0 0 0 8 0c0-1.4-.6-2.6-1.4-3.8-.3 1-.9 1.7-1.7 2.2.4-1.6.2-4.5-.9-6.4" />
    </svg>
  );
}

export function StarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <svg {...STROKE_PROPS} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg {...STROKE_PROPS} {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.3" y2="16.3" />
    </svg>
  );
}

export function XIcon(props) {
  return (
    <svg {...STROKE_PROPS} {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg {...STROKE_PROPS} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function BookmarkIcon(props) {
  return (
    <svg {...STROKE_PROPS} {...props}>
      <path d="M6 3h12v18l-6-4.2L6 21z" />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg {...STROKE_PROPS} {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
