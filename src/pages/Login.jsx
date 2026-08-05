import { useState } from "react";
 import { login } from "../services/authService";
 import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const navigate = useNavigate();
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const result = await login(email, password);

    localStorage.setItem(
      "access_token",
      result.data.access_token
    );

   navigate("/dashboard");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div>
      <h1>Financial Control System</h1>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;