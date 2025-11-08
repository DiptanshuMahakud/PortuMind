"use client";
import { useEffect, useRef, useState } from "react";
import axios from "@/utils/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AnalystChatBox({ symbol, investor, stockData }) {
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      content: `Hello Analyst — I’m your AI co-pilot for ${symbol}.  
Let’s discuss patterns, technical indicators, or investor sentiment shifts.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const [typingMessage, setTypingMessage] = useState(null);
  const textRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage]);

  const lastNHistory = (n = 10) =>
    (stockData?.history || []).slice(-n).map((d) => ({
      date: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume ?? 0,
    }));

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        symbol,
        investorId: investor?._id,
        latestData: lastNHistory(10),
        messages: [...messages, userMsg],
        role: "analyst",
      };

      const res = await axios.post("/api/ai/chat", payload);
      const reply =
        res.data?.reply ||
        (Array.isArray(res.data?.messages)
          ? res.data.messages.map((m) => m.content).join("\n")
          : "No AI response received.");

      // Typing simulation
      let index = 0;
      setTypingMessage("");
      const typingInterval = setInterval(() => {
        setTypingMessage((prev) => prev + reply.charAt(index));
        index++;
        if (index >= reply.length) {
          clearInterval(typingInterval);
          setMessages((m) => [...m, { role: "assistant", content: reply }]);
          setTypingMessage(null);
        }
      }, 15);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Failed to fetch response. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6 flex flex-col h-[520px] lg:h-[720px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            AI Analysis Chat — {symbol}
          </h3>
          {investor ? (
            <p className="text-xs text-gray-500">
              Analyzing for:{" "}
              <span className="font-medium text-blue-600">
                {investor.name}
              </span>{" "}
              ({investor.email})
            </p>
          ) : (
            <p className="text-xs text-gray-500">Investor info unavailable</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-scroll pr-2 space-y-2 min-h-0">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[78%] ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ node, ...props }) => (
                      <strong
                        className="font-semibold text-blue-700"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc ml-5 mt-1" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="my-0.5" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-2 leading-relaxed" {...props} />
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {typingMessage && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-800 max-w-[78%]">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {typingMessage}
                </ReactMarkdown>
              </div>
              <span className="animate-pulse text-gray-500 ml-1">▍</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="mt-3 flex items-end gap-2 pt-3 border-t"
      >
        <textarea
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none max-h-32 overflow-y-auto"
          placeholder={`Discuss ${symbol} trends, indicators, or investor risk factors...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          ref={textRef}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 h-fit"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
