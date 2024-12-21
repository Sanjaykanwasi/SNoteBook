import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  //   To Get all Note
  const getNotes = async () => {
    // API
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc1Njc4ZjJkMWQwMzdlMWVmNTQ1YTNjIn0sImlhdCI6MTczMzcyODY5Mn0.dBHXAZnkyA2G6zOIUrUUgUXFbor3ndEb9K9ORwRamUw",
      },
    });
    const json = await response.json();
    // console.log(json);
    setNotes(json);
  };

  //   To Add a New Note
  const addNote = async (title, description, tag) => {
    // API
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc1Njc4ZjJkMWQwMzdlMWVmNTQ1YTNjIn0sImlhdCI6MTczMzcyODY5Mn0.dBHXAZnkyA2G6zOIUrUUgUXFbor3ndEb9K9ORwRamUw",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();
    setNotes(notes.concat(note));
  };
  //   To Delete a Note
  const deleteNote = async (id) => {
    // API
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DElETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc1Njc4ZjJkMWQwMzdlMWVmNTQ1YTNjIn0sImlhdCI6MTczMzcyODY5Mn0.dBHXAZnkyA2G6zOIUrUUgUXFbor3ndEb9K9ORwRamUw",
      },
    });
    const json = response.json();
    // console.log(json);
    // console.log("Delete the note " + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  //   To Edit a Note
  const editNote = async (id, title, description, tag) => {
    // API
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc1Njc4ZjJkMWQwMzdlMWVmNTQ1YTNjIn0sImlhdCI6MTczMzcyODY5Mn0.dBHXAZnkyA2G6zOIUrUUgUXFbor3ndEb9K9ORwRamUw",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    // console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));
    // Logic to edit
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
