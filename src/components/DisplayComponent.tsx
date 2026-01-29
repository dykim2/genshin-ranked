// a component to replace the current showing of "none" and an empty circlet with a specific character
// we know the character information

import { BOSSES, CHARACTER_INFO, CHARACTERS } from "@genshin-ranked/shared";
import { BigCharacterButton, BossButton, CharacterButton } from "../../frontend/src/components";
import { BOSS_DETAIL } from "@genshin-ranked/shared";
import Droppable from "./Droppable";
import Dragable from "./Dragable";

// find a character by name
// basically take the existing component for the bosses / characters and use that

// basically a BossButton, but without clicking, instead it has drag and drop



const updateHover = (_teamNum: number, _selected: number) => {
  // does nothing
  // can be repurposed to do an alert
  // can send socket something
  // alert("hi");
}

const update = () => {
  // do nothing, mainly meant to be a set state action but not used
}

// index needed incase someone adds a boss twice
export const displayBoss = (boss: BOSSES, isPick: boolean, index: number, change: (team: number, name: string, original: number) => void) => {
    const selecting = true; // can be changed in future
    let z: number = BOSS_DETAIL[boss].index;
    // create a draggable element
    // it must also be droppable in a sense too
    // cause i want to drag it between the elements
    // only can be dragged horizontally

    // for bosses specifically make sure no duplicates
    // for characters can allow dupes
    
    return (
      <Droppable id={z}>
        <Dragable id={z}>
          <div
            onContextMenu={(e) => {
              e.preventDefault();
              change(0, BOSS_DETAIL[boss].displayName, index);
            }}
          >
            <BossButton
              boss={boss}
              updateBoss={update}
              updateHover={updateHover}
              team={0}
              mainDisplay={false}
              isChosen={!isPick}
              component={true}
            />
          </div>
        </Dragable>
      </Droppable>
    );
}

export const displayCharacter = (character: CHARACTERS, isPick: boolean, team: number, index: number, change: (team: number, name: string, original: number) => void) => {
    return (
      <Droppable id={CHARACTER_INFO[character].index}>
        <Dragable id={CHARACTER_INFO[character].index}>
          <div
            onContextMenu={(e) => {
              e.preventDefault();
              change(
                team,
                CHARACTER_INFO[character].displayName,
                index
              );
            }}
          >
            <CharacterButton
              character={character}
              updateCharacter={update}
              updateHover={updateHover}
              isBan={!isPick}
              team={0}
              mainDisplay={false}
              isChosen={false}
              component={true}
            />
          </div>
        </Dragable>
      </Droppable>
    );
}

export const displayCharacterNoDrag = (character: CHARACTERS, index: number, updateHover: (which: number) => void) => {
  return(
    <BigCharacterButton character={character} index={index} updateHover={updateHover} />
  )
}