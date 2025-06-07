import React, { useState } from 'react';

interface DebugPanelProps {
  data: any;
  title?: string;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ data, title = '调试面板' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 只在开发环境中显示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '10px',
        maxWidth: '400px',
        maxHeight: isOpen ? '500px' : '40px',
        overflow: 'auto',
        transition: 'max-height 0.3s ease-in-out',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: isOpen ? '10px' : '0'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span>{isOpen ? '▼' : '▲'}</span>
      </div>

      {isOpen && (
        <pre style={{ margin: 0, fontSize: '12px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DebugPanel;