import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { FaStar , FaPhoneAlt} from "react-icons/fa"
import { Link , useParams, useNavigate} from "react-router-dom"
import { useGlobalContext } from "./context"
import Message from "./Message"
import Loading from "./Loading"
import "./SingleProduct.css"
const SingleProduct = ({match})=>{
    const [product,setProduct] = useState(null)
    const [err,setError] = useState(null)
    const [loading,setLoading] = useState(false)
    const [reviewLoading,setReviewLoading] = useState(false)
    const [showReview,setShowReview] = useState(false)
    const [showPopup,setShowPopup] = useState(false)
    const [rating,setRating] = useState({rate:0,comment:""})
    const [message,setMessage] = useState(null)
    const [reviews,setReviews] = useState([])
    const { user:currentUser, setUser, itemCount,setItemCount } = useGlobalContext()
    const element = useRef("")
    const { id } = useParams()
    const navigate = useNavigate()
    const fetchUser = async ()=>{
        try
        {
        const response = await axios.get("https://emptycloset.herokuapp.com/api/v1/auth/user")
        setUser([{...response.data.user}])
        }
        catch(err)
        {
            setError({msg:err.response.data.msg,type:"auth"})
        }
    }
    const fetchData = async ()=>{
        try
        {
        setLoading(true)
        const response = await axios.get(`https://emptycloset.herokuapp.com/api/v1/product/${id}`)
        const reviewResponse = await axios.get(`https://emptycloset.herokuapp.com/api/v1/review/${response.data.product._id}`)
        setProduct([{...response.data.product}])
        setReviews(reviewResponse.data.reviews)
        setLoading(false)
        }
        catch(err)
        {
            setLoading(false)
            setError({msg:err.reponse.data.msg,type:"failure"})
        }
    }
    const handleImage = (e)=>{   
        element.current.src = product[0].images[e.target.dataset.id]
        const htmlCollection = e.target.parentElement.children
        for(let img of htmlCollection)
        {
            img.classList.remove("active")
        }
        e.target.classList.add("active")
    }
    const handleCreateReview = async (id)=>{
        try
        {
        setReviewLoading(true)
        const response = await axios.post("https://emptycloset.herokuapp.com/api/v1/review",{rating:rating.rate, comment:rating.comment ,product:id})
        setMessage({msg:response.data.msg,type:"success"})
        setRating({rate:0,comment:""})
        setMessage(null)
        setReviewLoading(false)
        setShowPopup(false)
        }
        catch(err)
        {
            setReviewLoading(false)
            setMessage({msg:err.response.data.msg,type:"failure"})
        }
    }
    const handleInnerPopupClick = (e)=>{
        e.stopPropagation()
    }
    const handleDeleteReview = async (reviewId)=>{
        try
        {
        const response = await axios.delete(`https://emptycloset.herokuapp.com/api/v1/review/${reviewId}`)
        setReviews(reviews.filter(review=>review._id !== reviewId))
        }
        catch(err)
        {
            setError({msg:err.response.data.msg,type:"reviewDeleteError"})
        }
    }
    const handleCallLater = async (productId)=>{
        try
        {
        const callResponse = await axios.patch(`https://emptycloset.herokuapp.com/api/v1/call`,{productId})
        setItemCount(itemCount+1)
        }
        catch(err)
        {
            console.log(err)
        }
    }
    useEffect(()=>{
        fetchUser()
        fetchData()
    },[message])
    if(loading)
    {
        return <Loading/>
    }
    if(err)
    {
        console.log("error exist")
        return <Message message = {err.msg} type = {err.type}/>
    }
    return (
        <section className="single-section">
            {product &&     
        product.map(item=>{
            const { _id:productId,images,name,brand,category, description,price,location,phoneNo,averageRating,noOfReview} = item
            return (
                <div key = {productId} className="single-product-item">
                    <div className="image-container">
                        <div>
                            <img ref = {element} src = {images[0]}/>
                        </div>
                        <div>
                            {images.map((image,index)=>{
                                if(index == 0)
                                {
                                    return <img className = "active" data-id = {index} onClick = {handleImage} src = {image}/>
                                }
                                return (
                            <img data-id = {index} onClick = {handleImage} src = {image}/>
                            )})}
                        </div>
                    </div>
                    <div className="single-product-detail">
                        <h1>{name}</h1>
                        <div className="product-detail">
                            <p>{averageRating}<FaStar/></p>
                            <p>({noOfReview} customer reviews)</p>
                            <p>&#8377;{price}</p>
                            <p>{description}</p>
                            <div>
                                <p><span>Category</span> : {category}</p>
                                <p><span>Brand</span> : {brand}</p>
                            </div>
                        </div>
                        <div className="review-container">
                                <div onClick = {()=>setShowReview(!showReview)}>Reviews{showReview ? <span>&#x25b2;</span> : <span>&#x25bc;</span>}</div>
                                {(showReview && reviews ) && <div className="reviews">
                                    {reviews.map(review => {
                                        const { _id:reviewId, user:reviewCreatedUser, rating, comment} = review
                                        const {  firstName, lastName } = reviewCreatedUser
                                        console.log(currentUser[0]._id,reviewCreatedUser)
                                        return (
                                            <>
                                            <div key = {reviewId}>
                                                <p>&#9733;{rating}</p>
                                                <p>{comment}</p>
                                                <p>{firstName + " " + lastName}</p>
                                            {(currentUser[0]._id == reviewCreatedUser._id) && <button className = "deleteReview" onClick = {()=>handleDeleteReview(reviewId)}>Delete Review</button>}
                                            </div>
                                            </>
                                        )  
                                    })}
                                    <button title = "add your review" onClick = {()=>setShowPopup(!showPopup)}className="addReview">+</button>
                                </div>}
                        </div>
                        <div className="call-container">
                            <a href = {`tel:${phoneNo}`}><FaPhoneAlt/>Call</a>
                            <button onClick = {()=>handleCallLater(productId)}>CallLater</button>
                        </div>
                    </div>
                </div>

            )
        })}
        {showPopup && <div onClick = {()=>setShowPopup(!showPopup)} className="popup">
            <div onClick = {handleInnerPopupClick} className="inner-popup">
                {message && <h3 className = "review-message" style={{
                    color : message.type === "success" ? "green" : "rgb(255, 101, 101)",
                    backgroundColor: message.type === "success" ? "rgb(212, 255, 212)" : "rgb(255, 232, 232)"
                    }}>{message.msg}</h3>}
                <div>
                    <p>{rating.rate}&#9733;</p>
                    <input value = {rating.rate} value = {rating.rate} onChange = {(e)=>setRating({...rating,rate:e.target.value})} type = "range" min = "0" step={1} max = "5"/>
                </div>
                <textarea onChange = {(e)=>setRating({...rating,comment:e.target.value})} className = "comment" value = {rating.comment} placeholder="Comment">
                </textarea>
                <button onClick = {()=>handleCreateReview(id)}>{reviewLoading ? "Loading...": "Create Review"}</button>
            </div>
        </div>}
        </section>
    )
}

export default SingleProduct;