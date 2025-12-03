import React from 'react';
import { useDispatch } from 'react-redux';
import { loadDemoPresentation } from '../../../../store/editorSlice';

export default function DemoButton() {
  const dispatch = useDispatch();

  const handleLoadDemo = () => {
    dispatch(loadDemoPresentation());
  };

  return (
    <button
      onClick={handleLoadDemo}
      className="demo-button"
      style={{
        padding: '6px 12px',
        backgroundColor: '#8b5cf6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        margin: '0 8px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        height: '32px',
        whiteSpace: 'nowrap',
      }}
      title="Загрузить демо-презентацию с примерами"
    >
      📖 Демо
    </button>
  );
}
