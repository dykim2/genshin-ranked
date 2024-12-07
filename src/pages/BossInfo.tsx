import { Typography } from "@mui/material";
import React, { Fragment } from "react";
import { BossDisplay } from "../../frontend/src/routes/bosses";

// like CharacterInfo, shows restrictions
export default function Bosses() {
    
    const select = (teamNum: number, selectedObj: object, timeout: boolean) => {};
    return (
      <Fragment>
        <Typography sx={{ fontSize: 60 }}>
          View available boss options and ids here!
        </Typography>
        <BossDisplay id={0} team={0} pickSelection={select} inGame={false} />
      </Fragment>
    );
} 