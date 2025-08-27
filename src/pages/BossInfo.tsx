import { Typography } from "@mui/material";
import React, { Fragment } from "react";
import { BossDisplay } from "../../frontend/src/routes/bosses";

// like CharacterInfo, shows restrictions
export default function Bosses() {
    
    const select = (_teamNum: number, _selectedObj: object, _timeout: boolean) => {}; // not meant to do anything
    const sendHover = (_teamNum: number, _selected: number) => {}; // not meant to do anything
    return (
      <div style={{marginLeft: 15}}>
        <Typography sx={{ fontSize: 60 }}>
          view available boss options and ids here!
        </Typography>
        <BossDisplay team={0} pickSelection={select} inGame={false} selections={[]} bonusInfo={[]} sendHover={sendHover} fearless={false} active={false} />
      </div>
    );
} 