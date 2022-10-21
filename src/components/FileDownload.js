import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchFile } from "../fetchers";
import { SuccessPage, ErrorPage } from "./Messages";

export const FileDownload = () => {
  const { filename } = useParams();

  const { isLoading, isSuccess, isError, data } = useQuery(
    ["file", filename],
    () => fetchFile(filename)
  );

  if (isLoading) {
    return (
      <>
        <h1 className="page-title">Recuperando Archivo</h1>
        <div className="loadercontainer">
          <span className="loader"></span>
        </div>
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <SuccessPage
          style={{marginTop:"80px"}}
          title="Archivo Recuperado"
          message={
            <>
              Si la descarga no comenzó, click{" "}
              <a
                type="download"
                style={{ color: "var(--color2)", fontWeight: "700" }}
                href={window.URL.createObjectURL(data)}
              >
                aquí
              </a>
            </>
          }
        />
      </>
    );
  }
  if (isError) {
    return (
      <>
        <ErrorPage
          title="Error"
          message="No se pudo obtener el archivo solicitado."
          style={{marginTop:"80px"}}
        />
      </>
    );
  }
};
