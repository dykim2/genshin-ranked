import { CHARACTERS, GenericDetails } from "../types";
import { BOSSES } from "../types/bosses";
import { CHARACTER_INFO } from "../types/characters/details";
import { BOSS_DETAIL } from "../types/bosses/details";

export const ELEMENT_IMAGE_PATH = "/images/general/elements";
export const WEAPON_IMAGE_PATH = "/images/general/billets";
export const CHARACTER_IMAGE_PATH = "/images/chars";
export const BOSS_IMAGE_PATH = "/images/bosses";
export const RARITY_IMAGE_PATH = "/images/genera/rarity";

export const getCharacterImagePath = (character: CHARACTERS) => {
	return `${CHARACTER_IMAGE_PATH}/${CHARACTER_INFO[character].imageFileName}.png`;
};

export const getCharacterElementImagePath = (character: CHARACTERS) => {
	return `${ELEMENT_IMAGE_PATH}/${CHARACTER_INFO[character].element}.png`;
};

export const getBossImagePath = (boss: BOSSES) => {
	return `${BOSS_IMAGE_PATH}/${BOSS_DETAIL[boss].imageFileName}.png`
}

export const getBossElementImagePath = (boss: BOSSES) => {
	return `${ELEMENT_IMAGE_PATH}/${BOSS_DETAIL[boss].element}.png`;
}

export const getElementImagePath = (elementDetail: GenericDetails) => {
	return `${ELEMENT_IMAGE_PATH}/${elementDetail.imageFileName}.png`;
};

export const getRarityImagePath = (elementDetail: GenericDetails) => {
	return `${RARITY_IMAGE_PATH}/${elementDetail.imageFileName}.png`;
};