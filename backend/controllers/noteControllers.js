const asyncHandler = require('express-async-handler');
const Note = require('../models/noteModel');

const getNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({user: req.user._id});
    res.json(notes);
});

const createNote = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        res.status(400);
        throw new Error('Please fill in all fields');
    } else {
        const note = new Note({ user: req.user._id, title, content, category });
        const createdNote = await note.save();
        res.status(201).json(createdNote);
    }
});

const getNoteById = async (req, res) => {
    const { id } = req.params;
    try {
      const note = await Note.findById(id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      // Check if the user is authorized
      if (note.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized' });
      }
  
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

/*
const getNoteById = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ message: "Note not found" });
    }
});
*/

const updateNote = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;

    const note = await Note.findById(req.params.id);

    if(note.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('You cannot perform this action');
    } 
    if (note) {
        note.title = title;
        note.content = content;
        note.category = category;
        const updatedNote = await note.save();
        res.json(updatedNote);
    } else {
        res.status(404);
        throw new Error( "Note not found" );
    }
});

const deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (note.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('You cannot perform this action');
    }
    if (note) {
        await Note.findByIdAndDelete(req.params.id); 
        res.json({ message: "Note removed successfully" });
    } else {
        res.status(404);
        throw new Error("Note not found");
    }
});

module.exports = { getNotes, createNote, getNoteById, updateNote, deleteNote }; // exporting the functions to be used in other files.
