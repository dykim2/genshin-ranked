import { Stack, Typography } from "@mui/material";
import { Fragment, useState, useRef, useEffect } from "react";
import { displayCharacterNoDrag } from "../components/DisplayComponent";
import { charMap } from "@genshin-ranked/shared/src/utils/nameToID";
import { CHARACTERS } from "@genshin-ranked/shared/src/types/characters/names";
import CharactersModal from "./CharactersModal";
import { CHARACTER_INFO, ELEMENTS } from "@genshin-ranked/shared";
import { TEAM_BONUS } from "@genshin-ranked/shared/src/types/teambonus";

// choose three characters

// display the icon at standard size, try to make stack fill up entire page
const Ref = () => {
    const [indexes, setIndexes] = useState<number[]>([-1,-1,-1]);
    const [selectedInd, setSelection] = useState<number>(-1);
    const [isOpen, setOpen] = useState<boolean>(false);
    const flinsInTeam = useRef(false);
    const whichFlinsIndex = useRef(-1);
    const [information, setInfo] = useState<String>("any non-natlan, non-moonsign character!");
    const fontSizeChoice = {xs: "1rem", sm: "1.3rem", md: "1.6rem", lg: "1.9rem", xl: "2.2rem"};
    useEffect(() => {
        refreshInformation();
    }, [indexes])
    const updateCharacter = (index: number, character: number) => {
        // update indexes
        setOpen(false);
        let newIndexes = [...indexes];
        newIndexes[index] = character;
        if(character == CHARACTER_INFO[CHARACTERS.Flins].index){
            // hard coded to check for flins in team, flins chasca + non moonsign electro cant have aino ref
            flinsInTeam.current = true;
            whichFlinsIndex.current = index;
        }
        else if (whichFlinsIndex.current == index && character != 103) {
          flinsInTeam.current = false;
          whichFlinsIndex.current = -1;
        }
        setIndexes(newIndexes);
        // update ref element
    };   
    const openCharacterMenu = (index: number) => {
        setSelection(index);
        // open the modal
        setOpen(true);
    };
    const refreshInformation = () => {
        // algorithm
        // assumes manekin / manekina / traveler automatically comply with the element requirements (i.e. chevreuse, traveler, clorinde has traveler be pyro or electro)
        let whichRestriction: TEAM_BONUS = TEAM_BONUS.none; // team element restrictions (you MUST be this element or that element)
        let whichOptions: TEAM_BONUS[] = [TEAM_BONUS.none, TEAM_BONUS.none, TEAM_BONUS.none]; // team options (aino ref, hex ref, chasca element), but per character, so if two or more moonsign, two or more hex, dont do anything
        let elementInfo: ELEMENTS[] = [ELEMENTS.physical, ELEMENTS.physical, ELEMENTS.physical];
        let doubleUp: TEAM_BONUS[] | null = null;
        for(let i = 0; i < indexes.length; i++){
            let bonus = CHARACTER_INFO[charMap.get(indexes[i]) ?? CHARACTERS.None].bonus;
            // check for specific dual element teams - if two of them exist on the same team, they cancel each other out. tbf not necessary
            // make an exception for something like skirk effie nilou - ignore nilou passive
            if(bonus == TEAM_BONUS.hydrocryo || bonus == TEAM_BONUS.hydrodendro || bonus == TEAM_BONUS.pyroelectro){
                if(whichRestriction != TEAM_BONUS.none && whichRestriction != bonus){
                    whichRestriction = TEAM_BONUS.none;
                    // problem is this relies on last character to work properly
                    // maybe go back and check again if and only if this procs
                    doubleUp = [];
                    doubleUp.push(whichRestriction);
                    doubleUp.push(bonus);
                }
                else{
                    if(doubleUp != null){
                        // in the case of three different team bonuses
                        doubleUp.push(bonus);
                    }
                    else{
                        whichRestriction = bonus;
                    }
                    whichOptions[i] = TEAM_BONUS.none;
                }
            }
            else{
                whichOptions[i] = bonus;
            }
            elementInfo[i] = CHARACTER_INFO[charMap.get(indexes[i]) ?? CHARACTERS.None].element;
        }
        let cryo = 0;
        let dendro = 0;
        let electro = 0;
        let hydro = 0;
        let pyro = 0;
        let multi = 0;
        for (let i = 0; i < elementInfo.length; i++) {
            if (elementInfo[i] === ELEMENTS.cryo) {
                cryo++;
            }
            if (elementInfo[i] === ELEMENTS.dendro) {
                dendro++;
            }
            if (elementInfo[i] === ELEMENTS.electro) {
                electro++;
            }
            if (elementInfo[i] === ELEMENTS.hydro) {
                hydro++;
            }
            if (elementInfo[i] === ELEMENTS.pyro) {
                pyro++;
            }
            if (elementInfo[i] === ELEMENTS.multi) {
                multi++;
          }
        }
        if(doubleUp != null){
            // check for the first 
            let found = false;
            for(let i = 0; i < doubleUp.length; i++){
                switch(doubleUp[i]){
                    case TEAM_BONUS.pyroelectro: {
                        if(pyro + electro + multi == 3){
                            found = true;
                            whichRestriction = TEAM_BONUS.pyroelectro;
                        }
                        break;
                    }
                    case TEAM_BONUS.hydrocryo: {
                        if(hydro + cryo + multi == 3){
                            found = true;
                            whichRestriction = TEAM_BONUS.hydrocryo;
                        }
                        break;
                    }
                    case TEAM_BONUS.hydrodendro: {
                        if(hydro + dendro + multi == 3){
                            found = true;
                            whichRestriction = TEAM_BONUS.hydrodendro;
                        }
                        break;
                    }
                }
                if(found){
                    break;
                }
            }
        }
        else if(whichRestriction != TEAM_BONUS.none){
            let found = false;
            switch(whichRestriction){
                case TEAM_BONUS.pyroelectro: {
                    if(pyro + electro + multi == 3){
                        found = true;
                        whichRestriction = TEAM_BONUS.pyroelectro;
                    }
                    break;
                }
                case TEAM_BONUS.hydrocryo: {
                    if(hydro + cryo + multi == 3){
                        found = true;
                        whichRestriction = TEAM_BONUS.hydrocryo;
                    }
                    break;
                }
                case TEAM_BONUS.hydrodendro: {
                    if(hydro + dendro + multi == 3){
                        found = true;
                        whichRestriction = TEAM_BONUS.hydrodendro;
                    }
                    break;
                }
            }
            if(!found){
                whichRestriction = TEAM_BONUS.none;
            }
        }
        // re-evaluate teambonus 
        /*
        console.log("elements");
        console.log(elementInfo);
        console.log("team bonus");
        console.log(whichRestriction);
        console.log("team options")
        console.log(whichOptions);
        */
        let count = 0;
        let moonsign = 0;
        let hexerei = 0;
        let phec = false;
        let nahida = false;
        console.log("phec and nahida:",phec,nahida,whichOptions.length);
        for (let i = 0; i < whichOptions.length; i++) {
            // console.log("tes tes tes")
            // console.log(whichOptions[i],"option",whichOptions[i] === TEAM_BONUS.phec);
            if (whichOptions[i] === TEAM_BONUS.neuvillette) {
                count += 0.5;
            }
            if (whichOptions[i] === TEAM_BONUS.chooseelement) {
                count++;
            }
            if (whichOptions[i] === TEAM_BONUS.hexerei) {
                hexerei++;
            }
            if (whichOptions[i] === TEAM_BONUS.moonsign) {
                moonsign++;
            }
            if (whichOptions[i] === TEAM_BONUS.phec) {
                // console.log("yes phec")
                phec = true;
            }
            if (whichOptions[i] === TEAM_BONUS.nahida) {
                nahida = true;
            }
        }
        if (count == 1.5) {
          // ref must be hydro
            if(moonsign == 1 && !flinsInTeam.current){
                setInfo("Aino or any non-Natlan non-Moonsign Hydro character, up to the players!");
            }
            else{
                setInfo("any non-Natlan non-Moonsign Hydro character!");
            }
            return;
        }
        // atm doesnt account for chasca neuv escoffier / skirk / nilou
        if(whichRestriction == TEAM_BONUS.none){
            if(count == 1){
                // check for flins
                if(flinsInTeam && moonsign == 1){
                    for(let i = 0; i < indexes.length; i++){
                        if(i == whichFlinsIndex.current){
                            continue;
                        }
                        if(CHARACTER_INFO[charMap.get(indexes[i]) ?? CHARACTERS.None].element == ELEMENTS.electro && indexes[i] != CHARACTER_INFO[CHARACTERS.Flins].index){
                            setInfo("any non-Moonsign non-Natlan Hydro character!")
                            return;
                        }
                    }
                }
                else if (hexerei == 1 && moonsign == 1) { // chasca mona 
                    setInfo("Aino, Fischl, Razor, or follow standard ref rules, chosen by the players!");
                } else if (moonsign == 1) {
                    setInfo("Aino or follow standard ref rules, chosen by the players!");
                } else if (hexerei == 1) {
                    setInfo("Fischl, Razor, or follow standard ref rules, chosen by the players!");
                } else {
                  // check elements of all characters
                    setInfo(generalElements(elementInfo, true));
                }
            }
            else{
                if(hexerei == 1 && moonsign == 1){
                    setInfo("Aino, Fischl, Razor, or follow standard ref rules, chosen by the players!");
                }
                else if(moonsign == 1){
                    setInfo("Aino or follow standard ref rules, chosen by the players!");
                    return;
                }
                else if(hexerei == 1){
                    setInfo("Fischl, Razor, or follow standard ref rules, chosen by the players!");
                }
                else if(phec){
                    // console.log("yes phec 2")
                    let newElements = [...elementInfo];
                    let bonusElements = [ELEMENTS.anemo, ELEMENTS.geo, ELEMENTS.dendro];
                    newElements = newElements.concat(bonusElements);
                    setInfo(generalElements(newElements, false));
                }
                else if(nahida){
                    let newElements = [...elementInfo];
                    let bonusElements = [ELEMENTS.hydro, ELEMENTS.pyro, ELEMENTS.electro];
                    newElements = newElements.concat(bonusElements);
                    setInfo(generalElements(newElements, false));
                }
                else{
                    setInfo(generalElements(elementInfo, false));
                }
            }
        }
        else{
            if(whichRestriction == TEAM_BONUS.pyroelectro){
                // check everyone is pyro or electro
                if(pyro + electro + multi == 3){
                    if((pyro > electro && pyro != 3) || electro == 3){
                        setInfo("Any non-Natlan non-Moonsign Pyro character!");
                    }
                    else if(pyro < electro || pyro == 3){
                        setInfo("Any non-Natlan non-Moonsign Electro character!");
                    }
                    else{
                        setInfo("Any non-Natlan non-Moonsign Electro or Pyro character, depending on which element has more characters!");
                    }
                }
                else{
                    setInfo(generalElements(elementInfo, false));
                }
            }
            else if(whichRestriction == TEAM_BONUS.hydrocryo){
                if(hydro + cryo + multi == 3){
                    if((hydro > cryo && hydro != 3) || cryo == 3){
                        setInfo("Any non-Natlan non-Moonsign Hydro character!");
                    }
                    else if(hydro < cryo || hydro == 3){
                        setInfo("Any non-Natlan non-Moonsign Cryo character!");
                    }
                    else{
                        // TODO fix this when cryo mc comes out if ever
                        setInfo("Any non-Natlan non-Moonsign Hydro character!");
                    }
                }
                else{
                    let check = false; // check for escoffier
                    let newElements: (ELEMENTS)[] = Array.from(new Set(elementInfo));
                    for(let i = 0; i < indexes.length; i++){
                        if(indexes[i] == CHARACTER_INFO[CHARACTERS.Escoffier].index){
                            check = true;
                            break;
                        }
                    }
                    let retStr = "any non-Natlan non-Moonsign";
                    for (let i = 0; i < newElements.length; i++) {
                        retStr += ` non-${newElements[i]}`;
                    }
                    if(check && hydro == 0){
                        retStr += ` non-hydro`
                    }
                    retStr += " character, element chosen by the ref!"
                }
            }
            else{
                if(hydro + dendro + multi == 3){
                    if((hydro + dendro && hydro != 3) || dendro == 3){
                        setInfo("Any non-Natlan non-Moonsign Hydro character!");
                    }
                    else if(hydro < dendro || hydro == 3){
                        setInfo("Any non-Natlan non-Moonsign Dendro character!");
                    }
                    else{
                        setInfo("Any non-Natlan non-Moonsign Hydro or Dendro character, depending on which element has more characters!");
                    }
                }
                else{
                    // check if its escoffier or skirk, skirk doesnt have a restriction of no hydro ref without full passive
                    setInfo(generalElements(elementInfo, false));
                }
            }
        }
    }
    return (
      <Fragment>
        <Typography sx={{ fontSize: fontSizeChoice }}>
          Choose three characters and this will tell you the ref requirements
          for that team.
        </Typography>
        <Typography sx={{ fontSize: fontSizeChoice }}>
          This will NOT be guarenteed accurate information if you add two of the same character.
        </Typography>
        <Stack marginLeft={1} direction={"row"} spacing={5}>
          {displayCharacterNoDrag(
            charMap.get(indexes[0]) ?? CHARACTERS.None,
            0,
            openCharacterMenu,
          )}
          {displayCharacterNoDrag(
            charMap.get(indexes[1]) ?? CHARACTERS.None,
            1,
            openCharacterMenu,
          )}
          {displayCharacterNoDrag(
            charMap.get(indexes[2]) ?? CHARACTERS.None,
            2,
            openCharacterMenu,
          )}
        </Stack>
          <Typography sx={{ fontSize: fontSizeChoice }}>
            Ref can use&nbsp;
            <Typography component={"span"} sx={{ fontSize: fontSizeChoice }} fontWeight={"bold"}>
            {`${information}`}
          </Typography>
          </Typography>
          

        <CharactersModal
          open={isOpen}
          close={() => setOpen(false)}
          index={selectedInd}
          updateCharacter={updateCharacter}
        />
      </Fragment>
    );  
    
}
const generalElements = (elementInfo: ELEMENTS[], chooseElement: boolean) => {
  let newElements: (ELEMENTS)[] = Array.from(new Set(elementInfo));
  let retStr = "any non-Natlan non-Moonsign";
  for (let i = 0; i < newElements.length; i++) {
    retStr += ` non-${newElements[i]}`;
  }
  retStr += " character";
  if(chooseElement){
    retStr += ", element chosen by the players!";
  }
  else{
    retStr += ", element chosen by the ref!";
  }
  return retStr;
};

export default Ref;