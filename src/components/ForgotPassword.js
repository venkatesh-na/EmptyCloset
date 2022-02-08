import axios from "axios"
import React, { useState } from "react";
import { Link } from "react-router-dom"
import "../components/ForgotPassword.css"
const ForgotPassword = ()=>{
    const [email, setEmail] = useState("")
    const [message,setMessage] = useState(null)
    const [loading,setLoading] = useState(false)
    const handleSubmit = async (e)=>{
        try
        {
        setLoading(true)
        e.preventDefault()
        const response = await axios.post("http://localhost:5000/api/v1/auth/forgot-password",{ email })
        setEmail("")
        setLoading(false)
        setMessage({msg:response.data.msg,type:"success"})
        }
        catch(err)
        {
            setLoading(false)
            setMessage({msg:err.response.data.msg,type:"failure"})
        }
    }
    return (
        <React.Fragment>
            {message && <h3 className = "forgot-message" style = {{
                    color : message.type === "success" ? "green" : "rgb(255, 101, 101)",
                    backgroundColor: message.type === "success" ? "rgb(212, 255, 212)" : "rgb(255, 232, 232)"
                    }}>{message.msg}</h3>}
        {(!message || message.type !== "success") && <div className="forgotpassword-form">
            <h1>Forgot Password</h1>
            <form>
                <input type = "text" onChange = {(e)=>setEmail(e.target.value)} value = {email} placeholder="email"/>
                <button type = "submit" onClick= {handleSubmit}>{loading ? "Loading..." : "Get Reset Password Link"}</button>
            </form>
            <p>Already have an Account? <Link to = "/login">Login</Link></p>
        </div>}
        </React.Fragment>
    )
}

export default ForgotPassword;