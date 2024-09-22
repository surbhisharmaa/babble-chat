const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    message: {
        text: {
            type: String,
            require: true,
            min: 1,
        },
    },
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("Messages", messageSchema)