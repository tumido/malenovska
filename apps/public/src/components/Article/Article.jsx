import React from 'react';
import PropTypes from 'prop-types';

import { Container, Card, CardContent, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

import { ScrollTop, ArticleCardHeader } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      paddingRight: 0
    }
  }
}));

const Article = ({ scrollTop = true, children, isLoading = false }) =>  {
  const styles = useStyles();
  return (
    <Container maxWidth='md' className={ styles.root }>
      <Box width="100%">
        <Card>
          { children && !isLoading ? children : (
            <React.Fragment>
              <ArticleCardHeader />
              <CardContent>
                <Skeleton variant='text'/>
              </CardContent>
            </React.Fragment>
          ) }
        </Card>
      </Box>
      { scrollTop && <ScrollTop anchor='#top' /> }
    </Container>

  );
};

Article.propTypes = {
  scrollTop: PropTypes.bool,
  isLoading: PropTypes.bool,
  spacing: PropTypes.number,
  children: PropTypes.node
};

export default Article;
