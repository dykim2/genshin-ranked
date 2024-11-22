import { Link } from "react-router-dom";

// Destructuring the props (Idk how many props are being used :c)
const OneCharacter = ({name, img} = props) => {
  return (
    <div>
      <Link style={{ color: "white" }} to="/characters">
        {"< Return to characters"}
      </Link>
      <p>{name}</p>
      <img src={img} height={1500} />
      
    </div>
  )
}

// export default function OneCharacter(props){
//     return (
//       <div>
//         <Link style={{ color: "white" }} to="/characters">
//           {"< Return to characters"}
//         </Link>
//         <p>{props.name}</p>
//         <img src={props.img} height={1500} />
//       </div>
//     );
// }

export default OneCharacter;

/*
<img
  src={props.icon}
  height={50}
  width={50}
  alt={`icon of character ${props.name}`}
/>
*/