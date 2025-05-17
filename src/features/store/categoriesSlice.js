import { createSlice } from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
    name: "categories",
    initialState: [],
    reducers: {
        setCategories(state, action) {
            return action.payload;
        },
        addCategories: (state, action) => {
            state.push(action.payload);
        },
        removeCategories: (state, action) => {
            return state.filter((category) => category.id !== action.payload);
        },
    },
});

export const { setCategories, addCategories, removeCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
