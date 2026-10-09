/**
 * Team policy — shared rules for teams, Team Leaders and members.
 *
 * - Team Leaders are unlimited: every new leader gets their own team.
 * - Members per team are unlimited.
 * - Team codes run A…Z, then AA…ZZ, then AAA…ZZZ (17,576 teams).
 */

export const TEAM_CODE_PATTERN = /^[A-Z]{1,3}$/;

export function isValidTeamCode(code: string) {
  return TEAM_CODE_PATTERN.test(code);
}

/** Team Leaders are never capped. */
export function canAddTeamLeader(_currentLeaders: number) {
  return true;
}

export function canAssignMemberToTeam(hasTeamLeader: boolean) {
  return hasTeamLeader;
}

function codeToIndex(code: string) {
  // Bijective base-26: A=1 … Z=26, AA=27 …
  let n = 0;
  for (const ch of code) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n;
}

function indexToCode(n: number) {
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/** Returns the first unused team code in A, B, … Z, AA, AB … order. */
export function nextTeamCode(existing: string[]) {
  const used = new Set(existing.filter(isValidTeamCode).map(codeToIndex));
  let i = 1;
  while (used.has(i)) i++;
  const code = indexToCode(i);
  if (!isValidTeamCode(code)) throw new Error("No team codes left");
  return code;
}

/** Sort team codes A, B … Z, AA … instead of alphabetical (A, AA, B). */
export function compareTeamCodes(a: string, b: string) {
  return codeToIndex(a) - codeToIndex(b);
}
