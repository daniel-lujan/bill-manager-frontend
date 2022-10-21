import React, { useState, useRef } from "react";
import { ClientsDB } from "./ClientsDB";

function getExtension(filename) {
  const re = /(?:\.([^.]+))?$/;
  return re.exec(filename)[0].toLowerCase();
}
const RESTAPI = process.env.REACT_APP_RESTAPI;

export const NewBill = (props) => {
  const uploadFile = async (file, filename) => {
    const outFile = new File([file], filename, { type: file.type });
    const formData = new FormData();
    formData.append("File", outFile);

    return await (
      await fetch(`${RESTAPI}/file`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
    ).json();
  };
  const changeHandler = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setBillSelectedFile(e.target.files[0].name.substring(0, 24));
    }
  };

  const submitHandler = async () => {
    const bill = {
      ref: billRef,
      date: billDate,
      type: billType,
      description: billDesc,
      file: "",
      client: billSelectedClient._id,
    };
    if (typeof selectedFile.name !== "undefined") {
      const upload_res = await uploadFile(selectedFile, billSelectedFile)
      if (upload_res.status === 0) {
        bill.file = upload_res.response
      } else {
        props.notification("No se pudo subir el archivo.", "error")
        return
      }
    }
    const res = await (
      await fetch(`${RESTAPI}/bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bill),
        credentials: "include",
      })
    ).json();
    if (res.status === 0) {
      props.notification("Se añadió la factura correctamente.", "success");
      setBillRef("");
      setBillDate("");
      setBillDesc("");
      setSelectedFile({});
      setBillSelectedFile("Seleccione un archivo...");
      setBillSelectedClient({ _id: "", name: "Seleccione un cliente..." });
    } else {
      props.notification("Ocurrió un error al añadír la factura.", "error");
    }
  };

  const popupSelector = () => {
    setClientSelectorDisplay("block");
  };

  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState({});

  const [billRef, setBillRef] = useState("");
  const [billDate, setBillDate] = useState("");
  const [billType, setBillType] = useState("Compra");
  const [billDesc, setBillDesc] = useState("");
  const [billSelectedFile, setBillSelectedFile] = useState(
    "Seleccione un archivo..."
  );
  const [billSelectedClient, setBillSelectedClient] = useState({
    _id: "",
    name: "Seleccione un cliente...",
  });

  const [clientSelectorDisplay, setClientSelectorDisplay] = useState("none");

  return (
    <div className="pagecontent">
      <h1 className="page-title">Nueva Factura</h1>
      <div className="container newbill">
        <div className="grid">
          <div className="containercolumn">
            <input
              value={billRef}
              onChange={(e) => {
                setBillRef(e.target.value);
              }}
              placeholder="Referencia*"
            />
            <input
              type="date"
              value={billDate}
              onChange={(e) => {
                setBillDate(e.target.value);
              }}
            />
            <div className="billtype">
              <p>Tipo</p>
              <select
                value={billType}
                onChange={(e) => {
                  setBillType(e.target.value);
                }}
              >
                <option>Compra</option>
                <option>Venta</option>
              </select>
            </div>
            <textarea
              rows={1}
              value={billDesc}
              onChange={(e) => {
                setBillDesc(e.target.value);
              }}
              placeholder="Descripción"
            />
          </div>
          <div className="containercolumn">
            <input
              onChange={changeHandler}
              className="uploadfile"
              type="file"
              ref={fileInputRef}
            />
            <div className="selector">
              <p>{billSelectedFile}</p>
              <button
                onClick={() => {
                  fileInputRef.current.click();
                }}
              >
                Seleccionar
              </button>
            </div>
            <div className="selector">
              <p>{billSelectedClient.name.substring(0, 24)}</p>
              <button onClick={popupSelector}>Seleccionar</button>
            </div>
          </div>
        </div>
        <button disabled={!billRef} onClick={submitHandler}>
          Agregar factura
        </button>
      </div>
      <div className="dialog" style={{ display: clientSelectorDisplay }}>
        <ClientsDB
          {...props}
          selectedClient={setBillSelectedClient}
          handleSelect={() => {
            setClientSelectorDisplay("none");
          }}
        />
        <button
          onClick={() => {
            setClientSelectorDisplay("none");
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
