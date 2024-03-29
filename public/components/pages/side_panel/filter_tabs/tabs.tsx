import React, { Fragment, useState } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import { CycleTimeFilter } from './cycle_time_filter';

interface FilterTabsProps {
  color: string;
}

export const FilterTabs = (props: FilterTabsProps) => {
  const [value, setValue] = useState<number>(1);

  const tabs = [
    <Fragment>
      <CycleTimeFilter />
    </Fragment>,
    <Fragment>
      <br />
      <Paper sx={{ width: '100%', height: '250px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', textAlign: 'center', padding: '70px' }}>
          <p style={{ color: '#828282' }}> Coming soon! </p>
        </div>
      </Paper>
    </Fragment>,
  ];

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs
          value={value}
          onChange={(e, v) => {
            setValue(v);
          }}
          TabIndicatorProps={{ style: { background: props.color } }}
          sx={{
            '& .MuiTab-root': { fontSize: '13pt', fontWeight: '600', textTransform: 'none' },
            '& .MuiTab-root.Mui-selected': { color: '#2C2C2C' },
          }}
        >
          <Tab value={1} label="Cycle Time"></Tab>
          <Tab value={2} label="Variants" disabled></Tab>
        </Tabs>
      </Box>
      {tabs[value - 1]}
    </div>
  );
};
