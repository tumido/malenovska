import React from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';

import { Container, Paper, Grid, Table, TableBody, TableRow, TableCell, TablePagination, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { EnhancedTableHead, Markdown } from 'components';
import { stableSort, getSorting } from 'utilities/sorting';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      padding: 0
    },
    paddingTop: 20
  },
  paper: {
    padding: 16
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}));

const headers = [
  { id: 'race', label: 'Strana' },
  { id: 'nickName', label: 'Přezdívka' },
  { id: 'firstName', label: 'Jméno' },
  { id: 'lastName', label: 'Příjmení' },
  { id: 'group', label: 'Skupina' }
];

const List = ({ event }) => {
  const classes = useStyles();
  const [ order, setOrder ] = React.useState('asc');
  const [ orderBy, setOrderBy ] = React.useState('race');
  const [ page, setPage ] = React.useState(0);
  const [ rowsPerPage, setRowsPerPage ] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useFirestoreConnect(() => [
    {
      collection: 'races',
      where: [ 'event', '==', event.id ],
      storeAs: `${event.id}_races`
    },
    {
      collection: 'participants',
      where: [ 'event', '==', event.id ],
      storeAs: `${event.id}_participants`
    }
  ]);

  const races = useSelector(({ firestore }) => firestore.ordered[`${event.id}_races`]);
  const participants = useSelector(({ firestore }) => firestore.ordered[`${event.id}_participants`]);

  if (!isLoaded(participants) || !isLoaded(races)) {return 'loading';}

  const raceMapping = races.reduce((o, k) => ({ ...o, [k.id]: k.name }), {});
  const rows = participants.map(p => ({ ...p, race: raceMapping[p.race] }));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Container className={ classes.root }>
      <Paper className={ classes.paper }>
        <Grid container direction='column' wrap='nowrap' spacing={ 2 } >
          <Grid item>
            <Typography variant='h4' component='h2'>Přihlášení účastníci</Typography>
            <Markdown content={ event.registrationList } />
          </Grid>
          <Grid item className={ classes.tableWrapper }>
            <Table className={ classes.table }>
              <EnhancedTableHead
                headers={ headers }
                classes={ classes }
                order={ order }
                orderBy={ orderBy }
                onRequestSort={ handleRequestSort }
              />
              <TableBody>
                { stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow key={ index }>
                      <TableCell>{ row.race }</TableCell>
                      <TableCell>{ row.nickName }</TableCell>
                      <TableCell>{ row.firstName }</TableCell>
                      <TableCell>{ row.lastName }</TableCell>
                      <TableCell>{ row.group }</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={ { height: 49 * emptyRows } }>
                    <TableCell colSpan={ 6 } />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={ [ 5, 10, 25 ] }
              component="div"
              count={ rows.length }
              rowsPerPage={ rowsPerPage }
              page={ page }
              backIconButtonProps={ {
                'aria-label': 'previous page'
              } }
              nextIconButtonProps={ {
                'aria-label': 'next page'
              } }
              onChangePage={ handleChangePage }
              onChangeRowsPerPage={ handleChangeRowsPerPage }
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

List.propTypes = {
  event: PropTypes.object.isRequired
};

export default connect(({ event }) => ({ event }))(List);
