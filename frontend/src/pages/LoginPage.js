import Login from "../components/Login";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage({ setEmail }) {
  const navigate = useNavigate();

  const onLogin = (email) => {
    setEmail(email);
    navigate("/todo");
  };

  return (
    <div className="container">
      <Login onLogin={onLogin} />
      <p>
        Don’t have an account?  
        <Link to="/"> Signup</Link>
      </p>
    </div>
  );
}
