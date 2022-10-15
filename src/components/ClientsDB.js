import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faExpand,
  faSquareCheck as selectIcon,
} from "@fortawesome/free-solid-svg-icons";

const RESTAPI = process.env.REACT_APP_RESTAPI;

export const ClientsDB = forwardRef((props, ref) => {
  const [clients, setClients] = useState([]);

  const handleDelete = (_id) => {
    props.dialog("¿Seguro que desea eliminar este cliente?", () => {
      handleAcceptDelete(_id);
    });
  };

  const handleAcceptDelete = async (_id) => {
    await sendDeleteRequest(_id);
    getClients();
  };

  const sendDeleteRequest = async (_id) => {
    const res = await (
      await fetch(`${RESTAPI}/client/${_id}`, {
        method: "DELETE",
        credentials: "include",
      })
    ).json();
    if (res.status === 0) {
      props.notification("Cliente eliminado corractamente.", "success");
    }
  };

  const getClients = async () => {
    const res = await (
      await fetch(`${RESTAPI}/clients`, {
        credentials: "include",
      })
    ).json();
    if (res.status === 0) {
      setClients(res.response);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (inpSearch !== "") {
        const res = await (
          await fetch(`${RESTAPI}/clients/${inpSearch}`, {
            credentials: "include",
          })
        ).json();
        setClients(res.response);
      } else {
        getClients();
      }
    }
  };

  const handleSelect = (client) => {
    props.selectedClient(client);
    if (typeof props.handleSelect === "function") {
      props.handleSelect();
    }
  };

  const selectableTr = (client) => {
    return (
      <tr key={client["_id"]}>
        <td>{client["id"]}</td>
        <td>{client["name"]}</td>
        <td className="tableButtons">
          <div>
            <a href={`/client/${client["_id"]}`}>
              <button className="tooltip">
                <span className="tooltiptext">Ver</span>
                <FontAwesomeIcon icon={faExpand} />
              </button>
            </a>
            <button
              className="tooltip"
              onClick={() => {
                handleSelect(client);
              }}
            >
              <span className="tooltiptext">Seleccionar</span>
              <FontAwesomeIcon icon={selectIcon} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const nonSelectableTr = (client) => {
    return (
      <tr key={client["_id"]}>
        <td>{client["id"]}</td>
        <td>{client["name"]}</td>
        <td className="tableButtons">
          <div>
            <a href={`/client/${client["_id"]}`}>
              <button className="outline tooltip">
                <span className="tooltiptext">Ver</span>
                <FontAwesomeIcon icon={faExpand} />
              </button>
            </a>
            <button
              className="outline tooltip"
              onClick={() => handleDelete(client["_id"])}
            >
              <span className="tooltiptext">Eliminar</span>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const [inpSearch, setInpSearch] = useState("");

  useEffect(() => {
    getClients();
  }, []);

  useImperativeHandle(ref, () => ({
    update: () => {
      getClients();
    },
  }));

  return (
    <div className="container">
      <div className="table-header">
        <h1>Base de datos</h1>
        <input
          value={inpSearch}
          onChange={(e) => {
            setInpSearch(e.target.value);
          }}
          className="search"
          typeof="text"
          placeholder="Buscar..."
          onKeyDown={handleKeyDown}
        ></input>
      </div>
      <div className="table">
        {clients.length === 0 ? (
          <div className="loadercontainer">
            <span className="loader"></span>
          </div>
        ) : null}
        <table className="clients">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {typeof props.selectedClient === "function"
              ? clients.map((client) => selectableTr(client))
              : clients.map((client) => nonSelectableTr(client))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
