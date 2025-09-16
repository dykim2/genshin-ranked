import { Fragment, useRef, useState } from "react";
import { Balancing } from "../../frontend/src/routes/balancing.tsx";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details.ts";
import { CHARACTER_RESTRICTIONS } from "@genshin-ranked/shared/src/types/characters/restrictions.ts";
import { CHARACTERS } from "@genshin-ranked/shared";
import { Typography } from "@mui/material";
export default function CharacterList() { 
  const charRef = useRef<Map<number, CHARACTERS>>(null);
  const [info, setInfo] = useState<string[]>([]);
  const displayInfo = (_teamNum: number, selection: number, _type: string, _timeout: boolean = false) => {
    if (charRef.current == undefined) {
      const newMap = new Map();
      for (const someName in CHARACTER_INFO) {
        newMap.set(CHARACTER_INFO[someName].index, someName);
      }
      charRef.current = newMap;
    }
    // get character using id from charRef
    // get their restrictions
    if(charRef.current != undefined){
      let char_name: CHARACTERS = charRef.current.get(selection) ?? CHARACTERS.None;
      let restrict: string[] = CHARACTER_RESTRICTIONS[char_name].restrictions
      let limits: number[] = CHARACTER_RESTRICTIONS[char_name].differences;
      let infoArr: string[] = [
        `maximum constellation level allowed: ${CHARACTER_RESTRICTIONS[char_name].limit}`,
      ];
      for(let i: number = 0; i < limits.length; i++){
        infoArr.push(limits[i] == -1 ? `No banned weapons` :`C${limits[i]}+ banned weapons: ${restrict[i]}`)
      }
      setInfo(infoArr)
      /* // comment out for now, uncomment another time, this way the gifplay component doesnt appear at all 
        alertLink.current = getCharacterGifPath(char_name);
        setOpen(true)
        setTimeout(() => {
          setOpen(false)
        }, 5000); 
      */
    }
      
  }
  const doHover = (teamNum: number, selected: number) => {
    displayInfo(teamNum, selected, "", false);
  }
  return (
    <Fragment>
      <Typography sx={{fontSize: {xs: "1rem", sm: "1.5rem", md: "2rem", lg: "2.5rem", xl: "3rem"}}}>
        view character restrictions here!
      </Typography>
      {/* <Button>Show GIF for test</Button>*/}
      <Balancing
        sendHover={doHover}
        team={0}
        phase={""}
        inGame={false}
        bonusInfo={info}
      />
    </Fragment>
  );
};
/* ignore the below code this is old and basically useless
 {chars.map((char) => {
        return char._id < 0 || typeof char._id == "undefined" ? null : (
          <Link
            style={{ color: chooseColor(char.element) }}
            key={char.name}
            to={`/characters/${char.name}`}
          >
            <br />
            {char.name}
          </Link>
        );
      })}
        function chooseColor(elem) {
  const elements = ["pyro", "cryo", "hydro", "electro", "dendro", "anemo", "geo"];
  const colors = ["#EC4923", "#4682B4", "#00BFFF", "#945DC4", "#608a00", "#359697", "#DEBD6C"]
  for(let i = 0; i < elements.length; i++){
    if(elem.toLowerCase() === elements[i]){
      return colors[i];
    }
  }
  return "#FFFFFF" // white by default and for traveler
}
*/
