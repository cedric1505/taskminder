require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve frontend files

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// --- MODELS ---
const User = require('./models/User');
const Task = require('./models/Task');

// --- MIDDLEWARE ---
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

// --- ROUTES ---

// 1. Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) { res.status(500).send('Server error'); }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) { res.status(500).send('Server error'); }
});

// 3. Get Tasks (Protected)
app.get('/api/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(tasks);
    } catch (err) { res.status(500).send('Server Error'); }
});

// 4. Add Task (Protected)
app.post('/api/tasks', auth, async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            priority: req.body.priority,
            userId: req.user.id
        });
        const task = await newTask.save();
        res.json(task);
    } catch (err) { res.status(500).send('Server Error'); }
});

// 5. Delete Task (Protected)
app.delete('/api/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        // Ensure user owns task
        if (task.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await task.deleteOne();
        res.json({ msg: 'Task removed' });
    } catch (err) { res.status(500).send('Server Error'); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));