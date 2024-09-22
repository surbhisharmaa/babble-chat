import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import userReducer from './slices/userSlice';
import navReducer from './slices/navSlice';
// ...

export const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
        nav: navReducer,
    },
});
