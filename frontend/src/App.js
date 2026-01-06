import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Todo from "./components/Todo";
import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupPage setEmail={setEmail} />} />
        <Route path="/login" element={<LoginPage setEmail={setEmail} />} />
        <Route path="/todo" element={<Todo email={email} setEmail={setEmail} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

