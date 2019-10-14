import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { Divider, Typography, Tabs, Tab, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Article, ArticleContent, ArticleMedia, ColorBadge, Markdown } from 'components';

const useStyles = makeStyles(theme => ({
  tabPanel: {
    paddingBottom: theme.spacing(2)
  },
  divider: {
    margin: '20px 0'
  },
  wrapper: {
    position: 'relative',
    '& > :first-child': {
      marginTop: 0
    }
  },
  badge: {
    position: 'absolute',
    top: theme.spacing(2),
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
      <div className={ classes.wrapper }>
        <ArticleMedia src={ race.image && race.image.src } />
        <ColorBadge color={ race.color } className={ classes.badge } />
      </div>
      <ArticleContent>
        <Typography gutterBottom variant='h4' component='h2'>{ race.name }</Typography>
        <Markdown content={ race.requirements } />
      </ArticleContent>
      <Divider className={ classes.divider }/>
      <ArticleContent>
        <Typography gutterBottom variant='h5' component='h3'>Příběh</Typography>
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
      <Hidden mdUp>
        <Tabs
          value={ activeTab }
          onChange={ handleTabChange }
          indicatorColor="secondary"
          textColor="primary"
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
          textColor="primary"
          variant="fullWidth"
        >
          { tabs }
        </Tabs>
      </Hidden>
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
