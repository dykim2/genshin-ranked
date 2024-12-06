import { CHARACTERS, GenericDetails } from "../types";
import { BOSSES } from "../types/bosses";
import { CHARACTER_INFO } from "../types/characters/details";
import { BOSS_DETAIL } from "../types/bosses/details";
import { ELEMENT_INFO, ELEMENTS } from "../types/elements";

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

export const getCharacterElementOnlinePath = (character: CHARACTERS) => {
	return `${ELEMENT_INFO[CHARACTER_INFO[character].element].onlineFilePath}`;
}

export const getCharacterBanPath = (character: CHARACTERS) => {
	return `${CHARACTER_IMAGE_PATH}/bans/${CHARACTER_INFO[character].imageFileName}Ban.gif`;
}

export const getCharacterGifPath = (character: CHARACTERS) => {
	return `${CHARACTER_IMAGE_PATH}/selections/${CHARACTER_INFO[character].imageFileName}.gif`;
};

export const getBossImagePath = (boss: BOSSES) => {
	return `${BOSS_IMAGE_PATH}/${BOSS_DETAIL[boss].imageFileName}.png`
}

export const getBossElementImagePath = (boss: BOSSES) => {
	return `${ELEMENT_IMAGE_PATH}/${BOSS_DETAIL[boss].element}.png`;
}

export const getBossElementOnlinePath = (boss: BOSSES) => {
	return `${ELEMENT_INFO[BOSS_DETAIL[boss].element].onlineFilePath}`;
}

export const getBossGifPath = (boss: BOSSES) => {
	return `${BOSS_IMAGE_PATH}/selections/${BOSS_DETAIL[boss].imageFileName}.gif`;
}

export const getElementImagePath = (elementDetail: GenericDetails) => {
	return `${ELEMENT_IMAGE_PATH}/${elementDetail.imageFileName}.png`;
};

export const getRarityImagePath = (elementDetail: GenericDetails) => {
	return `${RARITY_IMAGE_PATH}/${elementDetail.imageFileName}.png`;
};
