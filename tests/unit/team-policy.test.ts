import { describe, expect, it } from "vitest";
import {
  canAddTeamLeader,
  canAssignMemberToTeam,
  compareTeamCodes,
  isValidTeamCode,
  nextTeamCode,
} from "@/lib/team-policy";

describe("team policy", () => {
  it("allows adding Team Leaders beyond three", () => {
    expect(canAddTeamLeader(3)).toBe(true);
    expect(canAddTeamLeader(50)).toBe(true);
  });

  it("allows member assignment at counts above 50 when the team has a leader", () => {
    expect(canAssignMemberToTeam(true)).toBe(true);
  });

  it("requires a Team Leader before assigning members", () => {
    expect(canAssignMemberToTeam(false)).toBe(false);
  });

  it("gives the fourth team code D after A, B, C", () => {
    expect(nextTeamCode(["A", "B", "C"])).toBe("D");
  });

  it("continues with AA after Z", () => {
    const all = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    expect(nextTeamCode(all)).toBe("AA");
  });

  it("reuses the first free gap", () => {
    expect(nextTeamCode(["A", "C"])).toBe("B");
  });

  it("accepts multi-letter team codes up to three letters", () => {
    expect(isValidTeamCode("AB")).toBe(true);
    expect(isValidTeamCode("ABCD")).toBe(false);
  });

  it("sorts Z before AA", () => {
    expect(["AA", "Z", "B"].sort(compareTeamCodes)).toEqual(["B", "Z", "AA"]);
  });
});
