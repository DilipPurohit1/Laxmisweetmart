/**
 * Animated Sweet Favicon Controller for श्री Laxmi Sweet Mart
 * Plays high-visibility, handcrafted vector icons of iconic Indian sweets:
 * 1. Jalebi (Crisp saffron-orange spiral)
 * 2. Gulab Jamun (Glossy golden-brown syrup sweet with silver leaf)
 * 3. Laddoo (Golden motichoor sphere with pistachios)
 * 4. Barfi (Diamond cut silver-leaf Kaju Katli barfi)
 * 5. Modak (Festive pleated mawa modak)
 */

// 1. JALEBI (Crispy golden-orange juicy spirals with saffron glaze)
const svgJalebi = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#8B1E2E" />
      <stop offset="100%" stop-color="#4A0E17" />
    </radialGradient>
    <linearGradient id="jalebiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE066" />
      <stop offset="30%" stop-color="#FF9900" />
      <stop offset="75%" stop-color="#FF5500" />
      <stop offset="100%" stop-color="#CC3300" />
    </linearGradient>
    <linearGradient id="jalebiGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFF3A8" />
      <stop offset="100%" stop-color="#FFAA00" />
    </linearGradient>
  </defs>
  <!-- Royal Badge Background -->
  <rect width="64" height="64" rx="16" fill="url(#bgGrad)" stroke="#F0C05A" stroke-width="2.5" />
  
  <!-- Jalebi Concentric Golden-Orange Loops -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Base Shadow Loops -->
    <path d="M22,34 C18,22 34,14 44,22 C52,28 48,46 36,48 C24,50 14,36 20,24 C26,14 46,14 50,28 C54,42 36,52 26,48 C16,42 22,26 34,22 C42,18 46,32 40,38 C34,44 26,38 28,30 C30,24 38,26 38,32" stroke="#801800" stroke-width="8" />
    <!-- Vibrant Jalebi Core -->
    <path d="M22,34 C18,22 34,14 44,22 C52,28 48,46 36,48 C24,50 14,36 20,24 C26,14 46,14 50,28 C54,42 36,52 26,48 C16,42 22,26 34,22 C42,18 46,32 40,38 C34,44 26,38 28,30 C30,24 38,26 38,32" stroke="url(#jalebiGrad)" stroke-width="6" />
    <!-- Sugar Glaze Highlight -->
    <path d="M24,32 C20,24 34,16 42,22 C48,27 46,42 36,44" stroke="url(#jalebiGlow)" stroke-width="2.2" />
    <path d="M28,26 C34,18 46,20 48,30" stroke="#FFF7CC" stroke-width="1.8" />
  </g>
  <!-- Emerald Pistachio Garnish -->
  <circle cx="34" cy="30" r="2" fill="#16A34A" stroke="#86EFAC" stroke-width="0.6" />
  <circle cx="42" cy="24" r="1.5" fill="#15803D" />
</svg>`;

// 2. GULAB JAMUN (Glossy caramelized golden-brown sphere in saffron rose syrup with silver leaf)
const svgGulabJamun = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#8B1E2E" />
      <stop offset="100%" stop-color="#4A0E17" />
    </radialGradient>
    <radialGradient id="jamunGrad" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#C27A23" />
      <stop offset="35%" stop-color="#8C3F0D" />
      <stop offset="70%" stop-color="#542106" />
      <stop offset="100%" stop-color="#2E0E02" />
    </radialGradient>
  </defs>
  <!-- Royal Badge Background -->
  <rect width="64" height="64" rx="16" fill="url(#bgGrad)" stroke="#F0C05A" stroke-width="2.5" />
  
  <!-- Syrup Pool Glow -->
  <ellipse cx="32" cy="46" rx="22" ry="7" fill="#F59E0B" opacity="0.4" />
  
  <!-- Big Glossy Gulab Jamun Ball -->
  <circle cx="32" cy="33" r="22" fill="url(#jamunGrad)" stroke="#F59E0B" stroke-width="1.5" />
  
  <!-- Sugar Glaze Gloss Specular Highlight -->
  <ellipse cx="24" cy="22" rx="7" ry="4" fill="#FEF08A" opacity="0.75" transform="rotate(-30 24 22)" />
  <circle cx="35" cy="18" r="2" fill="#FFFFFF" opacity="0.9" />
  
  <!-- Chandi Vark (Silver Foil Leaf) -->
  <polygon points="34,26 44,24 41,34 33,32" fill="#FFFFFF" opacity="0.95" stroke="#E2E8F0" stroke-width="0.5" />
  
  <!-- Crushed Pistachio & Saffron Strand -->
  <ellipse cx="28" cy="35" rx="3.5" ry="1.8" fill="#15803D" stroke="#86EFAC" stroke-width="0.7" transform="rotate(20 28 35)" />
  <path d="M38,30 Q44,32 46,38" stroke="#DC2626" stroke-width="1.5" fill="none" stroke-linecap="round" />
</svg>`;

// 3. LADDOO (Golden saffron motichoor pearl laddoo with pistachios)
const svgLaddoo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#8B1E2E" />
      <stop offset="100%" stop-color="#4A0E17" />
    </radialGradient>
    <radialGradient id="ladduGrad" cx="38%" cy="32%" r="62%">
      <stop offset="0%" stop-color="#FFF066" />
      <stop offset="30%" stop-color="#FFB300" />
      <stop offset="70%" stop-color="#E66A00" />
      <stop offset="100%" stop-color="#993D00" />
    </radialGradient>
  </defs>
  <!-- Royal Badge Background -->
  <rect width="64" height="64" rx="16" fill="url(#bgGrad)" stroke="#F0C05A" stroke-width="2.5" />
  
  <!-- Golden Motichoor Laddoo Sphere -->
  <circle cx="32" cy="33" r="22" fill="url(#ladduGrad)" stroke="#FDE68A" stroke-width="1.8" />
  
  <!-- Pearl Motichoor Beads Texture -->
  <circle cx="23" cy="24" r="3.2" fill="#FFF59D" opacity="0.95" />
  <circle cx="33" cy="22" r="3" fill="#FFF59D" opacity="0.95" />
  <circle cx="41" cy="28" r="2.8" fill="#FFE082" opacity="0.9" />
  <circle cx="20" cy="35" r="3" fill="#FFB74D" opacity="0.9" />
  <circle cx="29" cy="34" r="3.5" fill="#FFF59D" opacity="0.95" />
  <circle cx="39" cy="37" r="3.2" fill="#FF9800" opacity="0.85" />
  <circle cx="25" cy="44" r="3" fill="#E65100" opacity="0.85" />
  <circle cx="35" cy="44" r="3.2" fill="#FF9800" opacity="0.85" />
  
  <!-- Magaz Melon Seed & Pistachio on Crown -->
  <ellipse cx="32" cy="14" rx="5" ry="2.2" fill="#15803D" stroke="#86EFAC" stroke-width="0.8" />
  <ellipse cx="34" cy="13" rx="2.5" ry="1.2" fill="#FEF08A" />
  <ellipse cx="26" cy="18" rx="3.5" ry="1.5" fill="#FFFFFF" transform="rotate(-30 26 18)" />
</svg>`;

// 4. BARFI (Signature diamond Kaju Katli / Pista Barfi with edible silver foil)
const svgBarfi = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#8B1E2E" />
      <stop offset="100%" stop-color="#4A0E17" />
    </radialGradient>
    <linearGradient id="silverFoil" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#F1F5F9" />
      <stop offset="70%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#FFFFFF" />
    </linearGradient>
    <radialGradient id="kajuBase" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#FFFDF5" />
      <stop offset="60%" stop-color="#F5ECD7" />
      <stop offset="100%" stop-color="#D6C4A5" />
    </radialGradient>
  </defs>
  <!-- Royal Badge Background -->
  <rect width="64" height="64" rx="16" fill="url(#bgGrad)" stroke="#F0C05A" stroke-width="2.5" />
  
  <!-- 3D Barfi Diamond Depth Shadow -->
  <polygon points="32,14 54,34 32,54 10,34" fill="#8C7350" />
  
  <!-- Crisp Diamond Cut Barfi Body -->
  <polygon points="32,9 55,32 32,52 9,32" fill="url(#kajuBase)" stroke="#F0C05A" stroke-width="2" />
  
  <!-- Genuine Shimmering Silver Vark Leaf -->
  <polygon points="32,15 49,32 32,47 15,32" fill="url(#silverFoil)" stroke="#E2E8F0" stroke-width="1" />
  
  <!-- Brilliant 4-Point Sparkle Stars -->
  <g fill="#F59E0B">
    <polygon points="38,18 40,23 45,23 41,26 43,31 38,28 33,31 35,26 31,23 36,23" />
    <circle cx="23" cy="38" r="1.8" fill="#FDE047" />
    <circle cx="43" cy="36" r="1.5" fill="#FDE047" />
  </g>
</svg>`;

// 5. MODAK (Authentic handcrafted mawa modak with pleats and saffron tilak)
const svgModak = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#8B1E2E" />
      <stop offset="100%" stop-color="#4A0E17" />
    </radialGradient>
    <linearGradient id="modakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="35%" stop-color="#FEF3C7" />
      <stop offset="75%" stop-color="#FDE68A" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
  </defs>
  <!-- Royal Badge Background -->
  <rect width="64" height="64" rx="16" fill="url(#bgGrad)" stroke="#F0C05A" stroke-width="2.5" />
  
  <!-- Modak Sculpted Silhouette -->
  <path d="M32,9 C36,17 54,34 50,49 C46,56 18,56 14,49 C10,34 28,17 32,9 Z" fill="url(#modakGrad)" stroke="#D97706" stroke-width="2" />
  
  <!-- Authentic Pleats (Kaliyan) Lines -->
  <path d="M32,10 Q32,32 32,54" stroke="#B45309" stroke-width="1.8" fill="none" stroke-linecap="round" />
  <path d="M32,10 Q22,32 20,51" stroke="#D97706" stroke-width="1.6" fill="none" stroke-linecap="round" />
  <path d="M32,10 Q42,32 44,51" stroke="#D97706" stroke-width="1.6" fill="none" stroke-linecap="round" />
  <path d="M32,10 Q14,35 15,47" stroke="#F59E0B" stroke-width="1.4" fill="none" stroke-linecap="round" />
  <path d="M32,10 Q50,35 49,47" stroke="#F59E0B" stroke-width="1.4" fill="none" stroke-linecap="round" />
  
  <!-- Saffron Red Tilak & Golden Pearl Apex -->
  <circle cx="32" cy="22" r="2.8" fill="#DC2626" stroke="#FEF08A" stroke-width="0.8" />
  <circle cx="32" cy="9" r="2" fill="#F59E0B" />
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
