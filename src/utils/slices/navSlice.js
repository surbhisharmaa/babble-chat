import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    drawerOpen: false
};

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        toggelDrawerOpen: (state) => {
            state.drawerOpen = !state.drawerOpen
        },
    },
});

export const selectDrawerOpen = (state) => state.nav.drawerOpen

export const { toggelDrawerOpen } = navSlice.actions;

export default navSlice.reducer;
