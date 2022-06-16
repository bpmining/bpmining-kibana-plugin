import * as React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { bindActionCreators } from 'redux';
import * as fetchCaseGraphActions from '../../../../reducer_actions/fetch_case_specific_graph';
import { connect } from 'react-redux';
import { useState } from 'react';

interface CaseSelectorProps {
  caseIds: string[];
}

const mapStateToProps = (state) => {
  return state;
};

const CaseSelector = (props) => {
  const [value, setValue] = useState('');

  const cases: any = [];
  for (let i = 0; i < props.caseIds.length; i++) {
    cases.push({ label: props.caseIds[i] });
  }

  function handleChange(event: any, value: any) {
    setValue(value);
    if (value === null) {
      const { unselectCaseAction } = props;
      unselectCaseAction();
      return;
    }
    const { fetchCaseGraphAction } = props;
    fetchCaseGraphAction(props.metadata, value.label);
  }

  return (
    <Autocomplete
      value={value}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      disablePortal
      id="combo-box-demo"
      options={cases}
      sx={{ width: 300 }}
      onChange={(event, value) => handleChange(event, value)}
      renderInput={(params) => <TextField {...params} label="Select one case" />}
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchCaseGraphAction: fetchCaseGraphActions.fetchCaseGraph,
      unselectCaseAction: fetchCaseGraphActions.unselectCaseAction,
    },
    dispatch
  );
};

const connectedCaseSelector = connect(mapStateToProps, mapDispatchToProps)(CaseSelector);
export { connectedCaseSelector as CaseSelector };
