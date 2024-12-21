const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");
var fetchUser = require("../middleware/fetchUser");

// Route 1
// Get All the notes of the user : GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    // To catch if any error occured
    console.log(error.message);
    res.status(500).send("Some Internal Server Error Occured");
  }
});

// Route 2
// Add a new Note for user : POST "/api/notes/addnote". Login Required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a Valid title").isLength({
      min: 3,
    }),
    body(
      "description",
      "Enter a Valid description with atleast 5 character"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there is an Error it will give bad request
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
      // To catch if any error occured
      console.log(error.message);
      res.status(500).send("Some Internal Server Error Occured");
    }
  }
);

// Route 3
// Update an exisiting Note for user : PUT "/api/notes/updatenote". Login Required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // Create a new Note
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

    // Find the note that needs to be updated and then update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow only if user is the actual owner of this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Access Denied");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ note });
  } catch (error) {
    // To catch if any error occured
    console.log(error.message);
    res.status(500).send("Some Internal Server Error Occured");
  }
});

// Route 4
// Delete an exisiting Note for user : DELETE "/api/notes/deletenote". Login Required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    // Find the note that needs to be deleted and then delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow only if user is the actual owner of this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Access Denied");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Sucess: "Note Deleted", note: note });
  } catch (error) {
    // To catch if any error occured
    console.log(error.message);
    res.status(500).send("Some Internal Server Error Occured");
  }
});

module.exports = router;
