import "./Login.css";
import {useState} from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const Submit = async (e)=>{
        e.preventDefault();
        setError("");
    try{
       const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }
        
    localStorage.setItem("token", data.token);
    localStorage.setItem("user" , JSON.stringify(data.User));
    navigate("/home"); 
}catch (error) {
    setError(error.message);
}
}     
  return (
    <header className="Login">
        <div className="text">
            <h1>Login</h1>
        </div>
        <div className="login-form">
            <div className="login-input">
                <input type="email" placeholder="email" value={email} onChange = {(e)=>setEmail(e.target.value)} required/>
                <input type="password" placeholder="password" value={password} onChange = {(e)=>setPassword(e.target.value)} required/>
            </div>
            {error && <p className="login-error">{error}</p>}
            <div className="login-btn">
                <button onClick={Submit}>Login</button>
            </div>
        </div>
    </header>
  );
}

export default Login;