import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  //create a logout button and program it to remove the localstorage token and navigate to register/login page
  useEffect(() => {
    // get the token if present
    const token = localStorage.getItem("token");

    if (!token) {
      //if no token - user has to login
      navigate("/login");
    } else {
      //if the token is there in localStorage - set the header
      const decoded = jwtDecode(token);
      console.log(decoded);
      setUsername(decoded.username);
      console.log(username);
    }
  }, []);
  return (
    <div className="container dashboard">
      <h1>Welcome!! {username}</h1>
    </div>
  );
};

export default Dashboard;
