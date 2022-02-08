import axios from "axios";
import { MdLocationOn  } from "react-icons/md"
import { FaUserAlt } from "react-icons/fa"
import { BsThreeDotsVertical } from "react-icons/bs"
import { useGlobalContext } from "./context";
import { Link } from "react-router-dom"
import Loading from "./Loading";
import Message from "./Message";
import "./Sell.css"
import { useEffect, useState } from "react";
const Sell = ()=>{
    const { user, setUser } = useGlobalContext()
    const [userProducts, setUserProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [err,setError] = useState(null)
    const { itemCount, setItemCount } = useGlobalContext()
    const fetchUser = async ()=>{
        console.log("fetchuser")
        try
        {
        setLoading(true)
        const responseForUser = await axios.get("/api/v1/auth/user")
        const responseForProduct = await axios.get("/api/v1/product/getUserProducts")
        setUser([responseForUser.data.user])
        setUserProducts(responseForProduct.data.products)
        setLoading(false)
        }
        catch(err)
        {
            setError({msg:err.response.data.msg})
            setLoading(false)
        }
    }
    const handleShowPopup = (e)=>{
        e.stopPropagation()
        e.target.parentElement.nextSibling.classList.add("show")
    }
    const cancelShowPopup = (e)=>{
        e.stopPropagation()
        e.target.parentElement.classList.remove("show")
    }
    const handleProductDelete = async (productId)=>{
        try
        {
            const response = await axios.delete(`/api/v1/product/${productId}`)
            const callResponse = await axios.get(`/api/v1/call`)
            setItemCount(callResponse.data.callLater.totalItem)
            setUserProducts(userProducts.filter(item=>item._id !== productId))
        }
        catch(err)
        {
            setError({msg:err.response.data.msg,type:"auth"})
        }
    }
    useEffect(()=>{
        fetchUser()
    },[])
    if(loading)
    {
        return <Loading/>
    }
    if(err)
    {
        return <Message message = {err.msg} type = {"auth"}/>
    }
    if(user)
    {
        const { firstName, lastName, location } = user[0]
    return (
        <main className="user-products-container">
            <section>
                <article className = "user-info">
                    <div>
                        <FaUserAlt className="user-icon"/>
                        <p>{firstName + " " + lastName}</p>
                    </div>
                    <div>
                        <MdLocationOn className="location-icon"/>
                        <p>{location}</p>
                    </div>
                    <Link to = "/PostProduct" className="postProduct-link">Post Your Product</Link>
                </article>
            </section>
            <section className="products">
                <h1>Your Products</h1>
                <article>
                { userProducts.length > 0 ? userProducts.map(item=>{
                    const { _id, name, price, description,images} = item
                    return (
                            <div key = {_id} className="user-product-info">
                                <div>
                                    <Link to = {`/SingleProduct/${_id}`}><img src = {images[0]} alt = {name}/></Link>
                                </div>
                                <div>
                                    <h4>{name}</h4>
                                    <p>&#8377;{price}</p>
                                    <p>{description.slice(0,60)}{description.length > 60 ? "..." : ""}</p>
                                </div>
                                <div>
                                    <BsThreeDotsVertical className = "menu" onClick = {handleShowPopup}/>
                                </div>
                                <div className="product-modify">
                                    <p className = "cancel" onClick = {cancelShowPopup}>&#10006;</p>
                                    <div>
                                        <button onClick = {()=>handleProductDelete(_id)}>{loading ? "Loading..." : "Delete"}</button>
                                        <Link to = {`/EditSellForm/${_id}`}><button>Edit</button></Link>
                                    </div>
                                </div>
                            </div>
                    )
                }) :
                <div className="sell-noproduct-message">
                    <p>You Have Not Posted Any Product</p>
                    <Link to = "/PostProduct">+</Link>
                </div>}
                </article>
            </section>
        </main>
    )
    }
    return <h1>fuck off</h1>

}

export default Sell;