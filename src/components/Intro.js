import mainImage from "../images/undraw_online_shopping_re_k1sv.svg"
import { Link , useNavigate, Redirect} from "react-router-dom"
import React , { useEffect, useState } from "react"
import { useGlobalContext } from "./context"
import "../components/Intro.css"
import axios from "axios"
import ShowMe from "./showMe"
const Intro = ()=>{
    const {user,setUser} = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const fetchUser = async ()=>{
        try
        {
            setLoading(true)
        const response = await axios.get("https://emptycloset.herokuapp.com/api/v1/auth/user")
        setUser([{...response.data.user}])
        setLoading(false)
        }
        catch(err)
        {
            setLoading(false)
            console.log(err.response)
        }
    }
    useEffect(()=>{
        fetchUser()
    },[])
    if(loading)
    {
        return <h1>Loading...</h1>
    }
    if(user)
    {
        return <ShowMe/>
    }
    return (
        <div className="intro">
            <div>
                <h1>Empty<span>Closet</span></h1>
                <p>Empty closet is a website where you can sell as well as buy an old clothes without any problems, you can directly contact a buyer to buy a cloth that you liked and you can sell your cloth online buy just filling a simple form</p>
                <p>Name of the website is empty closet becuase in every home our closet is always filled with cloths that we dont wear so the solution is simple that we empty our closet and i think you guessed it.</p>
                <div>
                    <Link to = "/register">Register</Link>
                    <Link to = "/login">Login</Link>
                </div>
            </div>
            <div>
                <img alt = "emptyCloset" src = {mainImage}/>
            </div>
        </div>
    )
}
export default Intro;