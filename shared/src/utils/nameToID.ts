import { CHARACTERS } from "../types";
import { CHARACTER_INFO } from "../types/characters/details";
import { BOSS_DETAIL, BOSSES } from "../types";

export const bossMap = new Map<number, BOSSES>();
export const bossNameMap = new Map<string, number>();
export const charMap = new Map<number, CHARACTERS>();
export const charNameMap = new Map<string, number>();
for (const [name, detail] of Object.entries(BOSS_DETAIL)) {
  const bossEnum = BOSSES[name as keyof typeof BOSSES];

  bossMap.set(detail.index, bossEnum);
  bossNameMap.set(detail.displayName.toLowerCase(), detail.index);
}

for (const [name, detail] of Object.entries(CHARACTER_INFO)) {
  const charEnum = CHARACTERS[name as keyof typeof CHARACTERS];

  charMap.set(detail.index, charEnum);
  charNameMap.set(detail.displayName.toLowerCase(), detail.index);
}