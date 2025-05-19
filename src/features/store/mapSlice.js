import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
    name: 'map',
    initialState: {
        latitude: null,
        longitude: null,
        isCity: false,
        attraction: null,
        shouldAnimate: false
    },
    reducers: {
        setMapCoordinates: (state, action) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.isCity = action.payload.isCity ?? false;
            state.attraction = action.payload.attraction ?? null;
            state.shouldAnimate = true;
        },
        resetMapAnimateFlag: (state) => {
            state.shouldAnimate = false;
        }
    }
});

export const { setMapCoordinates, resetMapAnimateFlag } = mapSlice.actions;
export default mapSlice.reducer;