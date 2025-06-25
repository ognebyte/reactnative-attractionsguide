import { createSlice } from "@reduxjs/toolkit";

const attractionSlice = createSlice({
    name: "attraction",
    initialState: {
        attraction: null,
        shouldAnimate: false
    },
    reducers: {
        setAttraction(state, action) {
            state.attraction = action.payload;
            state.shouldAnimate = true;
        },
        resetAttractionAnimateFlag: (state) => {
            state.shouldAnimate = false;
        }
    },
});

export const { setAttraction, resetAttractionAnimateFlag } = attractionSlice.actions;
export default attractionSlice.reducer;