import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { Typography, Tabs, Tab, Hidden, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import { Article, ArticleContent, ArticleMedia, ColorBadge, Markdown } from 'components';
import { darkTheme } from '../../utilities/theme';

const useStyles = makeStyles(theme => ({
  tabPanel: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },
  wrapper: {
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: `calc(${theme.spacing(2)}px + 2em)`,
    right: theme.spacing(2)
  }
}));

const TabPanel = ({ race, activeTab, index }) => {
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={ activeTab !== index }
      className={ classes.tabPanel }
    >
      <ArticleContent>
        <Typography gutterBottom variant='h4' component='h2'>{ race.name }</Typography>
        <Markdown content={ race.requirements } />
      </ArticleContent>
      <div className={ classes.wrapper }>
        <ArticleMedia src={ race.image && race.image.src } />
        <ColorBadge color={ race.color } className={ classes.badge } />
      </div>
      <ArticleContent>
        <Markdown content={ race.legend } />
      </ArticleContent>
    </div>
  );
};

TabPanel.propTypes = {
  race: PropTypes.object.isRequired,
  activeTab: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

const List = ({ event }) => {
  const [ activeTab, setActiveTab ] = React.useState(0);

  const handleTabChange = (event, newActiveTab) => {
    setActiveTab(newActiveTab);
  };

  useFirestoreConnect(() => [
    {
      collection: 'races',
      where: [ 'event', '==', event.id ],
      storeAs: `${event.id}_races`
    }
  ]);

  const races = useSelector(({ firestore }) => firestore.ordered[`${event.id}_races`]);

  if (!isLoaded(races)) {
    return <Article spacing={ 0 } isLoading={ true } />;
  }

  const tabs = races.map(race => (
    <Tab key={ race.id } label={ race.name } />
  ));

  return (
    <Article spacing={ 0 }>
      <ThemeProvider theme={ darkTheme }>
        <AppBar position="static" color="default">
          <Hidden mdUp>
            <Tabs
              value={ activeTab }
              onChange={ handleTabChange }
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
            >
              { tabs }
            </Tabs>
          </Hidden>
          <Hidden smDown>
            <Tabs
              value={ activeTab }
              onChange={ handleTabChange }
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
            >
              { tabs }
            </Tabs>
          </Hidden>
        </AppBar>
      </ThemeProvider>
      { races.map((race, idx) => (
        <TabPanel key={ race.id } race={ race } activeTab={ activeTab } index={ idx } />
      ))}
    </Article>
  );
};

List.propTypes = {
  event: PropTypes.object.isRequired
};

export default connect(({ event }) => ({ event }))(List);
