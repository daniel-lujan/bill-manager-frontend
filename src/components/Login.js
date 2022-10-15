import  React, { useState } from "react";
import { hash } from "bcryptjs";

const RESTAPI = process.env.REACT_APP_RESTAPI;
const HASHSALT = decodeURIComponent(process.env.REACT_APP_HASHSALT);

export const Login = (props) => {
  const login = async () => {
    const res = await (await fetch(`${RESTAPI}/auth/log`,{
      method:"POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        "username":user,
        "password": await hash(passw, HASHSALT)
      }),
      credentials:"include"
    })).json()
    if (res.status === 0){
      props.notification("Sesión iniciada correctamente.", "success")
      props.handle_login()
    } else {
      props.notification("Usuario o contraseña inválidos.","error")
    }
  };

  const [user, setUser] = useState("");
  const [passw, setPassw] = useState("");

  return (
    <div className="pagecontent">
      <h1 className="page-title">Iniciar Sesión</h1>
      <div className="container login">
        <input
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
          placeholder="Usuario"
        />
        <input
          value={passw}
          onChange={(e) => {
            setPassw(e.target.value);
          }}
          type="password"
          placeholder="Contraseña"
        />
        <button disabled={!user || !passw} onClick={login}>Iniciar Sesión</button>
      </div>
    </div>
  );
};
