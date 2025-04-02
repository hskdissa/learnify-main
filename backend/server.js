const express = require('express');
const notes = require('./data/notes');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Root route
app.get('/', (req, res) => {
    res.send("API is running..");
});

// Get all notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// Get a single note by ID
app.get('/api/notes/:id', (req, res) => {
    const note = notes.find((n) => n._id === req.params.id);
    
    res.send(note);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
