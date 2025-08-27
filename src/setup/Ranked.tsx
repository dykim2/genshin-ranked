import NaviBar from "./NaviBar.jsx";
import { Outlet } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

export default function Ranked() {
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