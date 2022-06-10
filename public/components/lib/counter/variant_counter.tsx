import React from 'react';
import './counter.scss';

interface VariantCounterProps {
  variants: number;
  color: string;
}

export function VariantCounterComponent({ variants, color }: VariantCounterProps) {
  return (
    <div>
      <p className="number" style={{ color: color }}>
        {variants}
      </p>
      <p className="text">Variant(s)</p>
    </div>
  );
}
