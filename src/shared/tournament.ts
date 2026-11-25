import type { Hero, MatchVote, RoundPreset } from './types';

export interface MatchPair {
  left: Hero;
  right: Hero;
}

export interface RoundSnapshot {
  roundLabel: string;
  roundSize: number;
  matches: MatchPair[];
  byeHeroes: Hero[];
  currentMatchIndex: number;
  winners: Hero[];
  votes: MatchVote[];
  semifinalists: Hero[];
}

export interface TournamentState {
  initialCount: number;
  roundLabel: string;
  roundSize: number;
  matches: MatchPair[];
  byeHeroes: Hero[];
  currentMatchIndex: number;
  winners: Hero[];
  votes: MatchVote[];
  semifinalists: Hero[];
  champion: Hero | null;
  runnerUp: Hero | null;
  history: RoundSnapshot[];
}

export function shuffleArray<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getRoundLabel(entrantCount: number): string {
  if (entrantCount <= 2) return '결승전';
  if (entrantCount <= 4) return '준결승 (4강)';
  return `${entrantCount}강`;
}

function buildRound(entrants: Hero[]): {
  roundSize: number;
  roundLabel: string;
  matches: MatchPair[];
  byeHeroes: Hero[];
} {
  const n = entrants.length;
  // Find largest power of 2 <= n. Extra players play preliminary matches first,
  // while the rest receive automatic byes so subsequent rounds are exact powers of 2.
  let targetPowerOfTwo = 1;
  while (targetPowerOfTwo * 2 <= n) {
    targetPowerOfTwo *= 2;
  }

  const isExactPowerOfTwo = targetPowerOfTwo === n;
  const matchCount = isExactPowerOfTwo ? n / 2 : n - targetPowerOfTwo;
  const playingCount = matchCount * 2;

  const matches: MatchPair[] = [];
  for (let i = 0; i < playingCount; i += 2) {
    matches.push({
      left: entrants[i],
      right: entrants[i + 1],
    });
  }

  const byeHeroes = entrants.slice(playingCount);
  const roundLabel = isExactPowerOfTwo
    ? getRoundLabel(n)
    : `예선전 (${n}강 → ${targetPowerOfTwo}강)`;

  return {
    roundSize: n,
    roundLabel,
    matches,
    byeHeroes,
  };
}

export function createTournament(
  pool: readonly Hero[],
  preset: RoundPreset,
  rng: () => number = Math.random,
): TournamentState {
  if (pool.length < 2) {
    throw new Error('토너먼트를 진행하려면 최소 2명의 영웅이 필요합니다.');
  }

  const shuffled = shuffleArray(pool, rng);
  const selected =
    preset === 'all' ? shuffled : shuffled.slice(0, Math.min(preset, shuffled.length));

  const firstRound = buildRound(selected);

  return {
    initialCount: selected.length,
    roundLabel: firstRound.roundLabel,
    roundSize: firstRound.roundSize,
    matches: firstRound.matches,
    byeHeroes: firstRound.byeHeroes,
    currentMatchIndex: 0,
    winners: [],
    votes: [],
    semifinalists: selected.length === 4 ? selected : [],
    champion: null,
    runnerUp: null,
    history: [],
  };
}

export function pickWinner(state: TournamentState, side: 'left' | 'right'): TournamentState {
  if (state.champion) return state;

  const currentMatch = state.matches[state.currentMatchIndex];
  if (!currentMatch) return state;

  const winner = side === 'left' ? currentMatch.left : currentMatch.right;
  const loser = side === 'left' ? currentMatch.right : currentMatch.left;

  const snapshot: RoundSnapshot = {
    roundLabel: state.roundLabel,
    roundSize: state.roundSize,
    matches: state.matches,
    byeHeroes: state.byeHeroes,
    currentMatchIndex: state.currentMatchIndex,
    winners: state.winners,
    votes: state.votes,
    semifinalists: state.semifinalists,
  };

  const nextWinners = [...state.winners, winner];
  const nextVotes: MatchVote[] = [
    ...state.votes,
    {
      winnerId: winner.id,
      loserId: loser.id,
      roundSize: state.roundSize,
    },
  ];
  const nextHistory = [...state.history.slice(-19), snapshot];

  const isRoundFinished = state.currentMatchIndex + 1 >= state.matches.length;

  if (!isRoundFinished) {
    return {
      ...state,
      currentMatchIndex: state.currentMatchIndex + 1,
      winners: nextWinners,
      votes: nextVotes,
      history: nextHistory,
    };
  }

  // Round completed
  const advancing = [...nextWinners, ...state.byeHeroes];

  if (advancing.length === 1) {
    return {
      ...state,
      winners: nextWinners,
      votes: nextVotes,
      champion: winner,
      runnerUp: loser,
      history: nextHistory,
    };
  }

  const nextRound = buildRound(advancing);
  const semifinalists =
    advancing.length === 4 ? [...advancing] : state.semifinalists;

  return {
    ...state,
    roundLabel: nextRound.roundLabel,
    roundSize: nextRound.roundSize,
    matches: nextRound.matches,
    byeHeroes: nextRound.byeHeroes,
    currentMatchIndex: 0,
    winners: [],
    votes: nextVotes,
    semifinalists,
    history: nextHistory,
  };
}

export function undoLastPick(state: TournamentState): TournamentState {
  if (state.history.length === 0) return state;

  const previous = state.history[state.history.length - 1];
  return {
    ...state,
    roundLabel: previous.roundLabel,
    roundSize: previous.roundSize,
    matches: previous.matches,
    byeHeroes: previous.byeHeroes,
    currentMatchIndex: previous.currentMatchIndex,
    winners: previous.winners,
    votes: previous.votes,
    semifinalists: previous.semifinalists,
    champion: null,
    runnerUp: null,
    history: state.history.slice(0, -1),
  };
}

export function getNextMatchPreview(state: TournamentState): MatchPair | null {
  if (state.champion) return null;
  return state.matches[state.currentMatchIndex + 1] ?? null;
}
