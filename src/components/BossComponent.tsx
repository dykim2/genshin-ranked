// a component to replace the current showing of "none" and an empty circlet with a specific character
// we know the character information

import { BOSSES } from "@genshin-ranked/shared";
import { BossButton } from "../../frontend/src/components";

// find a character by name
// basically take the existing component for the bosses / characters and use that

// basically a BossButton, but without clicking

export const displayBoss = (boss: BOSSES) => {
    const updateBoss = () => {
        // does nothing
    }
    return BossButton({boss, updateBoss})
}

export const findBoss = (bossIndex: number = -1) => {
    // have an array of all the boss indexes to boss objects and just call that value in array
    // could save it as a useref or memo it
    
}