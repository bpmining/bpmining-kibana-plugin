import React from 'react';
import './counter.scss';

interface VariantCounterProps {
  variants: number;
  color: string;
}

export function VariantCounterComponent({ variants, color }: VariantCounterProps) {
  const disabledColor = '#C7C7CC';
  return (
    <div>
      <p className="number" style={{ color: disabledColor }}>
        –
      </p>
      <p className="text">Variant(s)</p>
    </div>
  );
}
