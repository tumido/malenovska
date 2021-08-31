import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, CardContent, Typography, Divider, Box, Button, Icon } from '@material-ui/core';
import { TodayOutlined, EventOutlined, MailOutlined } from '@material-ui/icons';

import { Article, ArticleCardHeader, Markdown } from 'components';

const contactButtons = (event) => ([
  {
    href: event.contact && event.contact.facebook || '',
    startIcon: <Icon className='fab fa-facebook-f'/>,
    text: 'Událost na facebooku'
  },
  {
    href: event.contact && event.contact.larpovadatabaze || '',
    startIcon: <TodayOutlined />,
    text: 'Larpová Databáze'
  },
  {
    href: event.contact && event.contact.larpcz || '',
    startIcon: <EventOutlined />,
    text: 'LARP.cz'
  },
  {
    href: event.contact && event.contact.email || '',
    startIcon: <MailOutlined />,
    text: 'E-mail organizátorům'
  }
]);

const List = ({ event }) => (
  <Article>
    <ArticleCardHeader height={ 600 } title="Kontakty a organizační tým" image={ event.contactImage && event.contactImage.src }/>
    <CardContent>
      <Typography variant='h5' gutterBottom component='h3'>O nás</Typography>
      <Markdown content={ event.contactText } />
      <Box marginY={ 4 }>
        <Divider/>
      </Box>
      <Typography variant='h5' gutterBottom component='h3'>Kontakty a odkazy pro současný ročník</Typography>
      <Box marginTop={ 4 }>
        <Grid container justifyContent='center' spacing={ 2 } >
          { contactButtons(event).map(c => (
            <Grid item key={ c.href }>
              <Button
                variant="outlined"
                color="primary"
                target='_blank'
                href={ c.href }
                disabled={ !c.href }
                startIcon={ c.startIcon }>
                {c.text}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </CardContent>
  </Article>
);

List.propTypes = {
  event: PropTypes.shape({
    contactImage: PropTypes.shape({
      src: PropTypes.string.isRequired
    }),
    contactText: PropTypes.string.isRequired,
    contact: PropTypes.shape({
      facebook: PropTypes.string,
      larpovadatabaze: PropTypes.string,
      larpcz: PropTypes.string,
      email: PropTypes.string
    })
  }).isRequired
};

export default connect(({ event }) => ({ event }))(List);

