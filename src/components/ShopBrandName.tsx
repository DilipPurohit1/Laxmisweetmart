import React from 'react';

interface ShopBrandNameProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ShopBrandName: React.FC<ShopBrandNameProps> = ({ size = 'md', className = '' }) => {
  const widthClass = size === 'sm' ? 'w-44 sm:w-56' : size === 'lg' ? 'w-72 sm:w-[420px]' : 'w-52 sm:w-80';

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      <svg
        viewBox="0 0 240 94"
        className={`${widthClass} h-auto overflow-visible`}
        aria-label="श्री LAXMI SWEET MART"
      >
        {/* 7 Arched 5-Point Stars */}
        <g className="fill-[#6E1824] dark:fill-[#F0C05A] transition-colors duration-300">
          {/* Star 1 */}
          <polygon points="66.5,28.9 67.5,31.6 70.3,31.7 68.1,33.5 68.9,36.2 66.5,34.6 64.2,36.2 64.9,33.5 62.7,31.7 65.5,31.6" />
          {/* Star 2 */}
          <polygon points="75.9,19.3 76.9,21.9 79.8,22.0 77.6,23.8 78.3,26.5 75.9,25.0 73.6,26.5 74.3,23.8 72.1,22.0 74.9,21.9" />
          {/* Star 3 */}
          <polygon points="95.2,12.5 96.2,15.1 99.0,15.2 96.8,17.0 97.6,19.7 95.2,18.2 92.9,19.7 93.6,17.0 91.4,15.2 94.2,15.1" />
          {/* Star 4: Top Center Crest above 'श्री' */}
          <polygon points="120.0,10.0 121.0,12.6 123.8,12.8 121.6,14.5 122.4,17.2 120.0,15.7 117.6,17.2 118.4,14.5 116.2,12.8 119.0,12.6" />
          {/* Star 5 */}
          <polygon points="144.8,12.5 145.8,15.1 148.6,15.2 146.4,17.0 147.1,19.7 144.8,18.2 142.4,19.7 143.2,17.0 141.0,15.2 143.8,15.1" />
          {/* Star 6 */}
          <polygon points="164.1,19.3 165.1,21.9 167.9,22.0 165.7,23.8 166.4,26.5 164.1,25.0 161.7,26.5 162.4,23.8 160.2,22.0 163.1,21.9" />
          {/* Star 7 */}
          <polygon points="173.5,28.9 174.5,31.6 177.3,31.7 175.1,33.5 175.8,36.2 173.5,34.6 171.1,36.2 171.9,33.5 169.7,31.7 172.5,31.6" />
        </g>

        {/* Devanagari श्री */}
        <text
          x="120"
          y="48"
          fontFamily="'Rozha One', 'Yatra One', 'Noto Serif Devanagari', 'Mangal', serif"
          fontSize="26"
          fontWeight="900"
          className="fill-[#6E1824] dark:fill-[#F0C05A] transition-colors duration-300"
          textAnchor="middle"
        >
          श्री
        </text>

        {/* LAXMI SWEET MART */}
        <text
          x="120"
          y="71"
          fontFamily="'Times New Roman', 'Playfair Display', Georgia, serif"
          fontSize="18.5"
          fontWeight="900"
          letterSpacing="1.2"
          className="fill-[#6E1824] dark:fill-[#FFFFFF] transition-colors duration-300"
          textAnchor="middle"
        >
          LAXMI SWEET MART
        </text>

        {/* Subtitle: MAPUSA, GOA · ESTD. 1985 */}
        <text
          x="120"
          y="87"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="7.8"
          fontWeight="900"
          letterSpacing="1.8"
          className="fill-[#B8860B] dark:fill-[#F0C05A] transition-colors duration-300"
          textAnchor="middle"
        >
          MAPUSA, GOA · ESTD. 1985
        </text>
      </svg>
    </div>
  );
};
