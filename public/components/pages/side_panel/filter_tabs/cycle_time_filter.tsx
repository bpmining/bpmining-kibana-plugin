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
import { EuiSpacer } from '@elastic/eui';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as filterActions from '../../../../reducer_actions/get_cycle_times';
import { useEffect, useRef, useState } from 'react';

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

const CycleTimeFilter = (props) => {
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
    const cycleTimeGroups = props.rootReducer.filter.cycleTimeGroups;
    cycleTimeGroups.forEach((item, i: number) => {
      const id = i + 1;
      const interval = item.interval;
      const casesInInterval = item.cases;
      dataRows.push(createData(id, interval, casesInInterval.length));
    });
    setRows(dataRows);
  };

  const selectRow = (row: Data) => {
    const id = row.id;
    const cycleTimeGroups = props.rootReducer.filter.cycleTimeGroups;
    const selectedCases = cycleTimeGroups[id - 1].cases;
    const { selectCycleTimeCases } = props;
    selectCycleTimeCases(selectedCases);
  };

  return (
    <div className="cycle-time-table">
      <EuiSpacer />
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead style={{ fontWeight: 500 }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    onClick={() => selectRow(row)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
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
    },
    dispatch
  );
};

const connectedCycleTimeFilter = connect(mapStateToProps, mapDispatchToProps)(CycleTimeFilter);
export { connectedCycleTimeFilter as CycleTimeFilter };
