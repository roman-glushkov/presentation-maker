import React from 'react';
import './styles.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { changeTitle } from '../../../store/editorSlice';

export default function ProjectTitle() {
  const dispatch = useAppDispatch();

  const title = useAppSelector((state) => state.editor.presentation.title);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeTitle(e.target.value));
  };

  const handleCommit = () => {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="presentation-info top">
      <input
        value={title}
        onChange={handleChange}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        placeholder="Введите название презентации"
      />
    </div>
  );
}
