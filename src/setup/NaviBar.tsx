import { NavLink } from "react-router-dom";
import "./css/NaviBar.css"
import icon from "/images/assets/icon.png";
import React from "react";

export default function NaviBar(){
  const [open, setOpen] = React.useState(false);
    return (
      <>
        <header>
          <nav className="navigation">
            <button
              className="hamburger"
              onClick={() => setOpen((prev) => !prev)}
            >
              &#9776;
              <i className="ranked-text"><b>RANKED</b></i>
              <img src={icon} alt="Ranked Icon" width="20" height="20" />
            </button>

            <ul className={open ? "open" : ""}>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <b>
                  <i>
                    <p>RANKED </p>
                  </i>
                </b>
                <img src={icon} alt="Ranked Icon" width="20" height="20" />
              </li>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/play">Play</NavLink>
              </li>
              <li>
                <NavLink to="/characters">Characters</NavLink>
              </li>
              <li>
                <NavLink to="/bosses">Bosses</NavLink>
              </li>
              <li>
                <NavLink to="/guide">Guide</NavLink>
              </li>
              <li>
                <NavLink to="/rules">Rules</NavLink>
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