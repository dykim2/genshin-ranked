// a component to replace the current showing of "none" and an empty circlet with a specific character
// we know the character information

import { BOSSES, CHARACTERS } from "@genshin-ranked/shared";
import { BossButton, CharacterButton } from "../../frontend/src/components";
import React from "react";

// find a character by name
// basically take the existing component for the bosses / characters and use that

// basically a BossButton, but without clicking

export const displayBoss = (boss: BOSSES) => {
    const banDisplay = true; // can be changed in future
    const updateBoss = () => {
        // does nothing
    }
    return <BossButton boss={boss} updateBoss={updateBoss} banDisplay={true}/>
}

export const displayCharacter = (character: CHARACTERS, isPick: boolean) => {
    const banDisplay = (isPick ? "pick" : "ban");
    const updateCharacter = () => {

    }
    return <CharacterButton character={character} updateCharacter={updateCharacter} banDisplay={banDisplay} />
}