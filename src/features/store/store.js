import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cityReducer from "./citySlice";
import citiesReducer from "./citiesSlice";
import attractionsReducer from "./attractionsSlice";
import categoriesReducer from "./categoriesSlice";
import mapReducer from "./mapSlice";
import attractionSlice from "./attractionSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        city: cityReducer,
        cities: citiesReducer,
        attractions: attractionsReducer,
        categories: categoriesReducer,
        map: mapReducer,
        attraction: attractionSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // отключаем проверку сериализуемости
        }),
});

export default store;