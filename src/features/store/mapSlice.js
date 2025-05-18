import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
    name: "map",
    initialState: null,
    reducers: {
        jumpTo(state, action) {
            return action.payload;
        }
    },
});

export const { jumpTo } = mapSlice.actions;
export default mapSlice.reducer;