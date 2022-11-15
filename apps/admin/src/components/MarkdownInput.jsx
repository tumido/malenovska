import React from 'react';
import { Mde } from 'fc-mde';
import Showdown from 'showdown';
import { useController } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const MarkdownInput = () => {
  const input = useController({ defaultValue: '' });
  const [ activeTab, setActiveTab ] = React.useState('write');
  const [ content, setContent ] = React.useState(input.value);

  const handleContentChange = value => {
    setContent(value);
    handleChange(value);
  };

  return (
    <FormControl { ...input.props }>
      <Mde
        setText={ handleContentChange }
        onTabChange={ setActiveTab }
        text={ content }
        generateMarkdownPreview={ async (markdown) => converter.makeHtml(markdown) }
        selectedTab={ activeTab }/>
    </FormControl>
  );
};

export default MarkdownInput;
