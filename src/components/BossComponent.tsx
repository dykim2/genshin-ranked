// a component to replace the current showing of "none" and an empty circlet with a specific character
// we know the character information

import { BOSSES, CHARACTERS } from "@genshin-ranked/shared";
import { BossButton, CharacterButton } from "../../frontend/src/components";
import React from "react";

// find a character by name
// basically take the existing component for the bosses / characters and use that

// basically a BossButton, but without clicking

const updateHover = (_teamNum: number, _selected: number) => {
    // does nothing
}

export const displayBoss = (boss: BOSSES) => {
    const selecting = true; // can be changed in future
    const updateBoss = () => {
        // does nothing
    }
    return <BossButton boss={boss} updateBoss={updateBoss} selectDisplay={selecting} team={0} updateHover={updateHover} selectable={false} isChosen={false}/>
}

export const displayCharacter = (character: CHARACTERS, isPick: boolean) => {
    const banDisplay = (isPick ? "pick" : "ban");
    const updateCharacter = () => {

    }
    return <CharacterButton character={character} updateCharacter={updateCharacter} updateHover={updateHover} banDisplay={banDisplay} team={0} isChosen={false} />
}