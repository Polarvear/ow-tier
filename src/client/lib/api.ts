import type {
  CompleteTournamentRequest,
  CompleteTournamentResponse,
  RankingsResponse,
  StartTournamentRequest,
  StartTournamentResponse,
} from '../../shared/types';

export async function fetchRankingsApi(role?: string): Promise<RankingsResponse> {
  const query = role && role !== 'all' ? `?role=${encodeURIComponent(role)}` : '';
  const res = await fetch(`/api/rankings${query}`);
  if (!res.ok) {
    throw new Error(`랭킹 데이터를 불러오지 못했습니다 (${res.status})`);
  }
  return res.json();
}

export async function startTournamentApi(
  payload: StartTournamentRequest,
): Promise<StartTournamentResponse> {
  const res = await fetch('/api/tournaments/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`토너먼트 세션을 시작하지 못했습니다 (${res.status})`);
  }
  return res.json();
}

export async function completeTournamentApi(
  payload: CompleteTournamentRequest,
): Promise<CompleteTournamentResponse> {
  const res = await fetch('/api/tournaments/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`토너먼트 결과 저장에 실패했습니다 (${res.status})`);
  }
  return res.json();
}
