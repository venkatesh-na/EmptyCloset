import Intro from "./components/Intro";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { HashRouter as Router , Routes, Route} from "react-router-dom"
import ShowMe from "./components/showMe";
import NavBar from "./components/Navbar";
import SingleProduct from "./components/SingleProduct";
import Sell from "./components/Sell";
import SellForm from "./components/SellForm";
import EditSellForm from "./components/EditSellForm";
import CallLater from "./components/CallLater";
function App() {
  return (
    <div className="App">
      <Router>
        <NavBar/>
          <Routes>
            <Route path = "/" element = {<Intro/>}/>
            <Route path = "/register" element = {<Register/>}/>
            <Route path = "/login" element = {<Login/>}/>
            <Route path = "/user/verify-email" element = {<VerifyEmail/>}/>
            <Route path = "/forgot-password" element = {<ForgotPassword/>}/>
            <Route path = "/user/reset-password" element = {<ResetPassword/>}/>
            <Route path = "/showMe" element = {<ShowMe/>}/>
            <Route path = "/Sell" element = {<Sell/>}/>
            <Route path = "/SingleProduct/:id" element = {<SingleProduct/>}/>
            <Route path = "/PostProduct" element = {<SellForm/>}/>
            <Route path = "/EditSellForm/:id" element = {<EditSellForm/>}/>
            <Route path = "/CallLater" element = {<CallLater/>}/>
          </Routes>
      </Router> 
    </div>
  );
}

export default App;
