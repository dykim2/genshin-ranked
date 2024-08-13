import { GenericDetails } from "./generic";

export enum ELEMENTS {
	anemo = "anemo",
	cryo = "cryo",
	dendro = "dendro",
	electro = "electro",
	geo = "geo",
	hydro = "hydro",
	pyro = "pyro",
	physical = "physical"
}

type ElementMap = {
	[index in ELEMENTS]: GenericDetails;
};

export const ELEMENT_INFO: ElementMap = {
	[ELEMENTS.anemo]: {
		displayName: "Anemo",
		imageFileName: "anemo",
	},
	[ELEMENTS.cryo]: {
		displayName: "Cryo",
		imageFileName: "cryo",
	},
	[ELEMENTS.dendro]: {
		displayName: "Dendro",
		imageFileName: "dendro",
	},
	[ELEMENTS.electro]: {
		displayName: "Electro",
		imageFileName: "electro",
	},
	[ELEMENTS.geo]: {
		displayName: "Geo",
		imageFileName: "geo",
	},
	[ELEMENTS.hydro]: {
		displayName: "Hydro",
		imageFileName: "hydro",
	},
	[ELEMENTS.pyro]: {
		displayName: "Pyro",
		imageFileName: "pyro",
	},
	[ELEMENTS.physical]: {
		displayName: "Physical",
		imageFileName: "physical"
	}
};
