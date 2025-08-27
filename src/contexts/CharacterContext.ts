import { createContext, useEffect, useState } from "react";
import PlayerInfo from "../interfaces/PlayerInfoInterface";
let info: PlayerInfo[] = [];

const CharacterContext = createContext(info);
export default CharacterContext;
