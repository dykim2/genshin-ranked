import { CHARACTER_NAME } from "../types";
import { CHARACTERS } from "../types/characters/details";

export const ELEMENT_IMAGE_PATH = "/images/general/elements";
export const WEAPON_IMAGE_PATH = "/images/general/billets";
export const CHARACTER_IMAGE_PATH = "/images/chars";

export const getCharacterImagePath = (character: CHARACTER_NAME) => {
	return `${CHARACTER_IMAGE_PATH}/${CHARACTERS[character].imageFileName}.png`;
};

export const getCharacterElementImagePath = (character: CHARACTER_NAME) => {
	return `${ELEMENT_IMAGE_PATH}/${CHARACTERS[character].element}.png`;
};
