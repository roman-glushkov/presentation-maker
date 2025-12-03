import React from 'react';
import './styles.css';
import ToolbarTabs from './parts/Tabs';
import ToolbarGroup from './parts/Group';
export default function Toolbar() {
  return (
    <div className="toolbar-container">
      <ToolbarTabs />
      <ToolbarGroup />
    </div>
  );
}
