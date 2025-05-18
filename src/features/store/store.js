import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./citySlice";
import citiesReducer from "./citiesSlice";
import attractionsReducer from "./attractionsSlice";
import categoriesReducer from "./categoriesSlice";
import mapReducer from "./mapSlice";

const store = configureStore({
    reducer: {
        city: cityReducer,
        cities: citiesReducer,
        attractions: attractionsReducer,
        categories: categoriesReducer,
        map: mapReducer,
    },
});

export default store;