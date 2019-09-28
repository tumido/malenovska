import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Paper, Grid, Icon, Typography, Table, TableBody, TableRow, TableCell, IconButton, Tooltip, Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Map } from 'components';
import { timestampToDateStr, timestampToTimeStr } from 'utilities/firebase';

import { setCenter } from 'redux/actions/map-actions';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(2)
  },
  info: {
    [theme.breakpoints.up('sm')]: {
      paddingTop: 40,
      paddingBottom: 40
    },
    paddingLeft: 24,
    paddingRight: 24
  },
  map: {
    padding: theme.spacing(1),
    height: '100%'
  },
  heading: {
    marginTop: '1.7em'
  },
  color0: {
    color: theme.palette.loading[0]
  },
  color1: {
    color: theme.palette.loading[1]
  },
  color2: {
    color: theme.palette.loading[2]
  },
  tableFixed: {
    tableLayout: 'fixed'
  },
  columnActions: {
    width: 88
  },
  columnMarker: {
    width: '1.5rem'
  },
  clickableRow: {
    cursor: 'pointer'
  }
}));

const Info = ({ event, center, setCenter }) => {
  const classes = useStyles();

  const timesToRender = [
    [ 'Datum akce', timestampToDateStr(event.times.date) ],
    [ 'Začátek akce', timestampToTimeStr(event.times.start) ],
    [ 'Otevření registrace', timestampToTimeStr(event.times.registrationOpen) ],
    [ 'Uzavření registrace', timestampToTimeStr(event.times.registrationClose) ],
    [ 'Konec akce', timestampToTimeStr(event.times.end) ]
  ];

  return (
    <div className={ classes.root }>
      <Paper>
        <Grid container>
          <Grid item xs={ 12 } lg={ 3 } className={ classes.info }>
            <Typography gutterBottom variant='h5' component='h2'>Informace</Typography>
            <Typography gutterBottom className={ classes.heading } variant='h6'>K registraci</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Registrační poplatek</TableCell>
                  <TableCell align='right'>{ event.price } Kč</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Potvrzení pro mladší 18 let</TableCell>
                  <TableCell align='right' padding='none'>
                    <IconButton target='_blank' href={ event.declaration.src }>
                      <Icon>assignment</Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography gutterBottom className={ classes.heading } variant='h6'>Do kalendáře</Typography>
            <Table>
              <TableBody>
                { timesToRender.map((row, index) => (
                  <TableRow key={ `row_${index}` }>
                    <TableCell>{row[0]}</TableCell>
                    <TableCell align='right'>{row[1]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography gutterBottom className={ classes.heading } variant='h6'>Do navigace</Typography>
            <Table size='small' className={ classes.tableFixed }>
              <TableBody>
                { event.poi.map((row, index) => (
                  <TableRow
                    hover
                    key={ `row_${index}` }
                    onClick={ () => { setCenter([ row.geo.latitude, row.geo.longitude ]); } }
                    className={ classes.clickableRow }
                  >
                    <TableCell padding='none' className={ classes.columnMarker } >
                      <Icon className={ classes[`color${index % 3}`] }>location_on</Icon>
                    </TableCell>
                    <TableCell>
                      <Box component='span' display='block' overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>{ row.name }</Box>
                      <Box component='span' display='block' overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>{ row.description }</Box>
                    </TableCell>
                    <TableCell align='right' padding='none' className={ classes.columnActions }>
                      <Tooltip title="Vycentrovat mapu" aria-label="center map on marker" placement='top'>
                        <IconButton >
                          <Icon fontSize='small'>map</Icon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Otevřít v Mapy.cz" aria-label="locate on mapy.cz" placement='top'>
                        <IconButton target='_blank' href={ `http://www.mapy.cz/#z=16@mm=T@st=s@ssq=loc:${row.geo.latitude}N ${row.geo.longitude}E` }>
                          <Icon fontSize='small'>navigation</Icon>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={ 12 } lg={ 9 }>
            <Map markers={ event.poi } center={ center }/>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

Info.propTypes = {
  event: PropTypes.shape({
    poi: PropTypes.arrayOf(
      PropTypes.shape({
        geo: PropTypes.shape({
          latitude: PropTypes.number.isRequired,
          longitude: PropTypes.number.isRequired
        }).isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
      }).isRequired
    ),
    times: PropTypes.shape({
      date: PropTypes.any,
      start: PropTypes.any,
      registrationOpen: PropTypes.any,
      registrationClose: PropTypes.any,
      end: PropTypes.any
    }).isRequired,
    declaration: PropTypes.shape({
      src: PropTypes.string.isRequired
    }).isRequired,
    price: PropTypes.number.isRequired
  }).isRequired,
  center: PropTypes.array,
  setCenter: PropTypes.func.isRequired
};

export default connect(
  ({ map, event }) => ({
    center: map.center,
    event
  }),
  { setCenter }
)(Info);
