import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const RESTAPI = process.env.REACT_APP_RESTAPI;

export const PDFViewer = () => {
  const [state, setState] = useState({ src: null });
  const linkRef = useRef();

  const requestResponse = async () => {
    const res = await (
      await fetch(`${RESTAPI}/file/${filename}`, {
        credentials: "include",
      })
    ).blob();
    const url = window.URL.createObjectURL(res)
    setState({ src: url });
    try {
      console.log(res);
      linkRef.current.click();
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    if (state.src === null) {
      requestResponse();
    }
  }, []);

  let { filename } = useParams();
  return (
    <div>
      {state.src ? <a href={state.src} ref={linkRef} /> : <p>Cargando</p>}
    </div>
  );
};
