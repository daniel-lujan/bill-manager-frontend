import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const COLLAPSED_WIDTH = 100;

const SideNavElement = (props) => {
  return (
    <a href={props.href}>
      <button className="sidenav">
        <FontAwesomeIcon icon={props.icon} />
        <p style={{opacity:props.collapsed ? "0%" : "100%"}}>
        {props.text}
        </p>
      </button>
    </a>
  );
};

export const SideNav = (props) => {
  const handleAnimationEnd = () => {
    setCollapsed(sidenavRef.current.offsetWidth === COLLAPSED_WIDTH)
  };

  const sidenavRef = useRef();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      ref={sidenavRef}
      className="sidenav"
      onTransitionEnd={handleAnimationEnd}
    >
      {props.elements.map((e) => (
        <SideNavElement key={e.href} {...e} collapsed={collapsed} />
      ))}
    </div>
  );
};
