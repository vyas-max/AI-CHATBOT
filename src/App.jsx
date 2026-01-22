import React, { useEffect, useRef, useState } from "react";

const sidebarItem = [
  { label: "new chat" },
  { label: "history" },
  { label: "settings" },
];

const App = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMsg = input;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!response.ok) {
        throw new Error("Server returned error");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.reply || "No response from server" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error: Could not reach the server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#23272f] min-h-screen flex">
      {/* Sidebar */}
      <div className="w-[180px] bg-[#18181b] flex flex-col pt-8 gap-8 shadow-[2px_0_8px_rgba(0,0,0,0.12)]">
        {sidebarItem.map((item, index) => (
          <div
            key={index}
            className="text-white text-sm px-8 py-3 hover:bg-[#2a2b2e] cursor-pointer font-medium rounded-lg"
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[1000px] bg-[#18181b] rounded-[20px] shadow-[2px_0_8px_rgba(0,0,0,0.2)] flex flex-col h-[90vh]">
          {/* Header */}
          <div className="pt-6 text-center text-white font-bold text-[1.6rem]">
            CHATGPT
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-[10px] max-w-[70%] text-base ${
                    msg.from === "user"
                      ? "bg-[#00ff90] text-[#23272f]"
                      : "bg-[#343541] text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-white text-base">Thinking...</div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-[#282828] flex gap-3 bg-[#18181b] rounded-b-[20px]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-[#23272f] text-white rounded-lg px-3 py-3 text-base outline-none"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="bg-[#00ff90] text-[#23272f] rounded-lg px-8 font-bold text-base"
            >
              Send
            </button>

            <button
              onClick={() =>
                setMessages([
                  { from: "bot", text: "Hello! How can I assist you today?" },
                ])
              }
              className="bg-[#343541] text-white rounded-lg px-8 font-bold text-base"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
