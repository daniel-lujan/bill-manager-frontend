import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { hash } from "bcryptjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUsers,
  faUserTie,
  faUserPlus,
  faKey,
  faUnlockKeyhole,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck as faSquareUncheck } from "@fortawesome/free-regular-svg-icons";
import { MenuOption } from "./MenuOption";
import { UserSelector } from "./UserSelector";
import { SideNav } from "./SideNav";

const RESTAPI = process.env.REACT_APP_RESTAPI;
const HASHSALT = decodeURIComponent(process.env.REACT_APP_HASHSALT);

export const ChangeSelfPassword = (props) => {
  const handleChangePassword = () => {
    if (current === "") {
      props.notification("Ingrese la contraseña actual.", "error");
    } else if (newPass.length < 8) {
      props.notification(
        "Ingrese una contraseña de mínimo 8 carácteres.",
        "error"
      );
    } else if (newPass.length > 36) {
      props.notification(
        "Ingrese una contraseña de máximo 36 carácteres.",
        "error"
      );
    } else if (newPass !== newPassConf) {
      props.notification("Las contraseñas no coinciden.", "error");
    } else {
      props.dialog(
        "¿Seguro que desea reestrablecer la contraseña de este usuario?",
        async () => {
          const res = await (
            await fetch(`${RESTAPI}/admin/changepassword`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                current: await hash(current, HASHSALT),
                new: await hash(newPass, HASHSALT),
              }),
              credentials: "include",
            })
          ).json();

          if (res.status === 0) {
            props.notification("La contraseña fue cambiada correctamente.");
          } else if (res.status === 3) {
            props.notification("Contraseña incorrecta.");
          } else {
            props.notification("Ocurrió un error al cambiar la contraseña.");
          }
        }
      );
    }
  };

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassConf, setNewPassConf] = useState("");

  return (
    <div className="sectioncontent">
      <h1 className="page-title">Cambiar Contraseña</h1>
      <div className="form" style={{ width: "300px" }}>
        <input
          type="password"
          value={current}
          onChange={(e) => {
            setCurrent(e.target.value);
          }}
          placeholder="Contraseña actual"
        />
        <input
          type="password"
          value={newPass}
          onChange={(e) => {
            setNewPass(e.target.value);
          }}
          placeholder="Nueva contraseña"
        />
        <input
          type="password"
          value={newPassConf}
          onChange={(e) => {
            setNewPassConf(e.target.value);
          }}
          placeholder="Confirma la nueva contraseña"
        />
        <button onClick={handleChangePassword}>Cambiar</button>
        <hr />
        <a href="/admin/users">
          <button style={{ width: "100%" }} className="outline">
            Volver al menú
          </button>
        </a>
      </div>
    </div>
  );
};

export const CreateUser = (props) => {
  const handleCreate = async () => {
    if (passw !== passwC) {
      props.notification("Las contraseñas no coinciden.", "error");
      return;
    }
    const res = await (
      await fetch(`${RESTAPI}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user,
          password: await hash(passw, props.hashsalt),
          role: adminPer ? "admin" : "normal",
        }),
        credentials: "include",
      })
    ).json();
    if (res.status === 0) {
      props.notification("Se creó el usuario correctamente.", "success");
      setAdminPer(false);
      setCheckboxIcon("unchecked");
      setUser("");
      setPassw("");
      setPasswC("");
    } else {
      props.notification("Ocurrió un error al crear el usuario.", "error");
    }
  };

  const handleCheckboxClick = () => {
    if (adminPer) {
      setAdminPer(false);
    } else {
      setAdminPer(true);
    }
  };

  const handleCheckboxMouseEnter = () => {
    if (!adminPer) {
      setCheckboxIcon("checked");
    }
  };

  const handleCheckboxMouseLeave = () => {
    if (adminPer) {
      setCheckboxIcon("checked");
    } else {
      setCheckboxIcon("unchecked");
    }
  };

  const [user, setUser] = useState("");
  const [passw, setPassw] = useState("");
  const [passwC, setPasswC] = useState("");
  const [adminPer, setAdminPer] = useState(false);

  const [checkboxIcon, setCheckboxIcon] = useState("unchecked");

  const icons = {
    unchecked: faSquareUncheck,
    checked: faSquareCheck,
  };

  return (
    <div className="sectioncontent">
      <h1 className="page-title">Crear Usuario</h1>
      <div className="form" style={{ width: "300px" }}>
        <input
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
          placeholder="Usuario"
        />
        <input
          type="password"
          value={passw}
          onChange={(e) => {
            setPassw(e.target.value);
          }}
          placeholder="Contraseña"
        />
        <input
          type="password"
          value={passwC}
          onChange={(e) => {
            setPasswC(e.target.value);
          }}
          placeholder="Confirma la contraseña"
        />
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "14px", margin: 0 }}>
            Permisos de administrador
          </p>
          <FontAwesomeIcon
            style={{ marginRight: "12px", cursor: "pointer", color: "white" }}
            icon={icons[checkboxIcon]}
            onMouseEnter={handleCheckboxMouseEnter}
            onMouseLeave={handleCheckboxMouseLeave}
            onClick={handleCheckboxClick}
          />
        </div>
        <button onClick={handleCreate}>Crear</button>
        <hr />
        <a href="/admin/users">
          <button style={{ width: "100%" }} className="outline">
            Volver al menú
          </button>
        </a>
      </div>
    </div>
  );
};

export const ResetPassword = (props) => {
  const handleResetPassword = async () => {
    if (typeof user === "undefined") {
      props.notification("Seleccione un usuario", "error");
    } else if (newPassw.length < 8) {
      props.notification(
        "Ingrese una contraseña de mínimo 8 carácteres.",
        "error"
      );
    } else if (newPassw.length > 36) {
      props.notification(
        "Ingrese una contraseña de máximo 36 carácteres.",
        "error"
      );
    } else if (newPassw !== newPasswC) {
      props.notification("Las contraseñas no coinciden.", "error");
    } else {
      props.dialog(
        "¿Seguro que desea reestrablecer la contraseña de este usuario?",
        async () => {
          const res = await (
            await fetch(`${RESTAPI}/admin/resetpassword`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: user.username,
                password: await hash(newPassw, HASHSALT),
              }),
              credentials: "include",
            })
          ).json();
          if (res.status === 0) {
            props.notification(
              "Contraseña reestablecida exitosamente.",
              "success"
            );
          } else if (res.status === 2) {
            props.notification("No se encontró al usuario.", "error");
          } else {
            props.notification(
              "Ocurrió un error al reestablecer la contraseña.",
              "error"
            );
          }
        }
      );
    }
  };

  const [user, setUser] = useState();

  const [newPassw, setNewPassw] = useState("");
  const [newPasswC, setNewPasswC] = useState("");

  return (
    <div className="sectioncontent">
      <h1 className="page-title">Reestablecer contraseña</h1>
      <div className="form" style={{ width: "360px" }}>
        <UserSelector selectedUser={{ state: user, setter: setUser }} />
        <input
          value={newPassw}
          onChange={(e) => {
            setNewPassw(e.target.value);
          }}
          placeholder="Nueva Contraseña"
          type="password"
        />
        <input
          value={newPasswC}
          onChange={(e) => {
            setNewPasswC(e.target.value);
          }}
          placeholder="Confirma Nueva Contraseña"
          type="password"
        />
        <button onClick={handleResetPassword}>Reestablecer contraseña</button>
        <hr />
        <a href="/admin/users">
          <button style={{ width: "100%" }} className="outline">
            Volver al menú
          </button>
        </a>
      </div>
    </div>
  );
};

export const Roles = (props) => {
  const setAdminRole = async () => {
    props.dialog(
      "¿Seguro que desea editar los permisos de administración del usuario?",
      async () => {
        const res = await (
          await fetch(
            `${RESTAPI}/admin/${
              user.role == "admin" ? "removeadmin" : "addadmin"
            }/${user._id}`,
            {
              credentials: "include",
            }
          )
        ).json();
        if (res.status === 0) {
          props.notification("Permisos editados correctamente.", "success");
        } else {
          props.notification(
            "Ocurrió un error al editar los permisos.",
            "error"
          );
        }
      }
    );
  };

  const [user, setUser] = useState();

  return (
    <div className="sectioncontent">
      <h1 className="page-title">Permisos de administración</h1>
      <div className="form">
        <UserSelector
          selectedUser={{ state: user, setter: setUser }}
          currentUser={props.user.state}
        />
        {typeof user === "undefined" ? (
          <button disabled>Selecciona un usuario</button>
        ) : user.role === "admin" ? (
          <button className="danger" onClick={setAdminRole}>
            Quitar permisos
          </button>
        ) : (
          <button onClick={setAdminRole}>Dar Permisos</button>
        )}
        <hr />
        <a href="/admin/users">
          <button className="outline" style={{ width: "100%" }}>
            Volver al menú
          </button>
        </a>
      </div>
    </div>
  );
};

export const Users = () => {
  return (
    <>
      <div className="sectioncontent">
        <h1 className="page-title">Usuarios</h1>
        <a href="/admin/createuser">
          <MenuOption text="Crear usuario" icon={faUserPlus} />
        </a>
        <a href="/admin/resetuserpassword">
          <MenuOption
            text="Reestablecer la contraseña de un usuario"
            icon={faUnlockKeyhole}
          />
        </a>
        <a href="/admin/roles">
          <MenuOption text="Permisos de administrador" icon={faUserTie} />
        </a>
      </div>
    </>
  );
};

export const General = () => {
  return (
    <>
      <div className="sectioncontent">
        <h1 className="page-title">General</h1>
        <a href="changepassword">
          <MenuOption icon={faKey} text="Cambiar contraseña" />
        </a>
      </div>
    </>
  );
};

export const AdminPanel = (props) => {
  return props.role.var === "admin" ? (
    <>
      <SideNav elements={[
        {href:"/admin/general", icon: faGear, text: "General"},
        {href:"/admin/users", icon: faUsers, text: "Usuarios"}
      ]}/>
      <Outlet />
    </>
  ) : (
    <div className="messageblock centered">
      <h1 className="page-title">Error...</h1>
      <p style={{ color: "white" }}>
        Esta sección sólo está disponible para administradores.
      </p>
    </div>
  );
};
