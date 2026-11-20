import hat from './assets/comodin.png'

// Jester hat for the wildcard (founder, 2026-11-19). Drawn as a mask, so it takes the color of
// the text around it: accent on the button, light on the moment tag.
export default function WildcardIcon({ className = 'h-5 w-5' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{ mask: `url(${hat}) center / contain no-repeat`, WebkitMask: `url(${hat}) center / contain no-repeat` }}
    />
  )
}
