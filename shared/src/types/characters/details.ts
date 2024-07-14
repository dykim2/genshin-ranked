/**
 * Extends from names.tsx by associating to CHARACTERS enum to relevant data.
 */

import { ELEMENTS } from "../elements";
import { GenericDetails } from "../generic";
import { RARITY } from "../rarity";
import { WEAPONS } from "../weapons";
import { CHARACTERS } from "./names";

type CharacterMap = {
	[index in CHARACTERS]: CharacterDetail;
};

interface CharacterDetail extends GenericDetails {
	element: ELEMENTS;
	weapon: WEAPONS;
	rarity: RARITY;
}

// Default Template For Copy Paste:
// [CHARACTERS.]: {
// 	displayName: "",
// 	element: ELEMENTS.,
// 	weapon: WEAPONS.,
// 	rarity: RARITY.FiveStar,
// 	imageFileName: "",
// },

export const CHARACTER_INFO: CharacterMap = {
	[CHARACTERS.Albedo]: {
		displayName: "Albedo",
		element: ELEMENTS.geo,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Albedo",
	},
	[CHARACTERS.Alhaitham]: {
		displayName: "Alhaitham",
		element: ELEMENTS.dendro,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Alhaitham",
	},
	[CHARACTERS.Aloy]: {
		displayName: "Aloy",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.bow,
		rarity: RARITY.FiveStar,
		imageFileName: "Aloy",
	},
	[CHARACTERS.Amber]: {
		displayName: "Amber",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.bow,
		rarity: RARITY.FourStar,
		imageFileName: "Amber",
	},
	[CHARACTERS.AratakiItto]: {
		displayName: "Arataki Itto",
		element: ELEMENTS.geo,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FiveStar,
		imageFileName: "AratakiItto",
	},
	[CHARACTERS.Arlecchino]: {
		displayName: "Arlecchino",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.polearm,
		rarity: RARITY.FiveStar,
		imageFileName: "Arlecchino",
	},
	[CHARACTERS.Baizhu]: {
		displayName: "Baizhu",
		element: ELEMENTS.dendro,
		weapon: WEAPONS.catalyst,
		rarity: RARITY.FiveStar,
		imageFileName: "Baizhu",
	},
	[CHARACTERS.Barbara]: {
		displayName: "Barbara",
		element: ELEMENTS.hydro,
		weapon: WEAPONS.catalyst,
		rarity: RARITY.FourStar,
		imageFileName: "Barbara",
	},
	[CHARACTERS.Beidou]: {
		displayName: "Beidou",
		element: ELEMENTS.electro,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FourStar,
		imageFileName: "Beidou",
	},
	[CHARACTERS.Bennett]: {
		displayName: "Bennett",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.sword,
		rarity: RARITY.FourStar,
		imageFileName: "Bennett",
	},
	[CHARACTERS.Candace]: {
		displayName: "Candace",
		element: ELEMENTS.hydro,
		weapon: WEAPONS.polearm,
		rarity: RARITY.FourStar,
		imageFileName: "Candace",
	},
	[CHARACTERS.Charlotte]: {
		displayName: "Charlotte",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.catalyst,
		rarity: RARITY.FourStar,
		imageFileName: "Charlotte",
	},
	[CHARACTERS.Chevreuse]: {
		displayName: "Chevreuse",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.polearm,
		rarity: RARITY.FourStar,
		imageFileName: "Chevreuse",
	},
	[CHARACTERS.Chiori]: {
		displayName: "Chiori",
		element: ELEMENTS.geo,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Chiori",
	},
};
