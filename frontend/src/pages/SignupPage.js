import Signup from "../components/Signup";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage({ setEmail }) {
  const navigate = useNavigate();

  const onSignup = (email) => {
    setEmail(email);
    navigate("/todo");
  };

  return (
    <div className="container">
      <Signup onSignup={onSignup} />
      <p>
        Already have an account?  
        <Link to="/login"> Login</Link>
      </p>
    </div>
  );
}
