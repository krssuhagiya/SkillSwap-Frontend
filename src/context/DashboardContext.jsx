import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { jwtDecode } from 'jwt-decode';
import UserProfileService from '../services/userProfile.service';


const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider  = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [decodedUser, setDecodedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.token) {
            const fetchUserData = async () => {
                setLoading(true);
                setError(null);
                try {
                    const decoded = jwtDecode(user.token);
                    
                    const userData = await UserProfileService.getProfileByUserId(decoded.id); 
                    setDecodedUser(userData.data);
                } catch (err) {
                    setError("Failed to load user data");
                    console.error("Invalid token or API error", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }
    }, [user]);

    const userData = useMemo(() => {
        return decodedUser || user || {};
    }, [decodedUser, user]);

    const value = {
        user: userData,
        loading: authLoading || loading,
        error,
        refreshUserData: () => {
            // Trigger re-fetch if needed
            if (user?.token) {
                // Re-fetch logic here
            }
        }
    };

    return (
         <DashboardContext.Provider value={value}>
            {children}
         </DashboardContext.Provider>
    )
}
