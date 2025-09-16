import {Grid} from "@mui/material"

import {displayCharacter} from "../components/DisplayComponent";
import {useAppSelector} from "../hooks/ReduxHooks";
import {CHARACTERS} from "@genshin-ranked/shared";

interface BanProps {
    charInfo: Map<number, CHARACTERS>
    gridSize: number,
    openChange: (team: number, name: string, original: number) => void,
    team: 1 | 2
}

const BanDisplay = ({openChange, team, gridSize, charInfo}: BanProps) => {
    const identity = useAppSelector((state) => state.game);
    return(
        <Grid
            container
            justifyContent="center"
            size={gridSize}
        >

        </Grid>
    )
}

export default BanDisplay;