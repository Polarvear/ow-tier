export type HeroRole = 'tank' | 'damage' | 'support';

export interface Hero {
  id: string;
  nameKo: string;
  nameEn: string;
  role: HeroRole;
  imageUrl: string;
  sourceArtworkUrl: string;
  tagline: string;
  accentColor: string;
  isOmnic: boolean;
}

export interface HeroRanking extends Hero {
  championshipCount: number;
  matchWins: number;
  matchLosses: number;
  winRate: number;
  championshipRate: number;
  rank: number;
}

export type RoundPreset = 8 | 16 | 'all';

export interface MatchVote {
  winnerId: string;
  loserId: string;
  roundSize: number;
}

export interface StartTournamentRequest {
  roundSize: number;
  heroIds: string[];
}

export interface StartTournamentResponse {
  runId: string;
  token: string;
  startedAt: number;
}

export interface CompleteTournamentRequest {
  runId: string;
  token: string;
  startedAt: number;
  roundSize: number;
  winnerHeroId: string;
  runnerUpHeroId: string;
  votes: MatchVote[];
}

export interface CompleteTournamentResponse {
  ok: boolean;
  totalRuns: number;
  winnerStats: HeroRanking | null;
}

export interface RankingsResponse {
  totalRuns: number;
  rankings: HeroRanking[];
}
