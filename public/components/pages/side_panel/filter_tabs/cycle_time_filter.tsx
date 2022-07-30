import * as React from 'react';
import './cycle_time_filter.scss';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as filterActions from '../../../../reducer_actions/get_cycle_times';
import { useEffect, useState } from 'react';
import { RootReducer } from '../../../../reducer/root_reducer';
import { NODE_COLOR_LAYER_1, NODE_COLOR_LAYER_2 } from '../../../../../common/colors';
import { CycleTimeGroupItem } from 'plugins/bpmining-kibana-plugin/server/filter_calculation/calculate_cycle_time_buckets';
import * as fetchCaseGraphActions from '../../../../reducer_actions/fetch_case_specific_graph';

interface CycleTimeFilterProps {
  rootReducer: RootReducer;
  selectCycleTimeCases: Function;
  getCycleTimeGroups: Function;
  selectCaseAction: Function;
}

interface Column {
  id: 'id' | 'cycletime' | 'hash';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'Id', minWidth: 30 },
  { id: 'cycletime', label: 'Cycle Time (interv.)', minWidth: 100 },
  {
    id: 'hash',
    label: '#',
    minWidth: 30,
    align: 'right',
  },
];

interface Data {
  id: number;
  cycletime: string;
  hash: number;
}

function createData(id: number, cycletime: string, hash: number): Data {
  return { id, cycletime, hash };
}

const mapStateToProps = (state: any) => {
  return state;
};

const CycleTimeFilter = (props: CycleTimeFilterProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<Data[]>([]);

  useEffect(() => {
    formatRows();
  }, [props.rootReducer.filter.cycleTimeGroups]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const formatRows = () => {
    const dataRows: Data[] = [];
    const cycleTimeGroups: CycleTimeGroupItem[] = props.rootReducer.filter.cycleTimeGroups;
    cycleTimeGroups.forEach((item, i: number) => {
      const id = item.id;
      const interval = item.interval;
      const casesInInterval = item.cases;
      dataRows.push(createData(id, interval, casesInInterval.length));
    });
    setRows(dataRows);
  };

  const selectRow = (row: Data) => {
    const id = row.id;
    const cycleTimeGroups = props.rootReducer.filter.cycleTimeGroups;
    const selectedCases = cycleTimeGroups[id - 1];

    if (selectedCases.cases.length === 1) {
      const { selectCaseAction } = props;
      selectCaseAction({ label: selectedCases.cases[0].caseId });
    } else {
      const { selectCycleTimeCases } = props;
      selectCycleTimeCases(selectedCases);
    }
  };

  const hoverColor =
    props.rootReducer.layer.selectedLayer === 1 ? NODE_COLOR_LAYER_1 : NODE_COLOR_LAYER_2;

  return (
    <div className="cycle-time-table">
      <Paper sx={{ width: '100%', overflowX: 'auto', marginTop: '22px' }}>
        <TableContainer>
          <Table>
            <TableHead style={{ fontWeight: 500 }}>
              <TableRow>
                {columns.map((column, i) =>
                  columns[i + 1] ? (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        borderRightStyle: 'solid',
                        borderRightColor: '#e0e0e0',
                        borderRightWidth: '1pt',
                        fontWeight: '600',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ) : (
                    <TableCell key={column.id} align={column.align}>
                      {column.label}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    onClick={() => selectRow(row)}
                    sx={{ '&:hover': { backgroundColor: hoverColor } }}
                  >
                    {columns.map((column, i) => {
                      const value = row[column.id];
                      let cell = (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            borderRightStyle: 'solid',
                            borderRightColor: '#e0e0e0',
                            borderRightWidth: '1pt',
                            borderBottom: 'none',
                            padding: '5px 16px',
                          }}
                        >
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );

                      if (columns[i + 1] === undefined) {
                        cell = (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              borderBottom: 'none',
                              padding: '10px 16px',
                            }}
                          >
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      }
                      return cell;
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={rows.length}
          rowsPerPage={5}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      getCycleTimeGroups: filterActions.getCycleTimeData,
      selectCycleTimeCases: filterActions.selectCaseAction,
      selectCaseAction: fetchCaseGraphActions.selectCaseAction,
    },
    dispatch
  );
};

const connectedCycleTimeFilter = connect(mapStateToProps, mapDispatchToProps)(CycleTimeFilter);
export { connectedCycleTimeFilter as CycleTimeFilter };
