import {BrowserRouter, Route, Routes } from "react-router-dom";
import Characters from "../pages/CharacterInfo.tsx";
import Home from "../pages/Home.tsx";
import Rules from "../pages/Rules.jsx";
import Play from "../pages/Play.tsx";
import InvalidPage from "../pages/InvalidPage.jsx";
import Ranked from "./Ranked.jsx";
import { FC, useContext, useEffect } from "react";
import CharacterContext from "../contexts/CharacterContext.js";
import Game from "../pages/Game.jsx";
import ActiveContext from "../contexts/ActiveContext.js";
import React from "react";
import { Button } from "@mui/material";
import Bosses from "../pages/BossInfo.tsx";
import { Guide } from "../pages/Guide.tsx";
import GetInfo from "../pages/GetInfo.tsx";

interface IRouter {
  socket: WebSocket;
}

const WebRouter: FC<IRouter> = (props) => {
  const [characters, setCharacters] = useContext(CharacterContext);
  const [active, setActive] = useContext(ActiveContext);
  const api_choice = ["https://rankedapi-late-cherry-618.fly.dev", "http://localhost:3000"];
  const api = api_choice[0];
  
  useEffect(() => {
    // obtain list of characters, save them to a context
     const getChars = async() => {
      let charData = await fetch(
        `${api}/charAPI/`,
        {
          method: "GET",
        }
      );
      charData = await charData.json();
      let arr: Object[] = []; // to sort the characters alphabetically
      // remove the character with name "N/A"
      charData[0].map((char: { _id: number; }) => {
        return char._id >= 0 ? arr.push(char) : null;
      });
      arr.sort(compare);
      setCharacters(arr);
      sessionStorage.setItem("characters", JSON.stringify(arr));
    }
    const findActive = async() => {
      let gameData = await fetch(`${api}/gameAPI/active`, {
        method: "GET",
      });
      gameData = await gameData.json();
      setActive(gameData[0]);
    }
    getChars();
    findActive();
  }, []);
  const centerStyle: React.CSSProperties = {
    marginTop: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "pre-line",
    fontFamily: "Roboto Mono",
    flexDirection: "column",
  };
  function ErrorPage() {
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
            <Route path="/play" element={<Play />} />
            {active.map((game: { _id: React.Key | null | undefined }) => {
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

const compare = (one: any, two: any) => {
  // compare characters
  if(one._id == "undefined"){
    throw new Error("Please only compare characters.")
  }
  if(one._id < two._id){
    return -1;
  }
  else if(one._id > two._id){
    return 1;
  }
  else{
    return 0;
  }
}

export default WebRouter;