import { Typography } from "@mui/material";
import { BossDisplay } from "../../frontend/src/routes/bosses";

// like CharacterInfo, shows restrictions
export default function Bosses() {
  const sendHover = (_teamNum: number, _selected: number) => {}; // not meant to do anything
  return (
    <div style={{marginLeft: 15}}>
      <Typography sx={{fontSize: {xs: "1rem", sm: "1.5rem", md: "2rem", lg: "2.5rem", xl: "3rem"}}}>
        view available boss options and ids here!
      </Typography>
      <BossDisplay team={0} inGame={false} bonusInfo={[]} sendHover={sendHover} fearless={false} />
    </div>
  );
} 