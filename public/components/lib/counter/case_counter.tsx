import React from 'react';
import './counter.scss';

export interface CaseCounterProps {
  cases: number;
  color: string;
}

export function CaseCounterComponent({ cases, color }: CaseCounterProps) {
  return (
    <div>
      <p className="number" style={{ color: color }}>
        {cases}
      </p>
      <p className="text">Case(s)</p>
    </div>
  );
}
