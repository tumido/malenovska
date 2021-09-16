import React from "react";
import { useSelector } from "react-redux";
import { isLoaded, useFirestoreConnect } from "react-redux-firebase";

import {
  Container,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
  CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";

import {
  Article,
  TableHead,
  Markdown,
  TableToolbar,
  Banner,
} from "../../components";
import { stableSort, getSorting } from "../../utilities/sorting";
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";

const useStyles = makeStyles(() => ({
  table: {
    whiteSpace: "normal",
    wordWrap: "break-word",
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: "auto",
  },
}));

const headers = [
  { id: "race", label: "Strana" },
  { id: "nickName", label: "Přezdívka" },
  { id: "firstName", label: "Jméno" },
  { id: "lastName", label: "Příjmení" },
  { id: "group", label: "Skupina" },
];
const headerKeys = headers.reduce((acc, { id }) => [...acc, id], []);

const filterBySearch = (participant, filter) =>
  !filter ||
  Object.entries(participant).some(
    ([k, v]) => headerKeys.includes(k) && v.toLowerCase().includes(filter)
  );

const ListContent = () => {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("race");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterSearch, setFilterSearch] = React.useState(false);
  const [filterChips, setFilterChips] = React.useState([]);
  const [event] = useEvent();

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (value) => {
    setFilterSearch(value.toLowerCase());
  };

  const handleFilterClick = (clickedFilter) => {
    clickedFilter.enabled = true;
    setFilterChips([
      ...filterChips.filter((f) => f.name !== clickedFilter.name),
      clickedFilter,
    ]);
  };

  useFirestoreConnect(() => [
    {
      collection: "races",
      where: ["event", "==", event.id],
      storeAs: `${event.id}_races`,
    },
    {
      collection: "participants",
      where: ["event", "==", event.id],
      storeAs: `${event.id}_participants`,
    },
  ]);

  const races = useSelector(
    ({ firestore }) => firestore.ordered[`${event.id}_races`]
  );
  const participants = useSelector(
    ({ firestore }) => firestore.ordered[`${event.id}_participants`]
  );

  if (!isLoaded(participants) || !isLoaded(races)) {
    return (
      <Article>
        <Container>
          <Typography variant="h4" component="h2">
            <Skeleton type="text" width={400} />
          </Typography>
        </Container>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableBody>
              {[...Array(10).keys()].map((index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton type="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton type="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton type="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton type="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton type="text" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Article>
    );
  }

  const raceMapping = races.reduce((o, k) => ({ ...o, [k.id]: k.name }), {});
  const rows = participants
    .map((p) => ({ ...p, race: raceMapping[p.race] }))
    .filter((p) => filterBySearch(p, filterSearch));

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Article>
      <CardContent>
        <Markdown content={event.registrationList} />
      </CardContent>
      <TableToolbar
        onSearch={handleSearch}
        onFilterClick={handleFilterClick}
        filters={filterChips}
      />
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableHead
            headers={headers}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(rows, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{row.race}</TableCell>
                    <TableCell>{row.nickName}</TableCell>
                    <TableCell>{row.firstName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>{row.group}</TableCell>
                  </TableRow>
                );
              })}
            {[...Array(emptyRows)].map((r, idx) => (
              <TableRow key={idx} style={{ height: 49 }}>
                <TableCell colSpan={6} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Article>
  );
};

const Attendees = () => (
  <React.Fragment>
    <Helmet title="Účastníci" />
    <Banner title="Účastníci" />
    <ListContent />
  </React.Fragment>
);

export default Attendees;
