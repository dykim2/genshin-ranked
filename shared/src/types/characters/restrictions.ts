import { CHARACTERS } from "./names";

type CharMap = {
   [index in CHARACTERS]:  CharacterRestriction
}
type CharacterRestriction = {
    limit: number;
    differences: number[];
    restrictions: string[];
}

export const CHARACTER_RESTRICTIONS: CharMap = {
	[CHARACTERS.Albedo]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Alhaitham]: {
		limit: 4,
		differences: [2, 3, 4],
		restrictions: [
			"Any 5* Weapon | R3+ Wolf-Fang",
			"Wolf-Fang | Harbinger of Dawn",
			"Any 3* Weapon",
		],
	},
	[CHARACTERS.Aloy]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Amber]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Arlecchino]: {
		limit: 1,
		differences: [1],
		restrictions: ["Any 4* Weapon"],
	},
	[CHARACTERS.Ayaka]: {
		limit: 6,
		differences: [2, 3, 4],
		restrictions: [
			"Mistsplitter Reforged",
			"Any 5* Weapon | R3+ Wolf-Fang",
			"Any 2* Weapon",
		],
	},
	[CHARACTERS.Ayato]: {
		limit: 6,
		differences: [3, 6],
		restrictions: [
			"Haran Geppaku Futsu | Jade Cutter",
			"Any 4* Weapon | Harbinger of Dawn",
		],
	},
	[CHARACTERS.Baizhu]: {
		limit: 6,
		differences: [6],
		restrictions: ["Any 5* Weapon"],
	},
	[CHARACTERS.Barbara]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Beidou]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Bennett]: {
		limit: 6,
		differences: [5],
		restrictions: [
			"Any 674 Base Atk Weapon | Haran Geppaku Futsu | Freedom-Sworn | Peak Patrol Song,",
		],
	},
	[CHARACTERS.Candace]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Charlotte]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Chasca]: {
		limit: 1,
		differences: [0, 1],
		restrictions: [
			"Astral Vulture's Crimson Plumage",
			"Any 5* Weapon | Scion of The Blazing Sun | Flower-Wreathed Feathers | Range Gauge",
		],
	},
	[CHARACTERS.Chevreuse]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Chiori]: {
		limit: 3,
		differences: [2, 3],
		restrictions: ["Peak Patrol Song", "Uraku Misugiri"],
	},
	[CHARACTERS.Chongyun]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	/*
	[CHARACTERS.Citlali]: {
		limit: 6,
		differences: [-1],
		restrictions: ["To be determined"],
	},
	*/
	[CHARACTERS.Clorinde]: {
		limit: 2,
		differences: [0, 1, 2],
		restrictions: [
			"Absolution",
			"Any 5* Weapon | The Black Sword | Sturdy Bone | Lion's Roar",
			"Any 3* Weapon",
		],
	},
	[CHARACTERS.Collei]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Cyno]: {
		limit: 6,
		differences: [2, 3, 6],
		restrictions: [
			"Staff of Scarlet Sands",
			"Primorial Jade-Winged Spear",
			"Any 3* Weapon",
		],
	},
	[CHARACTERS.Dehya]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Diluc]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Diona]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Dori]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Emilie]: {
		limit: 2,
		differences: [1, 2],
		restrictions: ["Lumidouce Elegy", "Any 4* Weapon"],
	},
	[CHARACTERS.Eula]: {
		limit: 5,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Faruzan]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Fischl]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Freminet]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Furina]: {
		limit: 2,
		differences: [2],
		restrictions: ["Any 3* Weapon"],
	},
	[CHARACTERS.Gaming]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Ganyu]: {
		limit: 5,
		differences: [1, 3, 4],
		restrictions: [
			"Astral Vulture's Crimson Plumage",
			"Any 5* Weapon | R3+ Scion of The Blazing Sun",
			"Any 4* Weapon",
		],
	},
	[CHARACTERS.Gorou]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.HuTao]: {
		limit: 6,
		differences: [3, 6],
		restrictions: ["Staff of Homa", "Any 4* Weapon"],
	},
	[CHARACTERS.Itto]: {
		limit: 6,
		differences: [5, 6],
		restrictions: [
			"Redhorn Stonethresher | R3+ Serpent Spine",
			"Any 5* Weapon | Serpent Spine | Whiteblind",
		],
	},
	[CHARACTERS.Jean]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Kachina]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Kazuha]: {
		limit: 6,
		differences: [6],
		restrictions: ["Any 4* Weapon"],
	},
	[CHARACTERS.Kaeya]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Kaveh]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Keqing]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Kinich]: {
		limit: 1,
		differences: [1],
		restrictions: ["Any 5* Weapon | R3+ Serpent Spine"],
	},
	[CHARACTERS.Kirara]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Klee]: {
		limit: 6,
		differences: [2, 6],
		restrictions: ["Any 5* Weapon | R3+ Solar Pearl", "Solar Pearl"],
	},
	[CHARACTERS.Kokomi]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.KujouSara]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.KukiShinobu]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Layla]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Lisa]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Lynette]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Lyney]: {
		limit: 1,
		differences: [1],
		restrictions: ["Any 5* Weapon | Flower Wreathed Feathers"],
	},
	[CHARACTERS.Mika]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Mona]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	/*
	[CHARACTERS.Mavuika]: {
		limit: 6,
		differences: [-1],
		restrictions: ["To be determined"],
	},
	*/
	[CHARACTERS.Mualani]: {
		limit: 1,
		differences: [1],
		restrictions: [
			"Any 5* Weapon | R3+ Ring of Yaxche | Prototype Amber | Waveriding Whirl",
		],
	},
	[CHARACTERS.Nahida]: {
		limit: 6,
		differences: [3, 4, 6],
		restrictions: [
			"Thousand Floating Dreams",
			"Any 5* Weapon | Wandering Evenstar",
			"Any 3* Weapon",
		],
	},
	[CHARACTERS.Navia]: {
		limit: 1,
		differences: [0, 1],
		restrictions: ["Verdict", "R3+ Serpent Spine"],
	},
	[CHARACTERS.Neuvillette]: {
		limit: 2,
		differences: [0, 1, 2],
		restrictions: [
			"Tome of The Eternal Flow",
			"Any 4* Weapon",
			"Any 3* Weapon",
		],
	},
	[CHARACTERS.Nilou]: {
		limit: 6,
		differences: [6],
		restrictions: ["Any 5* Weapon | R3+ Wolf Fang"],
	},
	[CHARACTERS.Ningguang]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Noelle]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Ororon]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Qiqi]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Raiden]: {
		limit: 6,
		differences: [4, 6],
		restrictions: [
			"Any 5* Weapon | Wavebreaker's Fin | Deathmatch",
			"The Catch | Ballad of The Fjords",
		],
	},
	[CHARACTERS.Razor]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Rosaria]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Sayu]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Sethos]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Shenhe]: {
		limit: 5,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Heizou]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Sigewinne]: {
		limit: 5,
		differences: [4, 5],
		restrictions: ["Silvershow Heartstrings", "Aqua Simulacra"],
	},
	[CHARACTERS.Sucrose]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Tartaglia]: {
		limit: 6,
		differences: [6],
		restrictions: ["Polar Star"],
	},
	[CHARACTERS.Thoma]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Tighnari]: {
		limit: 5,
		differences: [2, 4],
		restrictions: [
			"Hunter's Path",
			"Any 5* Weapon | Scion of The Blazing Sun | R3+ Flower-Wreathed Feathers",
		],
	},
	[CHARACTERS.Traveler]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Venti]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Wanderer]: {
		limit: 5,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Wriothesley]: {
		limit: 3,
		differences: [1, 3],
		restrictions: ["Any 5* Weapon", "Any 4* Weapon"],
	},
	[CHARACTERS.Xiangling]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Xianyun]: {
		limit: 1,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Xiao]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Xilonen]: {
		limit: 1,
		differences: [0],
		restrictions: ["Peak Patrol Song | Freedom Sworn"],
	},
	[CHARACTERS.Xingqiu]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Xinyan]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.YaeMiko]: {
		limit: 6,
		differences: [3, 4, 6],
		restrictions: ["Kagura's Verity", "Any 5* Weapon", "Any 4* Weapon"],
	},
	[CHARACTERS.Yanfei]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Yaoyao]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Yelan]: {
		limit: 2,
		differences: [2],
		restrictions: ["Any 5* Weapon"],
	},
	[CHARACTERS.Yoimiya]: {
		limit: 6,
		differences: [4, 6],
		restrictions: ["Any 5* Weapon | Rust", "Any 4* Weapon | Slingshot"],
	},
	[CHARACTERS.YunJin]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Zhongli]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.NoBan]: {
		limit: 0,
		differences: [],
		restrictions: [],
	},
	[CHARACTERS.None]: {
		limit: 0,
		differences: [],
		restrictions: [],
	},
};