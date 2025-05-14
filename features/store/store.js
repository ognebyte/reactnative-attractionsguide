import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./citySlice";
import citiesReducer from "./citiesSlice";
import attractionsReducer from "./attractionsSlice";
import categoriesReducer from "./categoriesSlice";

const store = configureStore({
    reducer: {
        city: cityReducer,
        cities: citiesReducer,
        attractions: attractionsReducer,
        categories: categoriesReducer,
    },
});

export default store;