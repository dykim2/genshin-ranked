import { ELEMENTS } from "../elements";
import { GenericDetails } from "../generic";
import { BOSS_TYPE } from "../level";
import { BOSSES } from "./names";

type BossMap = {
    [index in BOSSES]: BossInfo
}

interface BossInfo extends GenericDetails {
    element: ELEMENTS;
    type: BOSS_TYPE;
    index: Number;
}
// index is the way the server communicates to determine what boss to place on the screen

export const BOSS_DETAIL: BossMap = {
    [BOSSES.AeonblightDrake]: {
        displayName: "Drake",
        element: ELEMENTS.physical,
        type: BOSS_TYPE.Standard,
        imageFileName: "AeonblightDrake",
        index: 20,
    },
    [BOSSES.AnemoCube]: {
        displayName: "AnemoCube",
        element: ELEMENTS.anemo,
        type: BOSS_TYPE.Standard,
        imageFileName: "AnemoCube",
        index: 1,
    },
    [BOSSES.ASIMON]: {
        displayName: "ASIMON",
        element: ELEMENTS.physical,
        type: BOSS_TYPE.Standard,
        imageFileName: "ASIMON",
        index: 21,
    },
    [BOSSES.IniquitousBaptist]: {
        displayName: "Baptist",
        element: ELEMENTS.physical,
        type: BOSS_TYPE.Standard,
        imageFileName: "Baptist",
        index: 25,
    },
    [BOSSES.Coppelia]: {
        displayName: "Coppelia",
        element: ELEMENTS.cryo,
        type: BOSS_TYPE.Standard,
        imageFileName: "Coppelia",
        index: 26,
    },
    [BOSSES.Coppelius]: {
        displayName: "Coppellius",
        element: ELEMENTS.anemo,
        type: BOSS_TYPE.Standard,
        imageFileName: "Coppelius",
        index: 27,
    },
    [BOSSES.CryoCube]: {
        displayName: "Cryo Cube",
        element: ELEMENTS.cryo,
        type: BOSS_TYPE.Standard,
        imageFileName: "CryoCube",
        index: 9,
    },
    [BOSSES.CryoVine]: {
        displayName: "Cryo Vine",
        element: ELEMENTS.cryo,
        type: BOSS_TYPE.Standard,
        imageFileName: "CryoVine",
        index: 2,
    },
    [BOSSES.DendroCube]: {
        displayName: "Dendro Cube",
        element: ELEMENTS.dendro,
        type: BOSS_TYPE.Standard,
        imageFileName: "DendroCube",
        index: 22,
    },
    [BOSSES.ElectroCube]: {
        displayName: "Electro Cube",
        element: ELEMENTS.electro,
        type: BOSS_TYPE.Standard,
        imageFileName: "ElectroCube",
        index: 3,
    },
    [BOSSES.ElectroVine]: {
        displayName: "Electro Vine",
        element: ELEMENTS.electro,
        type: BOSS_TYPE.Standard,
        imageFileName: "ElectroVine",
        index: 18,
    },
    [BOSSES.EnkaVishaps]: {
        displayName: "Enka Vishaps",
        element: ELEMENTS.electro,
        type: BOSS_TYPE.Standard,
        imageFileName: "EnkaVishap",
        index: 16,
    },
    [BOSSES.ExperimentalFieldGenerator]: {
        displayName: "EFG",
        element: ELEMENTS.geo,
        type: BOSS_TYPE.Standard,
        imageFileName: "EFG",
        index: 30
    },
    [BOSSES.GeoCube]: {
        displayName: "Geo Cube",
        element: ELEMENTS.geo,
        type: BOSS_TYPE.Standard,
        imageFileName: "GeoCube",
        index: 4,
    },
    [BOSSES.GoldenWolflord]: {
        displayName: "Wolflord",
        element: ELEMENTS.geo,
        type: BOSS_TYPE.Standard,
        imageFileName: "Wolflord",
        index: 15,
    },
    [BOSSES.HydroCube]: {
        displayName: "HydroCube",
        element: ELEMENTS.hydro,
        type: BOSS_TYPE.Standard,
        imageFileName: "HydroCube",
        index: 13,
    },
    [BOSSES.HydroTulpa]: {
        displayName: "Tulpa",
        element: ELEMENTS.hydro,
        type: BOSS_TYPE.Standard,
        imageFileName: "HydroTulpa",
        index: 33,
    },
    [BOSSES.JadeplumeTerrorshroom]: {
        displayName: "Terrorshroom",
        element: ELEMENTS.dendro,
        type: BOSS_TYPE.Standard,
        imageFileName: "JadeplumeTerrorshroom",
        index: 19,
    },
    [BOSSES.LegatusGolem]: {
        displayName: "Golem",
        element: ELEMENTS.pyro,
        type: BOSS_TYPE.Standard,
        imageFileName: "LegatusGolem",
        index: 38,
    },
    [BOSSES.MaguuKenki]: {
        displayName: "Kenki",
        element: ELEMENTS.anemo,
        type: BOSS_TYPE.Standard,
        imageFileName: "MaguuKenki",
        index: 10
    },
    [BOSSES.Oceanid]: {
        displayName: "Oceanid",
        element: ELEMENTS.anemo,
        type: BOSS_TYPE.Standard,
        imageFileName: "Oceanid",
        index: 5
    },
    [BOSSES.PMA]: {
        displayName: "PMA",
        element: ELEMENTS.physical,
        type: BOSS_TYPE.Standard,
        imageFileName: "PMA",
        index: 11
    },
    [BOSSES.PrimoVishap]: {
        displayName: "Primovishap",
        element: ELEMENTS.geo,
        type: BOSS_TYPE.Standard,
        imageFileName: "Primovishap",
        index: 7
    },
    [BOSSES.PyroCrab]: {
        displayName: "Pyro Crab",
        element: ELEMENTS.pyro,
        type: BOSS_TYPE.Standard,
        imageFileName: "PyroCrab",
        index: 28
    },
    [BOSSES.PyroCube]: {
        displayName: "Pyro Cube",
        element: ELEMENTS.pyro,
        type: BOSS_TYPE.Standard,
        imageFileName: "PyroCube",
        index: 12,
    },
    [BOSSES.PyroVine]: {
        displayName: "Pyro Vine",
        element: ELEMENTS.pyro,
        type: BOSS_TYPE.Standard,
        imageFileName: "PyroVine",
        index: 6,
    },
    [BOSSES.RuinSerpent]: {
        displayName: "Serpent",
        element: ELEMENTS.physical,
        type: BOSS_TYPE.Standard,
        imageFileName: "RuinSerpent",
        index: 17,
    },
    [BOSSES.MillenialPearlSeahorse]: {
        displayName: "Seahorse",
        element: ELEMENTS.electro,
        type: BOSS_TYPE.Standard,
        imageFileName: "Seahorse",
        index: 31,
    },
    [BOSSES.SolitarySuanii]: {
        displayName: "Suanni",
        element: ELEMENTS.hydro,
        type: BOSS_TYPE.Standard,
        imageFileName: "Suanni",
        index: 35,
    },
    [BOSSES.Thunderbird]: {
        displayName: "Thunderbird",
        element: ELEMENTS.electro,
        type: BOSS_TYPE.Standard,
        imageFileName: "THunderbird",
        index: 14,
    },
    [BOSSES.Wenut]: {
        displayName: "Wenut",
        element: ELEMENTS.anemo,
        type: BOSS_TYPE.Standard,
        imageFileName: "Wenut",
        index: 23,
    },
    [BOSSES.Apep]: {
        displayName: "Apep",
        element: ELEMENTS.dendro,
        type: BOSS_TYPE.Weekly,
        imageFileName: "Apep",
        index: 24,
    },
    [BOSSES.Azhdaha]: {
        displayName: "Azhdaha",
        element: ELEMENTS.geo,
        type: BOSS_TYPE.Weekly,
        imageFileName: "Azhdaha",
        index: 8,
    },
    [BOSSES.Knave]: {
        displayName: "Knave",
        element: ELEMENTS.pyro,
        type: BOSS_TYPE.Weekly,
        imageFileName: "Knave",
        index: 37,
    },
    [BOSSES.Narwhal]: {
        displayName: "Narwhal",
        element: ELEMENTS.hydro,
        type: BOSS_TYPE.Weekly,
        imageFileName: "Narwhal",
        index: 32,
    },
    [BOSSES.ArrayMek]: {
        displayName: "Array Mek",
        element: ELEMENTS.geo,
        type: BOSS_TYPE.Legend,
        imageFileName: "ArrayMek",
        index: 29,
    },
    [BOSSES.ChizangVishaps]: {
        displayName: "Chizang Vishaps",
        element: ELEMENTS.geo,
        type: BOSS_TYPE.Legend,
        imageFileName: "ChizangVishaps",
        index: 34
    },
    [BOSSES.Cineas]: {
        displayName: "Cineas",
        element: ELEMENTS.hydro,
        type: BOSS_TYPE.Legend,
        imageFileName: "Cineas",
        index: 36,
    },
}