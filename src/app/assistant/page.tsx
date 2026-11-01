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
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0' }}>🤖 AI Assistant (Claude Tool Calling)</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Server-side tool calling with prompt injection defense &amp; role security
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Simulate Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          >
            <option value="admin">Admin (Full Control)</option>
            <option value="hod">HOD (Department Access)</option>
            <option value="worker">Worker (Block Control)</option>
            <option value="user">User / Student (Read-Only)</option>
          </select>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {quickPrompts.map((qp) => (
          <button
            key={qp}
            onClick={() => handleSend(qp)}
            disabled={loading}
            style={{
              padding: '6px 12px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              fontSize: '12px',
              color: '#334155',
            }}
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          height: '450px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              background: m.role === 'user' ? '#0f172a' : '#f8fafc',
              color: m.role === 'user' ? '#fff' : '#0f172a',
              padding: '12px 16px',
              borderRadius: '8px',
              border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {m.content}
            </div>

            {m.toolsExecuted && m.toolsExecuted.length > 0 && (
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #cbd5e1', fontSize: '11px', color: '#16a34a' }}>
                🔧 Tools Executed: <strong>{m.toolsExecuted.join(', ')}</strong>
              </div>
            )}

            <div style={{ fontSize: '10px', color: m.role === 'user' ? '#94a3b8' : '#94a3b8', marginTop: '4px', textAlign: 'right' }}>
              {m.timestamp}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px', fontSize: '13px', color: '#64748b' }}>
            Claude Assistant is evaluating tools...
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        style={{ display: 'flex', gap: '10px' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question (e.g. 'Why is the front row dim?' or 'What is happening in Block B?')..."
          style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{ padding: '0 24px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
