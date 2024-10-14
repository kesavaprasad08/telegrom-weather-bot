import React from "react";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { useNavigate } from "react-router-dom";

function Dashboard(props) {
    const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
      props.onLogin();
      navigate('/users'); 
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        backgroundImage: 'url("/images/background.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <header className="text-center mb-4">
        <h1
          className=""
          style={{ fontSize: "2.5rem", fontWeight: "bold" }}
        >
          Weather Bot Admin Panel
        </h1>
      </header>
      <div className="text-center">
        <button
          className="btn btn-primary btn-lg"
          style={{ padding: "10px 20px", fontSize: "1.25rem" }}
          onClick={handleLogin}
        >
          Login with Google
          <i class="bi bi-google bg-white"></i>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
