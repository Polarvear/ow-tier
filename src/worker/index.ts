import { Hono } from 'hono';
import { FEMALE_HEROES, HERO_MAP } from '../shared/heroes';
import type {
  CompleteTournamentRequest,
  CompleteTournamentResponse,
  HeroRanking,
  HeroRole,
  RankingsResponse,
  StartTournamentRequest,
  StartTournamentResponse,
} from '../shared/types';

type Bindings = {
  DB?: D1Database;
  SIGNING_SECRET?: string;
};

interface MemoryStats {
  totalRuns: number;
  completedRunIds: Set<string>;
  heroes: Map<string, { championshipCount: number; matchWins: number; matchLosses: number }>;
}

const memoryStore: MemoryStats = {
  totalRuns: 0,
  completedRunIds: new Set(),
  heroes: new Map(
    FEMALE_HEROES.map((h) => [
      h.id,
      { championshipCount: 0, matchWins: 0, matchLosses: 0 },
    ]),
  ),
};

interface HeroRow {
  id: string;
  name_ko: string;
  name_en: string;
  role: HeroRole;
  image_url: string;
  tagline: string;
  accent_color: string;
  is_omnic: number;
  championship_count: number;
  match_wins: number;
  match_losses: number;
}

const DEFAULT_DEV_SECRET = 'ow-tier-local-dev-hmac-secret-v1';

async function signPayload(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyToken(
  secret: string,
  runId: string,
  startedAt: number,
  roundSize: number,
  token: string,
): Promise<boolean> {
  const expected = await signPayload(secret, `${runId}:${startedAt}:${roundSize}`);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}

function mapRowsToRankings(rows: HeroRow[], totalRuns: number): HeroRanking[] {
  const enriched = rows.map((row) => {
    const base = HERO_MAP.get(row.id);
    const totalMatches = row.match_wins + row.match_losses;
    const winRate = totalMatches > 0 ? (row.match_wins / totalMatches) * 100 : 0;
    const championshipRate = totalRuns > 0 ? (row.championship_count / totalRuns) * 100 : 0;

    return {
      id: row.id,
      nameKo: row.name_ko,
      nameEn: row.name_en,
      role: row.role,
      imageUrl: row.image_url,
      sourceArtworkUrl: base?.sourceArtworkUrl ?? row.image_url,
      tagline: row.tagline,
      accentColor: row.accent_color,
      isOmnic: row.is_omnic === 1,
      championshipCount: row.championship_count,
      matchWins: row.match_wins,
      matchLosses: row.match_losses,
      winRate: Number(winRate.toFixed(1)),
      championshipRate: Number(championshipRate.toFixed(1)),
      rank: 0,
    };
  });

  enriched.sort((a, b) => {
    if (b.championshipCount !== a.championshipCount) {
      return b.championshipCount - a.championshipCount;
    }
    if (b.winRate !== a.winRate) {
      return b.winRate - a.winRate;
    }
    if (b.matchWins !== a.matchWins) {
      return b.matchWins - a.matchWins;
    }
    return a.nameKo.localeCompare(b.nameKo, 'ko');
  });

  return enriched.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

async function fetchRankings(db?: D1Database, roleFilter?: string): Promise<RankingsResponse> {
  const validRoles = new Set(['tank', 'damage', 'support']);

  if (!db) {
    const rows: HeroRow[] = FEMALE_HEROES.filter(
      (h) => !roleFilter || !validRoles.has(roleFilter) || h.role === roleFilter,
    ).map((h) => {
      const stat = memoryStore.heroes.get(h.id) ?? {
        championshipCount: 0,
        matchWins: 0,
        matchLosses: 0,
      };
      return {
        id: h.id,
        name_ko: h.nameKo,
        name_en: h.nameEn,
        role: h.role,
        image_url: h.imageUrl,
        tagline: h.tagline,
        accent_color: h.accentColor,
        is_omnic: h.isOmnic ? 1 : 0,
        championship_count: stat.championshipCount,
        match_wins: stat.matchWins,
        match_losses: stat.matchLosses,
      };
    });
    return {
      totalRuns: memoryStore.totalRuns,
      rankings: mapRowsToRankings(rows, memoryStore.totalRuns),
    };
  }

  const countResult = await db
    .prepare('SELECT COUNT(*) as total FROM tournament_runs')
    .first<{ total: number }>();
  const totalRuns = Number(countResult?.total ?? 0);

  const query =
    roleFilter && validRoles.has(roleFilter)
      ? db
          .prepare('SELECT * FROM heroes WHERE is_active = 1 AND role = ?')
          .bind(roleFilter)
      : db.prepare('SELECT * FROM heroes WHERE is_active = 1');

  const { results } = await query.all<HeroRow>();

  if (!results || results.length === 0) {
    // Graceful fallback if DB hasn't been seeded yet
    const fallbackRows: HeroRow[] = FEMALE_HEROES.filter(
      (h) => !roleFilter || !validRoles.has(roleFilter) || h.role === roleFilter,
    ).map((h) => ({
      id: h.id,
      name_ko: h.nameKo,
      name_en: h.nameEn,
      role: h.role,
      image_url: h.imageUrl,
      tagline: h.tagline,
      accent_color: h.accentColor,
      is_omnic: h.isOmnic ? 1 : 0,
      championship_count: 0,
      match_wins: 0,
      match_losses: 0,
    }));
    return {
      totalRuns,
      rankings: mapRowsToRankings(fallbackRows, totalRuns),
    };
  }

  return {
    totalRuns,
    rankings: mapRowsToRankings(results, totalRuns),
  };
}

const app = new Hono<{ Bindings: Bindings }>();

app.get('/api/health', (c) => {
  return c.json({ ok: true, service: 'ow-tier', heroCount: FEMALE_HEROES.length });
});

app.get('/api/heroes', (c) => {
  const role = c.req.query('role');
  const includeOmnic = c.req.query('includeOmnic') !== 'false';

  const heroes = FEMALE_HEROES.filter((hero) => {
    if (!includeOmnic && hero.isOmnic) return false;
    if (role && role !== 'all' && hero.role !== role) return false;
    return true;
  });

  return c.json({ heroes });
});

app.post('/api/tournaments/start', async (c) => {
  const body = await c.req.json<StartTournamentRequest>().catch(() => null);
  if (!body || typeof body.roundSize !== 'number' || body.roundSize < 2 || body.roundSize > 64) {
    return c.json({ error: '유효하지 않은 토너먼트 설정입니다.' }, 400);
  }

  const runId = crypto.randomUUID();
  const startedAt = Date.now();
  const secret = c.env.SIGNING_SECRET || DEFAULT_DEV_SECRET;
  const token = await signPayload(secret, `${runId}:${startedAt}:${body.roundSize}`);

  const response: StartTournamentResponse = {
    runId,
    token,
    startedAt,
  };
  return c.json(response, 201);
});

app.post('/api/tournaments/complete', async (c) => {
  const body = await c.req.json<CompleteTournamentRequest>().catch(() => null);
  if (!body) {
    return c.json({ error: '잘못된 요청 형식입니다.' }, 400);
  }

  const { runId, token, startedAt, roundSize, winnerHeroId, runnerUpHeroId, votes } = body;

  if (
    !runId ||
    !token ||
    typeof startedAt !== 'number' ||
    typeof roundSize !== 'number' ||
    !HERO_MAP.has(winnerHeroId) ||
    !HERO_MAP.has(runnerUpHeroId) ||
    winnerHeroId === runnerUpHeroId ||
    !Array.isArray(votes) ||
    votes.length !== roundSize - 1
  ) {
    return c.json({ error: '토너먼트 결과 데이터가 유효하지 않습니다.' }, 400);
  }

  const secret = c.env.SIGNING_SECRET || DEFAULT_DEV_SECRET;
  const validSignature = await verifyToken(secret, runId, startedAt, roundSize, token);
  if (!validSignature) {
    return c.json({ error: '유효하지 않은 토너먼트 세션 토큰입니다.' }, 403);
  }

  // Reject tokens older than 2 hours
  if (Date.now() - startedAt > 2 * 60 * 60 * 1000) {
    return c.json({ error: '만료된 토너먼트 세션입니다.' }, 400);
  }

  // Validate votes and aggregate per-hero wins/losses
  const winCounts = new Map<string, number>();
  const lossCounts = new Map<string, number>();

  for (const vote of votes) {
    if (
      !vote ||
      !HERO_MAP.has(vote.winnerId) ||
      !HERO_MAP.has(vote.loserId) ||
      vote.winnerId === vote.loserId
    ) {
      return c.json({ error: '매치 기록에 유효하지 않은 영웅 ID가 포함되어 있습니다.' }, 400);
    }
    winCounts.set(vote.winnerId, (winCounts.get(vote.winnerId) ?? 0) + 1);
    lossCounts.set(vote.loserId, (lossCounts.get(vote.loserId) ?? 0) + 1);
  }

  if (!c.env.DB) {
    if (!memoryStore.completedRunIds.has(runId)) {
      memoryStore.completedRunIds.add(runId);
      memoryStore.totalRuns += 1;
      const champStat = memoryStore.heroes.get(winnerHeroId);
      if (champStat) {
        champStat.championshipCount += 1;
      }
      const touchedHeroIds = new Set([...winCounts.keys(), ...lossCounts.keys()]);
      for (const heroId of touchedHeroIds) {
        const stat = memoryStore.heroes.get(heroId);
        if (stat) {
          stat.matchWins += winCounts.get(heroId) ?? 0;
          stat.matchLosses += lossCounts.get(heroId) ?? 0;
        }
      }
    }

    const data = await fetchRankings(undefined);
    const winnerStats = data.rankings.find((h) => h.id === winnerHeroId) ?? null;
    const response: CompleteTournamentResponse = {
      ok: true,
      totalRuns: data.totalRuns,
      winnerStats,
    };
    return c.json(response);
  }

  // Prevent duplicate submission for the same runId
  const existingRun = await c.env.DB.prepare('SELECT id FROM tournament_runs WHERE id = ?')
    .bind(runId)
    .first();

  if (existingRun) {
    const data = await fetchRankings(c.env.DB);
    const winnerStats = data.rankings.find((h) => h.id === winnerHeroId) ?? null;
    const response: CompleteTournamentResponse = {
      ok: true,
      totalRuns: data.totalRuns,
      winnerStats,
    };
    return c.json(response);
  }

  const statements: D1PreparedStatement[] = [
    c.env.DB.prepare(
      'INSERT INTO tournament_runs (id, round_size, winner_hero_id, runner_up_hero_id) VALUES (?, ?, ?, ?)',
    ).bind(runId, roundSize, winnerHeroId, runnerUpHeroId),
    c.env.DB.prepare(
      'UPDATE heroes SET championship_count = championship_count + 1 WHERE id = ?',
    ).bind(winnerHeroId),
  ];

  const touchedHeroIds = new Set([...winCounts.keys(), ...lossCounts.keys()]);
  for (const heroId of touchedHeroIds) {
    const wins = winCounts.get(heroId) ?? 0;
    const losses = lossCounts.get(heroId) ?? 0;
    statements.push(
      c.env.DB.prepare(
        'UPDATE heroes SET match_wins = match_wins + ?, match_losses = match_losses + ? WHERE id = ?',
      ).bind(wins, losses, heroId),
    );
  }

  await c.env.DB.batch(statements);

  const data = await fetchRankings(c.env.DB);
  const winnerStats = data.rankings.find((h) => h.id === winnerHeroId) ?? null;

  const response: CompleteTournamentResponse = {
    ok: true,
    totalRuns: data.totalRuns,
    winnerStats,
  };
  return c.json(response);
});

app.get('/api/rankings', async (c) => {
  const role = c.req.query('role');
  const data = await fetchRankings(c.env.DB, role);
  c.header('Cache-Control', 'no-store');
  return c.json(data);
});

export default app;
