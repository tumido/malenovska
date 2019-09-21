import React from 'react';
import ReactMde from 'react-mde';
import PropTypes from 'prop-types';
import { addField } from 'ra-core';
import { FormControl } from '@material-ui/core';
import { compiler } from 'markdown-to-jsx';

import 'react-mde/lib/styles/css/react-mde-all.css';

const MarkdownInputBase = ({source}) => {
  const [ activeTab, setActiveTab ] = React.useState('write');
  const [ content, setContent ] = React.useState('');

  return (
    <FormControl fullWidth={ true } className='ra-input-mde'>
      <ReactMde
        onChange={ setContent }
        onTabChange={ setActiveTab }
        value={ content }
        generateMarkdownPreview={ markdown => Promise.resolve(compiler(markdown)) }
        selectedTab={ activeTab }/>
    </FormControl>
  );
}

MarkdownInputBase.propTypes = {
  source: PropTypes.string,
};

const MarkdownInput = addField(MarkdownInputBase);

MarkdownInput.defaultProps = {
  addLabel: true,
  fullWidth: true,
};

export default MarkdownInput;
