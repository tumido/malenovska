import React from 'react';
import ReactMde from 'react-mde';
import PropTypes from 'prop-types';
import { addField } from 'ra-core';
import { FormControl } from '@material-ui/core';
import { compiler } from 'markdown-to-jsx';

import 'react-mde/lib/styles/css/react-mde-all.css';

const MarkdownInputBase = ({ input: { value, onChange: handleChange }, ...props }) => {
  const [ activeTab, setActiveTab ] = React.useState('write');
  const [ content, setContent ] = React.useState(value);

  const handleContentChange = value => {
    setContent(value);
    handleChange(value);
  };

  return (
    <FormControl { ...props } className='ra-input-mde'>
      <ReactMde
        onChange={ handleContentChange }
        onTabChange={ setActiveTab }
        value={ content }
        generateMarkdownPreview={ markdown => Promise.resolve(compiler(markdown)) }
        selectedTab={ activeTab }/>
    </FormControl>
  );
};

MarkdownInputBase.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }).isRequired,
  props: PropTypes.object
};

const MarkdownInput = addField(MarkdownInputBase);

MarkdownInput.defaultProps = {
  addLabel: true,
  fullWidth: true
};

export default MarkdownInput;
