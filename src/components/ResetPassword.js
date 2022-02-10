import axios from "axios"
import React, { useState , useEffect} from "react";
import { useLocation , Redirect, useNavigate, Link} from "react-router-dom"
const useQuery = ()=>{
    return new URLSearchParams(useLocation().search)
}
const ResetPassword = ()=>{
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const query = useQuery()
    const handleSubmit = async (e)=>{
        try
        {
        setLoading(true)
        e.preventDefault()
        const response = await axios.post("https://emptycloset.herokuapp.com/api/v1/auth/reset-password",{ token:query.get("token"), email:query.get("email"), password })
        setPassword("")
        setLoading(false)
        setMessage({msg:response.data.msg,type:"success"})
        setTimeout(()=>{
            navigate("/login")
        },1500)
        }
        catch(err)
        {
            setLoading(false)
            console.log(err.response)
            setMessage({msg:err.response.data.msg,type:"failure"})
        }
    }
    return (
        <React.Fragment>
        {message && <h3 className = "reset-message" style = {{
                    color : message.type === "success" ? "green" : "rgb(255, 101, 101)",
                    backgroundColor: message.type === "success" ? "rgb(212, 255, 212)" : "rgb(255, 232, 232)"
                    }}>{message.msg}</h3>}
        {(!message || message.type !== "success") && 
        <div className="resetpassword-form">
            <h1>Reset Password</h1>
            <form>
                <input type = "text" onChange = {(e)=>setPassword(e.target.value)} value = {password} placeholder="new password"/>
                <button type = "submit" onClick = {handleSubmit}>{loading ? "Loading..." : "Reset Password"}</button>
            </form>
            <p>Already have an Account? <Link to = "/login">Login</Link></p>
        </div>}
        
        </React.Fragment>
    )
}

export default ResetPassword;