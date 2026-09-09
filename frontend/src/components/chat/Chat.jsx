import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../authContext.jsx";
import "./Chat.css";

const API_URL = "http://localhost:5000";

function Chat() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return undefined;

    const socket = io(API_URL, { auth: { token } });
    socket.on("message:new", (message) => {
      if (selectedUser && String(message.sender) === String(selectedUser.id)) {
        setMessages((current) => [...current, message]);
      }
    });
    socket.on("connect_error", () => setError("Chat connection failed"));
    return () => socket.disconnect();
  }, [selectedUser]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_URL}/api/chat/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Could not load users");
        setUsers(data.users);
      })
      .catch((fetchError) => setError(fetchError.message));
  }, []);

  const selectUser = async (nextUser) => {
    setSelectedUser(nextUser);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/chat/${nextUser.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Could not load messages");
      setMessages(data.messages);
    } catch (fetchError) {
      setError(fetchError.message);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!selectedUser || !text.trim()) return;
    try {
      const response = await fetch(`${API_URL}/api/chat/${selectedUser.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Could not send message");
      setMessages((current) => [...current, data.message]);
      setText("");
    } catch (sendError) {
      setError(sendError.message);
    }
  };

  if (!user)
    return (
      <main className="chat-page">
        <p>Log in to use chat.</p>
      </main>
    );

  return (
    <main className="chat-page">
      <section className="chat-shell">
        <aside className="chat-users">
          <h1>Messages</h1>
          {users.map((chatUser) => (
            <button
              type="button"
              className={
                selectedUser?.id === chatUser.id
                  ? "chat-user active"
                  : "chat-user"
              }
              key={chatUser.id}
              onClick={() => selectUser(chatUser)}
            >
              <strong>{chatUser.username}</strong>
              <span>{chatUser.email}</span>
            </button>
          ))}
        </aside>
        <section className="chat-conversation">
          {selectedUser ? (
            <>
              <header>
                <h2>{selectedUser.username}</h2>
              </header>
              <div className="chat-messages">
                {messages.map((message) => (
                  <p
                    className={
                      String(message.sender) === String(user._id)
                        ? "message mine"
                        : "message"
                    }
                    key={message._id}
                  >
                    {message.text}
                  </p>
                ))}
              </div>
              <form className="chat-form" onSubmit={sendMessage}>
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Write a message..."
                  maxLength={2000}
                />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <p className="chat-empty">Choose a user to start chatting.</p>
          )}
          {error && <p className="chat-error">{error}</p>}
        </section>
      </section>
    </main>
  );
}

export default Chat;
