import { GenericDetails } from "./generic";

export enum ELEMENTS {
	anemo = "anemo",
	cryo = "cryo",
	dendro = "dendro",
	electro = "electro",
	geo = "geo",
	hydro = "hydro",
	pyro = "pyro",
	physical = "physical",
	multi = "multi"
}

type ElementMap = {
	[index in ELEMENTS]: GenericDetails;
};

export const ELEMENT_INFO: ElementMap = {
	[ELEMENTS.anemo]: {
		displayName: "Anemo",
		imageFileName: "anemo",
		onlineFilePath: "https://thumbs4.imagebam.com/f0/4c/ed/MEVUDQC_t.png",
	},
	[ELEMENTS.cryo]: {
		displayName: "Cryo",
		imageFileName: "cryo",
		onlineFilePath: "https://thumbs4.imagebam.com/20/21/7b/MEVUDQE_t.png",
	},
	[ELEMENTS.dendro]: {
		displayName: "Dendro",
		imageFileName: "dendro",
		onlineFilePath: "https://thumbs4.imagebam.com/66/59/36/MEVUDQG_t.png",
	},
	[ELEMENTS.electro]: {
		displayName: "Electro",
		imageFileName: "electro",
		onlineFilePath: "https://thumbs4.imagebam.com/74/11/85/MEVUDQH_t.png",
	},
	[ELEMENTS.geo]: {
		displayName: "Geo",
		imageFileName: "geo",
		onlineFilePath: "https://thumbs4.imagebam.com/cd/4d/06/MEVUDQI_t.png",
	},
	[ELEMENTS.hydro]: {
		displayName: "Hydro",
		imageFileName: "hydro",
		onlineFilePath: "https://thumbs4.imagebam.com/55/e9/9a/MEVUDQK_t.png",
	},
	[ELEMENTS.pyro]: {
		displayName: "Pyro",
		imageFileName: "pyro",
		onlineFilePath: "https://thumbs4.imagebam.com/ca/c3/bf/MEVUDQM_t.png",
	},
	[ELEMENTS.physical]: {
		displayName: "Physical",
		imageFileName: "physical",
		onlineFilePath: "https://thumbs4.imagebam.com/bd/6c/be/MEVUDQL_t.png",
	},
	[ELEMENTS.multi]: {
		displayName: "Multi-Element",
		imageFileName: "multi",
		onlineFilePath: "https://thumbs4.imagebam.com/3f/67/70/ME10MWKB_t.png",
	},
};
