import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import Logout from "../components/Logout";

const Home = () => {
  const { user, loading } = useAuth();
  const [decodedUser, setDecodedUser] = useState(null);

  useEffect(() => {
    if (user?.token) {
      try {
        const decoded = jwtDecode(user.token);
        console.log("Decoded token =>", decoded);
        setDecodedUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Home Page
        </h1>

        {decodedUser ? (
          <div className="mt-6 space-y-4 text-gray-700">
            <h3 className="text-xl font-semibold text-blue-600">
              User Info from Token
            </h3>
            <p>
              <span className="font-medium">User ID:</span> {decodedUser.id}
            </p>
            <p>
              <span className="font-medium">Issued At:</span>{" "}
              {new Date(decodedUser.iat * 1000).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Expires At:</span>{" "}
              {new Date(decodedUser.exp * 1000).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 mt-6">No token data available.</p>
        )}

        <div className="mt-8">
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Home;
