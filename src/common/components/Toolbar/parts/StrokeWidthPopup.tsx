import React from 'react';

interface Props {
  onSelect: (width: number) => void;
  currentWidth?: number;
}

export default function StrokeWidthPopup({ onSelect, currentWidth = 2 }: Props) {
  const strokeWidthOptions = [1, 2, 3, 4, 5, 6, 8, 10];

  return (
    <div className="text-options-popup">
      {strokeWidthOptions.map((width) => (
        <button
          key={width}
          className="text-option-button"
          onClick={() => onSelect(width)}
          style={{
            position: 'relative',
            paddingLeft: '30px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: width,
              backgroundColor: '#000000',
              borderRadius: '1px',
            }}
          />
          {width}px {currentWidth === width ? '✓' : ''}
        </button>
      ))}
    </div>
  );
}
