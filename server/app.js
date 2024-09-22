const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const socket = require('socket.io')
const messagesRoutes = require('./routes/messagesRoutes')

const app = express()
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: __dirname + '/.env' });
}

app.use(cors())
app.use(express.json())
app.use("/api/auth", userRoutes)
app.use("/api/messages", messagesRoutes)

mongoose.connect(process.env.MONGO_URL, {
    useNewURLParser: true,
    // useUnifiedTropology: true,
    // useCreateIndex: true
}).then(() => {
    console.log('[Server]::DB CONNECTED')
}).catch((err) => {
    throw new Error(`[Server]::ERROR:${err.message}`);
})

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log("[Server]::LISTEN:%s", PORT);
})

app.on("error", error => {
    throw new Error(`[Server]::ERROR:${error.message}`);
});

const io = socket(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
    }
})

const onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-message", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("message-recieve", data.messages)
        }
    })

    socket.on('disconnect', () => {
        // console.log(`${socket.id} disconnected`);
        onlineUsers.delete(socket.id) // delete socket from Map object
    })
})
