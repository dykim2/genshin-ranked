import {Grid} from "@mui/material"

import {displayCharacter} from "./DisplayComponent";
import {useAppSelector} from "../hooks/ReduxHooks";
import {CHARACTERS} from "@genshin-ranked/shared";

interface ExtraBanProps {
  charInfo: Map<number, CHARACTERS>
  gridSize: number,
  openChange: (team: number, name: string, original: number) => void,
  team: 1 | 2,
}


const ExtraBanDisplay = ({openChange, team, gridSize, charInfo}: ExtraBanProps) => {
  const identity = useAppSelector((state) => state.game);
  let extraBanCounter = 0;
  let extraBanOrder: number[][] = [[], []];
  if (identity.extrabans.length > 0) {
    // creates extra ban order based on the number of extra bans of each team
    // alternates 1 - 2 - 1 - 2 - 1 - 2 until a team runs out of extra bans, which then the rest are the other team's
    for (
      let i = 0;
      i < Math.max(identity.extrabanst1, identity.extrabanst2);
      i++
    ) {
      if (i < identity.extrabanst1) {
        extraBanOrder[0].push(extraBanCounter);
        extraBanCounter++;
      }
      if (i < identity.extrabanst2) {
        extraBanOrder[1].push(extraBanCounter);
        extraBanCounter++;
      }
    }
  }
  return (
    <Grid
      container
      sx={{justifyContent: {xs: team == 2 ? "end" : "left", md: "center"}}}
      size={gridSize}
      // offset: now 0, formerly team == 1 || (identity.extrabanst1 > 0 && identity.extrabanst2 > 0 && gridSize == 2) ? 0 : identity.extrabanst1 > 0 ? (12 - gridSize * 2) : (12 - gridSize)
      direction={"row"}
      columns={2}
      spacing={0.5}
    >
      {extraBanOrder[team - 1].map((ban: number, index: number) => {
        return (
          <div key={index}>
            {displayCharacter(
              charInfo.get(identity.extrabans[ban]) ?? CHARACTERS.None,
              false,
              team,
              ban + 15,
              openChange
            )}
          </div>
        );
      })}
    </Grid>
  );
}
export default ExtraBanDisplay;