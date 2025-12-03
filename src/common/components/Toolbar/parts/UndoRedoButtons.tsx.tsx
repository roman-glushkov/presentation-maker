import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { undo, redo } from '../../../../store/editorSlice';

export default function UndoRedoButtons() {
  const dispatch = useAppDispatch();

  const canUndo = useAppSelector((state) => state.editor.history.past.length > 0);
  const canRedo = useAppSelector((state) => state.editor.history.future.length > 0);

  const baseStyle = {
    padding: '6px 12px',
    backgroundColor: '#6b7280',
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
  } as React.CSSProperties;

  return (
    <>
      <button
        onClick={() => canUndo && dispatch(undo())}
        disabled={!canUndo}
        style={{
          ...baseStyle,
          backgroundColor: canUndo ? '#6b7280' : '#9ca3af',
          cursor: canUndo ? 'pointer' : 'default',
        }}
        title="Отменить (Undo)"
      >
        ↶ Undo
      </button>

      <button
        onClick={() => canRedo && dispatch(redo())}
        disabled={!canRedo}
        style={{
          ...baseStyle,
          backgroundColor: canRedo ? '#6b7280' : '#9ca3af',
          cursor: canRedo ? 'pointer' : 'default',
        }}
        title="Вернуть (Redo)"
      >
        ↷ Redo
      </button>
    </>
  );
}
