import React from "react";

import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  Container,
  Typography,
  useTheme,
} from "@mui/material";

import { Banner } from "../../components";
import { Helmet } from "react-helmet";
import { useEvent } from "../../contexts/EventContext";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import useMediaQuery from '@mui/material/useMediaQuery';

const useIsWidthUp = (breakpoint) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(breakpoint));
}

const Gallery = () => {
  const [event] = useEvent();
  const isSmUp = useIsWidthUp("sm");

  const [galleries, loading, error] = useCollectionData(query(collection(getFirestore(), 'galleries'), where("event", "==", event.id)));

  const getGridItemCols = (length, idx) => {
    if (idx === length - 1) {
      // There are 2 elements per row
      if (isSmUp) {
        // On large screens, where there are 3 elements per row, span to 3 if even, 2 if odd
        return idx % 2 ? 2 : 3;
      } else {
        // On small screens, where there are 2 elements per row, return 1 if even, 2 if odd
        return idx % 2 ? 1 : 2;
      }
    }

    // returns a series 1 2 2 1 1 2 2 1 1 2 2... on 3 elem layout, return 1 on 2 elem layout
    return isSmUp ? (Math.ceil(idx / 2) % 2) + 1 : 1;
  };

  if (loading || error) {
    return null;
  }

  const randomGalleryItem =
    galleries && galleries[Math.floor(Math.random() * galleries.length)];

  return (
    <Container maxWidth="md" style={{ padding: 2 }}>
      <Helmet
        title="Galerie"
        meta={
          randomGalleryItem && [
            {
              property: "og:image",
              content: randomGalleryItem.cover && randomGalleryItem.cover.src,
            },
          ]
        }
      />
      <Banner title="Galerie">
        <Typography>
          Fotogalerie, sdílená alba, památníčky... prostě, co se našlo.
        </Typography>
      </Banner>
      <ImageList rowHeight={300} cols={isSmUp ? 3 : 2}>
        {galleries.map((tile, idx) => (
          <ImageListItem
            cols={getGridItemCols(galleries.length, idx)}
            component={Link}
            key={tile.url}
            href={tile.url}
            target="_blank"
            style={{ padding: 0, backgroundColor: "lightgray" }}
          >
            <img
              src={tile.cover && tile.cover.src}
              alt={`${event.name} od ${tile.author}`}
            />
            <ImageListItemBar
              title={tile.name}
              subtitle={<span>Autor: {tile.author}</span>}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
};

export default Gallery;
