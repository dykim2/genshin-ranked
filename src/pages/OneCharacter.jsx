
import { Link } from "react-router-dom";

export default function OneCharacter(props){
    return (
      <div>
        <Link style={{ color: "white" }} to="/characters">
          {"< Return to characters"}
        </Link>
        <p>{props.name}</p>
        <img src={props.img} height={1500} />
      </div>
    );
}


/*
<img
  src={props.icon}
  height={50}
  width={50}
  alt={`icon of character ${props.name}`}
/>
*/