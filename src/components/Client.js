import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ServerError } from "./Messages";

const RESTAPI = process.env.REACT_APP_RESTAPI;

export const Client = (props) => {
  const getClient = async () => {
    const res = await (
      await fetch(`${RESTAPI}/client/${uid}`, {
        credentials: "include",
      })
    ).json();
    if (res.status === 0) {
      setId(res.response.id);
      setName(res.response.name);
      setPhone(res.response.phone);
      setEmail(res.response.email);
      setAddress(res.response.address);
    } else {
      props.notification("No se encontró el cliente.", "error");
    }
    setLoading(false);
  };

  const saveChanges = async () => {
    props.dialog("¿Seguro que quiere actualizar los datos?", async () => {
      const res = await (
        await fetch(`${RESTAPI}/updateclient/${uid}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone,
            email: email,
            address: address,
          }),
          credentials: "include",
        })
      ).json();
      if (res.status === 0) {
        props.notification(
          "Se actualizaron los datos correctamente.",
          "success"
        );
      } else {
        props.notification(
          "Ocurrió un error al actualizar los datos.",
          "error"
        );
      }
    });
  };

  const enableSaveButton = () => {
    if (saveButtonState === true) {
      setSaveButtonState(false);
    }
  };

  let { uid } = useParams();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [saveButtonState, setSaveButtonState] = useState(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClient();
  }, []);

  return (
    <div className="pagecontent">
      {loading ? (
        <div className="loadercontainer">
          <span className="loader"></span>
        </div>
      ) : null}
      <h1 className="page-title">Contacto Cliente</h1>
      <div
        className="container clientcontact"
        style={loading ? { opacity: "20%" } : null}
      >
        <p className="contactfield">Cédula:</p>
        <input className="contactinfo" value={id} disabled />
        <p className="contactfield">Nombre:</p>
        <input className="contactinfo" value={name} disabled />
        <p className="contactfield">Teléfono:</p>
        <input
          className="contactinfo"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            enableSaveButton();
          }}
        />
        <p className="contactfield">Correo:</p>
        <input
          className="contactinfo"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            enableSaveButton();
          }}
        />
        <p className="contactfield">Dirección:</p>
        <input
          className="contactinfo"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            enableSaveButton();
          }}
        />
        <button disabled={saveButtonState} onClick={saveChanges}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
};
