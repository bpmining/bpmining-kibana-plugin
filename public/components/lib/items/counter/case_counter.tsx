import React from 'react';
import './counter.scss';

interface Props {
    cases: number;
}

export function CaseCounterComponent({ cases }: Props) {
  
  return (
      <div>
          <p className='number'>{cases}</p>
          <p className='text'>Case(s)</p>
      </div>
  );
}