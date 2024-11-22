
import { CHARACTERS } from "./names"

type CharMap = {
   [index in CHARACTERS]:  CharacterRestriction
}

type CharacterRestriction = {
    limit: number;
    differences: number[];
    restrictions: string[];
}

export const CHARACTER_RESTRICTIONS: CharMap = {
    [CHARACTERS.KamisatoAyaka]: {
        limit: 6,
        differences: [0,2,3,4],
        restrictions: ["C0 limit", "C2 limit", "C3 limit", "C4 limit"]
    } 
}