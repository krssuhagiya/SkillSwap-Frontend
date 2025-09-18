import React, { useState, useEffect, useCallback } from 'react';
import { ChatAlt2Icon, UserIcon, ClockIcon } from '@heroicons/react/outline';
import { Loader2 } from 'lucide-react';
import ChatService from '../../services/chat.service';
import { useAuth } from '../../context/AuthContext';

const ChatList = ({ onSelectChat, selectedChatId }) => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchChats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await ChatService.getUserChats();
            if (result.success) {
                setChats(result.data);
            } else {
                setError(result.error || 'Failed to fetch chats');
            }
        } catch (err) {
            setError('Failed to fetch chats');
            console.error('Error fetching chats:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    const formatLastMessageTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (diffInHours < 168) { // 7 days
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getOtherParticipant = (chat) => {
        if (!chat.participants || !user) return null;
        return chat.participants.find(p => p._id !== user.id && p._id !== user._id);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={fetchChats}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className="text-center py-8">
                <ChatAlt2Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active chats</p>
                <p className="text-gray-500 text-sm">Start a conversation by accepting a swap request</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {chats.map((chat) => {
                const otherParticipant = getOtherParticipant(chat);
                const isSelected = selectedChatId === chat._id;

                return (
                    <div
                        key={chat._id}
                        onClick={() => onSelectChat(chat)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                                ? 'bg-blue-50 border-2 border-blue-200'
                                : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {otherParticipant?.username || 'Unknown User'}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {formatLastMessageTime(chat.lastMessageAt)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                    Swap Request Chat
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatList;
