import "./UserList.css";

const UserList = ({ users, updateUser, deleteUser }) => {
  return (
    <div className="user-list">
      <h2>Users</h2>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span>
              {user.name} - {user.email}
            </span>

            <button onClick={() => updateUser(user)}>Edit</button>

            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
