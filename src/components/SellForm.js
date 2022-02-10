import axios from "axios"
import { useEffect, useState } from "react";
import { FaBackward } from "react-icons/fa"
import { Link } from "react-router-dom";
import "./SellForm.css"
const SellForm = ()=>{
    const [formData,setFormData] = useState({name:"",brand:"",images:[],category:"",description:"",price:0,location:"",phoneNo:0})
    const [image,setImage] = useState([])
    const [message,setMessage] = useState(null)
    const [loading,setLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)
    const categories =  ["Dress","Jeans","Trousers","Pant","Skirt","Suit","Sweater","T-shirt","Sock","Undergarments","Jacket","Swimwear","Coat","Shorts","Top","Gown","FormalWear","Boot"]
    const handleImage = async (e)=>{
        setImageLoading(true)
        const imageFile = e.target.files[0]
        console.log(imageFile)
        const formData = new FormData()
        formData.append("image",imageFile)
        try
        {
        const response = await axios.post("/api/v1/product/uploadImage",formData,{
            "Content-Type":"multipart/form-data"
        })
        setImage([...image,response.data.image.src])
        setImageLoading(false)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    useEffect(()=>{
        setFormData({...formData,images:image})
    },[image])

    const handlePost =async (e)=>{
        e.preventDefault()
        try
        {
        setLoading(true)
        const response = await axios.post("/api/v1/product",formData)
        setImage([])
        setMessage({msg:"Product is Posted",type:"success"})
        setLoading(false)
        setFormData({name:"",brand:"",images:[],category:"",description:"",price:0,location:"",phoneNo:0})
        window.scrollTo(0,0)
        setTimeout(()=>{
            setMessage(null)
        },3000)
        }
        catch(err)
        {
            setLoading(false)
            setMessage({msg:err.response.data.msg,type:"failure"})
            window.scrollTo(0,0)
            setTimeout(()=>{
                setMessage(null)
            },3000)
        }
    }
    return (
        <div className="form-container">
            <h1>Post Your Product</h1>
             {message && <h3 className = "post-message" style={{
                    color : message.type === "success" ? "green" : "rgb(255, 101, 101)",
                    backgroundColor: message.type === "success" ? "rgb(212, 255, 212)" : "rgb(255, 232, 232)"
                    }}>{message.msg}</h3>}
            <form>
                <div>
                    <label for = "name">Name</label>
                    <input
                    id = "name" 
                    type = "text" 
                    value = {formData.name}
                    onChange={(e)=>setFormData({...formData,name:e.target.value})}
                    />
                </div>
                <div>
                    <label for = "brand">Brand</label>
                    <input
                    id = "brand" 
                    type = "text" 
                    value = {formData.brand}
                    onChange={(e)=>setFormData({...formData,brand:e.target.value})}
                    />
                </div>
                <div>
                    <label >IMages</label>
                    <input onChange = {handleImage} type = "file"/>
                    {formData.images.length > 0 && <input onChange = {handleImage} type = "file"/>}
                    {formData.images.length > 1 && <input onChange = {handleImage} type = "file"/>}
                    {formData.images.length > 2 && <input onChange = {handleImage} type = "file"/>}
                    {imageLoading && <p className="wait">wait...</p>}
                </div>
                <div>
                    <label for = "category">Category</label>
                    <select id = "category" onChange={(e)=>setFormData({...formData,category:e.target.value})}>
                        {categories.map(item=><option key = {item} value = {item}>{item}</option>)}
                    </select>
                </div>
                <div>
                    <label for = "description">Description</label>
                    <textarea 
                    id = "description"
                    value = {formData.description}
                    onChange={(e)=>setFormData({...formData,description:e.target.value})}
                    />
                </div>
                <div>
                    <label for = "price">Set Price</label>
                    <input 
                    type = "number" 
                    id = "price" 
                    value = {formData.price} 
                    onChange={(e)=>setFormData({...formData,price:e.target.value})}/>
                </div>
                <div>
                    <label for = "location">Location</label>
                    <input
                    id = "location" 
                    type = "text" 
                    value = {formData.location}
                    onChange={(e)=>setFormData({...formData,location:e.target.value})}
                    />
                </div>
                <div>
                    <label for = "phoneNo">PhoneNo</label>
                    <input 
                    id = "phoneNo"
                    type = "number" 
                    value = {formData.phoneNo}
                    onChange={(e)=>setFormData({...formData,phoneNo:e.target.value})}
                    />
                </div>
                <button onClick = {handlePost} type = "submit">{loading ? "Loading..." : "Post Product"}</button>
            </form>
            <Link to = "/Sell"><FaBackward className = "backward"/></Link>
        </div>
    )
}

export default SellForm;