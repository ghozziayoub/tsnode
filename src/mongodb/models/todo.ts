import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        default: "non complétée",
        trim: true
    },
    comment: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        trim: true
    }
})

const Todo = mongoose.model('todo', todoSchema)

export { Todo }