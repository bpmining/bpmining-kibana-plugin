import * as React from 'react';
import { Autocomplete, TextField } from '@mui/material';

export function CaseSelector() {
  const cases = [
    {label: 'Test'},
    {label: 'Noch ein Test'}
  ]
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={cases}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
}