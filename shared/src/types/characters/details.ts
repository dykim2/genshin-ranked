/**
 * Extends from names.tsx by associating to CHARACTER_NAME enum to relevant data.
 */

import { ELEMENTS } from "../elements";
import { WEAPONS } from "../weapons";
import { CHARACTER_NAME } from "./names"

type CharacterMap = {
    [index in CHARACTER_NAME]: CharacterDetail
}

type CharacterDetail = { 
    fullName: string;
    element: ELEMENTS;
    weapon: WEAPONS;
    imageFileName: string;
}

export const CHARACTERS:CharacterMap = {
    [CHARACTER_NAME.albedo] : {
        fullName: "Albedo",
        element: ELEMENTS.geo,
        weapon: WEAPONS.sword,
        imageFileName: "albedo"
    }

}