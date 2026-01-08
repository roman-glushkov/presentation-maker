import React from 'react';
import ToolbarTabs from './parts/Tabs';
import ToolbarGroup from './parts/Group';
import './styles/index.css'; // Основные стили тулбара

export default function Toolbar() {
  return (
    <div className="toolbar-container">
      <ToolbarTabs />
      <ToolbarGroup />
    </div>
  );
}
