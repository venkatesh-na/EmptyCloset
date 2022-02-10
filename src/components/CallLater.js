import axios from "axios"
import { useEffect, useState } from "react";
import { useGlobalContext } from "./context";
import { FaPhoneAlt } from "react-icons/fa"
import Loading from "./Loading";
import "./CallLater.css"
import Message from "./Message";
const CallLater = ()=>{
    const { user, setUser } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const [callLater, setCallLater] = useState(null)
    const {itemCount,setItemCount} = useGlobalContext()
    const [err,setError] = useState(null)
    const fetchUser = async ()=>{
        try
        {
        setLoading(true)
        const responseForUser = await axios.get("/api/v1/auth/user")
        setUser([responseForUser.data.user])
        const callLaterResponse = await axios.get("/api/v1/call")
        if(callLaterResponse.data.callLater === null)
        {
            const createCallLater = await axios.post("/api/v1/call")
            setCallLater(createCallLater.data.callLater)
             setLoading(false)
            return;
        }
        setCallLater(callLaterResponse.data.callLater)
        setLoading(false)
        }
        catch(err)
        {
            setError({msg:err.response.data.msg,type:"auth"})
            setLoading(false)
        }
    }
    const handleCallLaterDelete = async (id)=>{
        try
        {
        const response = await axios.patch(`/api/v1/call/${id}`)
        setItemCount(itemCount-1)
        setCallLater({...callLater,items:callLater.items.filter((item)=>item._id !== id)})
        }
        catch(err)
        {
            console.log(err)
        }
    }
    useEffect(()=>{
        fetchUser()
    },[])
    useEffect(()=>{
        fetchUser()
    },[itemCount])
 
    
    if(loading)
    {
        return <Loading/>
    }
    if(err)
    {
        return <Message message={err.msg} type = {err.type}/>
    }
    return (
        <main className="callLater-main">
            {callLater && 
                <section>
                    {callLater.items.length > 0 ? callLater.items.map(item=>{
                        const { _id:productItemId, image, name, category, price, phoenNo } = item
                        return (
                            <article className="callLater-article">
                                <div>
                                    <img src = {image} alt = {name}/>
                                </div>
                                <div>
                                    <p>{name}</p>
                                    <p>{category}</p>
                                </div>
                                <p>&#8377;{price}</p>
                                <a href = {`tel:${phoenNo}`}><FaPhoneAlt className="call-icon"/>Call</a>
                                <button onClick = {()=>handleCallLaterDelete(productItemId)}>Delete</button>
                            </article>
                        )
                    }) : <h1 className="empty-callLater">Call Later is Empty</h1>}
                    <div className="total-price-container">
                        <p>Total : &#8377;{callLater.totalPrice}</p>
                    </div>
                </section>}
        </main>
    )
}

export default CallLater;
