import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // Use State
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  let navigate = useNavigate();
  // Submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    // API
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // Redirect to home
      localStorage.setItem("token", json.authtoken);
      navigate("/");
    } else {
      alert("Invalid Credentials");
    }
  };

  //   Onchange Method
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="my-5">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="name"
            onChange={onChange}
            className="form-control"
            required
            id="name"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            onChange={onChange}
            required
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="passwprd" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={5}
            onChange={onChange}
            className="form-control"
            id="passwprd"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpasswprd" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            name="cpassword"
            required
            minLength={5}
            onChange={onChange}
            className="form-control"
            id="cpasswprd"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
