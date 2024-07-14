/**
 * Extends from names.tsx by associating to CHARACTER_NAME enum to relevant data.
 */

import { ELEMENTS } from "../elements";
import { RARITY } from "../rarity";
import { WEAPONS } from "../weapons";
import { CHARACTER_NAME } from "./names";

type CharacterMap = {
	[index in CHARACTER_NAME]: CharacterDetail;
};

type CharacterDetail = {
	displayName: string;
	element: ELEMENTS;
	weapon: WEAPONS;
	rarity: RARITY;
	imageFileName: string;
};

export const CHARACTERS: CharacterMap = {
	[CHARACTER_NAME.albedo]: {
		displayName: "Albedo",
		element: ELEMENTS.geo,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Albedo",
	},
};
