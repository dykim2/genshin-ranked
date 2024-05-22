import { NavLink } from "react-router-dom";
import "./css/NaviBar.css"
import icon from "../images/icon.png"

export default function NaviBar(){
    return (
      <>
        <header>
          <nav className="navigation">
            <ul>
              <li style={{display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                <b><i><p>GENSHIN RANKED </p></i></b>
                <img
                  src={icon}
                  alt="Ranked Icon"
                  width="20"
                  height="20"
                />
              </li>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/characters">Characters</NavLink>
              </li>
              <li>
                <NavLink to="/rules">Rules</NavLink>
              </li>
              <li>
                <NavLink to="/play">Play</NavLink>
              </li>
              <li>
                <a href="http://discord.gg/fnGdP36E2Q">Discord</a>
              </li>
            </ul>
          </nav>
        </header>
      </>
    );
}