// redux store
import {configureStore} from "@reduxjs/toolkit";
import gameSlice from "../GameReduce/gameSlice";
import selectionSlice from "../GameReduce/selectionSlice";

export const store = configureStore({
    reducer: {
        game: gameSlice.reducer,
        selections: selectionSlice.reducer
    }
})

// infers the type of 'store' whatever 'store' may be
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>