// will need a context to generate a url randomly 
// link to a second page on clicking of the url, which then redirects to play but sets the user cookies so they see stuff on their end
import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import PlayingContext from "../contexts/PlayingContext";
export default function Redirect(){
    // player 1 redirect
    // on loading of this page, add cookies to the browser stating this is player 1
    // then redirect them back to play
    
    const [cookies, setCookie] = useCookies(['player']);
    const navi = useNavigate();
    const [players, setPlayers] = useContext(PlayingContext);
    useEffect(() => {
        if (cookies.player == 1) {
          setCookie("player", 2);
        } else {
          setCookie("player", 1); // to scale this down the line, adding another call to rankedAPI to see what players have been determined will allow me to scale this
        }
    }, [])
    const press = () => {
        navi("/play");
    }
    return(
        <button style={{fontSize: 24}} onClick={press}>Press to direct</button>
    )
}