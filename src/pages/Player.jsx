import { useContext, useState } from "react"
import { Button } from "react-bootstrap";
import {useCookies, withCookies, Cookies} from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Player() {
  // the actual player interface
  /*
        concerns:
        1) I will need a timer. 30 seconds to select a pick, 30 seconds to select a ban (both from dropdown menus)
        2) How do I get the page to update on its own? I could set up an auto refresh, but that would not cut it.

        solutions:
        1) https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9
        2) ??? sessionStorage? Or I can find a package that solves this problem for me. 
        maybe.. i can just save data in the browser, and if i connect to the site different times and just wait for it to update.
        i can s



        more rambling v2 will delete
        I want to have it so one website user presses a button. This then updates my API.
        Once my API is updated, I want to refresh data so the other player sees this update as well.
        Attempt #2: using a context
        Once I get past a certain number, I will just ask on reddit. 

        Using cookies:
        Have the play page work for both players. Using cookies, I can create some small changes between players, so both players see the same thing, just 
        each player can choose on their own. 
  */
  const [player, setPlayer] = useState(1); // 1 or 2, for player 1 or 2
  const [chars, setChars] = useState([]);
  const [cookies, setCookie] = useCookies(['player']); // need to build with scaling in mind. 
  const navi = useNavigate();
  const update = () => {
    // check 
    navi('/redirect');
  }
  /*
    more notes
    so i have the player click on a button to play the game. 
    once they do, they are assigned a cookie after redirecting. this cookie stays in the browser. 
  */
  return (
    <div style={{ color: "white" }}>
      <p>Welcome! </p>
      <p>You are player {cookies.player}</p>
      <br />
      <Button onClick={update}>Set a cookie!</Button>
      {cookies.player == 1 ? (
        <p style={{ fontSize: "18px" }}>Welcome player 1!</p>
      ) : (
        <p style={{ fontSize: "18px" }}>Hi player 2!</p>
      )}
      {}
      <div>
        <p>Picks team 1</p>
      </div>
    </div>
  );
}