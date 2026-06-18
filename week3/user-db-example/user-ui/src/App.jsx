import { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./Components/AddUser/AddUser";
import UserList from "./Components/UserList/UserList";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    setUsers(response.data);
  };

  const addUser = async (name, email) => {
    await axios.post(`${API_URL}/users`, {
      name,
      email,
    });

    getUsers();
  };

  const updateUser = async (user) => {
    const name = window.prompt("Enter updated name", user.name);
    const email = window.prompt("Enter updated email", user.email);

    if (!name?.trim() || !email?.trim()) return;

    await axios.put(`${API_URL}/users/${user.id}`, {
      name,
      email,
    });

    getUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/users/${id}`);

    getUsers();
  };

  useEffect(() => {
    const loadUsers = async () => {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    };

    loadUsers();
  }, []);

  return (
    <div className="app">
      <h1>Student User Directory</h1>

      <AddUser addUser={addUser} />

      <UserList users={users} updateUser={updateUser} deleteUser={deleteUser} />
    </div>
  );
};

export default App;
