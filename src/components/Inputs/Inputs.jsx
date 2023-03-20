import React, { useState } from 'react'
import { Eye, EyeOff } from "react-feather"
import "./Inputs.scss"
const Inputs = ({ islabel, ispassword, ...props }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="input_con">
            {islabel && <label>{islabel}</label>}
            <div className="inputContainer">
                <input 
                    type={ispassword ? (isVisible ? "password" : "text") : "text"}{...props} />
                {ispassword &&
                    <span>{isVisible ? <EyeOff onClick={() => setIsVisible((prev) => !prev)} /> : <Eye onClick={() => setIsVisible((prev) => !prev)} />}</span>
                }
            </div>
        </div>
    )
}

export default Inputs
