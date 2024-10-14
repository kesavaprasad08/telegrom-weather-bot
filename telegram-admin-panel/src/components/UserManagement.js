import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserManagement(props) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const logoutHandler = () => {
    props.onLogout();
    navigate("/");
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_ADMIN_URL);
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(()=>{
    if(!props.isLoggedIn){
        navigate("/")
    }
  },[])

  const userDeleteHandler = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_ADMIN_URL}/${id}/delete`
      );
      if (response.status === 200) {
        fetchUsers();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const userBlockHandler = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADMIN_URL}/block`,
        { telegramId: id }
      );
      console.log(response)
      if (response.status === 201) {
        fetchUsers();
      }
    } catch (e) {
        console.log(e)
    }
  };
  const userUnBlockHandler = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADMIN_URL}/unblock`,
        { telegramId: id }
      );
      console.log(response)
      if (response.status === 201) {
        fetchUsers();
      }
    } catch (e) {
        console.log(e)
    }
  };
  return (
    <div
      className="container-fluid d-flex flex-column min-vh-100 "
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        backgroundImage: 'url("/images/background.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mt-4 ">
        <h1 className="text-center">User Management</h1>
        <div>
          <button
            className="btn btn-primary mx-2"
            onClick={() => {
              navigate("/settings");
            }}
          >
            Bot Settings
          </button>
          <button onClick={logoutHandler} className="btn btn-primary">
            Logout
          </button>
        </div>
      </div>
      <div className="table-responsive mt-4 ">
        {users.length > 0 && (
          <table className="table table-bordered table-hover text-center rounded shadow">
            <thead className="thead-dark">
              <tr>
                <th scope="col" className="text-center">
                  Id
                </th>
                <th scope="col" className="text-center">
                  Username
                </th>
                <th scope="col" className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.chatId}>
                  <th scope="row" className="text-center">
                    {user.chatId}
                  </th>
                  <td className="text-center">{user.username}</td>
                  <td className="text-center">
                    <button
                      onClick={() => {
                        userDeleteHandler(user.chatId);
                      }}
                      className="btn btn-danger mx-2"
                    >
                      Delete
                    </button>
                    {user.isBlocked ? (
                      <button
                      onClick={() => {
                        userUnBlockHandler(user.chatId);
                      }}
                      className="btn btn-info"
                    >
                      UnBlock
                    </button>
                    ) : (
                      <button
                        onClick={() => {
                            userBlockHandler(user.chatId);
                        }}
                        className="btn btn-warning"
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {users.length === 0 && (
          <p className="text-center fs-1"> No Users found</p>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
