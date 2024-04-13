import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Characters from "../pages/Characters.jsx";
import Home from "../pages/Home.jsx";
import Rules from "../pages/Rules.jsx";
import Play from "../pages/Play.jsx";
import InvalidPage from "../pages/InvalidPage.jsx";
import Ranked from "./Ranked.jsx";

export default function WebRouter() {

const styleInfo = () => {
  
}

  // simple router, should route between all pages sufficiently
  return (
    <BrowserRouter>
      <Routes>
        {/* we will insert the pages here */}
        <Route path="/" element={<Ranked />}>
          <Route index element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/play" element={<Play />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="*" element={<InvalidPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
