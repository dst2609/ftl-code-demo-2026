import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API}/users/register`, form);
      console.log(data);
      navigate("/dashboard");
    } catch (err) {
      setError(`REgistration failed!! ${err.response?.data?.error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <h2> Create Account</h2>
      {error && <p className="error">{error}</p>}
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <label>Username</label>
      <input
        type="text"
        name="username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        minLength={8}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
