import { useState } from "react";
import { login, getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);

      console.log("LOGIN RESULT:", result);

      if (!result.data?.access_token) {
        alert("Invalid email or password.");
        return;
      }

      localStorage.setItem(
        "access_token",
        result.data.access_token
      );

      const userResult = await getCurrentUser();

      console.log("USER:", userResult);

      const role = userResult.data.role.name;
      const userEmail = userResult.data.email;
      const userId = userResult.data.id;

      console.log("ROLE:", role);

      localStorage.setItem("user_role", role);
      localStorage.setItem("user_email", userEmail);
      localStorage.setItem("user_id", userId);

      if (role === "Manager") {
        navigate("/dashboard");
      } else if (role === "Employee") {
        navigate("/employee");
      } else if (role === "Administrator") {
        navigate("/admin");
      } else {
        alert("Unknown user role.");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Login failed.");
    }
  };

  return (
  <div className="login-page">

    <div className="login-card">

      <div className="login-logo">
        FC
      </div>

      <h1>Financial Control System</h1>

      <p className="login-subtitle">
        Project Financial Management
      </p>

      <div className="login-welcome">
        <h2>Welcome Back</h2>

        <p>
          Sign in to access your account
        </p>
      </div>

      <form onSubmit={handleLogin}>

        <div className="form-group">

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            required
          />

        </div>


        <div className="form-group">

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
            required
          />

        </div>


        <button
          type="submit"
          className="login-button"
        >
          Sign In
        </button>

      </form>

      <p className="login-footer">
        Financial Control System © 2026
      </p>

    </div>

  </div>
);
}

export default Login;