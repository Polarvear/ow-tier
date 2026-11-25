import { useMemo, useState } from 'react';
import { ArrowLeft, Crown, RefreshCw, Search, Trophy } from 'lucide-react';
import { ROLE_META } from '../../shared/heroes';
import type { HeroRanking, HeroRole } from '../../shared/types';
import { HeroArtwork } from './HeroArtwork';

interface RankingsViewProps {
  rankings: HeroRanking[];
  totalRuns: number;
  isLoading: boolean;
  onRefresh: () => void;
  onBackHome: () => void;
}

type SortMode = 'championship' | 'winRate';

export function RankingsView({
  rankings,
  totalRuns,
  isLoading,
  onRefresh,
  onBackHome,
}: RankingsViewProps) {
  const [roleFilter, setRoleFilter] = useState<HeroRole | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('championship');
  const [search, setSearch] = useState('');

  const filteredRankings = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = rankings.filter((hero) => {
      if (roleFilter !== 'all' && hero.role !== roleFilter) return false;
      if (q) {
        return (
          hero.nameKo.toLowerCase().includes(q) || hero.nameEn.toLowerCase().includes(q)
        );
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortMode === 'winRate') {
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        return b.matchWins - a.matchWins;
      }
      if (b.championshipCount !== a.championshipCount) {
        return b.championshipCount - a.championshipCount;
      }
      return b.winRate - a.winRate;
    });
  }, [rankings, roleFilter, sortMode, search]);

  const topThree = filteredRankings.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-orange-300 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            월드컵 홈으로 돌아가기
          </button>
          <h1 className="mt-2 flex items-center gap-2.5 text-2xl sm:text-4xl font-black text-white">
            <Trophy className="h-7 w-7 text-amber-400" />
            실시간 여캐 랭킹
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Cloudflare D1 실시간 집계 · 누적 토너먼트{' '}
            <strong className="text-orange-300">{totalRuns.toLocaleString()}회</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:border-sky-400/60 hover:text-white disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {/* Filters & Search */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { value: 'all', label: '전체' },
              { value: 'tank', label: '돌격' },
              { value: 'damage', label: '공격' },
              { value: 'support', label: '지원' },
            ] as const
          ).map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRoleFilter(item.value)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                roleFilter === item.value
                  ? 'bg-orange-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 rounded-xl bg-slate-950/80 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setSortMode('championship')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              sortMode === 'championship'
                ? 'bg-slate-800 text-orange-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            우승 비율순
          </button>
          <button
            type="button"
            onClick={() => setSortMode('winRate')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              sortMode === 'winRate'
                ? 'bg-slate-800 text-sky-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1:1 승률순
          </button>
        </div>

        <div className="relative ml-auto min-w-[200px] flex-1 sm:flex-initial">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="영웅 이름 검색..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length > 0 && !search && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {topThree.map((hero, idx) => {
            const role = ROLE_META[hero.role];
            const ringStyle =
              idx === 0
                ? 'border-amber-400/70 shadow-[0_0_30px_rgba(251,191,36,0.18)]'
                : idx === 1
                  ? 'border-slate-400/50'
                  : 'border-orange-700/60';
            return (
              <div
                key={hero.id}
                className={`relative overflow-hidden rounded-2xl border bg-slate-900/85 p-4 ${ringStyle}`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 font-display text-lg font-black text-amber-400">
                    {idx === 0 && <Crown className="h-5 w-5" />}#{idx + 1}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${role.badgeClass}`}
                  >
                    {role.labelKo}
                  </span>
                </div>

                <HeroArtwork
                  hero={hero}
                  className="mt-3 aspect-[16/10] rounded-xl border border-slate-800"
                  imgClassName="p-2"
                />

                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-black text-white">{hero.nameKo}</h3>
                    <span className="font-display text-xs text-slate-400">{hero.nameEn}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      우승률{' '}
                      <strong className="text-orange-300">
                        {hero.championshipRate.toFixed(1)}%
                      </strong>{' '}
                      ({hero.championshipCount}회)
                    </span>
                    <span className="text-slate-400">
                      승률 <strong className="text-sky-300">{hero.winRate.toFixed(1)}%</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Rankings Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-xs font-bold text-slate-400">
                <th className="py-3.5 pl-5 pr-2 w-16">순위</th>
                <th className="py-3.5 px-3">영웅</th>
                <th className="py-3.5 px-3">역할</th>
                <th className="py-3.5 px-3 min-w-[180px]">우승 비율</th>
                <th className="py-3.5 px-3 min-w-[160px]">1:1 승률</th>
                <th className="py-3.5 pl-3 pr-5 text-right">전적</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredRankings.map((hero, idx) => {
                const role = ROLE_META[hero.role];
                return (
                  <tr
                    key={hero.id}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="py-3 pl-5 pr-2 font-display font-black text-slate-300">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <HeroArtwork
                          hero={hero}
                          className="h-12 w-12 shrink-0 rounded-xl border border-slate-700/80"
                          imgClassName="p-0.5"
                        />
                        <div>
                          <div className="font-bold text-white">{hero.nameKo}</div>
                          <div className="text-xs text-slate-400">{hero.nameEn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block rounded-md border px-2 py-0.5 text-xs font-bold ${role.badgeClass}`}
                      >
                        {role.labelKo}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-orange-300">
                          {hero.championshipRate.toFixed(1)}%
                        </span>
                        <span className="text-slate-500">{hero.championshipCount}회 우승</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300"
                          style={{ width: `${Math.min(100, hero.championshipRate)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-sky-300">{hero.winRate.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-300"
                          style={{ width: `${Math.min(100, hero.winRate)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 pl-3 pr-5 text-right font-display text-xs text-slate-400">
                      {hero.matchWins}승 {hero.matchLosses}패
                    </td>
                  </tr>
                );
              })}

              {filteredRankings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-slate-500">
                    검색 조건에 맞는 영웅이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
