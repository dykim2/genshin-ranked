// use for selected bosses, characters, and such

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

// for stuff like selected bosses / characters
export interface SelectionState {
    boss: number,
    character: number,
    selectedBosses: number[],
    selectedBossBans: number[],
    selectedExtraBans: number[],
    selectedBans: number[],
    selectedPicksT1: number[],
    selectedPicksT2: number[],
}

const initialState: SelectionState = {
    boss: -1,
    character: -1,
    selectedBosses: [],
    selectedBossBans: [],
    selectedExtraBans: [],
    selectedBans: [],
    selectedPicksT1: [],
    selectedPicksT2: [],
}

const selectionSlice = createSlice({
  name: "selections",
  initialState,
  reducers: {
    hoverBoss: (state, action: PayloadAction<number>) => {
      state.boss = action.payload;
    },
    hoverCharacter: (state, action: PayloadAction<number>) => {
      state.character = action.payload;
    },
    selectBoss: (state, action: PayloadAction<number>) => {
      if (!state.selectedBosses.includes(action.payload)) {
        state.selectedBosses.push(action.payload);
      }
    },
    selectBan: (state, action: PayloadAction<number>) => {
      if (!state.selectedBans.includes(action.payload)) {
        state.selectedBans.push(action.payload);
      }
    },
    selectExtraBan: (state, action: PayloadAction<number>) => {
      if (!state.selectedExtraBans.includes(action.payload)) {
        state.selectedExtraBans.push(action.payload);
      }
    },
    selectPickT1: (state, action: PayloadAction<number>) => {
      if (!state.selectedPicksT1.includes(action.payload)) {
        state.selectedPicksT1.push(action.payload);
      }
    },
    selectPickT2: (state, action: PayloadAction<number>) => {
      if (!state.selectedPicksT2.includes(action.payload)) {
        state.selectedPicksT2.push(action.payload);
      }
    },
    overrideBoss: (
      state,
      action: PayloadAction<{
        ban: boolean;
        bosses: number[];
      }>
    ) => {
        const {ban, bosses} = action.payload;
        if(ban){
            state.selectedBossBans = bosses;
        }
        else{
            state.selectedBosses = bosses;
        }
    },
    overrideCharacter: (
      state,
      action: PayloadAction<{
        type: string;
        characters: number[];
      }>
    ) => {
      const {type, characters} = action.payload;
      switch (type) {
        case "bans":
          state.selectedBans = characters;
          break;
        case "extraBans":
          state.selectedExtraBans = characters;
          break;
        case "picksT1":
          state.selectedPicksT1 = characters;
          break;
        case "picksT2":
          state.selectedPicksT2 = characters;
          break;
        default:
          break;
      }
    },
    overrideAllCharacters: (
      state,
      action: PayloadAction<{
        bans: number[];
        extraBans: number[];
        picksT1: number[];
        picksT2: number[];
      }>
    ) => {
      const { bans, extraBans, picksT1, picksT2 } = action.payload;
      console.log(
        "overriding all characters to ",
        bans,
        extraBans,
        picksT1,
        picksT2
      );
      state.selectedBans = bans;
      state.selectedExtraBans = extraBans;
      state.selectedPicksT1 = picksT1;
      state.selectedPicksT2 = picksT2;
    },
    clearSelections: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export default selectionSlice;

export const {hoverBoss, hoverCharacter, overrideBoss, overrideCharacter, overrideAllCharacters, selectBoss, selectBan, selectExtraBan, selectPickT1, selectPickT2, clearSelections} = selectionSlice.actions;

// selectors
export const hoveredBoss = (state: RootState) => state.selections.boss;
export const hoveredCharacter = (state: RootState) => state.selections.character;

export const chosenBosses = (state: RootState) => state.selections.selectedBosses;
export const chosenBossBans = (state: RootState) => state.selections.selectedBossBans;

export const chosenBans = (state: RootState) => state.selections.selectedBans;
export const chosenExtraBans = (state: RootState) => state.selections.selectedExtraBans;
export const chosenPicksT1 = (state: RootState) => state.selections.selectedPicksT1;
export const chosenPicksT2 = (state: RootState) => state.selections.selectedPicksT2;

export const chosenBossPlusBans = createSelector([chosenBosses, chosenBossBans], (bosses, bossBans) => {
    const combined = [...bosses, ...bossBans];
    return Array.from(new Set(combined));
});

export const chosenCharacters = createSelector([chosenBans, chosenExtraBans, chosenPicksT1, chosenPicksT2], (bans, extraBans, picksT1, picksT2) => {
    const combined = [...bans, ...extraBans, ...picksT1, ...picksT2];
    return Array.from(new Set(combined));
});