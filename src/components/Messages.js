import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGhost,
  faServer,
  faWarning,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";

const PageMessage = (props) => {
  return (
    <div
      className="centered"
      style={{
        display: "flex",
        flexWrap: "wrap",
        verticalAlign: "middle",
      }}
    >
      <FontAwesomeIcon
        style={{
          fontSize: "140px",
          color: "white",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        icon={props.icon}
      />

      <div style={{ width: "fit-content", marginLeft: "24px" }}>
        <h1 className="page-title">{props.title}</h1>
        <a href={props.buttonHref ? props.buttonHref : null}>
          <button
            onClick={
              typeof props.buttonOnClick === "function"
                ? props.buttonOnClick
                : null
            }
            style={{ width: "80%" }}
            className="outline"
          >
            {props.buttonText}
          </button>
        </a>
      </div>
    </div>
  );
};

export const PageNotFound = () => {
  return (
    <PageMessage
      icon={faGhost}
      title="PÁGINA NO ENCONTRADA"
      buttonText="Volver al inicio"
      buttonHref="/"
    />
  );
};

export const ServerError = (props) => {
  return (
    <PageMessage
      icon={faServer}
      title={props.title ? props.title : "OCURRIÓ UN ERROR"}
      buttonText="Reintentar"
      buttonOnClick={props.onRetry}
    />
  );
};

export const Warning = (props) => {
  return (
    <div className="flashmessage fmwarning">
      <p>
        <FontAwesomeIcon icon={faWarning} />
        {props.message}
      </p>
    </div>
  );
};

export const Error = (props) => {
  return (
    <div className="flashmessage fmerror">
      <p>
        <FontAwesomeIcon icon={faXmarkCircle} />
        {props.message}
      </p>
    </div>
  );
};
