'use client';

import { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  toolsExecuted?: string[];
  timestamp: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your Eco Class AI Energy Supervisor. I monitor occupancy, daylight harvesting, fan cooling, and electrical circuits across campus. How can I assist you?',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState<'admin' | 'hod' | 'worker' | 'user'>('worker');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "What's happening in Block B?",
    'How many students are in 204?',
    'Why is the front row dim?',
    'Where should brightness be higher?',
    'Turn off devices in empty rooms',
  ];

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role,
          'x-user-email': `${role}@ecoclass.campus.edu`,
        },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.response || 'No response received from assistant.',
        toolsExecuted: data.tools_executed || [],
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error connecting to assistant: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '40px auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="eyebrow-badge" style={{ marginBottom: '8px' }}>
            <span>CONVERSATIONAL ENERGY AGENT</span>
          </div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 200, letterSpacing: '-0.025em', color: '#fff' }}>
            🤖 AI Assistant (Claude Tool Calling)
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', fontWeight: 300 }}>
            Server-side tool calling with prompt injection defense &amp; role security
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)' }}>Simulate Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#080814',
              color: '#fff',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <option value="admin">Admin (Full Control)</option>
            <option value="hod">HOD (Department Access)</option>
            <option value="worker">Worker (Block Control)</option>
            <option value="user">User / Student (Read-Only)</option>
          </select>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {quickPrompts.map((qp) => (
          <button
            key={qp}
            onClick={() => handleSend(qp)}
            disabled={loading}
            className="strata-btn-pill"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="strata-card-wrapper" style={{ marginBottom: '20px' }}>
        <div className="strata-card-aura" />
        <div
          className="strata-card-inner"
          style={{
            padding: '24px',
            height: '480px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                background: m.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)' : 'rgba(255, 255, 255, 0.03)',
                color: '#ffffff',
                padding: '14px 18px',
                borderRadius: '14px',
                border: m.role === 'user' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: m.role === 'user' ? '0 4px 16px rgba(124, 58, 237, 0.25)' : 'none',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 300, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>

              {m.toolsExecuted && m.toolsExecuted.length > 0 && (
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11px', color: '#c4b5fd', fontFamily: 'var(--font-mono)' }}>
                  🔧 Tools Executed: <strong style={{ fontWeight: 500 }}>{m.toolsExecuted.join(', ')}</strong>
                </div>
              )}

              <div style={{ fontSize: '10px', color: m.role === 'user' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.35)', marginTop: '6px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                {m.timestamp}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '12px 18px',
                background: 'rgba(124, 58, 237, 0.12)',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#c4b5fd',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Claude Assistant is evaluating tools...
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        style={{ display: 'flex', gap: '12px' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question (e.g. 'Why is the front row dim?' or 'What is happening in Block B?')..."
          className="strata-input"
          style={{ flex: 1, padding: '14px 18px', borderRadius: '12px', fontSize: '13px' }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="strata-btn-primary"
          style={{ padding: '0 28px', borderRadius: '12px', opacity: loading || !input.trim() ? 0.5 : 1 }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
