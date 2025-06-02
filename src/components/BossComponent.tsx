// a component to replace the current showing of "none" and an empty circlet with a specific character
// we know the character information

import { BOSSES, CHARACTER_INFO, CHARACTERS } from "@genshin-ranked/shared";
import { BossButton, CharacterButton } from "../../frontend/src/components";
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
    alert("hi");
}

// index needed incase someone adds a boss twice
export const displayBoss = (boss: BOSSES, index: number, change: (team: number, name: string, original: number) => void) => {
    const selecting = true; // can be changed in future
    const updateBoss = () => {
        // does nothing
    }
    let z: number = BOSS_DETAIL[boss].index;
    // create a draggable element
    // it must also be droppable in a sense too
    // cause i want to drag it between the elements
    // only can be dragged horizontally

    // for bosses specifically make sure no duplicates
    // for characters can allow dupes
    
    return(
        <Droppable id={z}>
            <Dragable id={z}>
              <div onContextMenu={(e) => {e.preventDefault(); change(0, BOSS_DETAIL[boss].displayName, index)}}>
                <BossButton
                    boss={boss}
                    updateBoss={updateBoss}
                    selectDisplay={selecting}
                    team={0}
                    updateHover={updateHover}
                    isChosen={false}
                    component={true}
                />
                </div>
            </Dragable>
        </Droppable>
    )
}

export const displayCharacter = (character: CHARACTERS, isPick: boolean, team: number, index: number, change: (team: number, name: string, original: number) => void) => {
    const banDisplay = (isPick ? "pick" : "ban");
    const updateCharacter = () => {
      
    }
    return (
      <Droppable id={CHARACTER_INFO[character].index}>
        <Dragable id={CHARACTER_INFO[character].index}>
          <div
            onContextMenu={(e) => {
              e.preventDefault();
              console.log("index: "+index);
              change(
                team,
                CHARACTER_INFO[character].displayName,
                index
              );
            }}
          >
            <CharacterButton
              character={character}
              updateCharacter={updateCharacter}
              updateHover={updateHover}
              banDisplay={banDisplay}
              team={0}
              isChosen={false}
              component={true}
            />
          </div>
        </Dragable>
      </Droppable>
    );
}