import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
    selectedChat: Cookies.get('activeChat') ? JSON.parse(Cookies.get('activeChat')) : undefined,
    messages: [],
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
    },
});

export const selectSelectedChat = (state) => state.chat.selectedChat
export const selectMessages = (state) => state.chat.messages

export const { setSelectedChat, setMessages, addMessage } = chatSlice.actions;

export default chatSlice.reducer;
