import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. BEBINCA (Goan 7-Layered Coconut Milk & Jaggery Pudding)
const bebincaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGradBeb" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#3E2723"/>
      <stop offset="100%" stop-color="#1A0C08"/>
    </radialGradient>
    <linearGradient id="layerDark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4E260E"/>
      <stop offset="50%" stop-color="#6D3814"/>
      <stop offset="100%" stop-color="#3D1C08"/>
    </linearGradient>
    <linearGradient id="layerLight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A26227"/>
      <stop offset="50%" stop-color="#C6833D"/>
      <stop offset="100%" stop-color="#8F4F19"/>
    </linearGradient>
    <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5EFEB"/>
      <stop offset="50%" stop-color="#DFD5C8"/>
      <stop offset="100%" stop-color="#B8A996"/>
    </linearGradient>
    <filter id="dropShadowBeb" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="450" fill="url(#bgGradBeb)"/>
  
  <!-- Wooden Platter -->
  <ellipse cx="300" cy="310" rx="240" ry="90" fill="#2B1408" opacity="0.8"/>
  <ellipse cx="300" cy="295" rx="220" ry="75" fill="url(#plateGrad)" filter="url(#dropShadowBeb)"/>
  <ellipse cx="300" cy="295" rx="190" ry="60" fill="#E8DED2" opacity="0.9"/>

  <!-- Bebinca Slices -->
  <g transform="translate(180, 130)" filter="url(#dropShadowBeb)">
    <!-- Main Wedge Slice -->
    <!-- Top Face -->
    <polygon points="120,40 220,100 120,150 20,90" fill="#783F15" stroke="#4A2307" stroke-width="1.5"/>
    <polygon points="120,40 220,100 120,150 20,90" fill="url(#layerLight)" opacity="0.4"/>
    <ellipse cx="120" cy="95" rx="70" ry="25" fill="#FFE082" opacity="0.2"/>

    <!-- Front Left Face (7 Distinct Layers) -->
    <!-- Layer 1 -->
    <polygon points="20,90 120,150 120,165 20,105" fill="url(#layerDark)"/>
    <!-- Layer 2 -->
    <polygon points="20,105 120,165 120,178 20,118" fill="url(#layerLight)"/>
    <!-- Layer 3 -->
    <polygon points="20,118 120,178 120,192 20,132" fill="url(#layerDark)"/>
    <!-- Layer 4 -->
    <polygon points="20,132 120,192 120,205 20,145" fill="url(#layerLight)"/>
    <!-- Layer 5 -->
    <polygon points="20,145 120,205 120,218 20,158" fill="url(#layerDark)"/>
    <!-- Layer 6 -->
    <polygon points="20,158 120,218 120,230 20,170" fill="url(#layerLight)"/>
    <!-- Layer 7 -->
    <polygon points="20,170 120,230 120,245 20,185" fill="url(#layerDark)"/>

    <!-- Front Right Face (7 Distinct Layers) -->
    <!-- Layer 1 -->
    <polygon points="120,150 220,100 220,115 120,165" fill="url(#layerLight)"/>
    <!-- Layer 2 -->
    <polygon points="120,165 220,115 220,128 120,178" fill="url(#layerDark)"/>
    <!-- Layer 3 -->
    <polygon points="120,178 220,128 220,142 120,192" fill="url(#layerLight)"/>
    <!-- Layer 4 -->
    <polygon points="120,192 220,142 220,155 120,205" fill="url(#layerDark)"/>
    <!-- Layer 5 -->
    <polygon points="120,205 220,155 220,168 120,218" fill="url(#layerLight)"/>
    <!-- Layer 6 -->
    <polygon points="120,218 220,168 220,180 120,230" fill="url(#layerDark)"/>
    <!-- Layer 7 -->
    <polygon points="120,230 220,180 220,195 120,245" fill="url(#layerLight)"/>

    <!-- Garnish & Nutmeg / Almond Flakes on Top -->
    <ellipse cx="110" cy="85" rx="8" ry="4" fill="#FFE0B2" transform="rotate(-15, 110, 85)"/>
    <ellipse cx="135" cy="95" rx="9" ry="4" fill="#FFE0B2" transform="rotate(25, 135, 95)"/>
    <ellipse cx="90" cy="95" rx="7" ry="3" fill="#FFE0B2" transform="rotate(40, 90, 95)"/>
    <circle cx="125" cy="80" r="1.5" fill="#5D4037"/>
    <circle cx="105" cy="100" r="1.5" fill="#5D4037"/>
    <circle cx="140" cy="90" r="1.2" fill="#5D4037"/>
  </g>

  <!-- Label Badge -->
  <rect x="30" y="30" width="220" height="38" rx="10" fill="#000000" opacity="0.6"/>
  <text x="45" y="55" fill="#F0C05A" font-family="'Playfair Display', serif" font-size="17" font-weight="bold">Goan 7-Layer Bebinca</text>
</svg>`;

// 2. DODOL (Authentic Goan Coconut Jaggery Halwa Fudge)
const dodolSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGradDod" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#2D150B"/>
      <stop offset="100%" stop-color="#120603"/>
    </radialGradient>
    <linearGradient id="dodolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3E1C0C"/>
      <stop offset="40%" stop-color="#260F05"/>
      <stop offset="100%" stop-color="#120501"/>
    </linearGradient>
    <linearGradient id="glossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="brassPlatter" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#B45309"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
    <filter id="shadowDod" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.7"/>
    </filter>
  </defs>

  <rect width="600" height="450" fill="url(#bgGradDod)"/>
  
  <!-- Brass Thali Platter -->
  <ellipse cx="300" cy="300" rx="230" ry="85" fill="url(#brassPlatter)" filter="url(#shadowDod)"/>
  <ellipse cx="300" cy="298" rx="205" ry="70" fill="#92400E" opacity="0.9"/>
  <ellipse cx="300" cy="298" rx="180" ry="58" fill="#78350F"/>

  <!-- Dodol Diamond & Square Halwa Cubes -->
  <!-- Cube 1 (Center Front) -->
  <g transform="translate(230, 200)" filter="url(#shadowDod)">
    <!-- Top Face -->
    <polygon points="70,10 130,40 70,70 10,40" fill="#2E1206" stroke="#4A1E0B" stroke-width="1"/>
    <polygon points="70,10 130,40 70,70 10,40" fill="url(#glossGrad)"/>
    <!-- Left Face -->
    <polygon points="10,40 70,70 70,125 10,95" fill="#1C0902"/>
    <!-- Right Face -->
    <polygon points="70,70 130,40 130,95 70,125" fill="#280F05"/>
    <!-- Cashew Nut on Top -->
    <path d="M60,35 C55,28 75,25 80,33 C83,38 72,45 60,35 Z" fill="#FDE68A" stroke="#D97706" stroke-width="0.8"/>
  </g>

  <!-- Cube 2 (Left) -->
  <g transform="translate(130, 180)" filter="url(#shadowDod)">
    <polygon points="70,10 130,40 70,70 10,40" fill="#2E1206" stroke="#4A1E0B" stroke-width="1"/>
    <polygon points="70,10 130,40 70,70 10,40" fill="url(#glossGrad)"/>
    <polygon points="10,40 70,70 70,120 10,90" fill="#1C0902"/>
    <polygon points="70,70 130,40 130,90 70,120" fill="#280F05"/>
    <path d="M62,35 C57,28 77,25 82,33 C85,38 74,45 62,35 Z" fill="#FDE68A" stroke="#D97706" stroke-width="0.8"/>
  </g>

  <!-- Cube 3 (Right) -->
  <g transform="translate(330, 180)" filter="url(#shadowDod)">
    <polygon points="70,10 130,40 70,70 10,40" fill="#2E1206" stroke="#4A1E0B" stroke-width="1"/>
    <polygon points="70,10 130,40 70,70 10,40" fill="url(#glossGrad)"/>
    <polygon points="10,40 70,70 70,120 10,90" fill="#1C0902"/>
    <polygon points="70,70 130,40 130,90 70,120" fill="#280F05"/>
    <path d="M58,35 C53,28 73,25 78,33 C81,38 70,45 58,35 Z" fill="#FDE68A" stroke="#D97706" stroke-width="0.8"/>
  </g>

  <!-- Label Badge -->
  <rect x="30" y="30" width="220" height="38" rx="10" fill="#000000" opacity="0.6"/>
  <text x="45" y="55" fill="#F0C05A" font-family="'Playfair Display', serif" font-size="17" font-weight="bold">Goan Coconut Dodol</text>
</svg>`;

// 3. BHAVNAGRI PAPDI GATHIYA
const gathiyaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGradGath" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#3A220F"/>
      <stop offset="100%" stop-color="#180B04"/>
    </radialGradient>
    <linearGradient id="gathiyaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#EAB308"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>
    <filter id="shadowGath" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="600" height="450" fill="url(#bgGradGath)"/>
  
  <!-- Traditional Clay Handi Bowl -->
  <ellipse cx="300" cy="310" rx="230" ry="85" fill="#1F1008" opacity="0.8"/>
  <ellipse cx="300" cy="290" rx="210" ry="75" fill="#B45309" filter="url(#shadowGath)"/>
  <ellipse cx="300" cy="285" rx="180" ry="60" fill="#78350F"/>

  <!-- Thick Crunchy Bhavnagri Gathiya Ribbons -->
  <g filter="url(#shadowGath)">
    <!-- Gathiya Ribbon 1 -->
    <path d="M160,280 Q220,180 320,200 Q390,210 440,260" stroke="url(#gathiyaGrad)" stroke-width="26" stroke-linecap="round" fill="none"/>
    <!-- Gathiya Ribbon 2 -->
    <path d="M180,240 Q260,160 360,180 Q420,200 460,230" stroke="url(#gathiyaGrad)" stroke-width="24" stroke-linecap="round" fill="none"/>
    <!-- Gathiya Ribbon 3 -->
    <path d="M140,260 Q240,290 350,250 Q410,230 430,190" stroke="url(#gathiyaGrad)" stroke-width="25" stroke-linecap="round" fill="none"/>
    <!-- Gathiya Ribbon 4 -->
    <path d="M210,190 Q300,140 400,160" stroke="url(#gathiyaGrad)" stroke-width="24" stroke-linecap="round" fill="none"/>
    <!-- Gathiya Ribbon 5 -->
    <path d="M190,260 Q280,230 380,270" stroke="url(#gathiyaGrad)" stroke-width="26" stroke-linecap="round" fill="none"/>

    <!-- Ajwain & Black Pepper flecks on Gathiya -->
    <circle cx="250" cy="180" r="1.5" fill="#3E2723"/>
    <circle cx="280" cy="190" r="1.8" fill="#3E2723"/>
    <circle cx="340" cy="200" r="1.5" fill="#3E2723"/>
    <circle cx="310" cy="160" r="2.0" fill="#3E2723"/>
    <circle cx="220" cy="240" r="1.8" fill="#3E2723"/>
    <circle cx="390" cy="240" r="1.5" fill="#3E2723"/>
    <circle cx="420" cy="210" r="1.6" fill="#3E2723"/>
  </g>

  <!-- Green Chillies Garnish on side -->
  <path d="M410,310 Q440,280 470,300 Q460,320 410,310 Z" fill="#16A34A" stroke="#14532D" stroke-width="1"/>
  <path d="M430,325 Q460,305 490,320 Q480,335 430,325 Z" fill="#15803D" stroke="#14532D" stroke-width="1"/>

  <!-- Label Badge -->
  <rect x="30" y="30" width="240" height="38" rx="10" fill="#000000" opacity="0.6"/>
  <text x="45" y="55" fill="#F0C05A" font-family="'Playfair Display', serif" font-size="17" font-weight="bold">Bhavnagri Papdi Gathiya</text>
</svg>`;

// 4. MAPUSA SPICY TIKHA SEV
const sevSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGradSev" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#34180A"/>
      <stop offset="100%" stop-color="#140602"/>
    </radialGradient>
    <linearGradient id="sevGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#DC2626"/>
    </linearGradient>
    <filter id="shadowSev" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="600" height="450" fill="url(#bgGradSev)"/>
  
  <!-- Brass Bowl -->
  <ellipse cx="300" cy="300" rx="220" ry="80" fill="#B45309" filter="url(#shadowSev)"/>
  <ellipse cx="300" cy="295" rx="190" ry="65" fill="#92400E"/>
  <ellipse cx="300" cy="295" rx="160" ry="50" fill="#78350F"/>

  <!-- Fine Spicy Crispy Vermicelli Sev Pile -->
  <g stroke="url(#sevGrad)" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.95" filter="url(#shadowSev)">
    <path d="M170,280 Q230,220 310,230 T430,260"/>
    <path d="M180,260 Q270,180 360,200 T440,240"/>
    <path d="M160,250 Q240,160 330,170 T420,230"/>
    <path d="M200,220 Q290,140 380,180 T450,220"/>
    <path d="M220,180 Q300,130 370,160 T420,210"/>
    <path d="M190,200 Q280,150 350,180 T410,250"/>
    <path d="M210,240 Q310,190 390,220 T440,270"/>
    <path d="M175,270 Q250,210 325,220 T400,265"/>
    <path d="M225,195 Q295,155 365,175 T435,215"/>
    <path d="M185,230 Q265,175 345,195 T425,245"/>
    <path d="M195,210 Q275,165 355,185 T415,235"/>
    <path d="M205,250 Q285,195 365,215 T445,255"/>
    <path d="M215,170 Q295,145 375,165 T405,205"/>
  </g>

  <!-- Deep Fried Curry Leaves -->
  <path d="M280,160 Q305,140 325,155 Q310,175 280,160 Z" fill="#15803D" stroke="#166534" stroke-width="0.8"/>
  <path d="M340,180 Q365,160 385,175 Q370,195 340,180 Z" fill="#15803D" stroke="#166534" stroke-width="0.8"/>

  <!-- Label Badge -->
  <rect x="30" y="30" width="220" height="38" rx="10" fill="#000000" opacity="0.6"/>
  <text x="45" y="55" fill="#F0C05A" font-family="'Playfair Display', serif" font-size="17" font-weight="bold">Mapusa Tikha Sev</text>
</svg>`;

// 5. SWEET MALAI LASSI
const lassiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGradLassi" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#3B2011"/>
      <stop offset="100%" stop-color="#140A04"/>
    </radialGradient>
    <linearGradient id="kulhadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9A3412"/>
      <stop offset="50%" stop-color="#C2410C"/>
      <stop offset="100%" stop-color="#7C2D12"/>
    </linearGradient>
    <linearGradient id="lassiCream" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF7"/>
      <stop offset="60%" stop-color="#FEF3C7"/>
      <stop offset="100%" stop-color="#FDE68A"/>
    </linearGradient>
    <filter id="shadowLassi" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="600" height="450" fill="url(#bgGradLassi)"/>
  
  <!-- Wooden Table Mat -->
  <ellipse cx="300" cy="370" rx="180" ry="50" fill="#1C0D05" opacity="0.8"/>

  <!-- Earthen Clay Kulhad Glass -->
  <g transform="translate(190, 70)" filter="url(#shadowLassi)">
    <!-- Kulhad Body -->
    <path d="M40,100 L65,300 Q110,315 155,300 L180,100 Z" fill="url(#kulhadGrad)" stroke="#7C2D12" stroke-width="2"/>
    
    <!-- Ribbed Texture on Terracotta Kulhad -->
    <path d="M48,150 Q110,165 172,150" stroke="#7C2D12" stroke-width="2.5" fill="none" opacity="0.6"/>
    <path d="M53,200 Q110,215 167,200" stroke="#7C2D12" stroke-width="2.5" fill="none" opacity="0.6"/>
    <path d="M59,250 Q110,265 161,250" stroke="#7C2D12" stroke-width="2.5" fill="none" opacity="0.6"/>

    <!-- Thick Frothy Creamy Lassi Surface -->
    <ellipse cx="110" cy="100" rx="70" ry="25" fill="url(#lassiCream)" stroke="#FDE68A" stroke-width="1.5"/>
    
    <!-- Thick Golden Malai Dollop in Center -->
    <ellipse cx="110" cy="95" rx="45" ry="16" fill="#FFFBEB" stroke="#FEF08A" stroke-width="1"/>
    
    <!-- Saffron Threads & Chopped Pistachio Garnish -->
    <path d="M100,90 Q110,85 120,92" stroke="#DC2626" stroke-width="1.5" fill="none"/>
    <path d="M105,96 Q115,102 125,95" stroke="#EA580C" stroke-width="1.5" fill="none"/>
    <path d="M92,94 Q102,98 108,91" stroke="#DC2626" stroke-width="1.5" fill="none"/>
    
    <!-- Emerald Pistachio Slivers -->
    <ellipse cx="95" cy="90" rx="4" ry="2.5" fill="#16A34A" transform="rotate(-20, 95, 90)"/>
    <ellipse cx="125" cy="90" rx="4.5" ry="2.5" fill="#16A34A" transform="rotate(30, 125, 90)"/>
    <ellipse cx="112" cy="102" rx="4" ry="2" fill="#16A34A" transform="rotate(10, 112, 102)"/>
    <ellipse cx="130" cy="100" rx="3.5" ry="2" fill="#65A30D"/>
  </g>

  <!-- Label Badge -->
  <rect x="30" y="30" width="220" height="38" rx="10" fill="#000000" opacity="0.6"/>
  <text x="45" y="55" fill="#F0C05A" font-family="'Playfair Display', serif" font-size="17" font-weight="bold">Special Malai Lassi</text>
</svg>`;

// 6. SHAHI BESAN LADDOO
const besanLadduSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGradBesan" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#38200C"/>
      <stop offset="100%" stop-color="#140A03"/>
    </radialGradient>
    <radialGradient id="besanSphere" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="40%" stop-color="#F59E0B"/>
      <stop offset="85%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#92400E"/>
    </radialGradient>
    <filter id="shadowBesan" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="600" height="450" fill="url(#bgGradBesan)"/>
  
  <!-- Brass Platter -->
  <ellipse cx="300" cy="300" rx="220" ry="80" fill="#B45309" filter="url(#shadowBesan)"/>
  <ellipse cx="300" cy="295" rx="195" ry="65" fill="#92400E"/>

  <!-- Golden Besan Laddoos Pile -->
  <!-- Laddoo 1 (Left Back) -->
  <g transform="translate(200, 180)" filter="url(#shadowBesan)">
    <circle cx="50" cy="50" r="45" fill="url(#besanSphere)"/>
    <ellipse cx="45" cy="35" rx="6" ry="3" fill="#FFE082" transform="rotate(-30, 45, 35)"/>
  </g>

  <!-- Laddoo 2 (Right Back) -->
  <g transform="translate(300, 180)" filter="url(#shadowBesan)">
    <circle cx="50" cy="50" r="45" fill="url(#besanSphere)"/>
    <ellipse cx="52" cy="35" rx="6" ry="3" fill="#FFE082" transform="rotate(20, 52, 35)"/>
  </g>

  <!-- Laddoo 3 (Center Front Primary) -->
  <g transform="translate(250, 190)" filter="url(#shadowBesan)">
    <circle cx="50" cy="50" r="50" fill="url(#besanSphere)"/>
    <!-- Slivered Almonds & Pistachio Garnish -->
    <ellipse cx="45" cy="30" rx="8" ry="4" fill="#FEF3C7" stroke="#D97706" stroke-width="0.5" transform="rotate(-25, 45, 30)"/>
    <ellipse cx="58" cy="32" rx="7" ry="3.5" fill="#16A34A" stroke="#15803D" stroke-width="0.5" transform="rotate(35, 58, 32)"/>
    <ellipse cx="50" cy="40" rx="5" ry="2.5" fill="#DC2626" transform="rotate(10, 50, 40)"/>
  </g>

  <!-- Laddoo 4 (Left Front) -->
  <g transform="translate(160, 220)" filter="url(#shadowBesan)">
    <circle cx="45" cy="45" r="42" fill="url(#besanSphere)"/>
    <ellipse cx="40" cy="32" rx="6" ry="3" fill="#FEF3C7" transform="rotate(-15, 40, 32)"/>
    <ellipse cx="50" cy="34" rx="5" ry="2.5" fill="#16A34A" transform="rotate(30, 50, 34)"/>
  </g>

  <!-- Laddoo 5 (Right Front) -->
  <g transform="translate(340, 220)" filter="url(#shadowBesan)">
    <circle cx="45" cy="45" r="42" fill="url(#besanSphere)"/>
    <ellipse cx="42" cy="32" rx="6" ry="3" fill="#FEF3C7" transform="rotate(-20, 42, 32)"/>
    <ellipse cx="52" cy="34" rx="5" ry="2.5" fill="#16A34A" transform="rotate(25, 52, 34)"/>
  </g>

  <!-- Label Badge -->
  <rect x="30" y="30" width="220" height="38" rx="10" fill="#000000" opacity="0.6"/>
  <text x="45" y="55" fill="#F0C05A" font-family="'Playfair Display', serif" font-size="17" font-weight="bold">Shahi Besan Laddoo</text>
</svg>`;

// 7. AFGHANI LONG GREEN RAISINS (KISMIS)
const raisinsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGradRaisin" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#223315"/>
      <stop offset="100%" stop-color="#0B1306"/>
    </radialGradient>
    <linearGradient id="raisinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#BEF264"/>
      <stop offset="50%" stop-color="#84CC16"/>
      <stop offset="100%" stop-color="#4D7C0F"/>
    </linearGradient>
    <filter id="shadowRaisin" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="600" height="450" fill="url(#bgGradRaisin)"/>
  
  <!-- Wooden Bowl -->
  <ellipse cx="300" cy="300" rx="220" ry="80" fill="#2E180A" filter="url(#shadowRaisin)"/>
  <ellipse cx="300" cy="295" rx="190" ry="65" fill="#45230D"/>

  <!-- Plentiful Long Slender Green Raisins -->
  <g filter="url(#shadowRaisin)">
    ${[
      { cx: 240, cy: 230, r: -35 }, { cx: 280, cy: 220, r: 25 }, { cx: 320, cy: 215, r: -15 },
      { cx: 360, cy: 225, r: 40 }, { cx: 210, cy: 260, r: 10 }, { cx: 260, cy: 250, r: -45 },
      { cx: 300, cy: 245, r: 30 }, { cx: 340, cy: 250, r: -20 }, { cx: 390, cy: 260, r: 50 },
      { cx: 230, cy: 280, r: -10 }, { cx: 275, cy: 275, r: 20 }, { cx: 325, cy: 270, r: -30 },
      { cx: 370, cy: 280, r: 15 }, { cx: 250, cy: 295, r: 45 }, { cx: 300, cy: 290, r: -15 },
      { cx: 350, cy: 295, r: 35 }
    ].map(p => `
      <g transform="translate(${p.cx}, ${p.cy}) rotate(${p.r})">
        <ellipse cx="0" cy="0" rx="22" ry="7.5" fill="url(#raisinGrad)" stroke="#3F6212" stroke-width="0.8"/>
        <path d="M-15,-2 Q0,-4 15,-2" stroke="#ECFCCB" stroke-width="0.8" fill="none" opacity="0.6"/>
      </g>
    `).join('')}
  </g>

  <!-- Label Badge -->
  <rect x="30" y="30" width="240" height="38" rx="10" fill="#000000" opacity="0.6"/>
  <text x="45" y="55" fill="#F0C05A" font-family="'Playfair Display', serif" font-size="17" font-weight="bold">Afghani Green Raisins</text>
</svg>`;

// 8. FRESH SOFT MALAI PANEER
const paneerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGradPaneer" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#3A3530"/>
      <stop offset="100%" stop-color="#161412"/>
    </radialGradient>
    <linearGradient id="paneerTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>
    <linearGradient id="paneerSide" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <filter id="shadowPaneer" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <rect width="600" height="450" fill="url(#bgGradPaneer)"/>
  
  <!-- Slate Cutting Board -->
  <rect x="100" y="140" width="400" height="240" rx="20" fill="#292524" filter="url(#shadowPaneer)"/>
  <rect x="110" y="150" width="380" height="220" rx="14" fill="#1C1917"/>

  <!-- Pristine Fresh Malai Paneer Cubes -->
  <!-- Cube 1 (Large Center Block) -->
  <g transform="translate(180, 160)" filter="url(#shadowPaneer)">
    <polygon points="60,10 140,30 80,70 0,50" fill="url(#paneerTop)" stroke="#E2E8F0" stroke-width="0.8"/>
    <polygon points="0,50 80,70 80,140 0,120" fill="url(#paneerSide)"/>
    <polygon points="80,70 140,30 140,100 80,140" fill="#94A3B8"/>
  </g>

  <!-- Cube 2 (Right Front Cut Cube) -->
  <g transform="translate(320, 230)" filter="url(#shadowPaneer)">
    <polygon points="40,10 90,25 50,55 0,40" fill="url(#paneerTop)" stroke="#E2E8F0" stroke-width="0.8"/>
    <polygon points="0,40 50,55 50,100 0,85" fill="url(#paneerSide)"/>
    <polygon points="50,55 90,25 90,70 50,100" fill="#94A3B8"/>
  </g>

  <!-- Cube 3 (Left Front Cut Cube) -->
  <g transform="translate(140, 240)" filter="url(#shadowPaneer)">
    <polygon points="35,10 80,22 45,50 0,38" fill="url(#paneerTop)" stroke="#E2E8F0" stroke-width="0.8"/>
    <polygon points="0,38 45,50 45,90 0,78" fill="url(#paneerSide)"/>
    <polygon points="45,50 80,22 80,62 45,90" fill="#94A3B8"/>
  </g>

  <!-- Mint Leaves & Peppercorns on Board -->
  <path d="M380,200 Q405,185 420,195 Q410,215 380,200 Z" fill="#16A34A"/>
  <circle cx="395" cy="320" r="3" fill="#0F172A"/>
  <circle cx="410" cy="310" r="2.5" fill="#0F172A"/>
  <circle cx="380" cy="330" r="2.5" fill="#0F172A"/>

  <!-- Label Badge -->
  <rect x="30" y="30" width="220" height="38" rx="10" fill="#000000" opacity="0.6"/>
  <text x="45" y="55" fill="#F0C05A" font-family="'Playfair Display', serif" font-size="17" font-weight="bold">Fresh Malai Paneer</text>
</svg>`;

// 9. SPONGY BENGALI RASGULLA
const rasgullaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGradRas" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#2D1F1A"/>
      <stop offset="100%" stop-color="#110A08"/>
    </radialGradient>
    <radialGradient id="rasgullaBall" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#FFFDF7"/>
      <stop offset="85%" stop-color="#F3ECE0"/>
      <stop offset="100%" stop-color="#D6C5B3"/>
    </radialGradient>
    <linearGradient id="syrupShine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadowRas" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="600" height="450" fill="url(#bgGradRas)"/>
  
  <!-- Clear Glass / Ceramic Serving Bowl with Rose Sugar Syrup -->
  <ellipse cx="300" cy="300" rx="230" ry="85" fill="#E2D7CB" filter="url(#shadowRas)"/>
  <ellipse cx="300" cy="290" rx="205" ry="70" fill="#FAF5EF"/>
  <ellipse cx="300" cy="290" rx="185" ry="60" fill="#FEF9C3" opacity="0.5"/>

  <!-- Spongy White Rasgulla Spheres Floating in Rose Syrup -->
  <!-- Ball 1 (Left Back) -->
  <g transform="translate(190, 180)" filter="url(#shadowRas)">
    <circle cx="50" cy="50" r="46" fill="url(#rasgullaBall)"/>
    <ellipse cx="40" cy="35" rx="14" ry="7" fill="url(#syrupShine)" transform="rotate(-20, 40, 35)"/>
  </g>

  <!-- Ball 2 (Right Back) -->
  <g transform="translate(310, 180)" filter="url(#shadowRas)">
    <circle cx="50" cy="50" r="46" fill="url(#rasgullaBall)"/>
    <ellipse cx="42" cy="35" rx="14" ry="7" fill="url(#syrupShine)" transform="rotate(20, 42, 35)"/>
  </g>

  <!-- Ball 3 (Center Front Primary) -->
  <g transform="translate(250, 195)" filter="url(#shadowRas)">
    <circle cx="50" cy="50" r="52" fill="url(#rasgullaBall)"/>
    <ellipse cx="40" cy="30" rx="18" ry="9" fill="url(#syrupShine)" transform="rotate(-15, 40, 30)"/>
    <!-- Saffron Strands & Rose Petal Garnish -->
    <path d="M45,25 Q55,20 62,28" stroke="#DC2626" stroke-width="1.5" fill="none"/>
    <path d="M40,30 Q50,35 55,26" stroke="#EA580C" stroke-width="1.5" fill="none"/>
    <ellipse cx="60" cy="35" rx="6" ry="3" fill="#BE123C" opacity="0.8" transform="rotate(30, 60, 35)"/>
  </g>

  <!-- Label Badge -->
  <rect x="30" y="30" width="220" height="38" rx="10" fill="#000000" opacity="0.6"/>
  <text x="45" y="55" fill="#F0C05A" font-family="'Playfair Display', serif" font-size="17" font-weight="bold">Spongy Bengali Rasgulla</text>
</svg>`;

// Write all SVGs
fs.writeFileSync(path.join(outDir, 'bebinca.svg'), bebincaSvg);
fs.writeFileSync(path.join(outDir, 'bebinca.jpg'), bebincaSvg);

fs.writeFileSync(path.join(outDir, 'dodol.svg'), dodolSvg);
fs.writeFileSync(path.join(outDir, 'dodol.jpg'), dodolSvg);

fs.writeFileSync(path.join(outDir, 'gathiya.svg'), gathiyaSvg);
fs.writeFileSync(path.join(outDir, 'gathiya.jpg'), gathiyaSvg);

fs.writeFileSync(path.join(outDir, 'sev.svg'), sevSvg);
fs.writeFileSync(path.join(outDir, 'sev.jpg'), sevSvg);

fs.writeFileSync(path.join(outDir, 'lassi.svg'), lassiSvg);
fs.writeFileSync(path.join(outDir, 'lassi.jpg'), lassiSvg);

fs.writeFileSync(path.join(outDir, 'besanladdu.svg'), besanLadduSvg);
fs.writeFileSync(path.join(outDir, 'besanladdu.jpg'), besanLadduSvg);

fs.writeFileSync(path.join(outDir, 'raisins.svg'), raisinsSvg);
fs.writeFileSync(path.join(outDir, 'raisins.jpg'), raisinsSvg);

fs.writeFileSync(path.join(outDir, 'paneer.svg'), paneerSvg);
fs.writeFileSync(path.join(outDir, 'paneer.jpg'), paneerSvg);

fs.writeFileSync(path.join(outDir, 'rasgulla.svg'), rasgullaSvg);
fs.writeFileSync(path.join(outDir, 'rasgulla.jpg'), rasgullaSvg);

console.log('Successfully generated all accurate delicacy graphics in public/products/');
