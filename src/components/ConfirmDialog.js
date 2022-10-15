import React from "react";

/*
    PROPS:
    -> message
    -> handlers
    -> display
*/

export const ConfirmDialog = (props) => {
    
    const close = () => {
        props.display.set("none")
    }

    const handleAccept = () => {
        if (typeof props.handlers.accept === "function"){
            props.handlers.accept()
        }
        close()
    }

    const handleCancel = () => {
        if (typeof props.handlers.cancel === "function"){
            props.handlers.cancel()
        }
        close()
    }
    
    return <div className="dialog" style={{display:props.display.var}}>
        <div className="dialogBox">
            <h1>CONFIRMAR</h1>
            <p>{props.message}</p>
            <div>
                <button onClick={handleAccept}>Aceptar</button>
                <button onClick={handleCancel}>Cancelar</button>
            </div>
        </div>
    </div>
} 