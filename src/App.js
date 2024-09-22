import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetAvatar from "./pages/SetAvatar";
import { Provider } from 'react-redux';
import { store } from "./utils/Store";

function App() {
  return (
    <div className="">
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/set-avatar" element={<SetAvatar />} />
            <Route path="/" element={<Chat />} />
          </Routes>
        </Provider>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
