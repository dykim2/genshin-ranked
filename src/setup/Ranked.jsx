import NaviBar from "./NaviBar.jsx";
import { Outlet } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

export default function Ranked() {
  //https://rankedapi-late-cherry-618.fly.dev/charAPI/
  // i will start by implementing supporting one game at a time. Then I will build support for up to 5 at a time.
  // when player 2 loads in to the screen, update context of the play page.
  // create the actual interface seperate, be able to redirect

  return (
    <div>
      <NaviBar />
      <section>
        <CookiesProvider defaultSetOptions={{ path: "/", sameSite: "lax" }}>
            <Outlet />
        </CookiesProvider>
      </section>
    </div>
  );
}