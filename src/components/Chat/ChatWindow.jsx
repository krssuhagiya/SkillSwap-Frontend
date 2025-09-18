import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PaperAirplaneIcon, ArrowLeftIcon, UserIcon } from '@heroicons/react/outline';
import { Loader2 } from 'lucide-react';
import ChatService from '../../services/chat.service';
import { useAuth } from '../../context/AuthContext';

const ChatWindow = ({ chat, onBack }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = useCallback(async () => {
        if (!chat) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await ChatService.getChatMessages(chat._id);
            if (result.success) {
                setMessages(result.data);
            } else {
                setError(result.error || 'Failed to fetch messages');
            }
        } catch (err) {
            setError('Failed to fetch messages');
            console.error('Error fetching messages:', err);
        } finally {
            setIsLoading(false);
        }
    }, [chat]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        const messageContent = newMessage.trim();
        setNewMessage('');
        setIsSending(true);

        try {
            const result = await ChatService.sendMessage(chat._id, messageContent);
            if (result.success) {
                // Add the new message to the local state
                setMessages(prev => [...prev, result.data]);
            } else {
                setError(result.error || 'Failed to send message');
                // Restore the message if sending failed
                setNewMessage(messageContent);
            }
        } catch (err) {
            setError('Failed to send message');
            setNewMessage(messageContent);
            console.error('Error sending message:', err);
        } finally {
            setIsSending(false);
        }
    };

    const getOtherParticipant = () => {
        if (!chat?.participants || !user) return null;
        return chat.participants.find(p => p._id !== user.id && p._id !== user._id);
    };

    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const otherParticipant = getOtherParticipant();

    if (!chat) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a chat to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onBack}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">
                            {otherParticipant?.username || 'Unknown User'}
                        </h3>
                        <p className="text-xs text-gray-500">Swap Request Chat</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchMessages}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Try again
                        </button>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No messages yet</p>
                        <p className="text-gray-500 text-sm">Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage = message.sender._id === user?.id || message.sender._id === user?._id;
                        
                        return (
                            <div
                                key={message._id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        isOwnMessage
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <p className={`text-xs mt-1 ${
                                        isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                        {formatMessageTime(message.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <PaperAirplaneIcon className="w-4 h-4" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
