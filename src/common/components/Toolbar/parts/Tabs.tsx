import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setActiveGroup } from '../../../../store/toolbarSlice';
import { TAB_TITLES } from '../constants/config';
import DemoButton from './DemoButton';
import UndoRedoButtons from './UndoRedoButtons.tsx';

export default function ToolbarTabs() {
  const dispatch = useAppDispatch();
  const activeGroup = useAppSelector((state) => state.toolbar.activeGroup);

  const handleTabClick = (key: string) => {
    dispatch(setActiveGroup(key));
  };

  return (
    <div className="toolbar-tabs">
      <DemoButton />
      <UndoRedoButtons />

      {TAB_TITLES.map(({ key, name }) => (
        <button
          key={key}
          className={`toolbar-tab ${activeGroup === key ? 'active' : ''}`}
          onClick={() => handleTabClick(key)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
