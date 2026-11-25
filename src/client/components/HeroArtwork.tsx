import { useState } from 'react';
import type { Hero } from '../../shared/types';

interface HeroArtworkProps {
  hero: Hero;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export function HeroArtwork({
  hero,
  className = '',
  imgClassName = '',
  priority = false,
}: HeroArtworkProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const sources = [hero.imageUrl, hero.sourceArtworkUrl];
  const currentSrc = sources[sourceIndex];

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center bg-slate-900/90 ${className}`}
    >
      {/* Dynamic Hero Accent Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-45 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${hero.accentColor}66 0%, ${hero.accentColor}1a 48%, transparent 75%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 ow-grid-bg opacity-40" />

      {currentSrc ? (
        <img
          src={currentSrc}
          alt={`${hero.nameKo} (${hero.nameEn}) 공식 아트워크`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setSourceIndex((prev) => prev + 1)}
          className={`relative z-10 h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)] transition-transform duration-300 ${imgClassName}`}
        />
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
          <span
            className="font-display text-5xl font-bold tracking-wider"
            style={{ color: hero.accentColor }}
          >
            {hero.nameEn.slice(0, 2).toUpperCase()}
          </span>
          <span className="mt-1 text-xs text-slate-400">{hero.nameKo}</span>
        </div>
      )}
    </div>
  );
}
