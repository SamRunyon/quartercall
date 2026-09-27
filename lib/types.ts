export type SideScore = {
  home: number;
  away: number;
};

export type PeriodKey = "q1" | "q2" | "q3" | "q4" | "ot" | "final";

export type PickCard = {
  q1: SideScore;
  q2: SideScore;
  q3: SideScore;
  q4: SideScore;
  ot?: SideScore;
  final: SideScore;
};

export type Team = {
  id: string;
  abbr: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  record: string;
};

export type Game = {
  id: string;
  name: string;
  shortName: string;
  kickoff: string;
  status: "scheduled" | "live" | "final";
  statusDetail: string;
  period: number;
  clock: string;
  week: number;
  season: number;
  home: Team;
  away: Team;
  score: SideScore;
  q1?: SideScore;
  q2?: SideScore;
  q3?: SideScore;
  q4?: SideScore;
  ot?: SideScore;
  broadcast?: string;
};

export type PeriodScore = {
  key: PeriodKey;
  label: string;
  pts: number;
  err: number;
  cap: number;
  scored: boolean;
};

export type GameGrade = {
  periods: PeriodScore[];
  winnerBonus: number;
  total: number;
  error: number;
};

export type Player = {
  id: string;
  name: string;
  you?: boolean;
};
