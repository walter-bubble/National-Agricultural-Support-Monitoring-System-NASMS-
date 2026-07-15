import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Layout } from "@/components/Layout";
import { getBotReply } from "@/data/chat";
import {sendMessage, getMessages, getUser} from "@/services/api";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "NASMS – Chat Support" }] }),
  component: ChatPage,
});

interface ChatMessage {
  role: "bot" | "user";
  /** Trusted HTML produced by our local bot dictionary only. */
  html: string;
}

const QUICK_TOPICS: { label: string; msg: string }[] = [
  { label: "🌾 Farmer Registration", msg: "How do I register as a farmer?" },
  { label: "💰 Loan Applications", msg: "How do I apply for a government loan?" },
  { label: "🌱 Farm Inputs", msg: "How do I request farm inputs?" },
  { label: "🌤 Weather Forecasts", msg: "How do I check the weather forecast?" },
  { label: "🏪 Market Access", msg: "How do I connect with buyers?" },
  { label: "📋 Loan Repayment", msg: "What is my loan repayment status?" },
];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", html: "Hello! Welcome to the NASMS Support Centre. I'm here to help you with any questions about our agricultural services. How can I assist you today?" },
    { role: "bot", html: "You can ask me about:<br />🌾 Farmer registration &nbsp;&nbsp; 💰 Loan applications<br />🌱 Farm inputs &nbsp;&nbsp; 📊 Production analytics<br />🌤 Weather advisories &nbsp;&nbsp; 🏪 Marketplace" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (areaRef.current) areaRef.current.scrollTop = areaRef.current.scrollHeight;
  }, [messages, typing]);

 async function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [...prev, { role: "user", html: escapeHtml(t) }]);
    setInput("");
    setTyping(true);

    const currentUser = getUser() ?? "farmer";

    try {
        // Try backend first
        const response = await sendMessage(currentUser, "support", t);
        setTyping(false);
        setMessages((prev) => [...prev, {
            role: "bot",
            html: escapeHtml(response.content ?? "Thank you for your message.")
        }]);
    } catch {
        // Fall back to local bot if backend unavailable
        window.setTimeout(() => {
            setTyping(false);
            setMessages((prev) => [...prev, { role: "bot", html: getBotReply(t) }]);
        }, 900);
    }
}

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send(input);
  }

  return (
    <Layout hideFooter>
      <main className="chat-page">
        <div className="chat-container">
          <aside className="chat-sidebar">
            <h3>Quick Topics</h3>
            {QUICK_TOPICS.map((t) => (
              <button key={t.label} className="quick-btn" onClick={() => send(t.msg)}>
                {t.label}
              </button>
            ))}
            <div className="contact-box">
              <h4>Direct Contact</h4>
              <p>📞 Toll-Free: <strong>0800 720 093</strong></p>
              <p>✉️ info@nasms.go.ke</p>
              <p>🕗 Mon–Fri: 8AM – 5PM</p>
            </div>
          </aside>

          <div className="chat-main">
            <div className="chat-head">
              <div className="agent-avatar">🤖</div>
              <div>
                <h2>NASMS Support Agent</h2>
                <p>
                  Government Agricultural Helpdesk · <span className="online-dot" /> Online
                </p>
              </div>
            </div>

            <div className="messages-area" ref={areaRef}>
              {messages.map((m, i) => (
                <div key={i} className={`msg-row ${m.role}`}>
                  <div className="msg-avatar">{m.role === "bot" ? "🤖" : "👨‍🌾"}</div>
                  <div
                    className={`msg-bubble ${m.role === "bot" ? "bot-bubble" : "user-bubble"}`}
                    dangerouslySetInnerHTML={{ __html: m.html }}
                  />
                </div>
              ))}
            </div>

            {typing && (
              <div className="typing-indicator" style={{ display: "flex" }}>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}

            <div className="chat-input-area">
              <input
                type="text" placeholder="Type your message…" aria-label="Chat message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button onClick={() => send(input)} aria-label="Send">
                <i className="fa fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
