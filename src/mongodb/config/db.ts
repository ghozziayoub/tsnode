import mongoose from "mongoose";

export default mongoose.connect('mongodb://localhost:27017/test-todo', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}, () => {
    console.log('connected to database')
})