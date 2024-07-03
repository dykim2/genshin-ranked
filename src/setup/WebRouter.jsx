import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Characters from "../pages/Characters.jsx";
import Home from "../pages/Home.jsx";
import Rules from "../pages/Rules.jsx";
import Play from "../pages/Play.jsx";
import InvalidPage from "../pages/InvalidPage.jsx";
import Ranked from "./Ranked.jsx";
import Player from "../pages/Player.jsx";
import Redirect from "../pages/RedirectOne.jsx";
import OneCharacter from "../pages/OneCharacter.jsx";
import { Fragment, useContext, useEffect } from "react";
import CharacterContext from "../contexts/CharacterContext.js";
import Game from "../pages/Game.jsx";
import ActiveContext from "../contexts/ActiveContext.js";
import { PlayingContext, socket } from "../contexts/PlayingContext.js";

export default function WebRouter() {
  const [characters, setCharacters] = useContext(CharacterContext);
  const [active, setActive] = useContext(ActiveContext);
  useEffect(() => {
    // obtain list of characters, save them to a context
    async function getChars() {
      let charData = await fetch(
        "https://rankedapi-late-cherry-618.fly.dev/charAPI/",
        {
          method: "GET",
        }
      );
      charData = await charData.json();
      let arr = []; // to sort the characters alphabetically
      // remove the character with name "N/A"
      charData[0].map((char) => {
        char._id >= 0 ? arr.push(char) : null;
      });
      arr.sort(compare);
      setCharacters(arr);
      sessionStorage.setItem("characters", JSON.stringify(arr));
    }
    async function findActive() {
      let gameData = await fetch(
        "https://rankedapi-late-cherry-618.fly.dev/gameAPI/active",
        {
          method: "GET",
        }
      );
      gameData = await gameData.json();
      setActive(gameData[0].reverse());
    }
    getChars();
    findActive();
  }, []);
  const centerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whitespace: "pre-line",
    flexDirection: "column",
    marginTop: 300,
  };
  function ErrorPage() {
    return (
      <div style={centerStyle}>
        <h1 style={{ fontSize: 65 }}>Oh no, something went wrong!</h1>
        <p style={{ fontSize: 50 }}>
          Navigate to / to return home, and please send a bug report explaining
          how you got to this screen.
        </p>
      </div>
    );
  }
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Ranked />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/play" element={<Play />} />
        {active.map((game) => {
          return (
            <Route
              key={game._id}
              path={`/play/${game._id}`}
              element={<Game id={game._id} />}
            />
          );
        })}
        <Route path="/characters" element={<Characters />} />
        <Route path="/test" element={<Player />} />
        <Route path="/redirect" element={<Redirect />} />
        {characters.map((char) => {
          return (
            <Route
              key={char._id}
              path={`/characters/${char.name}`}
              element={<OneCharacter name={char.name} img={char.image} />}
            />
          );
        })}
        <Route path="*" element={<InvalidPage />} />
      </Route>
    )
  );
  /*
    createRoutesFromElements(
      <Route path="/" element={<Ranked />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/play" element={<Play />} />
        {active.map((game) => {
          return (
            <Route
              key={game._id}
              path={`/play/${game._id}`}
              element={<Game id={game._id} />}
            />
          );
        })}
        <Route path="/characters" element={<Characters />} />
        <Route path="/test" element={<Player />} />
        <Route path="/redirect" element={<Redirect />} />
        {characters.map((char) => {
          return (
            <Route
              key={char._id}
              path={`/characters/${char.name}`}
              element={<OneCharacter name={char.name} img={char.image} />}
            />
          );
        })}
        <Route path="*" element={<InvalidPage />} />
      </Route>
    )
  */
  const gameRoutes = () => {};
  const newRouter = createBrowserRouter([
    {
      path: "/",
      element: <Ranked />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "rules",
          element: <Rules />,
        },
        {
          path: "play",
          element: <Play />,
        },
      ],
      errorElement: <ErrorPage />,
    },
  ]);
  return (
    <PlayingContext.Provider value={socket}>
      <RouterProvider router={router} />
    </PlayingContext.Provider>
  );
}

function compare(one, two){
  // compare characters
  if(one.name == "undefined"){
    throw new Error("Please only compare characters.")
  }
  if(one.name < two.name){
    return -1;
  }
  else if(one.name > two.name){
    return 1;
  }
  else{
    return 0;
  }
}