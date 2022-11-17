import React from "react";
import { Mde } from "fc-mde";
import Showdown from "showdown";
import FormControl from "@mui/material/FormControl";
import { useInput, Labeled } from "react-admin";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const MarkdownInput = (props) => {
  const { onChange, onBlur, validate: _validate, ...rest } = props;
  const { field } = useInput({ onChange, onBlur, ...props });

  const [activeTab, setActiveTab] = React.useState("write");
  const [content, setContent] = React.useState(field.value || "");

  const handleContentChange = (value) => {
    setContent(value);
    field.onChange(value);
  };

  return (
    <Labeled label={field.label} {...rest} >
      <Mde
        setText={handleContentChange}
        onTabChange={setActiveTab}
        text={content}
        generateMarkdownPreview={async (markdown) =>
          converter.makeHtml(markdown)
        }
        selectedTab={activeTab}
      />
    </Labeled>
  );
};

export default MarkdownInput;
