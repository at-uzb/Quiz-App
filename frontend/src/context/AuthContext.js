import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import api, { setAuthToken } from "../api/api";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("refresh") || null
    )
    let [loading, setLoading] = useState(true)
    let [user, setUser] = useState(null);

    let navigate = useNavigate();

    let LoginUser = async (e) => {
        e.preventDefault()

        let response = await api.post("users/login/", {
            username: e.target.username.value, 
            password: e.target.password.value
        })

        if ( response.status === 200 ) {
            setAuthToken(response.data.access)
            localStorage.setItem("access", response.data.access)
            localStorage.setItem("refresh", response.data.refresh)
            getUserData();
            setAuthTokens(response.data.refresh)
            navigate("/")
        } else {
            alert("Something went wrong!")
        }
    }

    let LogoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.clear()
        window.location.reload()

    }
    let updateToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refresh");
            if (!refreshToken) {
                console.log("No refresh token found");
                LogoutUser();
                return;
            }
    
            let response = await api.post("users/token/refresh/", { refresh: refreshToken });

            if (response.status === 200) {
                setAuthToken(response.data.access);
                localStorage.setItem("access", response.data.access);
            } else {
                console.log("Failed to refresh token, status:", response.status);
                LogoutUser();
            }
        } catch (error) {
            console.error("Error during token refresh:", error.response?.status || error.message);
            LogoutUser();
        } finally {
            
            if (loading) {
                console.log("Fetching user data...");
                await getUserData();
                setLoading(false);
            }
        }
    };
    
    let getUserData = async (e) => {
        let response = await api.get("users/dashboard/")
        if (response.status === 200 ) {
            setUser(response.data)
        } else {
            alert("Something went wrong")
        }
    }

    let contextData = {
        user: user,
        loginUser: LoginUser,
        logoutUser: LogoutUser,
        loading: loading
    }

    useEffect(()=>{

        if ( loading && authTokens ) {
            updateToken()
        } else if (!authTokens) {
            setLoading(false)
        }

        let interval = setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, 1500000)
        
        return () => clearInterval(interval)
        
    }, [authTokens, loading])
    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}