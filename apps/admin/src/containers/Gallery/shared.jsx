import React from 'react';
import PropTypes from 'prop-types';

export const GalleryTitle = ({ record }) => {
  return <span>Galerie: {record ? `"${record.name}"` : ''}</span>;
};

GalleryTitle.propTypes = {
  record: PropTypes.object
};
