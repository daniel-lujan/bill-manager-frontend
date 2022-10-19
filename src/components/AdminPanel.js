import React, { useState, useEffect } from "react";
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
  faFileCircleCheck,
  faXmarkCircle,
  faFileArrowUp,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck as faSquareUncheck } from "@fortawesome/free-regular-svg-icons";
import { MenuOption } from "./MenuOption";
import { UserSelector } from "./UserSelector";
import { SideNav } from "./SideNav";
import { Error, Warning } from "./Messages";
import { Helmet } from "react-helmet";

const RESTAPI = process.env.REACT_APP_RESTAPI;
const HASHSALT = decodeURIComponent(process.env.REACT_APP_HASHSALT);

const FILE_EXTENSIONS = [
  ".csv",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".pdf",
  ".png",
  ".ppt",
  ".pptx",
  ".txt",
  ".xls",
];

const MAX_SIZE = 16; //MB

export const MaxFileSize = (props) => {
  const getMaxSize = async () => {
    const res = await (
      await fetch(`${RESTAPI}/settings`, {
        credentials: "include",
      })
    ).json();
    if (res.status === 0) {
      setSize(res.response["MAX_FILE_SIZE"] / 1000000);
    } else {
      props.notification(
        "Ocurrió un error al recuperar las configuraciones.",
        "error"
      );
    }
  };

  const handleSaveChanges = async () => {
    const saveChanges = async () => {
      const res = await (
        await fetch(`${RESTAPI}/settings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            MAX_FILE_SIZE: parseInt(value*1000000),
          }),
        })
      ).json();

      if (res.status === 0) {
        props.notification(
          "Configuraciones actualizadas correctamente.",
          "success"
        );
        setUpdated(false);
      } else {
        props.notification(
          "Ocurrió un error al actualizar las configuraciones.",
          "error"
        );
      }
    };

    let value;

    try {
      value = parseFloat(size);
    } catch {
      props.notification("Valor inválido.", "error");
      return;
    }

    if (value <= 0 || value > MAX_SIZE) {
      props.notification("Valor inválido.", "error");
      return;
    }

    props.dialog(
      "¿Seguro que desea actualizar las configuraciones de la aplicación?",
      saveChanges
    );
  };

  const [size, setSize] = useState("");

  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    getMaxSize();
  }, []);

  return (
    <div className="sectioncontent">
      <h1 className="page-title">Peso Máximo Permitido</h1>
      <div style={{ maxWidth: "500px" }}>
        <p>Peso máximo para los archivos de las facturas.</p>
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <input
            type="number"
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
              if (!updated) {
                setUpdated(true);
              }
            }}
            min={0}
            max={16}
            style={{ width: "60px" }}
          />
          <p
            style={{
              marginTop: 0,
              marginBottom: 0,
              marginLeft: "16px",
              lineHeight: "200%",
              fontWeight: "700",
            }}
          >
            Mega Bytes
          </p>
        </div>
        <hr />
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            width: "100%",
            gap: "20px",
          }}
        >
          {parseFloat(size) <= 0 || parseFloat(size) > MAX_SIZE ? (
            <Error
              message={`Valor inválido. Ingresa un valor mayor que 0 y máximo ${MAX_SIZE}.`}
            />
          ) : null}

          <button disabled={!updated} onClick={handleSaveChanges}>
            Guardar Cambios
          </button>
          <a href="/admin/general">
            <button className="outline" style={{ width: "100%" }}>
              Volver a General
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

const ItemBox = (props) => {
  const handleDelete = async () => {
    props.onDelete(props.value);
  };

  return (
    <div className="itembox">
      <p>{props.value}</p>
      <FontAwesomeIcon icon={faXmarkCircle} onClick={handleDelete} />
    </div>
  );
};

export const FileExtensions = (props) => {
  const getExtensions = async () => {
    const res = await (
      await fetch(`${RESTAPI}/settings`, {
        credentials: "include",
      })
    ).json();
    if (res.status === 0) {
      setExts(res.response["ALLOWED_FILE_EXTENSIONS"]);
    } else {
      props.notification(
        "Ocurrió un error al recuperar las configuraciones.",
        "error"
      );
    }
    setAfterReq(true);
  };

  const deleteItem = (value) => {
    const exts_copy = [...exts];
    exts_copy.splice(exts_copy.indexOf(value), 1);
    setExts(exts_copy);
    if (!updated) {
      setUpdated(true);
    }
  };

  const addItem = () => {
    if (exts.indexOf(selectedExt) == -1 && selectedExt !== "") {
      setExts(exts.concat(selectedExt));
      if (!updated) {
        setUpdated(true);
      }
    }
  };

  const handleSaveChanges = async () => {
    const saveChanges = async () => {
      const res = await (
        await fetch(`${RESTAPI}/settings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ALLOWED_FILE_EXTENSIONS: exts,
          }),
          credentials: "include",
        })
      ).json();

      if (res.status === 0) {
        props.notification(
          "Configuraciones actualizadas correctamente.",
          "success"
        );
        setUpdated(false);
      } else {
        props.notification(
          "Ocurrió un error al actualizar las configuraciones.",
          "error"
        );
      }
    };

    props.dialog(
      "¿Seguro que quiere actualizar las configuraciones?",
      saveChanges
    );
  };

  useEffect(() => {
    getExtensions();
  }, []);

  const [exts, setExts] = useState([]);

  const [selectedExt, setSelectedExt] = useState("");

  const [updated, setUpdated] = useState(false);

  const [afterReq, setAfterReq] = useState(false);

  return (
    <div className="sectioncontent">
      <h1 className="page-title">Formatos Permitidos</h1>
      <div style={{ maxWidth: "500px" }}>
        <p>Extensiones de archivo permitidas para las facturas.</p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          {exts.map((e) => (
            <ItemBox key={e} value={e} onDelete={deleteItem} />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "12px",
            marginBottom: "12px",
            gap: "20px",
          }}
        >
          <p style={{ marginTop: 0, marginBottom: 0, lineHeight: "200%" }}>
            Añadir formato:
          </p>
          <select
            value={selectedExt}
            onChange={(e) => {
              setSelectedExt(e.target.value);
            }}
          >
            <option key={"null"} value={null}></option>
            {FILE_EXTENSIONS.map((e, i) =>
              exts.indexOf(e) == -1 ? (
                <option key={i} value={e}>
                  {e}
                </option>
              ) : null
            )}
          </select>
          <button onClick={addItem}>Añadir</button>
        </div>
        <hr></hr>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexFlow: "column",
            gap: "16px",
          }}
        >
          {exts.length === 0 && afterReq ? (
            <Warning message="No se permitirá la subida de archivos." />
          ) : null}
          <button disabled={!updated} onClick={handleSaveChanges}>
            Guardar cambios
          </button>
          <a href="/admin/general">
            <button style={{ width: "100%" }} className="outline">
              Volver a General
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

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
        <a href="/admin/general">
          <button style={{ width: "100%" }} className="outline">
            Volver a General
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
            Volver a Usuarios
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
            Volver a Usuarios
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
            Volver a Usuarios
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
        <a href="fileextensions">
          <MenuOption icon={faFileCircleCheck} text="Formatos permitidos" />
        </a>
        <a href="filesize">
          <MenuOption icon={faFileArrowUp} text="Peso máximo permitido" />
        </a>
      </div>
    </>
  );
};

export const AdminPanel = (props) => {
  return props.role.var === "admin" ? (
    <>
    <Helmet>
      <title>Panel de Administrador</title>
      <link id="favicon" rel="icon" type="image/png" href="../admin.ico"/>
    </Helmet>
      <SideNav
        elements={[
          { href: "/admin/general", icon: faGear, text: "General" },
          { href: "/admin/users", icon: faUsers, text: "Usuarios" },
        ]}
      />
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
