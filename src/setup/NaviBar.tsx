import { NavLink } from "react-router-dom";
import "./css/NaviBar.css"
import icon from "/images/assets/icon.png";
import React from "react";

export default function NaviBar(){
  const [open, setOpen] = React.useState(false);
  const close = () => {
    if(open) setOpen(false);
  }
    return (
      <>
        <header>
          <nav className="navigation">
            <button
              className="hamburger"
              onClick={() => setOpen((prev) => !prev)}
            >
              &#9776;
              <i className="ranked-text">
                <b>&nbsp;RANKED&nbsp;</b>
              </i>
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
                    <p>RANKED</p>
                  </i>
                </b>
                <img src={icon} alt="Ranked Icon" width="20" height="20" />
              </li>
              <li>
                <NavLink onClick={close} to="/">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink onClick={close} to="/play">
                  Play
                </NavLink>
              </li>
              <li>
                <NavLink onClick={close} to="/characters">
                  Characters
                </NavLink>
              </li>
              <li>
                <NavLink onClick={close} to="/bosses">
                  Bosses
                </NavLink>
              </li>
              <li>
                <NavLink onClick={close} to="/guide">
                  Guide
                </NavLink>
              </li>
              <li>
                <NavLink onClick={close} to="/rules">
                  Rules
                </NavLink>
              </li>
              <li>
                <a href="http://discord.gg/fnGdP36E2Q">Discord</a>
              </li>
              <li>
                <NavLink onClick={close} to="/ref">
                  Find Ref Element
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
      </>
    );
}