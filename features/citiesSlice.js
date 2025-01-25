import { createSlice } from "@reduxjs/toolkit";

const citiesSlice = createSlice({
    name: "cities",
    initialState: [],
    reducers: {
        setCities(state, action) {
            return action.payload;
        },
        addCities: (state, action) => {
            state.push(action.payload);
        },
        removeCities: (state, action) => {
            return state.filter((city) => city.id !== action.payload);
        },
    },
});

export const { setCities, addCities, removeCities } = citiesSlice.actions;
export default citiesSlice.reducer;
