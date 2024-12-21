import React, { useState, useContext } from "react";
import noteContext from "../context/notes/noteContext";

const Addnote = () => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });
  //   TO handle add Note function when we click submit
  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
  };
  //   Onchange Method
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  return (
    <div className="container my-5">
      <h1>ADD YOUR NOTE HERE</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            minLength={5}
            required
            value={note.title}
            onChange={onChange}
            className="form-control"
            id="title"
            name="title"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            minLength={5}
            required
            type="text"
            value={note.description}
            onChange={onChange}
            name="description"
            className="form-control"
            id="description"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            value={note.tag}
            onChange={onChange}
            name="tag"
            className="form-control"
            id="tag"
          />
        </div>
        <button
          disabled={note.title.length < 5 || note.description.length < 5}
          onClick={handleClick}
          type="submit"
          className="btn btn-primary"
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default Addnote;
