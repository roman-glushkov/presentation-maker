import React from 'react';
import { useAppSelector } from '../../../../store/hooks';
import '../styles/GridOverlay.css';

export default function GridOverlay() {
  const gridVisible = useAppSelector((state) => state.toolbar.gridVisible);

  if (!gridVisible) {
    return null;
  }

  return <div className="grid-overlay" />;
}
