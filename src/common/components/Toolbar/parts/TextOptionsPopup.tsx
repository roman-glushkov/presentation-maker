import React from 'react';

export interface Props {
  options: string[];
  onSelect: (key: string) => void;
}

export default function TextOptionsPopup({ options, onSelect }: Props) {
  return (
    <div className="text-options-popup">
      {options.map((opt) => (
        <button key={opt} onClick={() => onSelect(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}
