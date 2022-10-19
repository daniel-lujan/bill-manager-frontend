import React from "react";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleGroup,
  faFileInvoiceDollar,
  faRightFromBracket,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

export const Home = (props) => {
  return (
    <div className="pagecontent home">
      <Helmet>
        <title>Menú</title>
        <link id="favicon" rel="icon" type="image/png" href="home.ico" />
      </Helmet>
      <a href="/clients">
        <button className="panel">
          <FontAwesomeIcon icon={faPeopleGroup} />
          Clientes
        </button>
      </a>
      <a href="/bills">
        <button className="panel">
          <FontAwesomeIcon icon={faFileInvoiceDollar} />
          Facturas
        </button>
      </a>

      {props.role.var === "admin" ? (
        <a href="/admin/general">
          <button className="outline panel">
            <FontAwesomeIcon icon={faSliders} />
            Administrar
          </button>
        </a>
      ) : null}

      <button onClick={props.logout} className="outline panel">
        <FontAwesomeIcon icon={faRightFromBracket} />
        Salir
      </button>
    </div>
  );
};
