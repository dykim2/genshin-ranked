import {Button} from "react-bootstrap";
/*
    notes:
    1) I need to be able to redirect the user to a page of my choosing. 
    2) Once I redirect the user, I can set up something to choose a player 1 and player 2.
    3) I can use the API I made to add an extra call.
    4) If I do add the API, then I would have to add a call to it. Or alternatively I could create a custom link.
    5) If I do create a custom link, that solves a lot of the hassle. It would be like /player2 or something, would be updated in the backend as "busy" and I would have up to 10.
    6) This would i think haved to be randomized, kind of, or just set as a default link, instead of the not found page. 
    7) 


    Gonna try to use browser cookies - this should solve the problem of "am i player 1 or 2?". This does not answer one key question: how can i update 
*/

import {Cookies} from "react-cookie";
export default function Play(){
    const draft = () => {
        alert("draft time");
    }
    const blind = () => {
        alert("blind pick.");
    }
    return (
      <div style={{ color: "white" }}>
        <p>SELECT GAMEMODE</p>
        <Button onClick={draft}>Draft</Button>
        <br />
        <Button onClick={blind}>Blind</Button>
      </div>
    );
}
