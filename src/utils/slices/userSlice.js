import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
    user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined,
    contacts: undefined
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setContacts: (state, action) => {
            state.contacts = action.payload;
        },
    },
});

export const selectUser = (state) => state.user.user
export const selectContacts = (state) => state.user.contacts

export const { setUser, setContacts } = userSlice.actions;

export default userSlice.reducer;
