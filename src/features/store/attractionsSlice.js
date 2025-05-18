import { createSlice } from "@reduxjs/toolkit";

const attractionsSlice = createSlice({
    name: "attractions",
    initialState: [],
    reducers: {
        initialStateAttractions() {
            return []
        },
        setAttractions(state, action) {
            return action.payload;
        },
        addAttractions: (state, action) => {
            state.push(action.payload);
        },
        removeAttractions: (state, action) => {
            return state.filter((attraction) => attraction.id !== action.payload);
        },
    },
});

export const { initialStateAttractions, setAttractions, addAttractions, removeAttractions } = attractionsSlice.actions;
export default attractionsSlice.reducer;
