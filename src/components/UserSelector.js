import { faUserTie, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faCheckSquare as faUncheckedSquare } from "@fortawesome/free-regular-svg-icons";

const RESTAPI = process.env.REACT_APP_RESTAPI;

const User = (props) => {
  const handleSelect = () => {
    props.selectedUser.setter(user);
  };

  const user = props.user;

  const selectedId =
    typeof props.selectedUser.state !== "undefined"
      ? props.selectedUser.state._id
      : "";

  return (
    <tr
      style={
        selectedId === user._id ? { backgroundColor: "var(--color3)" } : {}
      }
    >
      <td onClick={handleSelect}>
        <FontAwesomeIcon
          className="medium"
          icon={selectedId === user._id ? faCheckSquare : faUncheckedSquare}
        />
      </td>
      <td>{user.username}</td>
      <td>
        {user.role === "admin" ? (
          <FontAwesomeIcon className="medium" icon={faUserTie} />
        ) : null}
      </td>
    </tr>
  );
};

export const UserSelector = (props) => {
  const getUsers = async () => {
    const res = await (await fetch(`${RESTAPI}/admin/users`,{
      credentials:"include"
    })).json();
    if (res.status === 0) {
      setUsers(res.response);
    }
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="table">
      <table className="clients">
        <thead>
          <tr>
            <th></th>
            <th>Usuario</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            user._id !== props.currentUser ? (
              <User
                key={user._id}
                selectedUser={props.selectedUser}
                user={user}
              />
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
};
