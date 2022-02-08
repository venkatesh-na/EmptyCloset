import React, { useContext, useState } from "react";

const AppContext = React.createContext()

const AppProvider = ({ children })=>{
    const [user, setUser] = useState(null)
        const [itemCount,setItemCount] = useState(0)
    return (
        <AppContext.Provider value = {{user,setUser,itemCount,setItemCount}}>
            {children}
        </AppContext.Provider>
    )
}

const useGlobalContext = ()=>{
    return useContext(AppContext)
}


export { useGlobalContext, AppProvider }