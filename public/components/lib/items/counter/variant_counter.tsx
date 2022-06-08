import React from 'react';
import './counter.scss';

interface Props {
    variants: number;
}

export function VariantCounterComponent({ variants }: Props) {
  
  return (
      <div>
          <p className='number'>{variants}</p>
          <p className='text'>Variant(s)</p>
      </div>
  );
}