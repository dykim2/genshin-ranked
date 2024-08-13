import { GenericDetails } from "./generic";

export enum RARITY {
	FourStar = 4,
	FiveStar = 5,
}

type RarityMap = {
	[index in RARITY]: GenericDetails;
};

export const RARITY_INFO: RarityMap = {
	[RARITY.FourStar]: {
		displayName: "4*",
		imageFileName: "FourStar",
	},
	[RARITY.FiveStar]: {
		displayName: "5*",
		imageFileName: "FiveStar",
	},
};
