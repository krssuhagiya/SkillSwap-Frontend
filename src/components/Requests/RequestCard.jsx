import { useEffect, useState } from "react";
import { CalendarIcon, CheckIcon, Loader2, MailIcon, UserIcon, XIcon } from "lucide-react";
import UserProfileService from "../../services/userProfile.service";

// Request Card Component
const RequestCard = ({ request, onAccept, onReject, isLoading }) => {
    const [requesterName, setRequesterName] = useState("Loading...");

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "accepted":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const idDetail = await UserProfileService.getProfileByUserId(request.requester._id);
                setRequesterName(
                    idDetail.data.fullname || request.requester?.fullname || request.requester?.name || "Unknown User"
                );
            } catch (err) {
                console.error(err);
                setRequesterName(request.requester?.fullname || request.requester?.name || "Unknown User");
            }
        };

        if (request?.requester?._id) {
            fetchProfile();
        }
    }, [request]);

    const isPending = request.status === "pending";

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{requesterName}</h3>
                        <p className="text-sm text-gray-600">{request.requester?.headline || "No headline"}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                </span>
            </div>

            {/* Message */}
            {request.message && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <MailIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Message:</span>
                    </div>
                    <p className="text-gray-700 text-sm">{request.message}</p>
                </div>
            )}

            {/* Date */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>Received {formatDate(request.createdAt)}</span>
            </div>

            {/* Action Buttons */}
            {isPending && (
                <div className="flex space-x-3">
                    <button
                        onClick={() => onAccept(request._id)}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
                        Accept
                    </button>
                    <button
                        onClick={() => onReject(request._id)}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XIcon className="w-4 h-4" />}
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
};

export default RequestCard;
