import React from 'react';
import { Mde } from 'fc-mde';
import Showdown from 'showdown';
import { useRecordContext } from 'react-admin';
import FormControl from '@mui/material/FormControl';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const MarkdownField = (props) => {
  const record = useRecordContext(props);
  return (
    <FormControl {...props} className='ra-input-mde'>
      <Mde
        text={record[props.source]}
        selectedTab='preview'
        generateMarkdownPreview={async (markdown) => converter.makeHtml(markdown)}
        readOnly={true} />
    </FormControl>
  );
};


export default MarkdownField;
