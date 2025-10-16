// a small bonus page, used to get info of a game

import { Button } from "@mui/material"

const obtainInfo = async() => {
  let res = prompt("What ID?")
  if(res == null){
    return;
  }
  let game: Response = await fetch(
    `https://rankedapi-late-cherry-618.fly.dev/gameAPI/find/${res}`,
    {
      method: "GET"
    }
  );
  if(game == null){
    return;
  }
  let info = await game.json();
  console.log(info.log);
  alert("info obtained");
}

const GetInfo = () => {
  return (
    <Button
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "pre-line",
        fontFamily: "Roboto Mono",
        flexDirection: "column",
        width: 500,
      }}
      variant="contained"
      onClick={obtainInfo}
    >
      Log Game Info
    </Button>
  );
}

export default GetInfo;