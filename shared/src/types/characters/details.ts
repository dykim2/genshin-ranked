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

// Default Template For Copy Paste:
// [CHARACTER_NAME.]: {
// 	displayName: "",
// 	element: ELEMENTS.,
// 	weapon: WEAPONS.,
// 	rarity: RARITY.FiveStar,
// 	imageFileName: "",
// },

export const CHARACTERS: CharacterMap = {
	[CHARACTER_NAME.Albedo]: {
		displayName: "Albedo",
		element: ELEMENTS.geo,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Albedo",
	},
	[CHARACTER_NAME.Alhaitham]: {
		displayName: "Alhaitham",
		element: ELEMENTS.dendro,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Alhaitham",
	},
	[CHARACTER_NAME.Aloy]: {
		displayName: "Aloy",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.bow,
		rarity: RARITY.SpecialEvent,
		imageFileName: "Aloy",
	},
	[CHARACTER_NAME.Amber]: {
		displayName: "Amber",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.bow,
		rarity: RARITY.FourStar,
		imageFileName: "Amber",
	},
	[CHARACTER_NAME.AratakiItto]: {
		displayName: "Arataki Itto",
		element: ELEMENTS.geo,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FiveStar,
		imageFileName: "AratakiItto",
	},
	[CHARACTER_NAME.Arlecchino]: {
		displayName: "Arlecchino",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.polearm,
		rarity: RARITY.FiveStar,
		imageFileName: "Arlecchino",
	},
	[CHARACTER_NAME.Baizhu]: {
		displayName: "Baizhu",
		element: ELEMENTS.dendro,
		weapon: WEAPONS.catalyst,
		rarity: RARITY.FiveStar,
		imageFileName: "Baizhu",
	},
	[CHARACTER_NAME.Barbara]: {
		displayName: "Barbara",
		element: ELEMENTS.hydro,
		weapon: WEAPONS.catalyst,
		rarity: RARITY.FourStar,
		imageFileName: "Barbara",
	},
	[CHARACTER_NAME.Beidou]: {
		displayName: "Beidou",
		element: ELEMENTS.electro,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FourStar,
		imageFileName: "Beidou",
	},
	[CHARACTER_NAME.Bennett]: {
		displayName: "Bennett",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.sword,
		rarity: RARITY.FourStar,
		imageFileName: "Bennett",
	},
	[CHARACTER_NAME.Candace]: {
		displayName: "Candace",
		element: ELEMENTS.hydro,
		weapon: WEAPONS.polearm,
		rarity: RARITY.FourStar,
		imageFileName: "Candace",
	},
	[CHARACTER_NAME.Charlotte]: {
		displayName: "Charlotte",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.catalyst,
		rarity: RARITY.FourStar,
		imageFileName: "Charlotte",
	},
	[CHARACTER_NAME.Chevreuse]: {
		displayName: "Chevreuse",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.polearm,
		rarity: RARITY.FourStar,
		imageFileName: "Chevreuse",
	},
	[CHARACTER_NAME.Chiori]: {
		displayName: "Chiori",
		element: ELEMENTS.geo,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Chiori",
	},
};
