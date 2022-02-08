import axios from "axios";
import { useEffect , useState} from "react";
import { useGlobalContext } from "./context";
import { Link } from "react-router-dom"
import { FaStar } from "react-icons/fa"
import Loading from "./Loading";
import data from "./data"

import "../components/showMe.css"
import Message from "./Message";


//search, category(fetch category), sort(low-to-high,high-to-low,a-z,z-a), price(range)

// sell component
// show products thats user created
// user can create product

const ShowMe = ()=>{
const [loading, setLoading] = useState(false)
const { user , setUser} = useGlobalContext()
const [err, setError] = useState(null)
const [products, setProducts] = useState([])
const [maxPrice,setMaxPrice] = useState(0)
const [category,setCategory] = useState([])
const [brands,setBrands] = useState([])
const [rangeValue,setRangeValue] = useState(0)
const [query,setQuery] = useState({name:"",brand:"",category:"",sort:"",priceFilter:"",ratingFilter:"",numericFilter:""})
const [checked,setChecked] = useState({one:false,two:false,three:false,four:false})

    const fetchUser = async ()=>{
        try
        {
        setLoading(true)
        const userResponse = await axios.get("/api/v1/auth/user")
        const productResponse = await axios.get("/api/v1/product")
        if(productResponse.data.product.length > 0)
        {
        const maxPriceResponse = await axios.get("/api/v1/product/findMaxPrice")
        setMaxPrice(maxPriceResponse.data.maxPrice)
        }
        setUser([{...userResponse.data.user}])
        setProducts(productResponse.data.product)
        setCategory(["all",...new Set(productResponse.data.product.map(item=>item.category))])
        setBrands(["all",...new Set(productResponse.data.product.map(item=>item.brand))])
        setLoading(false)
        }
        catch(err)  
        {
            if(err.response.data.msg)
            {
                setError({msg:err.response.data.msg || "something went wrong"})
                return setLoading(false)
            }
            setError({msg:err.response.data || "something went wrong"})
            setLoading(false)
        }
    }

    const handleChange = async (e)=>{
        let queryName = e.target.name
        let value = e.target.value
        if(queryName == "priceFilter") setRangeValue(e.target.value)
        if(queryName == "category")
        {
            const htmlCollection = e.target.parentElement.children
            for(let item of htmlCollection)
            {
                item.classList.remove("active")
            }
            e.target.classList.add("active")
        }
        if(queryName == "priceFilter") value = `price<${value},`
        if((queryName == "category" || queryName == "brand") && value == "all") value = ""
        setQuery({...query,[queryName]:value})
    }

    const fetchProductByQuery = async ()=>{
        try
        {
         const products = await axios.get(`/api/v1/product?name=${query.name}&brand=${query.brand}&category=${query.category}&sort=${query.sort}&numericFilter=${query.priceFilter}${query.ratingFilter}`)
        setProducts(products.data.product)
        }
        catch(er)
        {
            setError({msg:err.response.data || "something went wrong"})
        }
    }

    const handleRemoveFilter = ()=>{
        setQuery({name:"",brand:"",category:"",sort:"",numericFilter:""})
        setChecked({one:false,two:false,three:false,four:false})
    }

    const handleCheck = (e)=>{
        switch(e.target.value)
        {
        case "averageRating>4":
            setChecked({one:false,two:false,three:false,four:!checked.four})
            break;
        case "averageRating>3":
            setChecked({one:false,two:false,three:!checked.three,four:false})
            break;
        case "averageRating>2":
                setChecked({one:false,two:!checked.two,three:false,four:false})
            break;
        case "averageRating>1":
                setChecked({one:!checked.one,two:false,three:false,four:false})
            break;
        }
    }

    useEffect(()=>{
        const obj = { one:"averageRating>1",two:"averageRating>2",three:"averageRating>3",four:"averageRating>4" }
        for(let a in checked)
        {
            console.log(checked[a])
            if(checked[a] == true) return setQuery({...query,ratingFilter:obj[a]})
            else setQuery({...query,ratingFilter:""})
        }
    },[checked])

    useEffect(()=>{
        fetchUser()
    },[])

    useEffect(()=>{
        fetchProductByQuery()
    },[query])
    if(loading)
    {
        return <Loading/>
    }
    if(err)
    {
        return <Message message = {err.msg} type = {"auth"}/>
    }
    return (
        <main className="main-showMe-container">
            {user &&
                <section className="buy-container">
                    <article className="filter-product">
                        <div className="category-container">
                            <h5>Category</h5>
                            <div>
                            {category.map(category=><button 
                                onClick = {handleChange} 
                                name = "category" 
                                value = {category} 
                                key = {category}>{category}</button>)}
                            </div>
                        </div>
                        <div className="brands-container">
                            <h5>Brands</h5>
                            <select name = "brand" onChange = {handleChange}>
                                {brands.map(item=><option value = {item} key = {item}>{item}</option>)}
                            </select>
                        </div>
                        <div className="rating-container">
                            <h5>Rating</h5>
                            <div>
                            <label>4 <FaStar className = "star-icon"/> & Above
                            <input 
                                onChange = {handleCheck} 
                                checked = {checked.four ? true : false} 
                                name = "ratingFilter" 
                                value = "averageRating>4" 
                                type = "checkbox"/></label>
                            <label>3 <FaStar className = "star-icon"/> & Above
                            <input 
                                onChange = {handleCheck} 
                                checked = {checked.three ? true : false} 
                                name = "ratingFilter" 
                                value = "averageRating>3" 
                                type = "checkbox"/></label>
                            <label>2 <FaStar className = "star-icon"/> & Above
                            <input 
                                onChange = {handleCheck} 
                                checked = {checked.two ? true : false} 
                                name = "ratingFilter" 
                                value = "averageRating>2" 
                                type = "checkbox"/></label>
                            <label>1 <FaStar className = "star-icon"/> & Above
                            <input 
                                onChange = {handleCheck} 
                                checked = {checked.one ? true : false} 
                                name = "ratingFilter" 
                                value = "averageRating>1" 
                                type = "checkbox"/></label>
                                </div>
                        </div>
                        <div className="price-filter-container">
                            <h5>Price</h5>
                            <p>{rangeValue}rs</p>
                            {maxPrice && 
                            <input 
                                name = "priceFilter"
                                onChange={handleChange} 
                                type = "range"
                                min = "0" 
                                max = {maxPrice+10}/>}
                        </div>
                        <div className="remove-filter-container">
                            <button onClick = {handleRemoveFilter}>Remove Filters</button>
                        </div>
                    </article>
                    <article className="search-product">
                        <div className="search-container">
                            <input type = "text" name = "name" onChange = {handleChange} placeholder="Search"/>
                            <select onChange = {handleChange} name = "sort">
                                <option value = "price">Price(Low-High)</option>
                                <option value = "-price">Price(High-Low)</option>
                                <option value = "name">Name(A-Z)</option>
                                <option value = "-name">Name(Z-A)</option>
                            </select>
                        </div>
                        <div className="products">
                            <div className="inner-product">
                            {products.length > 0 ? products.map(item=>{
                                return (
                                    <Link to = {`/SingleProduct/${item._id}`}>
                                        <div className = "product-item">
                                            <div><img src = {item.images[0]}/></div>
                                            <div>
                                                <p>{item.name.length > 15 ? `${item.name.slice(0,15)}...` : item.name}</p>
                                                <p>&#8377;{item.price}</p>
                                            </div>
                                        </div>
                                </Link>
                            )}) : <h1>There is No Product</h1>}
                            </div>
                        </div>
                    </article>
                </section>}
        </main>
    )
}

export default ShowMe;