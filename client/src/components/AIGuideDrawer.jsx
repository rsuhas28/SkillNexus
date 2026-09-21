import React, { useState } from 'react';
import { api } from '../services/api.js';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';

export const AIGuideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your SkillNexus AI Guide. Ask me anything about skill roadmaps, assessment preparation, career guidance, or opportunity matching.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendAIGuideMessage({
        message: userText,
        conversationContext: messages.slice(-4)
      });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'I encountered an error processing your query. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
          zIndex: 9998,
          transition: 'transform 0.2s ease'
        }}
        title="Ask SkillNexus AI Guide"
      >
        <Sparkles size={24} />
      </button>

      {/* Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '380px',
          height: '520px',
          background: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>SkillNexus AI Guide</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Active • Career Assistant</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.75rem 1rem',
                  borderRadius: m.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '0.88rem',
                  lineHeight: 1.5
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '0.6rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Ask about skills, roles, jobs..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="form-input"
              style={{ flex: 1, fontSize: '0.88rem' }}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary" style={{ padding: '0.5rem 0.9rem' }}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
