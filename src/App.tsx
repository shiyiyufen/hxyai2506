import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import DebugPanel from './DebugPanel';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugState, setDebugState] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 从本地存储加载聊天历史
  useEffect(() => {
    console.log('尝试从本地存储加载聊天历史');
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // 将字符串时间戳转换回Date对象
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        console.log('成功加载聊天历史:', messagesWithDates);
        setMessages(messagesWithDates);
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    } else {
      console.log('未找到保存的聊天历史');
    }
  }, []);

  // 保存聊天历史到本地存储
  useEffect(() => {
    if (messages.length > 0) {
      console.log('保存聊天历史到本地存储:', messages);
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // 更新调试状态
  useEffect(() => {
    setDebugState({
      messagesCount: messages.length,
      currentInput: input,
      isLoading: loading,
      lastMessage: messages.length > 0 ? messages[messages.length - 1] : null,
    });
  }, [messages, input, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    console.log('🚀 [前端] 发送用户消息:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 修正后端端口为 8001
      const backendUrl = 'http://127.0.0.1:8001/chat';
      console.log('📡 [前端] 发送请求到后端:', backendUrl, { message: input });
      console.log('⏰ [前端] 请求时间:', new Date().toISOString());

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      console.log('📥 [前端] 收到响应状态:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ [前端] 收到后端响应:', data);
      console.log('⏰ [前端] 响应时间:', new Date().toISOString());
      
      const aiMessage = {
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('❌ [前端] 请求错误:', error);
      console.error('⏰ [前端] 错误时间:', new Date().toISOString());
      
      const errorMessage = {
        content: `抱歉，发生了错误：${error instanceof Error ? error.message : '未知错误'}`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      console.log('🏁 [前端] 请求完成');
    }
  };

  const clearChat = () => {
    if (window.confirm('确定要清空聊天记录吗？')) {
      setMessages([]);
      localStorage.removeItem('chatHistory');
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>AI聊天助手</h1>
        <button className="clear-button" onClick={clearChat}>清空聊天</button>
      </header>

      <div className="chat-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h2>欢迎使用AI聊天助手</h2>
            <p>请输入您的问题，AI将为您提供回答。</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-container ${message.isUser ? 'user-container' : 'ai-container'}`}
          >
            <div className={`message ${message.isUser ? 'user' : 'ai'}`}>
              <div className="message-content">{message.content}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-container ai-container">
            <div className="message ai">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="输入消息..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? '发送中...' : '发送'}
        </button>
      </div>

      {/* 添加调试面板 */}
      <DebugPanel data={debugState} title="聊天应用状态" />
    </div>
  );
}

export default App;