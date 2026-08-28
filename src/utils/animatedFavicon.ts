/**
 * Animated Sweet Favicon Controller for श्री Laxmi Sweet Mart
 * Pure White Background with vibrant, high-contrast handcrafted sweet illustrations:
 * 1. Jalebi (Juicy saffron-orange crispy swirl)
 * 2. Gulab Jamun (Glossy deep caramel sphere in syrup)
 * 3. Laddoo (Golden motichoor pearl sphere with pistachio)
 * 4. Barfi (NEW: Two-Tone Royal Pista-Kesar Barfi with Silver Leaf & Pistachio Slices)
 * 5. Modak (Aromatic pleated festive modak with saffron tilak)
 */

// 1. JALEBI (Vibrant golden saffron-orange juicy spirals on pure white)
const svgJalebi = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="jalebiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE066" />
      <stop offset="25%" stop-color="#FF9900" />
      <stop offset="70%" stop-color="#FF5500" />
      <stop offset="100%" stop-color="#D92600" />
    </linearGradient>
    <linearGradient id="glazeHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FFE57F" />
    </linearGradient>
  </defs>
  <!-- Pure Crisp White Badge with Elegant Gold Ring -->
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#D4AF37" stroke-width="2.5" />
  
  <!-- Jalebi Loops -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Deep Outline for crisp definition -->
    <path d="M22,34 C18,22 34,14 44,22 C52,28 48,46 36,48 C24,50 14,36 20,24 C26,14 46,14 50,28 C54,42 36,52 26,48 C16,42 22,26 34,22 C42,18 46,32 40,38 C34,44 26,38 28,30 C30,24 38,26 38,32" stroke="#B43403" stroke-width="8.5" />
    <!-- Vibrant Glowing Saffron Jalebi -->
    <path d="M22,34 C18,22 34,14 44,22 C52,28 48,46 36,48 C24,50 14,36 20,24 C26,14 46,14 50,28 C54,42 36,52 26,48 C16,42 22,26 34,22 C42,18 46,32 40,38 C34,44 26,38 28,30 C30,24 38,26 38,32" stroke="url(#jalebiGrad)" stroke-width="6" />
    <!-- Glossy Sugar Syrup Highlight -->
    <path d="M24,32 C20,24 34,16 42,22 C48,27 46,42 36,44" stroke="url(#glazeHighlight)" stroke-width="2" />
    <path d="M28,26 C34,18 46,20 48,30" stroke="#FFFFFF" stroke-width="1.8" />
  </g>
  <!-- Sliced Emerald Pistachio -->
  <circle cx="34" cy="30" r="2.5" fill="#16A34A" stroke="#14532D" stroke-width="0.5" />
  <circle cx="42" cy="24" r="2" fill="#15803D" />
</svg>`;

// 2. GULAB JAMUN (Deep caramel sphere with sugar syrup gloss & silver leaf on pure white)
const svgGulabJamun = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="jamunGrad" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#C27A23" />
      <stop offset="35%" stop-color="#8C3F0D" />
      <stop offset="70%" stop-color="#542106" />
      <stop offset="100%" stop-color="#2E0E02" />
    </radialGradient>
  </defs>
  <!-- Pure Crisp White Badge with Elegant Gold Ring -->
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#D4AF37" stroke-width="2.5" />
  
  <!-- Syrup Pool Glow -->
  <ellipse cx="32" cy="46" rx="22" ry="8" fill="#FDE68A" stroke="#F59E0B" stroke-width="1.5" />
  
  <!-- Big Rich Gulab Jamun Ball -->
  <circle cx="32" cy="33" r="22" fill="url(#jamunGrad)" stroke="#78350F" stroke-width="1.5" />
  
  <!-- Sugar Glaze Specular Highlight -->
  <ellipse cx="24" cy="22" rx="7" ry="4" fill="#FFFFFF" opacity="0.85" transform="rotate(-30 24 22)" />
  <circle cx="35" cy="18" r="2" fill="#FFFFFF" opacity="0.9" />
  
  <!-- Chandi Vark (Silver Foil Leaf) -->
  <polygon points="34,26 44,24 41,34 33,32" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="0.8" />
  
  <!-- Sliced Pistachio & Saffron Strand -->
  <ellipse cx="28" cy="35" rx="4" ry="2" fill="#16A34A" stroke="#14532D" stroke-width="0.7" transform="rotate(20 28 35)" />
  <path d="M38,30 Q44,32 46,38" stroke="#DC2626" stroke-width="1.8" fill="none" stroke-linecap="round" />
</svg>`;

// 3. LADDOO (Golden saffron motichoor pearl laddoo on pure white)
const svgLaddoo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="ladduGrad" cx="38%" cy="32%" r="62%">
      <stop offset="0%" stop-color="#FFF066" />
      <stop offset="30%" stop-color="#FFB300" />
      <stop offset="70%" stop-color="#E66A00" />
      <stop offset="100%" stop-color="#993D00" />
    </radialGradient>
  </defs>
  <!-- Pure Crisp White Badge with Elegant Gold Ring -->
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#D4AF37" stroke-width="2.5" />
  
  <!-- Shadow below ball -->
  <ellipse cx="32" cy="52" rx="18" ry="5" fill="#E2E8F0" />
  
  <!-- Golden Motichoor Laddoo Sphere -->
  <circle cx="32" cy="33" r="22" fill="url(#ladduGrad)" stroke="#B45309" stroke-width="2" />
  
  <!-- Pearl Motichoor Beads Texture -->
  <circle cx="23" cy="24" r="3.2" fill="#FFF59D" />
  <circle cx="33" cy="22" r="3" fill="#FFF59D" />
  <circle cx="41" cy="28" r="2.8" fill="#FFE082" />
  <circle cx="20" cy="35" r="3" fill="#FFB74D" />
  <circle cx="29" cy="34" r="3.5" fill="#FFF59D" />
  <circle cx="39" cy="37" r="3.2" fill="#FF9800" />
  <circle cx="25" cy="44" r="3" fill="#E65100" />
  <circle cx="35" cy="44" r="3.2" fill="#FF9800" />
  
  <!-- Magaz Melon Seed & Emerald Pistachio Crown -->
  <ellipse cx="32" cy="14" rx="5.5" ry="2.5" fill="#15803D" stroke="#14532D" stroke-width="0.8" />
  <ellipse cx="34" cy="13" rx="3" ry="1.4" fill="#FEF08A" />
  <ellipse cx="26" cy="18" rx="3.5" ry="1.5" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.5" transform="rotate(-30 26 18)" />
</svg>`;

// 4. NEW BARFI (Royal Two-Tone Pistachio-Kesar Barfi Block with Silver Leaf & Almond Pistachio Topping)
const svgBarfi = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <!-- Top Pista Green Layer -->
    <linearGradient id="pistaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ADE80" />
      <stop offset="50%" stop-color="#22C55E" />
      <stop offset="100%" stop-color="#16A34A" />
    </linearGradient>
    <!-- Bottom Kesar Khoya Layer -->
    <linearGradient id="kesarLayer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <!-- Shimmering Silver Leaf -->
    <linearGradient id="silverLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#F1F5F9" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
  </defs>
  <!-- Pure Crisp White Badge with Elegant Gold Ring -->
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#D4AF37" stroke-width="2.5" />
  
  <!-- Soft Plate Shadow -->
  <ellipse cx="32" cy="54" rx="20" ry="5" fill="#E2E8F0" />
  
  <!-- 3D Layered Barfi Block -->
  <!-- Bottom Mawa Khoya Base Layer (Isometric Box) -->
  <path d="M12,32 L32,42 L52,32 L52,44 L32,54 L12,44 Z" fill="url(#kesarLayer)" stroke="#D97706" stroke-width="1.8" />
  <!-- Side Khoya Cut Detail -->
  <path d="M12,44 L32,54 L32,42 L12,32 Z" fill="#D97706" opacity="0.35" />
  
  <!-- Top Royal Pistachio Layer (Isometric Diamond Surface) -->
  <path d="M12,24 L32,14 L52,24 L32,34 Z" fill="url(#pistaGrad)" stroke="#15803D" stroke-width="2" />
  <path d="M12,24 L32,34 L32,42 L12,32 Z" fill="#15803D" stroke="#15803D" stroke-width="1.8" />
  <path d="M32,34 L52,24 L52,32 L32,42 Z" fill="#166534" stroke="#15803D" stroke-width="1.8" />
  
  <!-- Real Silver Leaf (Chandi Vark) Foil on Top -->
  <polygon points="26,19 42,16 38,27 22,25" fill="url(#silverLeaf)" stroke="#CBD5E1" stroke-width="0.8" />
  
  <!-- Sliced Badam / Pista Nuts Topping -->
  <ellipse cx="30" cy="22" rx="3.5" ry="1.8" fill="#FEF08A" stroke="#B45309" stroke-width="0.6" transform="rotate(-15 30 22)" />
  <ellipse cx="36" cy="24" rx="3" ry="1.5" fill="#14532D" stroke="#86EFAC" stroke-width="0.6" transform="rotate(25 36 24)" />
  
  <!-- Sparkle Star on Silver Vark -->
  <polygon points="42,17 43.5,20 46.5,20 44,22 45,25 42,23 39,25 40,22 37.5,20 40.5,20" fill="#F59E0B" />
</svg>`;

// 5. MODAK (Aromatic sculpted festive modak on pure white)
const svgModak = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="modakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="35%" stop-color="#FEF3C7" />
      <stop offset="75%" stop-color="#FDE68A" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
  </defs>
  <!-- Pure Crisp White Badge with Elegant Gold Ring -->
  <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#D4AF37" stroke-width="2.5" />
  
  <!-- Soft Plate Shadow -->
  <ellipse cx="32" cy="54" rx="18" ry="5" fill="#E2E8F0" />
  
  <!-- Modak Sculpted Silhouette with Bold Outline -->
  <path d="M32,9 C36,17 54,34 50,49 C46,56 18,56 14,49 C10,34 28,17 32,9 Z" fill="url(#modakGrad)" stroke="#B45309" stroke-width="2.2" />
  
  <!-- Authentic Pleats (Kaliyan) Lines -->
  <path d="M32,10 Q32,32 32,54" stroke="#B45309" stroke-width="2" fill="none" stroke-linecap="round" />
  <path d="M32,10 Q22,32 20,51" stroke="#D97706" stroke-width="1.8" fill="none" stroke-linecap="round" />
  <path d="M32,10 Q42,32 44,51" stroke="#D97706" stroke-width="1.8" fill="none" stroke-linecap="round" />
  <path d="M32,10 Q14,35 15,47" stroke="#F59E0B" stroke-width="1.5" fill="none" stroke-linecap="round" />
  <path d="M32,10 Q50,35 49,47" stroke="#F59E0B" stroke-width="1.5" fill="none" stroke-linecap="round" />
  
  <!-- Saffron Red Tilak & Golden Pearl Apex -->
  <circle cx="32" cy="22" r="3" fill="#DC2626" stroke="#FEF08A" stroke-width="0.8" />
  <circle cx="32" cy="9" r="2.2" fill="#F59E0B" stroke="#B45309" stroke-width="0.6" />
</svg>`;

// The 5 requested iconic sweets in exact order: Jalebi -> Gulab Jamun -> Laddoo -> Barfi -> Modak
const SWEET_FRAMES = [
  `data:image/svg+xml;utf8,${encodeURIComponent(svgJalebi)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(svgGulabJamun)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(svgLaddoo)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(svgBarfi)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(svgModak)}`
];

let currentIndex = 0;
let animationInterval: any = null;

export function startAnimatedSweetFavicon(intervalMs = 1500) {
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

  // Set first immediately (Jalebi)
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
