import { createSlice } from '@reduxjs/toolkit';


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: true
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        setFavorites: (state, action) => {
            state.user.favorites = action.payload;
        },
        setUsername: (state, action) => {
            state.user.firstname = action.payload.firstname;
            state.user.lastname = action.payload.lastname;
        }
    }
});

export const {
    setLoading,
    setUser,
    clearUser,
    setFavorites,
    setUsername,
} = userSlice.actions;

export default userSlice.reducer;