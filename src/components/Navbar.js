import axios from "axios"
import { useGlobalContext } from "./context";
import { useNavigate , Link} from "react-router-dom";
import { FaPhoneAlt , FaBars} from "react-icons/fa"
import "../components/Nav.css"
import { useEffect, useState } from "react";
const NavBar = ()=>{
    const { user , setUser} = useGlobalContext()
    const {itemCount,setItemCount} = useGlobalContext()
    const [err,setError] = useState(null)
    const [sidebar,setSidebar] = useState(false)
    const navigate = useNavigate()
    const handleLogout = async (e)=>{
        const data = await axios.get("https://emptycloset.herokuapp.com/api/v1/auth/logout")
        setUser(null)
        navigate("/")
    }

    const handleLink = (e)=>{
        var x = window.matchMedia("(max-width:900px)")
        if(x.matches)
        {
            setSidebar(!sidebar)
        }
        if(e.target.dataset.id == "buy")
        {
            e.target.classList.add("active")
            e.target.parentElement.children[1].classList.remove("active")
        }
        if(e.target.dataset.id == "sell")
        {
            e.target.classList.add("active")
            e.target.parentElement.children[0].classList.remove("active")
        }
    }

    const fetchCallLater = async ()=>{
        try
        {
         const callLaterResponse = await axios.get("https://emptycloset.herokuapp.com/api/v1/call")
         if(callLaterResponse.data.callLater == null)
         {
            const response = await axios.post("https://emptycloset.herokuapp.com/api/v1/call")
            setItemCount(response.data.callLater.totalItem)
            return;
        }
        setItemCount(callLaterResponse.data.callLater.totalItem) 
        }
        catch(err)
        {
            console.log(err)
            setError({msg:err.response.data.msg})
        }
    }
    useEffect(()=>{
        fetchCallLater()
    },[])
    return (
        <nav>
            <div>
                {user && <div onClick = {()=>setSidebar(!sidebar)} className="bar-icon"><FaBars/></div>}
                <h1>Empty<span>Closet</span></h1>
                {user && <Link className = "link-to-callLater" to = "/CallLater">
                    <div className="global-callLater">
                        <FaPhoneAlt className="phone-icon"/>
                        <span>{itemCount}</span>
                    </div>
                </Link>}
            </div>
            {user &&
            <>
            <div className="nav-middle">
                <Link data-id = "buy" onClick = {handleLink} to = "/showMe">Buy</Link>
                <Link data-id = "sell" onClick = {handleLink} to = "/Sell">Sell</Link>
            </div>
            <div className="nav-end">
                <p>Hello {user[0].firstName}</p>
                <Link to = "/CallLater">
                <div className="global-callLater">
                    <FaPhoneAlt className="phone-icon"/>
                    <span>{itemCount}</span>
                </div>
                </Link>
                <button className = "logout" onClick = {handleLogout}>{err ? "Login" : "Logout"}</button>
            </div>
            <div onClick = {()=>setSidebar(!sidebar)}className = {sidebar ? "side-bar active" : "side-bar"}>
                <div onClick = {(e)=>e.stopPropagation()} className="inner-side-bar">
                    <div className = "nav-header">
                        <h3>Empty<span>Closet</span></h3>
                        <button onClick = {()=>setSidebar(!sidebar)}>&#x2715;</button>
                    </div>
                    <div>
                        <p>Hello {user[0].firstName}</p>
                        <Link data-id = "buy" onClick = {handleLink} to = "/showMe">Buy</Link>
                        <Link data-id = "sell" onClick = {handleLink} to = "/Sell">Sell</Link>
                        <button className = "logout" onClick = {handleLogout}>{err ? "Login" : "Logout"}</button>
                    </div>
                </div>
            </div>
            </>
            }
        </nav>
    )
}

export default NavBar;