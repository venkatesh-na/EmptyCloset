import { Link } from "react-router-dom"
import React, { useState } from "react";
import axios from "axios"
import "../components/Register.css"
const Register = ()=>{
    const [ value, setValues ] = useState({firstName:"",lastName:"",location:"",email:"",password:""})
    const [ message , setMessage] = useState(null)
    const [loading,setLoading] = useState(false)
    const handleSubmit = async (e)=>{
        e.preventDefault()
        try
        {
            setLoading(true)
            const response = await axios.post(`/api/v1/auth/register`,value)
            setValues({firstName:"",lastName:"",loading:"",email:"",password:""})
            setLoading(false)
            setMessage({msg:response.data.msg,type:"success"})
        }
        catch(err)
        {
            setLoading(false)
            const { data : { msg } } = err.response 
            setMessage({msg , type:"failure"})
        }
    }
    return (
        <React.Fragment>
        {message && <h3 className = "register-message" style={{
                    color : message.type === "success" ? "green" : "rgb(255, 101, 101)",
                    backgroundColor: message.type === "success" ? "rgb(212, 255, 212)" : "rgb(255, 232, 232)"
                    }}>{message.msg}</h3>}
        {(!message || message.type !== "success") && <div className="register-form" disabled = {loading ? true : false}>
            <form>
                <input onChange = {(e)=>setValues({...value,firstName:e.target.value})} value = {value.firstName} type = "text" placeholder = "firstName"/>
                <input onChange = {(e)=>setValues({...value,lastName:e.target.value})} value = {value.lastName} type = "text" placeholder="lastName"/>
                <input onChange = {(e)=>setValues({...value,location:e.target.value})} value = {value.location} type = "text" placeholder="location"></input>
                <input onChange = {(e)=>setValues({...value,email:e.target.value})} value = {value.email} type = "text" placeholder="email"/>
                <input onChange = {(e)=>setValues({...value,password:e.target.value})} value = {value.password} type = "text" placeholder="password"/>
                <button onClick = {handleSubmit} type = "submit">{ loading ? "loading..." : "Register" }</button>
            </form>
            <p>Already registered? <Link to = "/login">Login</Link></p>
        </div>}
        </React.Fragment>
    )
}

export default Register;