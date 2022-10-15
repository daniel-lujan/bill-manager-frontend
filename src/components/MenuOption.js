import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const MenuOption = (props) => {
    return <div onClick={props.onClick ? props.onClick : ()=>{}} className="menuoption">
        {props.icon ? <FontAwesomeIcon icon={props.icon}/> : null}
        <p>{props.text ? props.text : ""}</p>
        <div>
        <FontAwesomeIcon icon={faArrowRight}/>
        </div>
    </div>
}