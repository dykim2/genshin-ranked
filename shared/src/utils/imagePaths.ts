import { CHARACTER_NAME } from "../types";
import { CHARACTERS } from "../types/characters/details";

export const ELEMENT_IMAGE_PATH = "/images/general/elements";
export const WEAPON_IMAGE_PATH = "/image/general/billets";
export const CHARACTER_IMAGE_PATH = "/image/chars";

export const getCharacterImagePath = (character: CHARACTER_NAME) => {
	return `${CHARACTER_IMAGE_PATH}/${CHARACTERS[character].imageFileName}.png`;
};
