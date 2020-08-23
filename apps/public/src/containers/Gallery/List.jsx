import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { GridList, GridListTile, GridListTileBar, Link, Container, Typography } from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import { Banner } from 'components';
import { Helmet } from 'react-helmet';

const List = ({ event, width }) => {
  useFirestoreConnect(() => [
    {
      collection: 'galleries',
      where: [ 'event', '==', event.id ],
      storeAs: `${event.id}_galleries`
    }
  ]);

  const galleries = useSelector(({ firestore }) => firestore.ordered[`${event.id}_galleries`]);

  const getGridItemCols = (length, idx) => {
    if (idx === length - 1) {
      // There are 2 elements per row
      if (isWidthUp('sm', width)) {
        // On large screens, where there are 3 elements per row, span to 3 if even, 2 if odd
        return idx % 2 ? 2 : 3;
      } else {
        // On small screens, where there are 2 elements per row, return 1 if even, 2 if odd
        return idx % 2 ? 1 : 2;
      }
    }

    // returns a series 1 2 2 1 1 2 2 1 1 2 2... on 3 elem layout, return 1 on 2 elem layout
    return isWidthUp('sm', width) ? Math.ceil(idx / 2) % 2 + 1 : 1;
  };

  if (!isLoaded(galleries)) {return '';}

  const randomGalleryItem = galleries && galleries[Math.floor(Math.random() * galleries.length)];

  return (
    <Container maxWidth='md' style={ { padding: 2 } }>
      <Helmet
        title='Galerie'
        meta={ randomGalleryItem && [
          { property: 'og:image', content: randomGalleryItem.cover && randomGalleryItem.cover.src }
        ] }
      />
      <Banner event={ event } title="Galerie">
        <Typography>Fotogalerie, sdílená alba, památníčky... prostě, co se našlo.</Typography>
      </Banner>
      <GridList cellHeight={ 300 } cols={ isWidthUp('sm', width) ? 3 : 2 }>
        {galleries.map((tile, idx) => (
          <GridListTile
            cols={ getGridItemCols(galleries.length, idx) }
            component={ Link }
            key={ tile.url }
            href={ tile.url }
            target='_blank'
            style={ { padding: 0, backgroundColor: 'lightgray' } }>
            <img src={ tile.cover && tile.cover.src } alt={ `${event.name} od ${tile.author}` } />
            <GridListTileBar
              title={ tile.name }
              subtitle={ <span>Autor: {tile.author}</span> } />
          </GridListTile>
        ))}
      </GridList>

    </Container>
  );
};

List.propTypes = {
  event: PropTypes.object.isRequired,
  width: PropTypes.string
};

export default connect(({ event }) => ({ event }))(withWidth()(List));
