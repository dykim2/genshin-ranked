import { Stack } from "@mui/material";
import { Fragment, useState } from "react";
import { displayCharacter, displayCharacterNoDrag } from "../components/DisplayComponent";
import { charMap } from "@genshin-ranked/shared/src/utils/nameToID";
import { CHARACTERS } from "@genshin-ranked/shared/src/types/characters/names";

// choose three characters

// display the icon at standard size, try to make stack fill up entire page
const Ref = () => {
    const [indexes, setIndexes] = useState<number[]>([-1,-1,-1]);
    const updateCharacter = (index: number, character: number) => {
        // update indexes

    };   
    return (
        <Fragment>
            <Stack marginLeft={1}>
                <p>Choose three characters and this will tell you the ref requirements for that team.</p>
                {
                    displayCharacterNoDrag(charMap.get(indexes[0]) ?? CHARACTERS.None, true, updateCharacter)
                }
            </Stack>
        </Fragment>
    )   
}



export default Ref;