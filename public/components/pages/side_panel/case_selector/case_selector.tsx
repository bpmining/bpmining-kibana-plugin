import * as React from 'react';
import { Autocomplete, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootReducer } from '../../../../reducer/root_reducer';
import { NODE_COLOR_LAYER_1, NODE_COLOR_LAYER_2 } from '../../../../../common/colors';

import * as fetchCaseGraphActions from '../../../../reducer_actions/fetch_case_specific_graph';
import { calculateColorValue } from '../../../../services';

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
  return state;
};

interface StyleProps {
  hoverColor: string;
}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  listbox: {
    '& .MuiAutocomplete-option[aria-selected="true"]': {
      backgroundColor: 'white',
    },
    '& .MuiAutocomplete-option[aria-selected="true"].Mui-focused': {
      backgroundColor: ({ hoverColor }) => hoverColor,
    },
    '& .MuiAutocomplete-option[aria-selected="false"]': {
      backgroundColor: 'white',
    },
    '& .MuiAutocomplete-option[aria-selected="false"].Mui-focused': {
      backgroundColor: ({ hoverColor }) => hoverColor,
    },
  },
}));

const CaseSelector = (props: CaseSelectorProps) => {
  const [value, setValue] = useState<CaseSelectorOption | null>({ label: '' });

  useEffect(() => {}, [props.rootReducer.layer.selectedLayer]);

  const cases: CaseSelectorOption[] = [];
  const borderColor = calculateColorValue(props.rootReducer.layer.selectedLayer);
  const hoverColor =
    props.rootReducer.layer.selectedLayer === 1 ? NODE_COLOR_LAYER_1 : NODE_COLOR_LAYER_2;

  const styleProps = {
    hoverColor: hoverColor,
  };

  const classes = useStyles(styleProps);

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
      classes={classes}
      value={value}
      isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
      disablePortal
      id="combo-box"
      options={cases}
      sx={{ width: '100%' }}
      onChange={(event, value) => handleChange(event, value)}
      renderInput={(params) => (
        <TextField
          sx={{
            '& label.Mui-focused': {
              color: borderColor,
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: borderColor,
              },
            },
          }}
          {...params}
          label="Select one case"
        />
      )}
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
