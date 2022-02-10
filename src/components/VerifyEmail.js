import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useLocation } from "react-router-dom"
import "../components/VerifyEmail.css"
const useQuery = ()=>{
    return new URLSearchParams(useLocation().search)
}
const VerifyEmail = ()=>{
    const [err,setError] = useState(false)
    const [loading,setLoading] = useState(false)
    const query = useQuery()
    const checkVerification = async ()=>{
        try
        {
            setLoading(true)
            const response = await axios.post(`/api/v1/auth/verify-email`,
            {
                token:query.get("token"),
                 email:query.get("email")
            })
            setLoading(false)
        }
        catch(err)
        {
            setLoading(false)
            setError(true)
        }
    }
    useEffect(()=>{
        checkVerification()
    },[])
    if(loading)
    {
        return <h1>loading...</h1>
    }
    if(err)
    {
        return <h1 className = "error-message">please check your verification token</h1>
    }
    return (
        <div className="email-confirmation">
            <h1>Email Confirmed</h1>
            <Link to = "/login">Login</Link>
        </div>
    )
}

export default VerifyEmail;