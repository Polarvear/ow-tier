import { useState } from 'react';
import {
  Check,
  Crown,
  Download,
  RefreshCw,
  Share2,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { ROLE_META } from '../../shared/heroes';
import type { Hero, HeroRanking } from '../../shared/types';
import { downloadResultCardPng } from '../lib/resultCard';
import { HeroArtwork } from './HeroArtwork';

interface ResultViewProps {
  champion: Hero;
  runnerUp: Hero | null;
  semifinalists: Hero[];
  roundCount: number;
  winnerStats: HeroRanking | null;
  totalRuns: number;
  isSubmitting: boolean;
  isSharedPreview?: boolean;
  onPlayAgain: () => void;
  onOpenRankings: () => void;
  onToast: (message: string) => void;
}

export function ResultView({
  champion,
  runnerUp,
  semifinalists,
  roundCount,
  winnerStats,
  totalRuns,
  isSubmitting,
  isSharedPreview = false,
  onPlayAgain,
  onOpenRankings,
  onToast,
}: ResultViewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const role = ROLE_META[champion.role];

  const handleDownloadCard = async () => {
    try {
      setIsDownloading(true);
      await downloadResultCardPng({
        champion,
        runnerUp,
        roundCount,
        winnerStats,
        totalRuns,
      });
      onToast('결과 카드 PNG가 저장되었습니다!');
    } catch (error) {
      onToast(error instanceof Error ? error.message : '이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareLink = async () => {
    const shareUrl = `${window.location.origin}/?winner=${encodeURIComponent(champion.id)}`;
    const shareText = `나의 오버워치 여캐 이상형 월드컵 우승자는 [${champion.nameKo}]! 너의 최애는 누구야?`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: '오버워치 여캐 이상형 월드컵 결과',
          text: shareText,
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      onToast('결과 공유 링크가 클립보드에 복사되었습니다!');
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      onToast('링크 복사에 실패했습니다. 주소창에서 직접 복사해 주세요.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl border border-orange-400/40 bg-slate-900/85 p-6 sm:p-10 shadow-2xl backdrop-blur">
        <div
          className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl opacity-35"
          style={{ backgroundColor: champion.accentColor }}
        />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-1.5 text-xs font-black tracking-wider text-slate-950 shadow-lg">
            <Crown className="h-4 w-4" />
            {isSharedPreview ? 'SHARED CHAMPION RESULT' : 'TOURNAMENT CHAMPION'}
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-white">
            {champion.nameKo}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2.5">
            <span className="font-display text-sm font-bold tracking-widest text-slate-400 uppercase">
              {champion.nameEn}
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-xs font-bold ${role.badgeClass}`}
            >
              {role.labelKo}
            </span>
          </div>

          {/* Champion Artwork */}
          <div className="mx-auto mt-6 max-w-md">
            <HeroArtwork
              hero={champion}
              priority
              className="aspect-[4/3] rounded-3xl border-2 border-orange-400/50 shadow-[0_0_40px_rgba(250,156,30,0.22)]"
              imgClassName="p-4"
            />
          </div>

          <p className="mx-auto mt-5 max-w-lg text-sm sm:text-base text-slate-300">
            “{champion.tagline}”
          </p>

          {/* Global Stats Summary */}
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
              <div className="text-xs text-slate-400">현재 실시간 순위</div>
              <div className="mt-1 font-display text-2xl font-black text-amber-400">
                {isSubmitting ? '집계 중...' : winnerStats ? `#${winnerStats.rank}위` : '-'}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
              <div className="text-xs text-slate-400">전체 우승 비율</div>
              <div className="mt-1 font-display text-2xl font-black text-orange-400">
                {isSubmitting
                  ? '...'
                  : winnerStats
                    ? `${winnerStats.championshipRate.toFixed(1)}%`
                    : '0.0%'}
              </div>
              {winnerStats && (
                <div className="mt-0.5 text-[11px] text-slate-500">
                  {totalRuns.toLocaleString()}회 중 {winnerStats.championshipCount.toLocaleString()}회 우승
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
              <div className="text-xs text-slate-400">1:1 매치 승률</div>
              <div className="mt-1 font-display text-2xl font-black text-sky-400">
                {isSubmitting
                  ? '...'
                  : winnerStats
                    ? `${winnerStats.winRate.toFixed(1)}%`
                    : '0.0%'}
              </div>
              {winnerStats && (
                <div className="mt-0.5 text-[11px] text-slate-500">
                  {winnerStats.matchWins}승 {winnerStats.matchLosses}패
                </div>
              )}
            </div>
          </div>

          {/* Bracket Summary */}
          {!isSharedPreview && (runnerUp || semifinalists.length > 0) && (
            <div className="mt-5 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                내 토너먼트 요약 ({roundCount}명 출전)
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {runnerUp && (
                  <span className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200">
                    준우승: <strong className="text-white">{runnerUp.nameKo}</strong>
                  </span>
                )}
                {semifinalists
                  .filter((h) => h.id !== champion.id && h.id !== runnerUp?.id)
                  .map((hero) => (
                    <span
                      key={hero.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-slate-400"
                    >
                      4강: {hero.nameKo}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:opacity-50 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? '이미지 생성 중...' : '결과 카드 저장 (PNG)'}
            </button>

            <button
              type="button"
              onClick={handleShareLink}
              className="inline-flex items-center gap-2 rounded-2xl border border-sky-400/50 bg-sky-500/15 px-5 py-3.5 text-sm font-bold text-sky-200 transition hover:bg-sky-500/25 cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              {copied ? '링크 복사됨' : '결과 공유하기'}
            </button>

            <button
              type="button"
              onClick={onOpenRankings}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3.5 text-sm font-bold text-slate-200 transition hover:border-amber-400/60 hover:text-white cursor-pointer"
            >
              <Trophy className="h-4 w-4 text-amber-400" />
              전체 랭킹 보기
            </button>

            <button
              type="button"
              onClick={onPlayAgain}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3.5 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:text-white cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              {isSharedPreview ? '나도 월드컵 해보기' : '다시 하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
