import {BrowserRouter, Route, Routes } from "react-router-dom";
import Characters from "../pages/CharacterInfo.tsx";
import Home from "../pages/Home.tsx";
import Rules from "../pages/Rules.tsx";
import Play from "../pages/Play.tsx";
import InvalidPage from "../pages/InvalidPage.tsx";
import Ranked from "./Ranked.jsx";
import { FC, useEffect, useState } from "react";
import Game from "../pages/Game.jsx";
import React from "react";
import { Button } from "@mui/material";
import Bosses from "../pages/BossInfo.tsx";
import { Guide } from "../pages/Guide.tsx";
import GetInfo from "../pages/GetInfo.tsx";
import PlayerConnection from "../interfaces/PlayerInfoInterface.tsx";

interface IRouter {
  socket: WebSocket;
}

const WebRouter: FC<IRouter> = (props) => {
  const [active, setActive] = useState<PlayerConnection[]>([]);
  const api_choice = ["https://rankedapi-late-cherry-618.fly.dev", "http://localhost:3001"];
  const api = api_choice[0];
  const findActive = async () => {
    let gameData = await fetch(`${api}/gameAPI/active`, {
      method: "GET",
    });
    let res: [PlayerConnection[], string] = await gameData.json();
    let info: PlayerConnection[] = res[0];
    if (info != undefined) {
      setActive(info);
    }
    // console.log(info);
  };
  useEffect(() => {
    findActive();
  }, []);
  // maybe pass down the active and findactive 
  const centerStyle: React.CSSProperties = {
    marginTop: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "pre-line",
    fontFamily: "Roboto Mono",
    flexDirection: "column",
  };
  const ErrorPage = () => {
    return (
      <div style={centerStyle}>
        <h1 style={{ fontSize: 65 }}>Oh no, something went wrong!</h1>
        <p style={{ fontSize: 50 }}>
          Press the button below to return home, and please send a bug report explaining
          how you got to this screen.
        </p>
        <Button variant="contained" sx={{ fontSize: 30 }} href="/">
          Return Home
        </Button>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Ranked />} errorElement={<ErrorPage />}>
          <Route index element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/play" element={<Play activeGames={active} findActive={findActive} />} />
          {active!.map((game: {_id: number}) => {
            return (
              <Route
                key={game._id}
                path={`/play/${game._id}`}
                element={<Game id={game._id} socket={props.socket} />}
              />
            );
          })}
          <Route path="/characters" element={<Characters />} />
          <Route path="/bosses" element={<Bosses />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/checklogs" element={<GetInfo />} />
          <Route path="*" element={<InvalidPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default WebRouter;