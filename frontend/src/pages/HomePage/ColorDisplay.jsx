import React from 'react';

const aaa = () => {
  const colors = [
    { label: 'Background', hsl: 'hsl(222.2, 84%, 4.9%)' },
    { label: 'Foreground', hsl: 'hsl(210, 40%, 98%)' },
    { label: 'Card', hsl: 'hsl(222.2, 84%, 4.9%)' },
    { label: 'Card Foreground', hsl: 'hsl(210, 40%, 98%)' },
    { label: 'Popover', hsl: 'hsl(222.2, 84%, 4.9%)' },
    { label: 'Popover Foreground', hsl: 'hsl(210, 40%, 98%)' },
    { label: 'Primary', hsl: 'hsl(210, 40%, 98%)' },
    { label: 'Primary Foreground', hsl: 'hsl(222.2, 47.4%, 11.2%)' },
    { label: 'Secondary', hsl: 'hsl(217.2, 32.6%, 17.5%)' },
    { label: 'Secondary Foreground', hsl: 'hsl(210, 40%, 98%)' },
    { label: 'Muted', hsl: 'hsl(217.2, 32.6%, 17.5%)' },
    { label: 'Muted Foreground', hsl: 'hsl(215, 20.2%, 65.1%)' },
    { label: 'Accent', hsl: 'hsl(217.2, 32.6%, 17.5%)' },
    { label: 'Accent Foreground', hsl: 'hsl(210, 40%, 98%)' },
    { label: 'Destructive', hsl: 'hsl(0, 62.8%, 30.6%)' },
    { label: 'Destructive Foreground', hsl: 'hsl(210, 40%, 98%)' },
    { label: 'Border', hsl: 'hsl(217.2, 32.6%, 17.5%)' },
    { label: 'Input', hsl: 'hsl(217.2, 32.6%, 17.5%)' },
    { label: 'Ring', hsl: 'hsl(212.7, 26.8%, 83.9%)' },
    { label: 'Chart 1', hsl: 'hsl(220, 70%, 50%)' },
    { label: 'Chart 2', hsl: 'hsl(160, 60%, 45%)' },
    { label: 'Chart 3', hsl: 'hsl(30, 80%, 55%)' },
    { label: 'Chart 4', hsl: 'hsl(280, 65%, 60%)' },
    { label: 'Chart 5', hsl: 'hsl(340, 75%, 55%)' },
  ];
  return (
    <>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              backgroundColor: color.hsl,
              width: '100px',
              height: '100px',
              margin: '10px',
              textAlign: 'center',
              lineHeight: '100px',
              fontSize: '12px',
              color: '#fff',
              borderRadius: '5px',
            }}
          >
            {color.label}
          </div>
        ))}
      </div>
    </>
  );
};

export default aaa;
