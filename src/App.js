import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Home } from "./components/Home";
import { Clients } from "./components/Clients";
import { Client } from "./components/Client";
import { Bills } from "./components/Bills";
import { Login } from "./components/Login";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Notification } from "./components/Notification";
import { PDFViewer } from "./components/PDFViewer";
import { NewBill } from "./components/NewBill";
import {
  AdminPanel,
  FileExtensions,
  Users,
  ChangeSelfPassword,
  CreateUser,
  ResetPassword,
  Roles,
  General,
  MaxFileSize,
} from "./components/AdminPanel";
import { PageNotFound } from "./components/Messages";

const RESTAPI = process.env.REACT_APP_RESTAPI;

const Redirector = (props) => {
  const pages = {
    default: <></>,
    target: props.target,
    login: <Navigate to="/login" />,
  };
  const [page, setPage] = useState("default");
  const request = async () => {
    const res = await (
      await fetch(`${RESTAPI}/auth/log`, {
        credentials: "include",
      })
    ).json();
    if (res.status === 0) {
      try {
        props.target.props.role.setter(res.response.role);
        props.target.props.user.setter(res.response.user);
        props.target.props.username.setter(res.response.username);
      } catch {}

      setPage("target");
    } else {
      setPage("login");
    }
  };
  useEffect(() => {
    request();
  }, []);
  return <div>{pages[page]}</div>;
};

function App() {
  const popupDialog = (
    message = "",
    acceptHandler = null,
    cancelHandler = null
  ) => {
    setDialogMessage(message);
    setDialogHandlers({
      accept: acceptHandler,
      cancel: cancelHandler,
    });
    setDialogDisplay("block");
  };

  const pushNotification = (message = "", type = "default") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setNotificationDisplay("flex");
  };

  const handle_logout = async () => {
    const logout = async () => {
      const res = await (
        await fetch(`${RESTAPI}/auth/log`, {
          method: "DELETE",
          credentials: "include",
        })
      ).json();
      if (res.status === 0) {
        setLoginComponentManager("login");
        window.location.reload();
      }
    };
    popupDialog("¿Seguro que quiere cerrar sesión?", logout);
  };

  const handle_login = () => {
    setLoginComponentManager("home");
  };

  const [dialogDisplay, setDialogDisplay] = useState("none");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogHandlers, setDialogHandlers] = useState({
    accept: null,
    cancel: null,
  });

  const [notificationMessage, setNotificationMessage] =
    useState("Notificación");
  const [notificationDisplay, setNotificationDisplay] = useState("none");
  const [notificationType, setNotificationType] = useState("default");

  const login_component = {
    login: (
      <Login
        notification={pushNotification}
        dialog={popupDialog}
        handle_login={handle_login}
      />
    ),
    home: <Navigate to="/" />,
  };

  const [loginComponentManager, setLoginComponentManager] = useState("login");

  const [role, setRole] = useState(false);
  const [user, setUser] = useState();
  const [username, setUsername] = useState();

  const commonProps = {
    notification: pushNotification,
    dialog: popupDialog,
    hashsalt: "$2a$10$azQKaZl0cgxsYrPZewNJmu",
    role: {
      var: role,
      setter: setRole,
    },
    user: {
      state: user,
      setter: setUser,
    },
    username: {
      state: username,
      setter: setUsername,
    },
  };

  return (
    <>
      <Navbar logout={handle_logout} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Redirector
                target={<Home logout={handle_logout} {...commonProps} />}
              />
            }
          />
          <Route
            path="/clients"
            element={<Redirector target={<Clients {...commonProps} />} />}
          />
          <Route
            path="/client/:uid"
            element={<Redirector target={<Client {...commonProps} />} />}
          />
          <Route
            path="/bills"
            element={<Redirector target={<Bills {...commonProps} />} />}
          />
          <Route
            path="/newbill"
            element={<Redirector target={<NewBill {...commonProps} />} />}
          />
          <Route
            path="/admin"
            element={<Redirector target={<AdminPanel {...commonProps} />} />}
          >
            <Route path="general" element={<General {...commonProps} />} />
            <Route
              path="changepassword"
              element={<ChangeSelfPassword {...commonProps} />}
            />
            <Route
              path="fileextensions"
              element={<FileExtensions {...commonProps} />}
            />
            <Route path="filesize" element={<MaxFileSize {...commonProps} />} />
            <Route path="users" element={<Users {...commonProps} />} />
            <Route
              path="createuser"
              element={<CreateUser {...commonProps} />}
            />
            <Route
              path="resetuserpassword"
              element={<ResetPassword {...commonProps} />}
            />
            <Route path="roles" element={<Roles {...commonProps} />} />
          </Route>

          <Route
            path="/login"
            element={login_component[loginComponentManager]}
          />
          <Route
            path="/bill/:filename"
            element={<Redirector target={<PDFViewer />} />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <ConfirmDialog
          display={{ var: dialogDisplay, set: setDialogDisplay }}
          message={dialogMessage}
          handlers={dialogHandlers}
        />
        <Notification
          display={{ var: notificationDisplay, set: setNotificationDisplay }}
          type={notificationType}
          message={notificationMessage}
        />
      </BrowserRouter>
    </>
  );
}

export default App;
