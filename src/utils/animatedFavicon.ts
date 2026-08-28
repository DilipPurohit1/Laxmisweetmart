/**
 * Animated Sweet Favicon Controller for Shree Laxmi Sweet Mart
 * Dynamically animates/cycles handcrafted SVG icons of iconic Indian sweets in the browser tab.
 */

// 1. Kaju Katli (Silver diamond cashew sweet)
const svgKajuKatli = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
    <radialGradient id="kajuGrad" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#FDFBF7" />
      <stop offset="70%" stop-color="#EFE6D8" />
      <stop offset="100%" stop-color="#DBC8B0" />
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#6E1824" />
  <!-- Diamond Kaju Katli -->
  <polygon points="32,10 54,32 32,54 10,32" fill="url(#kajuGrad)" stroke="#C89B3C" stroke-width="1.5" />
  <!-- Chandi Silver Foil Leaf -->
  <polygon points="32,16 48,32 32,48 16,32" fill="url(#silverGrad)" opacity="0.95" />
  <!-- Sparkle Star -->
  <polygon points="40,20 42,24 46,24 43,27 44,31 40,28 36,31 37,27 34,24 38,24" fill="#F59E0B" />
</svg>`;

// 2. Motichoor Laddoo (Saffron golden pearl laddoo)
const svgMotichoor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="ladduGrad" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="85%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#B45309" />
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#6E1824" />
  <!-- Golden Laddoo Ball -->
  <circle cx="32" cy="34" r="21" fill="url(#ladduGrad)" stroke="#FDE68A" stroke-width="1.5" />
  <!-- Motichoor Pearls Texture -->
  <circle cx="26" cy="27" r="2.5" fill="#FEF08A" opacity="0.9" />
  <circle cx="36" cy="26" r="2" fill="#FEF08A" opacity="0.9" />
  <circle cx="42" cy="33" r="2.2" fill="#FCD34D" opacity="0.8" />
  <circle cx="24" cy="37" r="2.5" fill="#D97706" opacity="0.8" />
  <circle cx="33" cy="38" r="3" fill="#FEF08A" opacity="0.9" />
  <circle cx="38" cy="42" r="2.2" fill="#B45309" opacity="0.7" />
  <!-- Pistachio Garnish on Top -->
  <ellipse cx="32" cy="18" rx="4" ry="2" fill="#15803D" stroke="#86EFAC" stroke-width="0.8" />
  <ellipse cx="34" cy="17" rx="2" ry="1" fill="#FDE047" />
</svg>`;

// 3. Modak (Aromatic festive mawa modak)
const svgModak = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="modakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="50%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#FDE68A" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#6E1824" />
  <!-- Modak Body -->
  <path d="M32,10 C34,16 52,34 48,48 C45,55 19,55 16,48 C12,34 30,16 32,10 Z" fill="url(#modakGrad)" stroke="#F59E0B" stroke-width="1.5" />
  <!-- Pleats (Kaliyan) -->
  <path d="M32,12 Q32,32 32,53" stroke="#D97706" stroke-width="1.2" fill="none" opacity="0.8" />
  <path d="M32,12 Q24,32 22,50" stroke="#D97706" stroke-width="1.2" fill="none" opacity="0.8" />
  <path d="M32,12 Q40,32 42,50" stroke="#D97706" stroke-width="1.2" fill="none" opacity="0.8" />
  <!-- Saffron Tika -->
  <circle cx="32" cy="24" r="2" fill="#DC2626" />
</svg>`;

// 4. Kesar Peda (Saffron khoya peda with pistachio)
const svgPeda = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="pedaGrad" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#6E1824" />
  <!-- Round Peda Disc -->
  <circle cx="32" cy="34" r="20" fill="url(#pedaGrad)" stroke="#F59E0B" stroke-width="1.5" />
  <!-- Center Indentation -->
  <circle cx="32" cy="33" r="8" fill="#D97706" opacity="0.4" />
  <!-- Almond/Pistachio Slices in Center -->
  <ellipse cx="30" cy="32" rx="3.5" ry="2" fill="#16A34A" stroke="#86EFAC" stroke-width="0.8" transform="rotate(-25 30 32)" />
  <ellipse cx="34" cy="34" rx="3.5" ry="1.8" fill="#F87171" transform="rotate(30 34 34)" />
  <circle cx="32" cy="33" r="1.5" fill="#FEF08A" />
</svg>`;

// 5. Gulab Jamun (Rich caramelized milk sweet in saffron syrup)
const svgGulabJamun = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="jamunGrad" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#A16207" />
      <stop offset="40%" stop-color="#78350F" />
      <stop offset="85%" stop-color="#451A03" />
      <stop offset="100%" stop-color="#260F02" />
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#6E1824" />
  <!-- Glossy Gulab Jamun Sphere -->
  <circle cx="32" cy="34" r="21" fill="url(#jamunGrad)" stroke="#CA8A04" stroke-width="1.5" />
  <!-- Glossy Sugar Syrup Shine -->
  <ellipse cx="26" cy="25" rx="5" ry="3" fill="#FEF08A" opacity="0.6" transform="rotate(-30 26 25)" />
  <circle cx="35" cy="22" r="1.5" fill="#FFFFFF" opacity="0.8" />
  <!-- Pistachio & Silver Leaf Speck -->
  <ellipse cx="33" cy="20" rx="3" ry="1.5" fill="#22C55E" />
  <rect x="36" y="27" width="4" height="3" fill="#E2E8F0" opacity="0.85" transform="rotate(15 36 27)" />
</svg>`;

const SWEET_FRAMES = [
  `data:image/svg+xml;utf8,${encodeURIComponent(svgKajuKatli)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(svgMotichoor)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(svgModak)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(svgPeda)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(svgGulabJamun)}`
];

let currentIndex = 0;
let animationInterval: any = null;

export function startAnimatedSweetFavicon(intervalMs = 1800) {
  if (typeof window === 'undefined') return;

  const setFavicon = (iconUrl: string) => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = iconUrl;
  };

  // Set first immediately
  setFavicon(SWEET_FRAMES[0]);

  // Rotate smoothly every intervalMs
  if (animationInterval) clearInterval(animationInterval);
  animationInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % SWEET_FRAMES.length;
    setFavicon(SWEET_FRAMES[currentIndex]);
  }, intervalMs);
}

export function stopAnimatedSweetFavicon() {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
}
