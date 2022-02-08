import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom"
import axios from "axios"
import "../components/Login.css"
const Login = ()=>{
    const [ value, setValue] = useState({email:"",password:""})
    const [message, setMessage] = useState(null)
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = async (e)=>{
        try
        {
            e.preventDefault()
            setLoading(true)
            const response = await axios.post("https://emptycloset.herokuapp.com/api/v1/auth/login",value)
            setLoading(false)
            console.log(response)
            setMessage({msg:"login successfull, redirecting...",type:"success"})
            setTimeout(()=>{
                navigate("/showMe")
            },1500)
        }
        catch(err)
        {
            setLoading(false)
            setMessage({msg:err.response.data.msg,type:"failure"})
        }
}
return (
    <React.Fragment>
            {message && <h3 className = "login-message" style = {
                {
                    color : message.type === "success" ? "green" : "rgb(255, 101, 101)",
                    backgroundColor: message.type === "success" ? "rgb(212, 255, 212)" : "rgb(255, 232, 232)"
                    }
        }>{message.msg}</h3>}
        {(!message || message.type !== "success") && <div className="login-form">
            <form>
                <input onChange = {(e)=>setValue({...value,email:e.target.value})} value = {value.email} type = "text" placeholder="email"/>
                <input onChange = {(e)=>setValue({...value,password:e.target.value})} value = {value.password} type = "text" placeholder="password"/>
                <button onClick = {handleSubmit} type = "submit">{loading ? "Loading..." : "Login"}</button>
            </form>
            <p>Not Registered at? <Link to = "/register">Register</Link></p>
            <p>Forgot Password? <Link to = "/forgot-password">Reset Password</Link></p>
        </div>}
        </React.Fragment>
    )
}
export default Login;