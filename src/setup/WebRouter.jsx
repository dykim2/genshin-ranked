import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Characters from "../pages/Characters.jsx";
import Home from "../pages/Home.jsx";
import Rules from "../pages/Rules.jsx";
import Play from "../pages/Play.jsx";
import InvalidPage from "../pages/InvalidPage.jsx";
import Ranked from "./Ranked.jsx";
import Player from "../pages/Player.jsx";
import Redirect from "../pages/RedirectOne.jsx";
import OneCharacter from "../pages/OneCharacter.jsx";
import { useContext } from "react";
import CharacterContext from "../contexts/CharacterContext.js";

export default function WebRouter() {
  const characters = useContext(CharacterContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Ranked />}>
          <Route index element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/play" element={<Play />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/test" element={<Player />} />
          <Route path="/redirect" element={<Redirect />} />
          {
            characters.map(char => {
              return(
                <Route
                  key={char._id}
                  path={`/characters/${char.name}`}
                  element={<OneCharacter name={char.name} img={char.image} />}
                />
              )
            })
          }
          <Route path="*" element={<InvalidPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}