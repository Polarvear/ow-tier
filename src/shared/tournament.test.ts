import { describe, expect, it } from 'vitest';
import { FEMALE_HEROES } from './heroes';
import { createTournament, pickWinner, undoLastPick } from './tournament';

function deterministicRng() {
  let seed = 42;
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

describe('tournament engine', () => {
  it('completes a 16-hero bracket in exactly 15 matches', () => {
    let state = createTournament(FEMALE_HEROES, 16, deterministicRng());
    expect(state.initialCount).toBe(16);
    expect(state.roundLabel).toBe('16강');
    expect(state.matches).toHaveLength(8);
    expect(state.byeHeroes).toHaveLength(0);

    let picks = 0;
    while (!state.champion) {
      state = pickWinner(state, picks % 2 === 0 ? 'left' : 'right');
      picks += 1;
    }

    expect(picks).toBe(15);
    expect(state.votes).toHaveLength(15);
    expect(state.champion).not.toBeNull();
    expect(state.runnerUp).not.toBeNull();
    expect(state.champion?.id).not.toBe(state.runnerUp?.id);
    expect(state.semifinalists).toHaveLength(4);
  });

  it('handles non-power-of-two all-star pool (27 heroes) cleanly with preliminary round + byes', () => {
    let state = createTournament(FEMALE_HEROES, 'all', deterministicRng());
    expect(state.initialCount).toBe(27);
    // 27 -> 16 requires 11 preliminary matches (22 playing) + 5 byes
    expect(state.matches).toHaveLength(11);
    expect(state.byeHeroes).toHaveLength(5);

    let picks = 0;
    while (!state.champion) {
      state = pickWinner(state, 'left');
      picks += 1;
    }

    // Single elimination with N entrants ALWAYS requires exactly N - 1 matches
    expect(picks).toBe(26);
    expect(state.votes).toHaveLength(26);
    expect(state.champion).not.toBeNull();
    expect(state.runnerUp).not.toBeNull();
  });

  it('supports undoing the previous pick across round boundaries', () => {
    let state = createTournament(FEMALE_HEROES, 8, deterministicRng());
    // Finish quarterfinals (4 matches)
    for (let i = 0; i < 4; i += 1) {
      state = pickWinner(state, 'left');
    }
    expect(state.roundLabel).toBe('준결승 (4강)');
    expect(state.votes).toHaveLength(4);

    // Undo should jump back to the last match of 8강
    const undone = undoLastPick(state);
    expect(undone.roundLabel).toBe('8강');
    expect(undone.currentMatchIndex).toBe(3);
    expect(undone.votes).toHaveLength(3);
  });
});
