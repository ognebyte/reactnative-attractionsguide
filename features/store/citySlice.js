import { createSlice } from "@reduxjs/toolkit";

const citySlice = createSlice({
    name: "city",
    initialState: null,
    reducers: {
        setCity(state, action) {
            return action.payload;
        }
    },
});

export const { setCity } = citySlice.actions;
export default citySlice.reducer;
