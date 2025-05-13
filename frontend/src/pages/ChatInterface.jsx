import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Swal from 'sweetalert2';



const ChatInterface = () => {
  const { id: partnerId } = useParams();
  const { user, loadingUser } = useUser();
  const navigate = useNavigate();

  const [chatHeads, setChatHeads] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const getChatId = () => [user.id || user._id, partnerId].sort().join('_');

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) return;

    axios.get('http://localhost:8080/api/chat-heads/me', { withCredentials: true })
      .then(async (res) => {
        setChatHeads(res.data);

        const partnerIds = res.data.map(chat => chat.participants.find(p => p !== userId));
        if (!partnerIds.length) return;

        const query = partnerIds.map(id => `ids=${id}`).join('&');
        const userRes = await axios.get(`http://localhost:8080/api/users/bulk?${query}`, { withCredentials: true });

        const map = {};
        userRes.data.forEach(u => { map[u._id || u.id] = u; });
        setUserMap(map);
      });
  }, [user]);

  useEffect(() => {
    let intervalId;

    const fetchMessages = async () => {
      if (!user || !partnerId) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/messages/${getChatId()}`, {
          withCredentials: true,
        });
        const sorted = res.data.sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sorted);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    if (user && partnerId) {
      fetchMessages();
      intervalId = setInterval(fetchMessages, 2000);
    }

    return () => clearInterval(intervalId);
  }, [user, partnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msgObj = {
      chatId: getChatId(),
      senderId: user.id || user._id,
      receiverId: partnerId,
      message: message.trim(),
      type: 'text',
      status: 'sent',
    };

    try {
      const res = await axios.post('http://localhost:8080/api/messages', msgObj, {
        withCredentials: true,
      });
      setMessages((prev) => [...prev, res.data]);
      setMessage('');
      scrollToBottom();
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const startNewChat = async () => {
    const { value: email } = await Swal.fire({
      title: 'Start New Chat',
      input: 'email',
      inputLabel: 'Enter Gmail of the user',
      inputPlaceholder: 'example@gmail.com',
      showCancelButton: true,
    });

    if (email) {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/users/by-email/${encodeURIComponent(email)}`,
          { withCredentials: true }
        );
        const receiver = res.data;

        if (!receiver || !(receiver._id || receiver.id)) {
          Swal.fire('User not found', '', 'error');
          return;
        }

        const receiverId = receiver._id || receiver.id;

        await axios.post(`http://localhost:8080/api/chat-heads/create`, null, {
          params: { userId2: receiverId },
          withCredentials: true,
        });

        navigate(`/chat/${receiverId}`);
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Could not create or find user.', 'error');
      }
    }
  };

  const handleDeleteChat = async (partnerId) => {
    const chatId = [user.id || user._id, partnerId].sort().join('_');

    const confirm = await Swal.fire({
      title: 'Delete Chat?',
      text: 'This will permanently delete all messages in this conversation.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/messages/${chatId}`, {
          withCredentials: true,
        });

        setChatHeads((prev) =>
          prev.filter((chat) =>
            chat.participants.find((p) => p !== user.id) !== partnerId
          )
        );

        if (partnerId === partner?.id) navigate('/chat');

        Swal.fire('Deleted!', 'Chat has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete chat.', 'error');
      }
    }
  };

  const partner = userMap[partnerId];

  if (loadingUser) return <div className="text-center mt-10">Loading...</div>;
  if (!user?.id && !user?._id) return <div className="text-center mt-10 text-red-600">Login required</div>;

  return (
    <div className="w-full h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Chats</h2>
          <button
            onClick={startNewChat}
            title="Start New Chat"
            className="text-blue-600 text-lg font-bold hover:scale-110"
          >
            +
          </button>
        </div>
        <ul>
          {chatHeads.map((chat) => {
            const uid = user.id || user._id;
            const pid = chat.participants.find(p => p !== uid);
            const partner = userMap[pid];

            return (
              <li
                key={chat._id || chat.id}
                className="px-4 py-3 hover:bg-gray-100 flex items-center justify-between transition w-full"
              >
                <div
                  onClick={() => navigate(`/chat/${pid}`)}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <Avatar src={partner?.profileImage} className="w-10 h-10">{partner?.name?.[0]}</Avatar>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">{partner?.name}</div>
                    <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
                  </div>
                </div>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(pid);
                  }}
                  className="ml-2"
                  sx={{ minWidth: 'auto' }}
                  title="Delete chat"
                >
                  <DeleteIcon fontSize="small" className="text-red-600 hover:text-red-800" />
                </IconButton>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Chat Area */}
      <section className="max-w-[100%] flex-1 flex flex-col bg-gray-50">
        <header className="h-16 px-6 flex items-center border-b border-gray-200 bg-white">
          <h2 className="text-base font-bold text-gray-800">{partner?.name || 'Select a conversation'}</h2>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar bg-gray-50">
          {messages.map((msg, index) => {
            const isSender = msg.senderId === (user.id || user._id);
            const timeStr = new Date(msg.timestamp).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            });

            return (
              <div key={msg._id || msg.id || index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[100%] px-5 py-3 rounded-2xl text-[1rem] shadow-sm leading-relaxed ${
                  isSender ? 'bg-[#072d3a] text-white' : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  <div>{msg.message}</div>
                  <div className="text-[0.7rem] text-right mt-2 text-gray-400">{timeStr}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </main>

        <footer className="h-16 flex items-center px-6 border-t border-gray-200 bg-white">
          <div className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2">
            <input
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-4 text-blue-600 font-bold hover:underline"
            >
              Send
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default ChatInterface;
