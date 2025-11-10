"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ArrowLeft, Send, MoreVertical, Paperclip, X, File, Download } from "lucide-react";

export default function ChatWindow({ userId, userInfo, onBack }) {
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const listRef = useRef(null);
    const fileInputRef = useRef(null);

    // Helper function to format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Fetch messages
    useEffect(() => {
        if (!userId) return;

        let isMounted = true;

        async function fetchMessages() {
            try {
                const res = await fetch(`/api/messages/${userId}`);
                const d = await res.json();
                if (d.ok && isMounted) {
                    setMessages(d.messages || []);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }

        fetchMessages();
        const iv = setInterval(fetchMessages, 3000);

        return () => {
            isMounted = false;
            clearInterval(iv);
        };
    }, [userId]);

    // Auto scroll
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    // Mark as read
    useEffect(() => {
        if (!userId) return;

        fetch("/api/messages/mark-read", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderId: Number(userId) }),
        }).catch(() => { });
    }, [userId]);

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert("File size should be less than 10MB");
            return;
        }

        setSelectedFile(file);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    // Remove selected file
    const removeFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Open file picker
    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    // Download file function
    const downloadFile = async (fileUrl, fileName) => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download file');
        }
    };

    async function onSend(e) {
        e.preventDefault();
        if ((!text.trim() && !selectedFile) || sending) return;

        setSending(true);
        const msg = text.trim();
        setText("");

        try {
            // If file is selected, upload it first
            let fileUrl = null;
            let fileName = null;
            let fileType = null;
            let fileSize = null;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('receiverId', userId);

                const uploadRes = await fetch('/api/messages/upload', {
                    method: 'POST',
                    body: formData
                });

                const uploadData = await uploadRes.json();
                if (uploadData.ok) {
                    fileUrl = uploadData.fileUrl;
                    fileName = uploadData.fileName;
                    fileType = uploadData.fileType;
                    fileSize = uploadData.fileSize;
                }

                removeFile(); // Clear file after upload
            }

            // Send message with file info
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: Number(userId),
                    content: msg || '',
                    fileUrl,
                    fileName,
                    fileType,
                    fileSize
                }),
            });

            // Refresh messages
            const res = await fetch(`/api/messages/${userId}`);
            const d = await res.json();
            if (d.ok) setMessages(d.messages || []);
        } catch (err) {
            console.error(err);
            setText(msg);
            alert("Failed to send message");
        } finally {
            setSending(false);
        }
    }

    const formatDate = (date) => {
        const today = new Date();
        const msgDate = new Date(date);
        const isToday = msgDate.toDateString() === today.toDateString();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = msgDate.toDateString() === yesterday.toDateString();

        if (isToday) return "Today";
        if (isYesterday) return "Yesterday";
        return msgDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                            {userInfo?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900 text-sm">
                                {userInfo?.name || "User"}
                            </h2>
                            <p className="text-xs text-gray-600 capitalize">{userInfo?.role || ""}</p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-md">
                        <MoreVertical size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No messages yet</p>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {messages.map((m, idx) => {
                            const isMine = m.sender_id === currentUserId;
                            const showDate = idx === 0 ||
                                new Date(messages[idx - 1].created_at).toDateString() !==
                                new Date(m.created_at).toDateString();

                            return (
                                <div key={m.id}>
                                    {showDate && (
                                        <div className="flex justify-center mb-4">
                                            <span className="px-3 py-1 bg-white text-gray-600 text-xs rounded-full border border-gray-200">
                                                {formatDate(m.created_at)}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                        <div className="max-w-[70%]">
                                            <div className={`p-3 rounded-lg ${isMine
                                                    ? "bg-blue-600 text-white rounded-br-none"
                                                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                                                }`}>
                                                {/* File attachment */}
                                                {m.file_url && (
                                                    <div className="mb-2">
                                                        {m.file_type?.startsWith('image/') ? (
                                                            // Image with download overlay
                                                            <div className="relative group">
                                                                <Image
                                                                    src={m.file_url}
                                                                    alt={m.file_name || "Image"}
                                                                    width={300}
                                                                    height={300}
                                                                    className="max-w-full h-auto rounded-lg cursor-pointer"
                                                                    onClick={() => window.open(m.file_url, '_blank')}
                                                                />
                                                                {/* Download button overlay */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        downloadFile(m.file_url, m.file_name);
                                                                    }}
                                                                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    title="Download image"
                                                                >
                                                                    <Download size={16} className="text-white" />
                                                                </button>
                                                                {/* Image name */}
                                                                <p className={`text-xs mt-1 ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                                                                    {m.file_name}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            // Document/File download card
                                                            <button
                                                                onClick={() => downloadFile(m.file_url, m.file_name)}
                                                                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed ${isMine
                                                                        ? 'bg-blue-700/30 border-blue-400 hover:bg-blue-700/50'
                                                                        : 'bg-white border-gray-300 hover:bg-gray-50'
                                                                    } transition-all cursor-pointer group`}
                                                            >
                                                                {/* File icon */}
                                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${isMine ? 'bg-blue-800' : 'bg-gray-100'
                                                                    }`}>
                                                                    {m.file_type?.includes('pdf') ? (
                                                                        <svg className={`w-6 h-6 ${isMine ? 'text-white' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
                                                                        </svg>
                                                                    ) : m.file_type?.includes('word') || m.file_type?.includes('doc') ? (
                                                                        <svg className={`w-6 h-6 ${isMine ? 'text-white' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M4 2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" />
                                                                        </svg>
                                                                    ) : (
                                                                        <File size={24} className={isMine ? 'text-white' : 'text-gray-600'} />
                                                                    )}
                                                                </div>

                                                                {/* File info */}
                                                                <div className="flex-1 min-w-0 text-left">
                                                                    <p className={`text-sm font-medium truncate ${isMine ? 'text-white' : 'text-gray-900'}`}>
                                                                        {m.file_name}
                                                                    </p>
                                                                    <p className={`text-xs ${isMine ? 'text-blue-200' : 'text-gray-500'}`}>
                                                                        {m.file_size ? formatFileSize(m.file_size) : 'Click to download'}
                                                                    </p>
                                                                </div>

                                                                {/* Download icon */}
                                                                <div className={`p-2 rounded-full ${isMine ? 'bg-blue-800 group-hover:bg-blue-900' : 'bg-gray-100 group-hover:bg-gray-200'
                                                                    } transition-colors`}>
                                                                    <Download size={18} className={isMine ? 'text-white' : 'text-gray-600'} />
                                                                </div>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Message text */}
                                                {m.content && (
                                                    <p className="text-sm whitespace-pre-wrap break-words">
                                                        {m.content}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${isMine ? "justify-end" : "justify-start"
                                                }`}>
                                                <span>
                                                    {new Date(m.created_at).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                </span>
                                                {isMine && <span>• {m.is_read ? "Read" : "Sent"}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                {/* File Preview */}
                {selectedFile && (
                    <div className="mb-3 max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {filePreview ? (
                                <Image
                                    src={filePreview}
                                    alt="Preview"
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                    <File size={24} className="text-gray-500" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                            <button
                                onClick={removeFile}
                                className="p-1 hover:bg-gray-200 rounded-full transition"
                            >
                                <X size={18} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="flex gap-2 max-w-3xl mx-auto">
                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />

                    {/* Paperclip Button */}
                    <button
                        onClick={openFilePicker}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"
                        title="Attach file"
                    >
                        <Paperclip size={20} />
                    </button>

                    {/* Text Input */}
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                onSend(e);
                            }
                        }}
                        placeholder="Type your message..."
                        disabled={sending}
                        className="flex-1 dark:text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />

                    {/* Send Button */}
                    <button
                        onClick={onSend}
                        disabled={(!text.trim() && !selectedFile) || sending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium transition"
                    >
                        {sending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={16} />
                        )}
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}