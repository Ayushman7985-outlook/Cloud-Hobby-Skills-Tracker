import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);

        setMessage("Account created successfully. You are now logged in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);

        setMessage("Login successful.");
      }
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else {
        setError(error.message);
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Hobby & Skills Tracker</h1>

        <h2>{isRegistering ? "Create Account" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />

          <button type="submit">
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}

        {error && <p className="error-message">{error}</p>}

        <p>
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            className="switch-button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMessage("");
              setError("");
            }}
          >
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}