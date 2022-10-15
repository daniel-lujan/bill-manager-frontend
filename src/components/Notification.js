import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCircleCheck,
  faCircleXmark,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

export const Notification = (props) => {
  const hide = () => {
    props.display.set("none");
  };

  let icon;
  if (typeof props.type === "undefined" || props.type === "default") {
    icon = faBell;
  } else if (props.type === "success") {
    icon = faCircleCheck;
  } else if (props.type === "error") {
    icon = faCircleXmark;
  } else if (props.type === "info") {
    icon = faCircleInfo;
  }

  return (
    <div
      onAnimationEnd={hide}
      className="notification"
      style={{ display: props.display.var }}
    >
      <FontAwesomeIcon fontSize={25} icon={icon} />
      <p>{props.message}</p>
    </div>
  );
};
