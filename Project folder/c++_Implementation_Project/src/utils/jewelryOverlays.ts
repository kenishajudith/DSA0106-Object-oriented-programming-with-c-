// SVG Overlays for AR Virtual Try-On
// Returns standalone SVG elements or data URLs for transparent overlay on webcam/photo

export const getJewelrySvgOverlay = (id: string, _colorVariant: string = 'gold'): string => {
  switch (id) {
    case 'necklace-1': // Celestia Diamond Tear Drop Necklace
      return `
        <svg viewBox="0 0 320 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FCE879" />
              <stop offset="50%" stop-color="#C59B27" />
              <stop offset="100%" stop-color="#78550B" />
            </linearGradient>
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="40%" stop-color="#E2E8F0" />
              <stop offset="100%" stop-color="#94A3B8" />
            </linearGradient>
            <radialGradient id="diamShine" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="60%" stop-color="#E0F2FE" />
              <stop offset="100%" stop-color="#38BDF8" />
            </radialGradient>
            <filter id="luxeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="shadowDepth" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.6"/>
            </filter>
          </defs>
          <g filter="url(#shadowDepth)">
            <!-- Realistic Neck Chain Arc following collarbone -->
            <path d="M 20 15 Q 160 170 300 15" fill="none" stroke="url(#silverGrad)" stroke-width="5" stroke-linecap="round" filter="url(#luxeGlow)"/>
            <path d="M 20 15 Q 160 170 300 15" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4,5"/>
            <!-- Dual Side Diamond Clusters -->
            <circle cx="100" cy="72" r="5" fill="url(#diamShine)" stroke="#38BDF8" stroke-width="1"/>
            <circle cx="220" cy="72" r="5" fill="url(#diamShine)" stroke="#38BDF8" stroke-width="1"/>
            <circle cx="130" cy="105" r="6" fill="url(#diamShine)" stroke="#38BDF8" stroke-width="1"/>
            <circle cx="190" cy="105" r="6" fill="url(#diamShine)" stroke="#38BDF8" stroke-width="1"/>
            <!-- Central Pendant Connector -->
            <g transform="translate(160, 118)">
              <circle cx="0" cy="-6" r="4.5" fill="none" stroke="url(#silverGrad)" stroke-width="2.5"/>
              <!-- Pear Cut Central Diamond Drop -->
              <path d="M 0 0 C 14 18 14 36 0 52 C -14 36 -14 18 0 0 Z" fill="url(#diamShine)" stroke="#FFFFFF" stroke-width="1.8" filter="url(#luxeGlow)"/>
              <path d="M 0 2 C 7 18 7 34 0 48 Z" fill="#FFFFFF" opacity="0.6"/>
              <!-- Facet Highlights -->
              <path d="M 0 0 L 0 52 M -10 26 L 10 26 M -7 13 L 7 39 M -7 39 L 7 13" stroke="#FFFFFF" stroke-width="0.8" opacity="0.75"/>
              <circle cx="0" cy="26" r="3.5" fill="#FFFFFF"/>
            </g>
          </g>
        </svg>
      `;

    case 'earrings-1': // Emerald Royal Chandelier Earrings (Full Pair)
      return `
        <svg viewBox="0 0 300 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#34D399" />
              <stop offset="60%" stop-color="#059669" />
              <stop offset="100%" stop-color="#064E3B" />
            </linearGradient>
            <linearGradient id="goldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FDE047" />
              <stop offset="50%" stop-color="#D97706" />
              <stop offset="100%" stop-color="#78350F" />
            </linearGradient>
            <filter id="earringGlow">
              <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.5"/>
            </filter>
          </defs>
          <g filter="url(#earringGlow)">
            <!-- Left Earring -->
            <g transform="translate(60, 20)">
              <circle cx="0" cy="0" r="5" fill="url(#goldMetal)"/>
              <circle cx="0" cy="0" r="2.5" fill="#FEF08A"/>
              <path d="M 0 0 L -14 30 L 14 30 Z" fill="none" stroke="url(#goldMetal)" stroke-width="2.5"/>
              <polygon points="0,12 10,26 0,40 -10,26" fill="url(#emeraldGrad)" stroke="#A7F3D0" stroke-width="1.2"/>
              <polygon points="-7,46 0,62 7,46" fill="url(#emeraldGrad)" stroke="#A7F3D0" stroke-width="1.2"/>
            </g>
            <!-- Right Earring -->
            <g transform="translate(240, 20)">
              <circle cx="0" cy="0" r="5" fill="url(#goldMetal)"/>
              <circle cx="0" cy="0" r="2.5" fill="#FEF08A"/>
              <path d="M 0 0 L -14 30 L 14 30 Z" fill="none" stroke="url(#goldMetal)" stroke-width="2.5"/>
              <polygon points="0,12 10,26 0,40 -10,26" fill="url(#emeraldGrad)" stroke="#A7F3D0" stroke-width="1.2"/>
              <polygon points="-7,46 0,62 7,46" fill="url(#emeraldGrad)" stroke="#A7F3D0" stroke-width="1.2"/>
            </g>
          </g>
        </svg>
      `;

    case 'tiara-1': // Imperial Empress Pearl & Diamond Tiara
      return `
        <svg viewBox="0 0 320 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tiaraGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#FCD34D" />
              <stop offset="50%" stop-color="#F59E0B" />
              <stop offset="100%" stop-color="#FCD34D" />
            </linearGradient>
            <radialGradient id="pearlGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="70%" stop-color="#E2E8F0" />
              <stop offset="100%" stop-color="#CBD5E1" />
            </radialGradient>
            <filter id="tiaraShine">
              <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.5"/>
            </filter>
          </defs>
          <g filter="url(#tiaraShine)">
            <path d="M 20 130 Q 160 75 300 130" fill="none" stroke="url(#tiaraGold)" stroke-width="6" stroke-linecap="round"/>
            <path d="M 50 115 L 70 65 L 90 100 L 120 42 L 160 15 L 200 42 L 230 100 L 250 65 L 270 115" fill="none" stroke="url(#tiaraGold)" stroke-width="3.5"/>
            <circle cx="160" cy="12" r="10" fill="url(#pearlGrad)" stroke="#CBD5E1" stroke-width="1"/>
            <circle cx="120" cy="38" r="8" fill="url(#pearlGrad)"/>
            <circle cx="200" cy="38" r="8" fill="url(#pearlGrad)"/>
            <circle cx="70" cy="60" r="7" fill="url(#pearlGrad)"/>
            <circle cx="250" cy="60" r="7" fill="url(#pearlGrad)"/>
            <polygon points="160,48 167,60 160,72 153,60" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.2"/>
            <polygon points="120,74 126,84 120,94 114,84" fill="#E0F2FE"/>
            <polygon points="200,74 206,84 200,94 194,84" fill="#E0F2FE"/>
          </g>
        </svg>
      `;

    case 'nosering-1': // Royal Heritage Gold Nose Ring (Nath)
      return `
        <svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goldRingGlow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
            </filter>
          </defs>
          <g filter="url(#goldRingGlow)">
            <circle cx="50" cy="55" r="32" fill="none" stroke="#F59E0B" stroke-width="3.5"/>
            <circle cx="22" cy="72" r="4.5" fill="#EF4444" stroke="#991B1B" stroke-width="1"/>
            <circle cx="33" cy="82" r="4" fill="#F8FAFC"/>
            <circle cx="46" cy="87" r="4" fill="#EF4444"/>
            <path d="M 80 48 Q 100 32 118 10" fill="none" stroke="#FBBF24" stroke-width="1.5" stroke-dasharray="2,2"/>
          </g>
        </svg>
      `;

    case 'ring-1': // Sapphire Royal Solitaire Ring
      return `
        <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="platGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="50%" stop-color="#CBD5E1" />
              <stop offset="100%" stop-color="#64748B" />
            </linearGradient>
            <filter id="ringDepth">
              <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.6"/>
            </filter>
          </defs>
          <g filter="url(#ringDepth)">
            <ellipse cx="100" cy="115" rx="48" ry="32" fill="none" stroke="url(#platGrad)" stroke-width="14"/>
            <ellipse cx="100" cy="115" rx="48" ry="32" fill="none" stroke="#FFFFFF" stroke-width="2"/>
            <g transform="translate(100, 78)">
              <polygon points="0,-28 24,0 0,28 -24,0" fill="#1D4ED8" stroke="#60A5FA" stroke-width="2.5"/>
              <polygon points="0,-28 12,0 0,28" fill="#2563EB" opacity="0.85"/>
              <polygon points="-12,-12 0,-28 12,-12" fill="#93C5FD" opacity="0.7"/>
              <circle cx="-26" cy="0" r="3.5" fill="#FFFFFF"/>
              <circle cx="26" cy="0" r="3.5" fill="#FFFFFF"/>
              <circle cx="0" cy="-30" r="3.5" fill="#FFFFFF"/>
              <circle cx="0" cy="30" r="3.5" fill="#FFFFFF"/>
            </g>
          </g>
        </svg>
      `;

    default: // Generic Luxe Gold Pendant
      return `
        <svg viewBox="0 0 300 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M 40 20 Q 150 140 260 20" fill="none" stroke="#F59E0B" stroke-width="4"/>
          <circle cx="150" cy="80" r="15" fill="#DC2626" stroke="#FBBF24" stroke-width="3.5"/>
          <circle cx="150" cy="80" r="7" fill="#FEF08A"/>
        </svg>
      `;
  }
};

/**
 * Returns standalone SVG for a single ear (Left or Right)
 * Enables independent earlobe tracking at different head tilt angles.
 */
export const getSingleEarringSvgOverlay = (id: string, side: 'left' | 'right' = 'left'): string => {
  const flip = side === 'right' ? 'scale(-1, 1)' : '';
  switch (id) {
    case 'earrings-1': // Emerald Royal Chandelier
    default:
      return `
        <svg viewBox="0 0 100 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="emeraldGrad_${side}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#34D399" />
              <stop offset="60%" stop-color="#059669" />
              <stop offset="100%" stop-color="#064E3B" />
            </linearGradient>
            <linearGradient id="goldMetal_${side}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FDE047" />
              <stop offset="50%" stop-color="#D97706" />
              <stop offset="100%" stop-color="#78350F" />
            </linearGradient>
            <filter id="singleEarringGlow_${side}">
              <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.5"/>
            </filter>
          </defs>
          <g filter="url(#singleEarringGlow_${side})" transform="translate(50, 20) ${flip}">
            <!-- Top Stud Hook -->
            <circle cx="0" cy="0" r="6" fill="url(#goldMetal_${side})"/>
            <circle cx="0" cy="0" r="3" fill="#FEF08A"/>
            <!-- Intricate Chandelier Frame -->
            <path d="M 0 0 L -18 36 L 18 36 Z" fill="none" stroke="url(#goldMetal_${side})" stroke-width="3"/>
            <!-- Main Emerald Gem -->
            <polygon points="0,14 12,30 0,46 -12,30" fill="url(#emeraldGrad_${side})" stroke="#A7F3D0" stroke-width="1.5"/>
            <!-- Lower Hanging Emerald Drop -->
            <polygon points="-8,54 0,74 8,54" fill="url(#emeraldGrad_${side})" stroke="#A7F3D0" stroke-width="1.5"/>
            <circle cx="-14" cy="38" r="3" fill="#FFFFFF"/>
            <circle cx="14" cy="38" r="3" fill="#FFFFFF"/>
          </g>
        </svg>
      `;
  }
};
