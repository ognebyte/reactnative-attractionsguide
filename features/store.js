import { configureStore } from "@reduxjs/toolkit";
import citiesReducer from "./citiesSlice";
import attractionsReducer from "./attractionsSlice";
import categoriesReducer from "./categoriesSlice";

const store = configureStore({
    reducer: {
        cities: citiesReducer,
        attractions: attractionsReducer,
        categories: categoriesReducer,
    },
});

export default store;