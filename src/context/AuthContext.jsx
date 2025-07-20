import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginAPI, logout as logoutAPI, fetchUserInfo } from "../services/auth.service";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

   useEffect(()=>{
    const intilizeAuth = async () => {
        const token = localStorage.getItem("token");
        if(token) {
            try{
                const res = await fetchUserInfo();
                setUser({...res.data,token});
            } catch (err) {
                console.log("Error fetching user info:", err.response?.data?.msg);
                localStorage.removeItem("token");
                setUser(null);
            }
        }
        setLoading(null);
    };
    intilizeAuth();
   },[]);

    const login = async (formData) => {
        const res = await loginAPI(formData);
        const token = res.data.token; 
        localStorage.setItem("token", token);

        const userInfo = await fetchUserInfo(); 
        setUser({ ...userInfo, token}); 
        return { ...userInfo, token };
    };

    const logout = async () => {
        await logoutAPI(); // call /auth/logout
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
