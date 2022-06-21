import * as React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import * as fetchCaseGraphActions from '../../../../reducer_actions/fetch_case_specific_graph';
import { connect } from 'react-redux';
import { useState } from 'react';
import { RootReducer } from '../../../../reducer/root_reducer';

interface CaseSelectorState {
  rootReducer: RootReducer;
}

interface CaseSelectorProps {
  caseIds: string[];
  metadata: any;
  unselectCaseAction: Function;
  fetchCaseGraphAction: Function;
}

interface CaseSelectorOption {
  label: string;
}
const mapStateToProps = (state: CaseSelectorState) => {
  console.log(state);
  return state;
};

const CaseSelector = (props: CaseSelectorProps) => {
  const [value, setValue] = useState<CaseSelectorOption | null>({ label: '' });

  const cases: CaseSelectorOption[] = [];

  for (let i = 0; i < props.caseIds.length; i++) {
    cases.push({ label: props.caseIds[i] });
  }

  function handleChange(event: any, value: CaseSelectorOption | null) {
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
      isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
      disablePortal
      id="combo-box-demo"
      options={cases}
      sx={{ width: 300 }}
      onChange={(event, value) => handleChange(event, value)}
      renderInput={(params) => <TextField {...params} label="Select one case" />}
    />
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
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
