import React, { useState } from "react";
import {
  Paper,
  Grid,
  Icon,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Box,
  Container,
} from "@mui/material";

import { Map, Banner } from "../../components";
import {
  timestampToDateStr,
  timestampToTimeStr,
} from "../../utilities/firebase";
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";

const Info = () => {
  const [event] = useEvent();
  const [center, setCenter] = useState();

  const timesToRender = [
    ["Datum akce", timestampToDateStr(event.date)],
    ["Začátek akce", timestampToTimeStr(event.onsiteStart)],
    ["Otevření registrace", timestampToTimeStr(event.onsiteRegistrationOpen)],
    ["Uzavření registrace", timestampToTimeStr(event.onsiteRegistrationClose)],
    ["Konec akce", timestampToTimeStr(event.onsiteEnd)],
  ];

  return (
    <React.Fragment>
      <Helmet title="To důležité" />
      <Banner title="To důležité" />
      <Container maxWidth="xl" sx={{p: {xs: 0, sm: "20px"}}}>
        <Paper>
          <Grid container>
            <Grid item xs={12} lg={3} sx={{ p: "16px", px: {sm: "24px"}, pt: 0 }}>
              <Typography gutterBottom sx={{mt: "1.7em"}} variant="h5">
                K registraci
              </Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Registrační poplatek</TableCell>
                    <TableCell align="right">{event.price} Kč</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Potvrzení pro mladší 18 let</TableCell>
                    <TableCell align="right" padding="none">
                      <IconButton target="_blank" href={event.declaration.src}>
                        <Icon>assignment</Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography gutterBottom sx={{mt: "1.7em"}} variant="h5">
                Do kalendáře
              </Typography>
              <Table>
                <TableBody>
                  {timesToRender.map((row, index) => (
                    <TableRow key={`row_${index}`}>
                      <TableCell>{row[0]}</TableCell>
                      <TableCell align="right">{row[1]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography gutterBottom sx={{mt: "1.7em"}} variant="h5">
                Do navigace
              </Typography>
              <Table size="small" sx={{tableLayout: 'fixed'}}>
                <TableBody>
                  {event.poi.map((row, index) => (
                    <TableRow
                      hover
                      key={`row_${index}`}
                      onClick={() => {
                        setCenter([row.latitude, row.longitude]);
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        padding="none"
                        sx={{width: "1.5rem"}}
                      >
                        <Icon sx={{ color: t => t.palette.loading[index % 3] }}>
                          location_on
                        </Icon>
                      </TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          display="block"
                          overflow="hidden"
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                        >
                          {row.name}
                        </Box>
                        <Box
                          component="span"
                          display="block"
                          overflow="hidden"
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                        >
                          {row.description}
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        padding="none"
                        sx={{ width: "88px" }}
                      >
                        <Tooltip
                          title="Vycentrovat mapu"
                          aria-label="center map on marker"
                          placement="top"
                        >
                          <IconButton>
                            <Icon fontSize="small">map</Icon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="Otevřít v Mapy.cz"
                          aria-label="locate on mapy.cz"
                          placement="top"
                        >
                          <IconButton
                            target="_blank"
                            href={`http://www.mapy.cz/#z=16@mm=T@st=s@ssq=loc:${row.latitude}N ${row.longitude}E`}
                          >
                            <Icon fontSize="small">navigation</Icon>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12} lg={9}>
              <Map markers={event.poi} center={center} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </React.Fragment>
  );
};

export default Info;
