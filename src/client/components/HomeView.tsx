import { Crown, Play, Shield, Sparkles, Swords, Trophy } from 'lucide-react';
import { FEMALE_HEROES, ROLE_META } from '../../shared/heroes';
import type { HeroRanking, HeroRole, RoundPreset } from '../../shared/types';
import { HeroArtwork } from './HeroArtwork';

interface HomeViewProps {
  roundPreset: RoundPreset;
  roleFilter: HeroRole | 'all';
  includeOmnic: boolean;
  availableCount: number;
  rankings: HeroRanking[];
  totalRuns: number;
  isLoadingRankings: boolean;
  onChangeRoundPreset: (preset: RoundPreset) => void;
  onChangeRoleFilter: (role: HeroRole | 'all') => void;
  onToggleOmnic: (include: boolean) => void;
  onStart: () => void;
  onOpenRankings: () => void;
}

const ROLE_OPTIONS: Array<{ value: HeroRole | 'all'; label: string }> = [
  { value: 'all', label: '전체 역할' },
  { value: 'tank', label: '돌격' },
  { value: 'damage', label: '공격' },
  { value: 'support', label: '지원' },
];

export function HomeView({
  roundPreset,
  roleFilter,
  includeOmnic,
  availableCount,
  rankings,
  totalRuns,
  isLoadingRankings,
  onChangeRoundPreset,
  onChangeRoleFilter,
  onToggleOmnic,
  onStart,
  onOpenRankings,
}: HomeViewProps) {
  const topThree = rankings.slice(0, 3);
  const canPlay8 = availableCount >= 8;
  const canPlay16 = availableCount >= 16;

  const presets: Array<{
    value: RoundPreset;
    title: string;
    subtitle: string;
    disabled: boolean;
    badge?: string;
  }> = [
    {
      value: 8,
      title: '8강 토너먼트',
      subtitle: '7번의 선택으로 빠르게 최애 결정',
      disabled: !canPlay8,
    },
    {
      value: 16,
      title: '16강 토너먼트',
      subtitle: '밸런스 좋은 클래식 월드컵 (15경기)',
      disabled: !canPlay16,
      badge: '추천',
    },
    {
      value: 'all',
      title: `올스타 ${availableCount}강`,
      subtitle: '선택된 기본 여캐 전원 출전 (부전승 자동 배치)',
      disabled: availableCount < 2,
    },
  ];

  const effectiveEntrants =
    roundPreset === 'all' ? availableCount : Math.min(roundPreset, availableCount);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/70 p-6 sm:p-10 shadow-2xl backdrop-blur">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/35 bg-orange-500/10 px-3.5 py-1 text-xs font-bold tracking-wider text-orange-300">
              <Sparkles className="h-3.5 w-3.5" />
              OVERWATCH BASE HEROINE EDITION ({FEMALE_HEROES.length} HEROES)
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl leading-tight">
              오버워치 여캐
              <span className="block bg-gradient-to-r from-orange-400 via-amber-300 to-sky-300 bg-clip-text text-transparent">
                이상형 월드컵
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed">
              공식 기본 영웅 아트워크로 즐기는 1:1 토너먼트! 나만의 최애 오버워치 여성 영웅을
              뽑고, 전 세계 유저들과 실시간 우승 비율·승률 랭킹을 비교해 보세요.
            </p>

            {/* Quick Start Controls */}
            <div className="mt-7 space-y-5">
              {/* Role & Omnic Filter */}
              <div className="flex flex-wrap items-center gap-2">
                {ROLE_OPTIONS.map((opt) => {
                  const active = roleFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeRoleFilter(opt.value)}
                      className={`rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                        active
                          ? 'border-orange-400 bg-orange-500/20 text-orange-200 shadow-[0_0_16px_rgba(250,156,30,0.25)]'
                          : 'border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}

                <label className="ml-auto inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs text-slate-300 cursor-pointer select-none hover:border-slate-500">
                  <input
                    type="checkbox"
                    checked={includeOmnic}
                    onChange={(e) => onToggleOmnic(e.target.checked)}
                    className="h-4 w-4 accent-orange-500 rounded"
                  />
                  옴닉 포함 (오리사·에코)
                </label>
              </div>

              {/* Round Presets */}
              <div className="grid gap-3 sm:grid-cols-3">
                {presets.map((preset) => {
                  const isSelected = roundPreset === preset.value && !preset.disabled;
                  return (
                    <button
                      key={String(preset.value)}
                      type="button"
                      disabled={preset.disabled}
                      onClick={() => onChangeRoundPreset(preset.value)}
                      className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                        preset.disabled
                          ? 'border-slate-800 bg-slate-950/40 text-slate-600 cursor-not-allowed'
                          : isSelected
                            ? 'border-orange-400 bg-gradient-to-br from-orange-500/20 via-slate-900 to-slate-900 text-white shadow-[0_0_24px_rgba(250,156,30,0.2)] cursor-pointer'
                            : 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-600 cursor-pointer'
                      }`}
                    >
                      {preset.badge && !preset.disabled && (
                        <span className="absolute right-3 top-3 rounded-md bg-orange-500 px-2 py-0.5 text-[10px] font-black text-slate-950">
                          {preset.badge}
                        </span>
                      )}
                      <span className="font-display text-base font-bold">{preset.title}</span>
                      <span className="mt-1 text-xs text-slate-400 leading-snug">
                        {preset.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Primary CTA */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onStart}
                  disabled={availableCount < 2}
                  className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 text-base font-black text-slate-950 shadow-lg shadow-orange-500/25 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-40 cursor-pointer animate-ow-glow"
                >
                  <Play className="h-5 w-5 fill-slate-950" />
                  <span>{effectiveEntrants}명 월드컵 시작하기</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenRankings}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-5 py-4 text-sm font-bold text-slate-200 transition hover:border-sky-400/60 hover:text-white cursor-pointer"
                >
                  <Trophy className="h-4 w-4 text-amber-400" />
                  실시간 랭킹 보기
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Live TOP 3 Podium Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-400" />
                <h2 className="font-display text-base font-bold text-white">실시간 TOP 3</h2>
              </div>
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
                누적 {totalRuns.toLocaleString()}회 완료
              </span>
            </div>

            {isLoadingRankings ? (
              <div className="mt-4 space-y-3">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="h-20 animate-pulse rounded-xl border border-slate-800 bg-slate-900/70"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {topThree.map((hero, idx) => {
                  const role = ROLE_META[hero.role];
                  const medalColors = [
                    'from-amber-400 to-orange-500 text-slate-950',
                    'from-slate-300 to-slate-400 text-slate-950',
                    'from-amber-700 to-orange-800 text-white',
                  ];
                  return (
                    <div
                      key={hero.id}
                      className="flex items-center gap-3.5 rounded-xl border border-slate-800/90 bg-slate-900/70 p-2.5 transition hover:border-slate-700"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br font-display text-sm font-black ${medalColors[idx]}`}
                      >
                        {idx + 1}
                      </div>

                      <HeroArtwork
                        hero={hero}
                        className="h-14 w-14 shrink-0 rounded-xl border border-slate-700/80"
                        imgClassName="p-1"
                        priority
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-bold text-white">{hero.nameKo}</span>
                          <span
                            className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${role.badgeClass}`}
                          >
                            {role.labelKo}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                          <span>
                            우승률{' '}
                            <strong className="text-orange-300">
                              {hero.championshipRate.toFixed(1)}%
                            </strong>
                          </span>
                          <span>
                            승률{' '}
                            <strong className="text-sky-300">{hero.winRate.toFixed(1)}%</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/70 px-3 py-2">
                <Swords className="h-4 w-4 text-orange-400 shrink-0" />
                <span>키보드 ← / → 빠른 선택</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/70 px-3 py-2">
                <Shield className="h-4 w-4 text-sky-400 shrink-0" />
                <span>결과 카드 PNG 저장 지원</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
