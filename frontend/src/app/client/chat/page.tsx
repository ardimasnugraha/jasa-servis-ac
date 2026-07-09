"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, ArrowLeft, Sparkles, Clock, CheckCheck, Headphones } from "lucide-react";
import Link from "next/link";

type User = {
  id: string;
  fullname: string;
  email: string;
  role: string;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount?: number;
};

type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

export default function ClientChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const [activeContact, setActiveContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== "USER") {
      router.push("/dashboard");
      return;
    }
    setCurrentUser(parsed);
  }, [router]);

  // Load contacts (Admins) once currentUser is loaded
  useEffect(() => {
    if (!currentUser) return;

    const fetchContacts = () => {
      fetch(`${API_BASE_URL}/api/chat/users?userId=${currentUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setContacts(data);
            // Default to first contact if none selected
            if (data.length > 0 && !activeContact) {
              setActiveContact(data[0]);
            }
          }
          setLoadingContacts(false);
        })
        .catch((err) => {
          console.error("Error fetching contacts:", err);
          setLoadingContacts(false);
        });
    };

    fetchContacts();
    const interval = setInterval(fetchContacts, 5000);
    return () => clearInterval(interval);
  }, [currentUser, activeContact]);

  // Load messages for active contact
  useEffect(() => {
    if (!currentUser || !activeContact) return;

    const fetchMessages = (isInitial = false) => {
      if (isInitial) setLoadingMessages(true);
      fetch(`${API_BASE_URL}/api/chat/messages?userId=${currentUser.id}&otherId=${activeContact.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMessages(data);
          }
          if (isInitial) setLoadingMessages(false);
        })
        .catch((err) => {
          console.error("Error fetching messages:", err);
          if (isInitial) setLoadingMessages(false);
        });
    };

    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 3000);
    return () => clearInterval(interval);
  }, [currentUser, activeContact]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !activeContact || !newMessage.trim()) return;

    const msgText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: activeContact.id,
          message: msgText,
        }),
      });

      if (res.ok) {
        const savedMsg = await res.json();
        setMessages((prev) => [...prev, savedMsg]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 h-[calc(100vh-80px)] flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/client/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 h-10 w-10">
              <ArrowLeft className="h-4.5 w-4.5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              Chat Support <Sparkles className="h-4 w-4 text-gray-700" />
            </h1>
            <p className="text-xs text-gray-400">Hubungi customer service kami jika ada kendala.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200/60 rounded-3xl overflow-hidden shadow-sm flex h-full">
        {/* Contacts Sidebar */}
        {contacts.length > 0 && (
          <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Daftar Kontak</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {contacts.map((c) => {
                const isActive = activeContact?.id === c.id;
                const initials = (c.fullname || 'CS').split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveContact(c)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                      isActive 
                        ? "bg-white border border-gray-200/80 shadow-sm"
                        : "hover:bg-gray-100/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9 text-xs bg-gray-900 text-white font-bold">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{c.fullname}</h4>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{c.lastMessage || "Mulai percakapan..."}</p>
                      </div>
                    </div>
                    {c.unreadCount && c.unreadCount > 0 ? (
                      <span className="h-5 w-5 bg-gray-900 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                        {c.unreadCount}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {activeContact ? (
            <>
              {/* Thread Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-900/5 text-gray-900 rounded-xl flex items-center justify-center">
                    <Headphones className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-950">{activeContact.fullname}</h3>
                    <p className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      Customer Support (Online)
                    </p>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50/20">
                {loadingMessages ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                    <div className="h-6 w-6 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
                    <span className="text-[10px] font-medium">Memuat pesan...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
                    <MessageSquare className="h-8 w-8 mb-2 text-gray-300" />
                    <p className="text-xs font-bold text-gray-800">Mulai Obrolan Baru</p>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[240px]">Kirimkan pesan pertama Anda untuk terhubung dengan layanan pelanggan.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = msg.senderId === currentUser.id;
                    const time = new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed ${
                            isSelf
                              ? "bg-gray-900 text-white rounded-tr-none shadow-sm shadow-gray-900/10"
                              : "bg-white border border-gray-100 text-gray-900 rounded-tl-none shadow-sm shadow-gray-100/5"
                          }`}
                        >
                          {msg.message}
                          <div
                            className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 ${
                              isSelf ? "text-gray-300" : "text-gray-400"
                            }`}
                          >
                            <Clock className="h-2.5 w-2.5" />
                            {time}
                            {isSelf && (
                              <CheckCheck className={`h-3 w-3 ${msg.isRead ? "text-blue-400" : "text-gray-400"}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex items-center gap-2 bg-white">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan Anda di sini..."
                  required
                  disabled={sending}
                  className="flex-1 h-11 bg-gray-50/80 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-gray-900 text-xs px-4"
                />
                <Button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="h-11 w-11 p-0 bg-gray-900 hover:bg-gray-800 text-white rounded-xl flex items-center justify-center shadow-sm disabled:opacity-50 shrink-0"
                >
                  <Send className="h-4.5 w-4.5" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Headphones className="h-8 w-8 mb-2 text-gray-300" />
              <p className="text-xs font-semibold">Tidak ada kontak admin tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
