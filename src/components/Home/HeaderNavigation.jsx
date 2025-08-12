import {
    User,
    Bell,
    Settings,
} from "lucide-react";
import Logout from "../Logout";
import { useNavigate } from "react-router";

// Header Navigation Component
const HeaderNavigation = ({ user }) => {
    const navigate = useNavigate();
    const updateUserbtn = () => {
        navigate("/update-profile");
    }
    return (
        <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">Professional Network</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                3
                            </span>
                        </button>

                        <button className="p-2 text-gray-600 hover:text-gray-900">
                            <Settings className="h-5 w-5" />
                        </button>

                        <div className="flex items-center space-x-3 cursor-pointer" onClick={updateUserbtn}>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                {user?.fullname || user?.email?.split('@')[0] || 'User'}
                            </span>
                        </div>

                        <Logout />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderNavigation;