const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Task', TaskSchema);