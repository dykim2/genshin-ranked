import NaviBar from "./NaviBar.jsx";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import PlayingContext from "../contexts/PlayingContext.js";

export default function Ranked() {
  const [players, setPlayers] = useState({});
  // i will start by implementing supporting one game at a time. Then I will build support for up to 5 at a time.
  // when player 2 loads in to the screen, update context of the play page. 
  // create the actual interface seperate, be able to redirect
  useEffect(() => {

  }, [])
  return (
    <div>
      <NaviBar />
      <section>
        <PlayingContext.Provider value={[players, setPlayers]}>
          <CookiesProvider defaultSetOptions={{path: '/', sameSite: 'lax'}}>
            <Outlet />
          </CookiesProvider>
        </PlayingContext.Provider>
        
      </section>
    </div>
  );
}
