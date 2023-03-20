import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Inputs from '../Inputs/Inputs';
import "./Registration.scss"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, updateUserDB } from '../../firebase';
const Register = (props) => {
    const isSingUp = props.singup ? true : false;
    const navigate = useNavigate();
    const [values, setvalues] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [errMssg, setErrMsg] = useState("");
    const [submitBtnDisable, setSubmitBtnDisable] = useState(false)


    const createAccount = () => {
        if (!values.name || !values.email || !values.password) {
            setErrMsg("All Fields Required!!")
            return;
        }
        setSubmitBtnDisable(true)
        createUserWithEmailAndPassword(auth, values.email, values.password)
            .then(async (res) => {
                const userID = res.user.uid;
                await updateUserDB({ name: values.name, email: values.email }, userID)
                setSubmitBtnDisable(false);
                navigate("/")
                console.log("Create Account:", res)
            })
            .catch((err) => {
                setSubmitBtnDisable(false);
                setErrMsg(err.message);
            })
    }
    const loginAccount = () => {
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then(async (res) => {
                setSubmitBtnDisable(false);
                navigate("/")
                console.log("login:", res)
            })
            .catch((err) => {
                setSubmitBtnDisable(false);

                setErrMsg(err.message);
            })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // return (
        //     isSingUp?createAccount:loginAccount
        // )
        if (isSingUp) createAccount();
        else loginAccount();


    }




    return (
        <div className='register'>
            <form onSubmit={handleSubmit}>
                <Link to="/"><p className='bth'>{"<=Back to Home Page"}</p></Link>
                <h1>{isSingUp ? "singup" : "login"}</h1>
                {
                    isSingUp && (
                        <Inputs islabel={"Name"} placeholder="Enter Your Name" onChange={(e) => setvalues((prev) => ({ ...prev, name: e.target.value }))} />
                    )
                }
                <Inputs islabel={"Email"} placeholder="Enter Your Email" onChange={(e) => setvalues((prev) => ({ ...prev, email: e.target.value }))} />
                <Inputs islabel={"Password"} placeholder="Enter Your Password" ispassword onChange={(e) => setvalues((prev) => ({ ...prev, password: e.target.value }))} />
                <p style={{ color: "red" }}>{errMssg}</p>
                <button type='submit' disabled={submitBtnDisable}>{isSingUp ? "SingUp" : "login"}</button>

                <div className='bottom'>
                    {
                        isSingUp ?
                            <p>Already Have an account?<Link to="/login" className='bottom_btn'>Login here</Link></p>
                            :
                            <p>New here?<Link to="/singup" className='bottom_btn'>Create an account</Link></p>
                    }
                </div>
            </form>

        </div>
    )
}

export default Register
