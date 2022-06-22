import * as React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootReducer } from '../../../../reducer/root_reducer';

import * as fetchCaseGraphActions from '../../../../reducer_actions/fetch_case_specific_graph';

interface CaseSelectorState {
  rootReducer: RootReducer;
}

interface CaseSelectorProps {
  caseIds: string[];
  rootReducer: RootReducer;
  selectCaseAction: Function;
  unselectCaseAction: Function;
}

export interface CaseSelectorOption {
  label: string;
}
const mapStateToProps = (state: CaseSelectorState) => {
  console.log(state);
  return state;
};

const CaseSelector = (props: CaseSelectorProps) => {
  const [value, setValue] = useState<CaseSelectorOption | null>({ label: '' });

  useEffect(() => {}, [props]);

  const cases: CaseSelectorOption[] = [];

  for (let i = 0; i < props.caseIds.length; i++) {
    cases.push({ label: props.caseIds[i] });
  }

  function handleChange(event: any, value: CaseSelectorOption | null) {
    setValue(value);
    if (value !== null) {
      const { selectCaseAction } = props;
      selectCaseAction(value);
    } else {
      const { unselectCaseAction } = props;
      unselectCaseAction();
    }
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
      unselectCaseAction: fetchCaseGraphActions.unselectCaseAction,
      selectCaseAction: fetchCaseGraphActions.selectCaseAction,
    },
    dispatch
  );
};

const connectedCaseSelector = connect(mapStateToProps, mapDispatchToProps)(CaseSelector);
export { connectedCaseSelector as CaseSelector };
