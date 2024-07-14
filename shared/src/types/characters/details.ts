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
	[CHARACTERS.Chongyun]: {
		displayName: "Chongyun",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FourStar,
		imageFileName: "Chongyun",
	},
	[CHARACTERS.Clorinde]: {
		displayName: "Clorinde",
		element: ELEMENTS.electro,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Clorinde",
	},
	[CHARACTERS.Collei]: {
		displayName: "Collei",
		element: ELEMENTS.dendro,
		weapon: WEAPONS.bow,
		rarity: RARITY.FourStar,
		imageFileName: "Collei",
	},
	[CHARACTERS.Cyno]: {
		displayName: "Cyno",
		element: ELEMENTS.electro,
		weapon: WEAPONS.polearm,
		rarity: RARITY.FiveStar,
		imageFileName: "Cyno",
	},
	[CHARACTERS.Dehya]: {
		displayName: "Dehya",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FiveStar,
		imageFileName: "Dehya",
	},
	[CHARACTERS.Diluc]: {
		displayName: "Diluc",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FiveStar,
		imageFileName: "Diluc",
	},
	[CHARACTERS.Diona]: {
		displayName: "Diona",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.bow,
		rarity: RARITY.FourStar,
		imageFileName: "Diona",
	},
	[CHARACTERS.Dori]: {
		displayName: "Dori",
		element: ELEMENTS.electro,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FourStar,
		imageFileName: "Dori",
	},
	[CHARACTERS.Eula]: {
		displayName: "Eula",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FiveStar,
		imageFileName: "Eula",
	},
	[CHARACTERS.Faruzan]: {
		displayName: "Faruzan",
		element: ELEMENTS.anemo,
		weapon: WEAPONS.bow,
		rarity: RARITY.FourStar,
		imageFileName: "Faruzan",
	},
	[CHARACTERS.Freminet]: {
		displayName: "Freminet",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FourStar,
		imageFileName: "Freminet",
	},
	[CHARACTERS.Furina]: {
		displayName: "Furina",
		element: ELEMENTS.hydro,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Furina",
	},
	[CHARACTERS.Gaming]: {
		displayName: "Gaming",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FourStar,
		imageFileName: "Gaming",
	},
	[CHARACTERS.Ganyu]: {
		displayName: "Ganyu",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.bow,
		rarity: RARITY.FiveStar,
		imageFileName: "Ganyu",
	},
	[CHARACTERS.Gorou]: {
		displayName: "Gorou",
		element: ELEMENTS.geo,
		weapon: WEAPONS.bow,
		rarity: RARITY.FourStar,
		imageFileName: "Gorou",
	},
	[CHARACTERS.HuTao]: {
		displayName: "Hu Tao",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.polearm,
		rarity: RARITY.FiveStar,
		imageFileName: "HuTao",
	},
	[CHARACTERS.Jean]: {
		displayName: "Jean",
		element: ELEMENTS.anemo,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Jean",
	},
	[CHARACTERS.KaedeharaKazuha]: {
		displayName: "Kaedehara Kazuha",
		element: ELEMENTS.anemo,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "KaedeharaKazuha",
	},
	[CHARACTERS.Kaeya]: {
		displayName: "Kaeya",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.sword,
		rarity: RARITY.FourStar,
		imageFileName: "Kaeya",
	},
	[CHARACTERS.KamisatoAyaka]: {
		displayName: "Kamisato Ayaka",
		element: ELEMENTS.cryo,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "KamisatoAyaka",
	},
	[CHARACTERS.KamisatoAyato]: {
		displayName: "Kamisato Ayato",
		element: ELEMENTS.hydro,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "KamisatoAyato",
	},
	[CHARACTERS.Kaveh]: {
		displayName: "Kaveh",
		element: ELEMENTS.dendro,
		weapon: WEAPONS.claymore,
		rarity: RARITY.FourStar,
		imageFileName: "Kaveh",
	},
	[CHARACTERS.Keqing]: {
		displayName: "Keqing",
		element: ELEMENTS.electro,
		weapon: WEAPONS.sword,
		rarity: RARITY.FiveStar,
		imageFileName: "Keqing",
	},
	[CHARACTERS.Kirara]: {
		displayName: "Kirara",
		element: ELEMENTS.dendro,
		weapon: WEAPONS.sword,
		rarity: RARITY.FourStar,
		imageFileName: "Kirara",
	},
	[CHARACTERS.Klee]: {
		displayName: "Klee",
		element: ELEMENTS.pyro,
		weapon: WEAPONS.catalyst,
		rarity: RARITY.FiveStar,
		imageFileName: "Klee",
	},
};
