import NaviBar from "./NaviBar.jsx";
import { Outlet } from "react-router-dom";

export default function Ranked() {
  return (
    <div>
      <NaviBar />
      
      <section>
        <Outlet />
      </section>
    </div>
  );
}
