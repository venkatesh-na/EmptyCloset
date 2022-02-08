import "./Message.css"
import { Link } from "react-router-dom"
const Message = ({ message, type })=>{
    return (
        <div className="message">
            <p style={{color:type == "success" ? "green" : (type == "auth") ? "rgb(223, 154, 25,0.6)" : "red"}}>{message}</p>
            <Link to = "/login">Login</Link>
        </div>
    )
}

export default Message;