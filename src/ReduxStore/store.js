// redux store
import {configureStore} from "@reduxjs/toolkit";
import gameReducer from "./gameReducer";
import characterReducer from "./characterReducer";

export default configureStore({
    reducer: {}
})