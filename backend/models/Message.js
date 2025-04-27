const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    // id mess of user
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    // role user
    role: {
        type: String,
        enum: ["user", "assistant", "admin"],
        required: true
    },
    // content
    content: {
        type: String,
        required: true
    },
    // bot used
    modelUsed: {
        type: String,
        default: null
    },

    isFromBot: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Message", MessageSchema);
