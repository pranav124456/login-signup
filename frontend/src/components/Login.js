import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const login = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: `HTTP ${res.status}: ${res.statusText}` }));
        alert(errorData.detail || "Login failed");
        return;
      }

      const data = await res.json();

      if (data.token) {
        // Store JWT in a cookie for 15 minutes
        document.cookie = `token=${data.token}; max-age=${15 * 60}; path=/`;
      }

      alert("Login successful");
      onLogin(email);
    } catch (error) {
      console.error("Login error:", error);
      alert(`Backend not reachable: ${error.message}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <>
      <h2>Login</h2>
      <input 
        placeholder="Email" 
        value={email}
        onChange={e => {
          setEmail(e.target.value);
          setEmailError("");
        }}
        onKeyDown={handleKeyDown}
      />
      {emailError && <div style={{color: "red", fontSize: "14px"}}>{emailError}</div>}
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={e => {
          setPassword(e.target.value);
          setPasswordError("");
        }}
        onKeyDown={handleKeyDown}
      />
      {passwordError && <div style={{color: "red", fontSize: "14px"}}>{passwordError}</div>}
      <button onClick={login}>Login</button>
    </>
  );
}
