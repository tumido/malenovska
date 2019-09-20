import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Paper, Grid, Icon, Typography, Table, TableBody, TableRow, TableCell, IconButton, Tooltip, Container
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
  paper: {
    [theme.breakpoints.up('sm')]: {
      marginTop: 40,
      paddingTop: 40,
      paddingBottom: 40
    },
    padding: '0 16px'
  },
  map: {
    padding: theme.spacing(1),
    height: '100%'
  },
  mapMarker: {
    paddingRight: 0
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
  mapActions: {
    width: 120
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
    <Container className={ classes.root } fixed>
      <Paper className={ classes.paper }>
        <Typography gutterBottom variant='h5' component='h2'>Informace</Typography>
        <Grid container spacing={ 2 } >
          <Grid item xs={ 12 } lg={ 4 }>
            <Typography gutterBottom className={ classes.heading } variant='h6'>Cena</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Cena</TableCell>
                  <TableCell align='right'>{ event.price } Kč</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography gutterBottom className={ classes.heading } variant='h6'>Datum a čas</Typography>
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
            <Typography gutterBottom className={ classes.heading } variant='h6'>Místo a cesta</Typography>
            <Table size='small'>
              <TableBody>
                { event.poi.map((row, index) => (
                  <TableRow
                    hover
                    key={ `row_${index}` }
                    onClick={ () => { setCenter([ row.geo.latitude, row.geo.longitude ]); } }
                    className={ classes.clickableRow }
                  >
                    <TableCell className={ classes.mapMarker } ><Icon className={ classes[`color${index % 3}`] }>location_on</Icon></TableCell>
                    <TableCell >
                      <div>{row.name}</div>
                      <div>{row.description}</div>
                    </TableCell>
                    <TableCell className={ classes.mapActions } align='right' padding='none'>
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
          <Grid item xs={ 12 } lg={ 8 }>
            <Map markers={ event.poi } center={ center }/>
          </Grid>
        </Grid>
      </Paper>
    </Container>
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
