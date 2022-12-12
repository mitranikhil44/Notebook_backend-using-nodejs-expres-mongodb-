const express = require("express");
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// ROUTE 1: Get all the notes using: GET "/api/note/user". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    // Show Other errors
    console.error(error.message);
    res.status(500).send("Iternal server error");
  }
});

// ROUTE 2: Add a new notes using: POST "/api/note/add_note". Login required
router.post(
  "/add_note",
  fetchuser,
  [
    body("title", "Title must be at lest 3 charecters").isLength({ min: 3 }),
    body("description", "Description must be atleast 10 charecters").isLength({
      min: 10,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      // Show Other errors
      console.error(error.message);
      res.status(500).send("Iternal server error");
    }
  }
);

// ROUTE 3: Update an existiong notes: PUt "/api/notes/update_note". Login required
router.put("/update_note/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Create a new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    // Show Other errors
    console.error(error.message);
    res.status(500).send("Iternal server error");
  }
});

// ROUTE 4: Delete an existiong notes: POST "/api/notes/update_note". Login required
router.delete("/delete_note/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // Alow deletion only if user owns this note
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Your note has been deleted" });
  } catch (error) {
    // Show Other errors
    console.error(error.message);
    res.status(500).send("Iternal server error");
  }
});

module.exports = router;
