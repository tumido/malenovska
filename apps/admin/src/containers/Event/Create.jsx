import React from "react";
import PropTypes from "prop-types";
import {
  Create as CreateBase,
  TabbedForm,
  FormTab,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  FileInput,
  ImageInput,
  FileField,
  ImageField,
  useNotify,
  useRedirect,
  required,
} from "react-admin";
import { DateInput, KeyboardTimeInput } from "react-admin-date-inputs";

import MarkdownInput from "../../components/MarkdownInput";

import { inlineBlock, setCacheForRecord } from "../shared";

const Create = (props) => {
  const notify = useNotify();
  const redirectTo = useRedirect();
  const onSuccess = setCacheForRecord({
    collection: "events",
    records: ["contactImage", "rulesImage", "declaration"],
    isCreate: true,
    basePath: props.basePath,
    redirectTo,
    notify,
  });

  return (
    <CreateBase onSuccess={onSuccess} title="Nová událost" {...props}>
      <TabbedForm>
        <FormTab label="Obecné">
          <TextInput label="ID" source="id" sx={inlineBlock} />
          <TextInput
            label="Název"
            source="name"
            validate={required()}
            sx={inlineBlock}
          />
          <NumberInput label="Rok" source="year" sx={inlineBlock} />
          <DateInput label="Datum konání" source="date" sx={inlineBlock} />
          <SelectInput
            label="Tag"
            source="type"
            sx={inlineBlock}
            choices={[
              { id: true, name: "Bitva" },
              { id: false, name: "Šarvátka" },
            ]}
          />
          <BooleanInput label="Zobrazitelné" source="display" />
          <MarkdownInput label="Titulek" source="description" />
        </FormTab>
        <FormTab label="Pravidla">
          <MarkdownInput label="" source="rules" />
          <ImageInput label="Obrázek" source="rules_image">
            <ImageField source="src" title="title" />
          </ImageInput>
        </FormTab>
        <FormTab label="Registrace">
          <BooleanInput
            label="Otevřená registrace"
            source="registrationAvailable"
          />
          <MarkdownInput
            label="Úvod: Nahoře"
            source="registrationBeforeAbove"
          />
          <MarkdownInput label="Úvod: Dole" source="registrationBeforeBelow" />
          <MarkdownInput
            label="Úspěšná registrace"
            source="registrationAfter"
          />
          <MarkdownInput
            label="Přihlášení účastníci"
            source="registrationList"
          />
        </FormTab>
        <FormTab label="Ostatní">
          <FileInput
            label="Potvrzení pro nezletilé"
            source="declaration"
            accept="application/pdf"
          >
            <FileField source="src" title="title" />
          </FileInput>
          <NumberInput label="Cena" source="price" />
        </FormTab>
        <FormTab label="Kontakty">
          <TextInput
            label="FB událost"
            source="contact.facebook"
            sx={inlineBlock}
          />
          <TextInput
            label="Larpová databáze"
            source="contact.larpovadatabaze"
            sx={inlineBlock}
          />
          <TextInput label="LARP.cz" source="contact.larpcz" sx={inlineBlock} />
          <TextInput label="E-mail" source="contact.email" sx={inlineBlock} />
          <ImageInput label="Foto organizátorů" source="contactImage">
            <ImageField source="src" title="title" />
          </ImageInput>
          <MarkdownInput label="O organizátorech" source="contactText" />
        </FormTab>
        <FormTab label="Harmonogram">
          <KeyboardTimeInput
            label="Začátek akce"
            source="onsiteStart"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <KeyboardTimeInput
            label="Konec akce"
            source="onsiteEnd"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <br />
          <KeyboardTimeInput
            label="Otevření registrace na místě"
            source="onsiteRegistrationOpen"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <KeyboardTimeInput
            label="Uzavření registrace na místě"
            source="onsiteRegistrationClose"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <KeyboardTimeInput
            label="Seznámení s pravidly"
            source="onsiteRules"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <KeyboardTimeInput
            label="První quest"
            source="onsiteQuestStart"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <KeyboardTimeInput
            label="Závěrečná bitva"
            source="onsiteLastQuest"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
        </FormTab>
      </TabbedForm>
    </CreateBase>
  );
};

Create.propTypes = {
  basePath: PropTypes.string,
};

export default Create;
