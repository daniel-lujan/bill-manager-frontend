import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faTrash,
  faUser,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

const RESTAPI = process.env.REACT_APP_RESTAPI;

export const Bills = (props) => {
  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      if (inpSearch.length > 0) {
        const res = await (
          await fetch(`${RESTAPI}/bills/${inpSearch}`, {
            credentials: "include",
          })
        ).json();
        if (res.status === 0) {
          setBills(applyFilters(res.response));
        }
      } else {
        getBills();
      }
    }
  };

  const handleDelete = async (id) => {
    props.dialog("¿Seguro que quiere eliminar esta factura?", async () => {
      const res = await (
        await fetch(`${RESTAPI}/bill/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
      ).json();
      if (res.status === 0) {
        props.notification("Factura eliminada correctamente.", "success");
        getBills();
      } else if (res.status === 2) {
        props.notification("No se encontró la factura.", "error");
      }
    });
  };

  const applyFilters = (collection) => {
    if (typeSelect !== "Todas") {
      const new_coll = [];
      collection.forEach((element) => {
        if (element.type === typeSelect) {
          new_coll.push(element);
        }
      });
      return new_coll.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      return collection.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  const getBills = async () => {
    const res = await (
      await fetch(`${RESTAPI}/bills`, {
        credentials: "include",
      })
    ).json();
    if (res.status === 0) {
      setBills(applyFilters(res.response));
    }
  };

  const [typeSelect, setTypeSelect] = useState("Todas");

  const [inpSearch, setInpSearch] = useState("");

  const [bills, setBills] = useState([]);

  const newBillButtonRef = useRef();

  useEffect(() => {
    getBills();
  }, []);

  useEffect(() => {
    getBills();
  }, [typeSelect]);

  return (
    <div className="pagecontent">
      <Helmet>
        <title>Facturas</title>
        <link rel="icon" type="image/png" href="bills.ico"/>
      </Helmet>
      <h1 className="page-title">Facturas</h1>
      <div className="bills">
        <div className="container billsdb">
          <div className="table-header">
            <div className="tablecontrol">
              <p>Mostrar: </p>
              <select
                value={typeSelect}
                onChange={(e) => {
                  setTypeSelect(e.target.value);
                }}
              >
                <option>Todas</option>
                <option>Compra</option>
                <option>Venta</option>
              </select>
              <a href="/newbill">
                <button ref={newBillButtonRef}>Nueva Factura</button>
              </a>
            </div>

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
            {bills.length === 0 ? (
              <div className="loadercontainer">
                <span className="loader"></span>
              </div>
            ) : null}
            <table
              className="bills"
              style={bills.length === 0 ? { opacity: "20%" } : null}
            >
              <thead>
                <tr>
                  <th>Ref.</th>
                  <th>
                    Fecha
                    <FontAwesomeIcon
                      style={{ paddingLeft: "8px" }}
                      icon={faSortDown}
                    />
                  </th>
                  <th>Tipo</th>
                  <th className="longer">Descripción</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill["_id"]}>
                    <td>{bill["ref"]}</td>
                    <td>{bill["date"]}</td>
                    <td>{bill["type"]}</td>
                    <td className="longer">{bill["description"]}</td>
                    <td className="tableButtons">
                      <div>
                        <a
                          href={bill["file"] ? `/bill/${bill["ref"]}.pdf` : "#"}
                          target={bill["file"] ? "_blank" : "_self"}
                        >
                          <button
                            className="outline tooltip"
                            disabled={!bill["file"]}
                          >
                            <span className="tooltiptext">Archivo</span>
                            <FontAwesomeIcon icon={faFile} />
                          </button>
                        </a>
                        <a
                          href={
                            bill["client"] ? `/client/${bill["client"]}` : "#"
                          }
                        >
                          <button
                            className="outline tooltip"
                            disabled={!bill["client"]}
                          >
                            <span className="tooltiptext">Cliente</span>
                            <FontAwesomeIcon icon={faUser} />
                          </button>
                        </a>
                        <button
                          className="outline tooltip"
                          onClick={() => {
                            handleDelete(bill["_id"]);
                          }}
                        >
                          <span className="tooltiptext">Eliminar</span>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
