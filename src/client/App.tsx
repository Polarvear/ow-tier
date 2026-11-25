import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Swords, Trophy } from 'lucide-react';
import { FEMALE_HEROES, HERO_MAP } from '../shared/heroes';
import {
  createTournament,
  pickWinner,
  undoLastPick,
  type TournamentState,
} from '../shared/tournament';
import type {
  Hero,
  HeroRanking,
  HeroRole,
  RoundPreset,
  StartTournamentResponse,
} from '../shared/types';
import { HomeView } from './components/HomeView';
import { RankingsView } from './components/RankingsView';
import { ResultView } from './components/ResultView';
import { TournamentView } from './components/TournamentView';
import {
  completeTournamentApi,
  fetchRankingsApi,
  startTournamentApi,
} from './lib/api';

type Screen = 'home' | 'tournament' | 'result' | 'rankings';

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [roundPreset, setRoundPreset] = useState<RoundPreset>(16);
  const [roleFilter, setRoleFilter] = useState<HeroRole | 'all'>('all');
  const [includeOmnic, setIncludeOmnic] = useState(true);

  const [tournament, setTournament] = useState<TournamentState | null>(null);
  const [session, setSession] = useState<StartTournamentResponse | null>(null);
  const [sharedChampion, setSharedChampion] = useState<Hero | null>(null);

  const [rankings, setRankings] = useState<HeroRanking[]>([]);
  const [totalRuns, setTotalRuns] = useState(0);
  const [isLoadingRankings, setIsLoadingRankings] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [winnerStats, setWinnerStats] = useState<HeroRanking | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const submittedRunRef = useRef<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 2800);
  }, []);

  const loadRankings = useCallback(async () => {
    try {
      setIsLoadingRankings(true);
      const data = await fetchRankingsApi();
      setRankings(data.rankings);
      setTotalRuns(data.totalRuns);
    } catch {
      // Offline / dev fallback
      const fallback: HeroRanking[] = FEMALE_HEROES.map((hero, index) => ({
        ...hero,
        championshipCount: 0,
        matchWins: 0,
        matchLosses: 0,
        winRate: 0,
        championshipRate: 0,
        rank: index + 1,
      }));
      setRankings(fallback);
    } finally {
      setIsLoadingRankings(false);
    }
  }, []);

  useEffect(() => {
    void loadRankings();
  }, [loadRankings]);

  // Support shared result URL (?winner=dva)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const winnerId = params.get('winner');
    if (winnerId && HERO_MAP.has(winnerId)) {
      setSharedChampion(HERO_MAP.get(winnerId) ?? null);
      setScreen('result');
    }
  }, []);

  const filteredPool = useMemo(() => {
    return FEMALE_HEROES.filter((hero) => {
      if (!includeOmnic && hero.isOmnic) return false;
      if (roleFilter !== 'all' && hero.role !== roleFilter) return false;
      return true;
    });
  }, [roleFilter, includeOmnic]);

  // Adjust round preset automatically if role filter reduces pool below preset
  useEffect(() => {
    if (roundPreset === 16 && filteredPool.length < 16) {
      setRoundPreset(filteredPool.length >= 8 ? 8 : 'all');
    } else if (roundPreset === 8 && filteredPool.length < 8) {
      setRoundPreset('all');
    }
  }, [filteredPool.length, roundPreset]);

  const handleStartTournament = async () => {
    if (filteredPool.length < 2) return;
    const nextState = createTournament(filteredPool, roundPreset);
    setTournament(nextState);
    setSharedChampion(null);
    setWinnerStats(null);
    submittedRunRef.current = null;
    setScreen('tournament');

    // Clean ?winner query param if present
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    try {
      const heroIds = [
        ...nextState.matches.flatMap((m) => [m.left.id, m.right.id]),
        ...nextState.byeHeroes.map((h) => h.id),
      ];
      const started = await startTournamentApi({
        roundSize: nextState.initialCount,
        heroIds,
      });
      setSession(started);
    } catch {
      setSession(null);
    }
  };

  const handlePick = (side: 'left' | 'right') => {
    setTournament((prev) => {
      if (!prev) return prev;
      const updated = pickWinner(prev, side);
      if (updated.champion) {
        setScreen('result');
      }
      return updated;
    });
  };

  const handleUndo = () => {
    setTournament((prev) => (prev ? undoLastPick(prev) : prev));
  };

  // Submit completed tournament results to Cloudflare D1 via Worker API
  useEffect(() => {
    if (!tournament?.champion || !tournament.runnerUp) return;

    const currentRunId = session?.runId ?? `local-${tournament.champion.id}-${tournament.votes.length}`;
    if (submittedRunRef.current === currentRunId) return;
    submittedRunRef.current = currentRunId;

    const submit = async () => {
      if (!session) {
        const localStat = rankings.find((r) => r.id === tournament.champion?.id) ?? null;
        setWinnerStats(localStat);
        return;
      }

      try {
        setIsSubmitting(true);
        const res = await completeTournamentApi({
          runId: session.runId,
          token: session.token,
          startedAt: session.startedAt,
          roundSize: tournament.initialCount,
          winnerHeroId: tournament.champion!.id,
          runnerUpHeroId: tournament.runnerUp!.id,
          votes: tournament.votes,
        });
        setTotalRuns(res.totalRuns);
        setWinnerStats(res.winnerStats);
        void loadRankings();
      } catch {
        showToast('실시간 랭킹 반영에 실패했습니다. 잠시 후 다시 확인해 주세요.');
      } finally {
        setIsSubmitting(false);
      }
    };

    void submit();
  }, [tournament, session, rankings, loadRankings, showToast]);

  const activeChampion = tournament?.champion ?? sharedChampion;
  const activeWinnerStats =
    winnerStats ??
    (activeChampion ? rankings.find((r) => r.id === activeChampion.id) ?? null : null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <button
            type="button"
            onClick={() => {
              setScreen('home');
              setSharedChampion(null);
              if (window.location.search) {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="ow-skew flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 text-slate-950 shadow-md shadow-orange-500/20">
              <Swords className="ow-unskew h-5 w-5" />
            </div>
            <div className="text-left leading-none">
              <div className="font-display text-lg font-black tracking-wider text-white group-hover:text-orange-300 transition">
                OW-TIER
              </div>
              <div className="text-[10px] font-bold tracking-widest text-slate-400">
                OVERWATCH WORLD CUP
              </div>
            </div>
          </button>

          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                screen === 'home' || screen === 'tournament'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-400/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              월드컵
            </button>
            <button
              type="button"
              onClick={() => {
                setScreen('rankings');
                void loadRankings();
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                screen === 'rankings'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Trophy className="h-4 w-4 text-amber-400" />
              실시간 랭킹
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {screen === 'home' && (
          <HomeView
            roundPreset={roundPreset}
            roleFilter={roleFilter}
            includeOmnic={includeOmnic}
            availableCount={filteredPool.length}
            rankings={rankings}
            totalRuns={totalRuns}
            isLoadingRankings={isLoadingRankings}
            onChangeRoundPreset={setRoundPreset}
            onChangeRoleFilter={setRoleFilter}
            onToggleOmnic={setIncludeOmnic}
            onStart={handleStartTournament}
            onOpenRankings={() => {
              setScreen('rankings');
              void loadRankings();
            }}
          />
        )}

        {screen === 'tournament' && tournament && (
          <TournamentView
            state={tournament}
            onPick={handlePick}
            onUndo={handleUndo}
            onExit={() => setScreen('home')}
          />
        )}

        {screen === 'result' && activeChampion && (
          <ResultView
            champion={activeChampion}
            runnerUp={tournament?.runnerUp ?? null}
            semifinalists={tournament?.semifinalists ?? []}
            roundCount={tournament?.initialCount ?? 16}
            winnerStats={activeWinnerStats}
            totalRuns={totalRuns}
            isSubmitting={isSubmitting}
            isSharedPreview={!tournament?.champion && Boolean(sharedChampion)}
            onPlayAgain={() => {
              setTournament(null);
              setSharedChampion(null);
              setScreen('home');
            }}
            onOpenRankings={() => {
              setScreen('rankings');
              void loadRankings();
            }}
            onToast={showToast}
          />
        )}

        {screen === 'rankings' && (
          <RankingsView
            rankings={rankings}
            totalRuns={totalRuns}
            isLoading={isLoadingRankings}
            onRefresh={() => void loadRankings()}
            onBackHome={() => setScreen('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>OW-TIER · Cloudflare Workers + D1 기반 팬 프로젝트</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Overwatch 및 영웅 아트워크의 권리는 Blizzard Entertainment, Inc.에 있습니다.
        </p>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-orange-400/50 bg-slate-900/95 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
