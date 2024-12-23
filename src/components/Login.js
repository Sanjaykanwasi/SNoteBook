import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  // Use State
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  let navigate = useNavigate();
  // Submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    // API
    const response = await fetch(`http://localhost:5000/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // Redirect to home
      localStorage.setItem("token", json.authToken);
      props.showAlert("Logged In Successfully", "success");
      navigate("/");
    } else {
      props.showAlert("Invalid Credentials", "danger");
    }
  };

  //   Onchange Method
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginpage">
      <div>
        <h2>Login to continue to SNoteBook</h2>
        <form onSubmit={handleSubmit} className="conatiner my-5">
          <div className="mb-3">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={credentials.email}
              onChange={onChange}
              name="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              onChange={onChange}
              id="password"
              value={credentials.password}
              name="password"
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
