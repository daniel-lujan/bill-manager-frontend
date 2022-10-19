import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";

import { ClientsDB } from "./ClientsDB";

const RESTAPI = process.env.REACT_APP_RESTAPI;

export const Clients = (props) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    const res = await (
      await fetch(`${RESTAPI}/client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          name: name,
          phone: phone,
          email: email,
          address: address,
        }),
        credentials:"include"
      })
    ).json();

    if (res["status"] === 0) {
      setId("");
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      clientsTable.current.update()
      props.notification("Se añadió el cliente satisfactoriamente.", "success");
    }
  };

  const clientsTable = useRef()

  return (
    <div className="pagecontent">
      <Helmet>
        <title>Clientes</title>
        <link id="favicon" rel="icon" type="image/png" href="clients.ico" />
      </Helmet>
      <h1 className="page-title">Clientes</h1>
      <div className="clients">
        <div className="container">
          <h1>Nuevo cliente</h1>
          <div className="form">
            <input
              type="text"
              placeholder="Cédula*"
              onChange={(e) => setId(e.target.value)}
              value={id}
            ></input>
            <input
              type="text"
              placeholder="Nombre*"
              onChange={(e) => setName(e.target.value)}
              value={name}
            ></input>
            <input
              type="text"
              placeholder="Teléfono"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            ></input>
            <input
              type="text"
              placeholder="Correo Electrónico"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></input>
            <input
              type="text"
              placeholder="Dirección"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            ></input>
          </div>
          <button disabled={!id || !name} onClick={handleSubmit}>
            Agregar
          </button>
        </div>
        <ClientsDB
          {...props}
          ref={clientsTable}
        />
      </div>
    </div>
  );
};
