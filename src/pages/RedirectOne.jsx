// will need a context to generate a url randomly 
// link to a second page on clicking of the url, which then redirects to play but sets the user cookies so they see stuff on their end
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
export default function Redirect(){
    // player 1 redirect
    // on loading of this page, add cookies to the browser stating this is player 1
    // then redirect them back to play
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(20);
    const [timeVisible, setVisible] = useState(false);
    let interval = 0;
    // set a variable for current time
    
    const [cookies, setCookie] = useCookies(['player']);
    const navi = useNavigate();
    useEffect(() => {
      if (cookies.player == 1) {
        setCookie("player", 2);
      } else {
        setCookie("player", 1);
      }
    }, [])
    const press = () => {
      navi("/play");
    }
    const doStuff = () => {
      alert("yikes");
    }
    return (
      <div>
        <button style={{ fontSize: 24 }} onClick={press}>
          Press to direct
        </button>
        <button onClick={() => {
          setSeconds(21);
          if(timeVisible){
            setVisible(false);
          } else{
            setVisible(true);
          }
        }}>20 seconds timer</button>
        {timeVisible ? (
          <Countdown date={Date.now() + seconds * 1000} onComplete={() => {doStuff()}}>
            <p>Time completed</p>
          </Countdown>
        ) : (
          <p>no timer</p>
        )}
      </div>
    );
}