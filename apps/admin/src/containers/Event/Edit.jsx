import React from "react";
import {
  Edit as EditBase,
  Datagrid,
  TabbedForm,
  FormTab,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  FileInput,
  ImageInput,
  ArrayInput,
  FunctionField,
  FileField,
  ImageField,
  TextField,
  ReferenceManyField,
  ReferenceField,
  EditButton,
  SimpleFormIterator,
  useNotify,
  useRedirect,
  required,
  minValue,
  maxValue,
} from "react-admin";
import PropTypes from "prop-types";
import { DateInput, KeyboardTimeInput } from "react-admin-date-inputs";
import { Icon } from "@material-ui/core";

import MarkdownInput from "../../components/MarkdownInput";
import { EventTitle } from "./shared";
import { inlineBlock, setCacheForRecord, ConditionalField } from "../shared";

const Edit = (props) => {
  const notify = useNotify();
  const redirectTo = useRedirect();
  const onSuccess = setCacheForRecord({
    collection: "events",
    records: ["contactImage", "rulesImage", "declaration"],
    isCreate: false,
    basePath: props.basePath,
    redirectTo,
    notify,
  });

  return (
    <EditBase
      onSuccess={onSuccess}
      undoable={false}
      title={<EventTitle />}
      {...props}
    >
      <TabbedForm>
        <FormTab label="Obecné">
          <TextInput
            label="ID"
            source="id"
            disabled
            sx={ inlineBlock }
          />
          <TextInput
            label="Název"
            source="name"
            validate={required()}
            sx={ inlineBlock }
          />
          <NumberInput
            label="Rok"
            source="year"
            sx={ inlineBlock }
          />
          <DateInput
            label="Datum konání"
            source="date"
            sx={ inlineBlock }
          />
          <SelectInput
            label="Tag"
            source="type"
            sx={ inlineBlock }
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
          <ImageInput label="Obrázek" source="rulesImage">
            <ImageField source="src" title="title" />
          </ImageInput>
        </FormTab>
        <FormTab label="Strany">
          <ReferenceManyField reference="races" target="event" fullWidth>
            <Datagrid>
              <TextField label="Název" source="name" />
              <TextField label="Limit" source="limit" />
              <FunctionField
                label="Obrázek"
                source="image"
                render={({ image }) => <Icon>{image ? "check" : "close"}</Icon>}
              />
              <TextField label="Barva" source="color" />
              <EditButton />
            </Datagrid>
          </ReferenceManyField>
        </FormTab>
        <FormTab label="Účastníci">
          <ReferenceManyField reference="participants" target="event" fullWidth>
            <Datagrid>
              <TextField source="nickName" label="Přezdívka" />
              <TextField source="firstName" label="Jméno" />
              <TextField source="lastName" label="Příjmení" />
              <ReferenceField source="race" reference="races" label="Strana">
                <TextField source="name" />
              </ReferenceField>
              <EditButton />
            </Datagrid>
          </ReferenceManyField>
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
          <ArrayInput
            label="Registrační formulář, extra údaje"
            source="registrationExtras"
          >
            <SimpleFormIterator>
              <SelectInput
                label="Typ"
                source="type"
                choices={[
                  { id: "text", name: "Text" },
                  { id: "number", name: "Číslo" },
                  { id: "checkbox", name: "Checkbox" },
                  { id: "markdown", name: "Popisek" },
                ]}
                sx={ inlineBlock }
              />
              <NumberInput
                label="Šířka"
                source="size"
                validate={[minValue(1), maxValue(12)]}
                sx={ inlineBlock }
              />
              <ConditionalField
                conditional={(r) => r.type !== "markdown"}
                component={TextInput}
                label="ID"
                source="props.id"
                sx={ inlineBlock }
              />
              <ConditionalField
                conditional={(r) => r.type !== "markdown"}
                component={TextInput}
                label="Popisek"
                source="props.label"
                sx={ inlineBlock }
              />
              <ConditionalField
                conditional={(r) => r.type === "markdown"}
                component={MarkdownInput}
                label="Komentář"
                source="content"
              />
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>
        <FormTab label="Mapa">
          <ArrayInput label="Body na mapě" source="poi">
            <SimpleFormIterator>
              <TextInput
                label="Název"
                source="name"
                sx={ inlineBlock }
              />
              <TextInput
                label="Popisek"
                source="description"
                sx={ inlineBlock }
              />
              <NumberInput
                label="Souřadnice - šířka"
                source="latitude"
                validate={[minValue(-180), maxValue(180)]}
                sx={ inlineBlock }
              />
              <NumberInput
                label="Souřadnice - délka"
                source="longitude"
                validate={[minValue(-90), maxValue(90)]}
                sx={ inlineBlock }
              />
            </SimpleFormIterator>
          </ArrayInput>
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
            sx={ inlineBlock }
          />
          <TextInput
            label="Larpová databáze"
            source="contact.larpovadatabaze"
            sx={ inlineBlock }
          />
          <TextInput
            label="LARP.cz"
            source="contact.larpcz"
            sx={ inlineBlock }
          />
          <TextInput
            label="E-mail"
            source="contact.email"
            sx={ inlineBlock }
          />
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
            sx={ inlineBlock }
          />
          <KeyboardTimeInput
            label="Konec akce"
            source="onsiteEnd"
            options={{ ampm: false }}
            sx={ inlineBlock }
          />
          <br />
          <KeyboardTimeInput
            label="Otevření registrace na místě"
            source="onsiteRegistrationOpen"
            options={{ ampm: false }}
            sx={ inlineBlock }
          />
          <KeyboardTimeInput
            label="Uzavření registrace na místě"
            source="onsiteRegistrationClose"
            options={{ ampm: false }}
            sx={ inlineBlock }
          />
          <KeyboardTimeInput
            label="Seznámení s pravidly"
            source="onsiteRules"
            options={{ ampm: false }}
            sx={ inlineBlock }
          />
          <KeyboardTimeInput
            label="První quest"
            source="onsiteQuestStart"
            options={{ ampm: false }}
            sx={ inlineBlock }
          />
          <KeyboardTimeInput
            label="Závěrečná bitva"
            source="onsiteLastQuest"
            options={{ ampm: false }}
            sx={ inlineBlock }
          />
        </FormTab>
      </TabbedForm>
    </EditBase>
  );
};

Edit.propTypes = {
  basePath: PropTypes.string,
};

export default Edit;
