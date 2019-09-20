import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Paper, Grid, Icon, Typography, Table, TableBody, TableRow, TableCell, IconButton, Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Map } from 'components';
import { MarkerPropType } from 'utilities/scheme';
import { timestampToDateStr, timestampToTimeStr } from 'utilities/firebase';

import { setCenter, resetCenter } from 'redux/actions/map-actions';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(2)
  },
  map: {
    padding: theme.spacing(1),
    height: '100%'
  },
  mapMarker: {
    paddingRight: 0
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
  }
}));

const InfoPage = ({ event, center, setCenter, resetCenter }) => {
  const classes = useStyles();

  console.log(event)
  // let date = info.date ? info.date.toDate() : undefined;
  // const dateString = !date ? "" : date.toLocaleDateString('cs-CZ')
  // const timeString = !date ? "" : date.getHours() + ":" + date.getMinutes();

  // const contacts = Object.entries(info.contact).map(([key, contact]) => (
  //   <li key={`contact-${key}`}>
  //     <a href={contact.href}><i className={contact.icon}></i> {contact.label}</a>
  //   </li>
  // ))

  const timesToRender = [
    ['Datum akce', timestampToDateStr(event.times.date)],
    ['Začátek akce', timestampToTimeStr(event.times.start)],
    ['Otevření registrace', timestampToTimeStr(event.times.registrationOpen)],
    ['Uzavření registrace', timestampToTimeStr(event.times.registrationClose) ],
    ['Konec akce', timestampToTimeStr(event.times.end)]
  ]

  return (
    <Grid container spacing={ 2 } className={ classes.root }>
      <Grid item xs={ 12 } lg={ 8 }>
        <Paper className={ classes.map }>
          <Map markers={ event.poi } center={ center }/>
        </Paper>
      </Grid>
      <Grid item xs={ 12 } lg={ 4 }>
        <Paper>
          <Grid container direction='column'>
            <Grid item>
              <Typography gutterBottom variant='h5'>Datum a čas</Typography>
              <Table>
                <TableBody>
                  { timesToRender.map((row, index) => (
                    <TableRow hover key={ `row_${index}`}>
                      <TableCell>{row[0]}</TableCell>
                      <TableCell align='right'>{row[1]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant='h5'>Místo a cesta</Typography>
              <Table size="small">
                <TableBody>
                  { event.poi.map((row, index) => (
                    <TableRow hover key={ `row_${index}`} onClick={ () => { setCenter([ row.geo.latitude, row.geo.longitude ]); } }>
                      <TableCell className={ classes.mapMarker } ><Icon className={ classes[`color${index % 3}`] }>location_on</Icon></TableCell>
                      <TableCell>{row.name} - {row.description}</TableCell>
                      <TableCell className={ classes.mapActions } align='right'>
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
          </Grid>
        </Paper>
      </Grid>
      {/*
        <p>Cena: <span className="right"><strong>{info.price}</strong> Kč</span></p>
      </div>
      <div>
        <p>Kontakt:</p>
        <List items={contacts}/>
      </div>
      <div>
        <p>Harmonogram: </p>
      </div> */}
    </Grid>
  )
}

InfoPage.propTypes = {
  info: PropTypes.shape({
    poi: PropTypes.arrayOf(MarkerPropType)
  })
}

export default connect(
  state => ({
    center: state.map.center
  }),
  { setCenter, resetCenter }
)(InfoPage);
