import type { Game, GameGrade, PeriodKey, PeriodScore, PickCard, SideScore } from "./types";

const Q_CAP = 10;
const FINAL_CAP = 25;
const WINNER_BONUS = 5;

export function scorePeriod(
  guess: SideScore | undefined,
  actual: SideScore | undefined,
  cap: number
): { pts: number; err: number; scored: boolean } {
  if (!guess || !actual) return { pts: 0, err: 0, scored: false };
  const err =
    Math.abs(guess.home - actual.home) + Math.abs(guess.away - actual.away);
  return { pts: Math.max(0, cap - err), err, scored: true };
}

function winnerOf(score: SideScore): "home" | "away" | "tie" {
  if (score.home === score.away) return "tie";
  return score.home > score.away ? "home" : "away";
}

export function scoreGame(pick: PickCard | undefined, game: Game): GameGrade {
  const empty: GameGrade = {
    periods: [],
    winnerBonus: 0,
    total: 0,
    error: 0,
  };
  if (!pick) return empty;

  const keys: { key: PeriodKey; label: string; cap: number; actual?: SideScore }[] =
    [
      { key: "q1", label: "Q1", cap: Q_CAP, actual: game.q1 },
      { key: "q2", label: "Q2", cap: Q_CAP, actual: game.q2 },
      { key: "q3", label: "Q3", cap: Q_CAP, actual: game.q3 },
      { key: "q4", label: "Q4", cap: Q_CAP, actual: game.q4 },
    ];

  if (game.ot) {
    keys.push({ key: "ot", label: "OT", cap: Q_CAP, actual: game.ot });
  }

  const finalReady = game.status === "final";
  keys.push({
    key: "final",
    label: "Final",
    cap: FINAL_CAP,
    actual: finalReady ? game.score : undefined,
  });

  const periods: PeriodScore[] = keys.map((row) => {
    const graded = scorePeriod(pick[row.key], row.actual, row.cap);
    return {
      key: row.key,
      label: row.label,
      cap: row.cap,
      pts: graded.pts,
      err: graded.err,
      scored: graded.scored,
    };
  });

  let winnerBonus = 0;
  if (finalReady) {
    const guessedWinner = winnerOf(pick.final);
    const actualWinner = winnerOf(game.score);
    if (guessedWinner === actualWinner) winnerBonus = WINNER_BONUS;
  }

  const total =
    periods.reduce((sum, period) => sum + period.pts, 0) + winnerBonus;
  const error = periods
    .filter((period) => period.scored)
    .reduce((sum, period) => sum + period.err, 0);

  return { periods, winnerBonus, total, error };
}

export function isLocked(game: Game, now = Date.now()): boolean {
  return now >= new Date(game.kickoff).getTime() || game.status !== "scheduled";
}
