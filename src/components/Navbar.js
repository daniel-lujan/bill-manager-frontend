import React from "react";

export const Navbar = (props) => {
    return <header className="navbar">
        <a className="title" href="/">App</a>
        <ul className="links">
            <li><a href="/clients">Clientes</a></li>
            <li><a href="/bills">Facturas</a></li>
            <li><button onClick={props.logout}>Cerrar Sesión</button></li>
        </ul>
    </header>
}