import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Home, RotateCcw, Sparkles } from 'lucide-react';
import { ROLE_META } from '../../shared/heroes';
import { getNextMatchPreview, type TournamentState } from '../../shared/tournament';
import type { Hero } from '../../shared/types';
import { HeroArtwork } from './HeroArtwork';

interface TournamentViewProps {
  state: TournamentState;
  onPick: (side: 'left' | 'right') => void;
  onUndo: () => void;
  onExit: () => void;
}

export function TournamentView({ state, onPick, onUndo, onExit }: TournamentViewProps) {
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const currentMatch = state.matches[state.currentMatchIndex];
  const nextMatch = getNextMatchPreview(state);

  const totalMatchesInTournament = state.initialCount - 1;
  const completedMatches = state.votes.length;
  const overallProgress = Math.round((completedMatches / totalMatchesInTournament) * 100);

  const handleSelect = (side: 'left' | 'right') => {
    if (selectedSide) return;
    setSelectedSide(side);
    window.setTimeout(() => {
      setSelectedSide(null);
      onPick(side);
    }, 260);
  };

  // Preload next match artwork for instant transitions
  useEffect(() => {
    if (!nextMatch) return;
    [nextMatch.left.imageUrl, nextMatch.right.imageUrl].forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [nextMatch]);

  // Keyboard shortcuts: Left/1, Right/2, Z/Backspace for undo
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (selectedSide) return;
      if (event.key === 'ArrowLeft' || event.key === '1') {
        event.preventDefault();
        handleSelect('left');
      } else if (event.key === 'ArrowRight' || event.key === '2') {
        event.preventDefault();
        handleSelect('right');
      } else if (
        (event.key === 'z' || event.key === 'Z' || event.key === 'Backspace') &&
        state.history.length > 0
      ) {
        event.preventDefault();
        onUndo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!currentMatch) return null;

  const isFinal = state.roundSize <= 2;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-4 sm:py-6">
      {/* Top HUD */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-display text-sm font-black tracking-wide ${
                isFinal
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-orange-500/30'
                  : 'border border-orange-400/40 bg-orange-500/15 text-orange-300'
              }`}
            >
              {isFinal && <Sparkles className="h-4 w-4" />}
              {state.roundLabel}
            </span>
            <span className="font-display text-sm font-bold text-slate-200">
              매치 {state.currentMatchIndex + 1} / {state.matches.length}
            </span>
            {state.byeHeroes.length > 0 && (
              <span className="hidden sm:inline-block rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                부전승 {state.byeHeroes.length}명 대기
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onUndo}
              disabled={state.history.length === 0 || selectedSide !== null}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:border-slate-500 disabled:opacity-35 cursor-pointer"
              title="이전 선택 되돌리기 (Z)"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              되돌리기
            </button>
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-rose-400/60 hover:text-white cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" />
              나가기
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-sky-400 transition-all duration-300"
              style={{ width: `${Math.max(4, overallProgress)}%` }}
            />
          </div>
          <span className="w-12 text-right font-display text-xs font-bold text-slate-400">
            {overallProgress}%
          </span>
        </div>
      </div>

      {/* VS Arena */}
      <div className="relative mt-4 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 items-stretch">
        <HeroChoiceCard
          hero={currentMatch.left}
          side="left"
          shortcut="←"
          selectedSide={selectedSide}
          onSelect={() => handleSelect('left')}
        />

        {/* Center VS Badge */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="ow-skew flex h-14 w-16 sm:h-16 sm:w-20 items-center justify-center rounded-xl border-2 border-orange-400 bg-slate-950/95 shadow-[0_0_30px_rgba(250,156,30,0.5)]">
            <span className="ow-unskew font-display text-xl sm:text-2xl font-black italic text-orange-400">
              VS
            </span>
          </div>
        </div>

        <HeroChoiceCard
          hero={currentMatch.right}
          side="right"
          shortcut="→"
          selectedSide={selectedSide}
          onSelect={() => handleSelect('right')}
        />
      </div>

      {/* Footer Hint */}
      <p className="mt-3 text-center text-xs text-slate-500">
        마음에 드는 영웅 카드를 클릭하거나 키보드 <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">←</kbd>{' '}
        <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">→</kbd> 로 빠르게 선택할 수 있습니다.
      </p>
    </div>
  );
}

interface HeroChoiceCardProps {
  hero: Hero;
  side: 'left' | 'right';
  shortcut: string;
  selectedSide: 'left' | 'right' | null;
  onSelect: () => void;
}

function HeroChoiceCard({
  hero,
  side,
  shortcut,
  selectedSide,
  onSelect,
}: HeroChoiceCardProps) {
  const role = ROLE_META[hero.role];
  const isChosen = selectedSide === side;
  const isEliminated = selectedSide !== null && selectedSide !== side;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border text-left transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
        isChosen
          ? 'scale-[1.02] border-orange-400 bg-slate-900 shadow-[0_0_45px_rgba(250,156,30,0.45)] z-10'
          : isEliminated
            ? 'scale-[0.97] border-slate-800 bg-slate-950/50 opacity-35'
            : 'border-slate-800 bg-slate-900/75 hover:-translate-y-1 hover:border-orange-400/70 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Top Role & Shortcut Bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 z-10">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${role.badgeClass}`}
        >
          {role.labelKo} · {role.labelEn}
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-700/80 bg-slate-950/70 px-2 py-0.5 font-display text-xs font-bold text-slate-400 group-hover:border-orange-400/50 group-hover:text-orange-300">
          {shortcut === '←' && <ArrowLeft className="h-3 w-3" />}
          {shortcut}
        </span>
      </div>

      {/* Artwork Display */}
      <HeroArtwork
        hero={hero}
        priority
        className="mx-4 aspect-[4/3] sm:aspect-[5/4] flex-1 rounded-2xl border border-slate-800/80"
        imgClassName="p-3 sm:p-5 group-hover:scale-105"
      />

      {/* Name & Tagline */}
      <div className="relative z-10 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {hero.nameKo}
            </h2>
            <p className="font-display text-xs font-bold tracking-widest text-slate-400 uppercase">
              {hero.nameEn}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/90 px-3.5 py-2 text-xs font-black text-slate-200 transition group-hover:bg-orange-500 group-hover:text-slate-950">
            <CheckCircle2 className="h-4 w-4" />
            선택
          </span>
        </div>
        <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm text-slate-300">{hero.tagline}</p>
      </div>

      {/* Winner Flash Overlay */}
      {isChosen && (
        <div className="pointer-events-none absolute inset-0 border-4 border-orange-400 rounded-3xl bg-orange-400/10" />
      )}
    </button>
  );
}
