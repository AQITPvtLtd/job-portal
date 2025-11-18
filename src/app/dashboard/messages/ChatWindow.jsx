"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ArrowLeft, Send, MoreVertical, Paperclip, X, File, Download, Smile, Archive, AlertOctagon, LogOut, Inbox } from "lucide-react";
import EmojiPicker from "./EmojiPicker";

export default function ChatWindow({ uniqueId, onBack, onArchive }) {
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    const [messages, setMessages] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [conversationStatus, setConversationStatus] = useState({ is_archived: false, is_spam: false });
    const listRef = useRef(null);
    const fileInputRef = useRef(null);
    const prevMessagesLengthRef = useRef(0);
    const isUserScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);
    const optionsMenuRef = useRef(null);

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
                setShowOptionsMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const container = listRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

            if (!isAtBottom) {
                isUserScrollingRef.current = true;
            } else {
                isUserScrollingRef.current = false;
            }

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                const { scrollTop, scrollHeight, clientHeight } = container;
                const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
                if (isAtBottom) {
                    isUserScrollingRef.current = false;
                }
            }, 150);
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!uniqueId) return;

        let isMounted = true;

        async function fetchMessages() {
            try {
                const res = await fetch(`/api/messages/${uniqueId}`);
                const d = await res.json();
                if (d.ok && isMounted) {
                    setMessages(d.messages || []);
                    setUserInfo(d.userInfo || null);

                    // Check conversation status from first message
                    if (d.messages && d.messages.length > 0) {
                        const firstMsg = d.messages[0];
                        setConversationStatus({
                            is_archived: firstMsg.is_archived || false,
                            is_spam: firstMsg.is_spam || false
                        });
                    }

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
    }, [uniqueId]);

    useEffect(() => {
        if (!listRef.current) return;

        const container = listRef.current;
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

        const hasNewMessages = messages.length > prevMessagesLengthRef.current;

        if (hasNewMessages && (!isUserScrollingRef.current || isAtBottom)) {
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }

        prevMessagesLengthRef.current = messages.length;
    }, [messages]);

    useEffect(() => {
        if (!uniqueId) return;

        fetch("/api/messages/mark-read", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uniqueId }),
        }).catch(() => { });
    }, [uniqueId]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("File size should be less than 10MB");
            return;
        }

        setSelectedFile(file);

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

    const removeFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

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

    const handleEmojiSelect = (emoji) => {
        setText(prev => prev + emoji);
    };

    // const handleAction = async (action) => {
    //     try {
    //         const res = await fetch('/api/messages/actions', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ uniqueId, action })
    //         });

    //         const data = await res.json();
    //         if (data.ok) {
    //             setShowOptionsMenu(false);

    //             // Show success message
    //             const actionMessages = {
    //                 'archive': 'Conversation archived',
    //                 'spam': 'Marked as spam',
    //                 'inbox': 'Moved to inbox'
    //             };

    //             alert(actionMessages[action] || 'Action completed');

    //             // Go back to list
    //             onBack();

    //             // Refresh list
    //             if (onArchive) onArchive();
    //         } else {
    //             alert(data.message || 'Action failed');
    //         }
    //     } catch (error) {
    //         console.error('Action error:', error);
    //         alert('Failed to perform action');
    //     }
    // };

    const handleAction = async (action) => {
        try {
            const res = await fetch('/api/messages/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uniqueId, action })
            });

            const data = await res.json();
            if (data.ok) {
                setShowOptionsMenu(false);

                // Update local conversation status
                if (action === 'archive') {
                    setConversationStatus({ is_archived: true, is_spam: false });
                } else if (action === 'spam') {
                    setConversationStatus({ is_archived: false, is_spam: true });
                } else if (action === 'inbox') {
                    setConversationStatus({ is_archived: false, is_spam: false });
                }

                // Show success toast (better than alert)
                const actionMessages = {
                    'archive': 'Conversation archived successfully',
                    'spam': 'Marked as spam successfully',
                    'inbox': 'Moved to inbox successfully'
                };

                // Optional: Add toast notification instead of alert
                alert(actionMessages[action] || 'Action completed');

                // IMPORTANT: Call parent refresh and go back
                if (onArchive) onArchive();

                // Small delay to ensure state updates
                setTimeout(() => {
                    onBack();
                }, 300);
            } else {
                alert(data.message || 'Action failed');
            }
        } catch (error) {
            console.error('Action error:', error);
            alert('Failed to perform action');
        }
    };

    async function onSend(e) {
        e.preventDefault();
        if ((!text.trim() && !selectedFile) || sending) return;

        setSending(true);
        const msg = text.trim();
        setText("");

        isUserScrollingRef.current = false;

        try {
            let fileUrl = null;
            let fileName = null;
            let fileType = null;
            let fileSize = null;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('uniqueId', uniqueId);

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

                removeFile();
            }

            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uniqueId,
                    content: msg || '',
                    fileUrl,
                    fileName,
                    fileType,
                    fileSize
                }),
            });

            const res = await fetch(`/api/messages/${uniqueId}`);
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
        <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-lg shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="md:hidden p-2 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 rounded-full transition-all duration-300 transform hover:scale-110"
                        >
                            <ArrowLeft size={20} className="text-gray-700" />
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full animate-spin-slow opacity-75 blur-sm"></div>
                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-xl">
                                {userInfo?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-900 text-lg">
                                {userInfo?.name || "User"}
                            </h2>
                            {userInfo?.job_title && (
                                <p className="text-sm text-blue-600 font-semibold">
                                    {userInfo.job_title}
                                </p>
                            )}
                            {userInfo?.company_name && (
                                <p className="text-xs text-gray-500">
                                    at {userInfo.company_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Options Menu */}
                    <div className="relative" ref={optionsMenuRef}>
                        <button
                            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                            className="p-2.5 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 rounded-full transition-all duration-300"
                        >
                            <MoreVertical size={20} className="text-gray-600" />
                        </button>

                        {showOptionsMenu && (
                            <div className="relative top-full right-0 mt-2 w-56 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down">
                                {/* Move to Inbox - Show only if archived or spam */}
                                {(conversationStatus.is_archived || conversationStatus.is_spam) && (
                                    <>
                                        <button
                                            onClick={() => handleAction('inbox')}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all text-left"
                                        >
                                            <Inbox size={18} className="text-blue-600" />
                                            <span className="text-sm font-medium text-blue-700">Move to Inbox</span>
                                        </button>
                                        <div className="border-t border-gray-200"></div>
                                    </>
                                )}

                                {/* Archive - Show only if NOT archived */}
                                {!conversationStatus.is_archived && (
                                    <button
                                        onClick={() => handleAction('archive')}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all text-left"
                                    >
                                        <Archive size={18} className="text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Archive</span>
                                    </button>
                                )}

                                {/* Spam - Show only if NOT spam */}
                                {!conversationStatus.is_spam && (
                                    <button
                                        onClick={() => handleAction('spam')}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all text-left"
                                    >
                                        <AlertOctagon size={18} className="text-red-600" />
                                        <span className="text-sm font-medium text-red-700">Report Spam</span>
                                    </button>
                                )}

                                <div className="border-t border-gray-200"></div>

                                <button
                                    onClick={onBack}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all text-left"
                                >
                                    <LogOut size={18} className="text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">Exit Chat</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 relative">
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.1) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}></div>

                <div className="relative">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-full min-h-[400px]">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                            </div>
                            <p className="text-gray-600 text-sm mt-4 font-medium">Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                                    <Send size={40} className="text-white" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Start Your Conversation
                            </h3>
                            <p className="text-gray-500 text-sm max-w-sm">
                                Send the first message to {userInfo?.name || "this user"}!
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {messages.map((m, idx) => {
                                const isMine = m.sender_id === currentUserId;
                                const showDate = idx === 0 ||
                                    new Date(messages[idx - 1].created_at).toDateString() !==
                                    new Date(m.created_at).toDateString();

                                return (
                                    <div key={m.id}>
                                        {showDate && (
                                            <div className="flex justify-center my-8">
                                                <span className="px-5 py-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold rounded-full border-2 border-gray-200 shadow-lg">
                                                    {formatDate(m.created_at)}
                                                </span>
                                            </div>
                                        )}

                                        <div className={`flex ${isMine ? "justify-end" : "justify-start"} px-2`}>
                                            <div className="max-w-[75%] md:max-w-[60%] group">
                                                <div className={`p-4 rounded-3xl shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] ${isMine
                                                    ? "bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white rounded-br-md shadow-blue-500/30"
                                                    : "bg-white/90 text-gray-900 border-2 border-gray-100 rounded-bl-md shadow-gray-300/50"
                                                    }`}>
                                                    {m.file_url && (
                                                        <div className="mb-3">
                                                            {m.file_type?.startsWith('image/') ? (
                                                                <div className="relative group/image">
                                                                    <Image
                                                                        src={m.file_url}
                                                                        alt={m.file_name || "Image"}
                                                                        width={300}
                                                                        height={300}
                                                                        className="max-w-full h-auto rounded-2xl cursor-pointer ring-2 ring-white/50 shadow-xl"
                                                                        onClick={() => window.open(m.file_url, '_blank')}
                                                                    />
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            downloadFile(m.file_url, m.file_name);
                                                                        }}
                                                                        className="absolute top-3 right-3 p-2.5 bg-black/70 hover:bg-black/90 rounded-full opacity-0 group-hover/image:opacity-100 transition-all"
                                                                    >
                                                                        <Download size={16} className="text-white" />
                                                                    </button>
                                                                    <p className={`text-xs mt-2 font-medium ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                                                                        {m.file_name}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => downloadFile(m.file_url, m.file_name)}
                                                                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed ${isMine
                                                                        ? 'bg-blue-700/30 border-blue-300 hover:bg-blue-700/50'
                                                                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                                                                        } cursor-pointer group/file`}
                                                                >
                                                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isMine ? 'bg-blue-700' : 'bg-gray-200'
                                                                        }`}>
                                                                        <File size={26} className={isMine ? 'text-white' : 'text-gray-600'} />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 text-left">
                                                                        <p className={`text-sm font-semibold truncate ${isMine ? 'text-white' : 'text-gray-900'
                                                                            }`}>
                                                                            {m.file_name}
                                                                        </p>
                                                                        <p className={`text-xs font-medium ${isMine ? 'text-blue-200' : 'text-gray-500'
                                                                            }`}>
                                                                            {m.file_size ? formatFileSize(m.file_size) : 'Click to download'}
                                                                        </p>
                                                                    </div>
                                                                    <Download size={18} className={isMine ? 'text-white' : 'text-gray-600'} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {m.content && (
                                                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed font-medium">
                                                            {m.content}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className={`flex items-center gap-2 mt-2 text-xs font-medium ${isMine ? "justify-end text-gray-600" : "justify-start text-gray-600"
                                                    }`}>
                                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {new Date(m.created_at).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </span>
                                                    {isMine && (
                                                        <>
                                                            <span className="opacity-0 group-hover:opacity-100">•</span>
                                                            <span className={`px-2 py-0.5 rounded-full ${m.is_read
                                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                                                : "bg-gray-200 text-gray-600"
                                                                }`}>
                                                                {m.is_read ? "✓✓" : "✓"}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-xl relative">
                {selectedFile && (
                    <div className="mb-3 max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
                            {filePreview ? (
                                <Image src={filePreview} alt="Preview" width={64} height={64} className="w-16 h-16 object-cover rounded-xl" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                                    <File size={24} className="text-gray-600" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                                <p className="text-xs text-gray-600">{formatFileSize(selectedFile.size)}</p>
                            </div>
                            <button onClick={removeFile} className="p-2 hover:bg-red-100 rounded-full transition-all">
                                <X size={18} className="text-red-600" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 max-w-4xl mx-auto">
                    <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />

                    <button onClick={openFilePicker} className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all" title="Attach file">
                        <Paperclip size={22} />
                    </button>

                    <div className="flex-1 relative">
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
                            className="w-full dark:text-black px-5 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <Smile size={20} className="text-gray-400" />
                        </button>

                        {showEmojiPicker && (
                            <EmojiPicker
                                onSelect={handleEmojiSelect}
                                onClose={() => setShowEmojiPicker(false)}
                            />
                        )}
                    </div>

                    <button
                        onClick={onSend}
                        disabled={(!text.trim() && !selectedFile) || sending}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2 text-sm font-bold transition-all shadow-lg"
                    >
                        {sending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}