import { NavLink } from "react-router-dom";
import "./css/NaviBar.css"

export default function NaviBar(){
    return (
      <>
        <header>
          <nav className="navigation">
            <ul>
              <li>
                <p style={{color: 'white'}}>Genshin Ranked</p>
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