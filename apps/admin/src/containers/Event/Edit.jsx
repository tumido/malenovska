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
  DateInput,
  TimeInput,
  TextField,
  ReferenceManyField,
  ReferenceField,
  EditButton,
  SimpleFormIterator,
  required,
  minValue,
  maxValue,
  FormDataConsumer,
} from "react-admin";
import { Icon, Grid } from "@mui/material";

import MarkdownInput from "../../components/MarkdownInput";
import { EventTitle } from "./shared";
import { inlineBlock } from "../shared";

const Edit = (props) => (
  <EditBase undoable={false} title={<EventTitle />} {...props}>
    <TabbedForm>
      <FormTab label="Obecné">
        <Grid container>
          <TextInput label="ID" source="id" disabled sx={inlineBlock} />
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
        </Grid>
        <BooleanInput label="Zobrazitelné" source="display" />
        <MarkdownInput label="Titulek" source="description" fullWidth />
      </FormTab>
      <FormTab label="Pravidla">
        <MarkdownInput label="" source="rules" fullWidth />
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
          fullWidth
        />
        <MarkdownInput
          label="Úvod: Dole"
          source="registrationBeforeBelow"
          fullWidth
        />
        <MarkdownInput
          label="Úspěšná registrace"
          source="registrationAfter"
          fullWidth
        />
        <MarkdownInput
          label="Přihlášení účastníci"
          source="registrationList"
          fullWidth
        />
        <ArrayInput
          label="Registrační formulář, extra údaje"
          source="registrationExtras"
        >
          <SimpleFormIterator
            inline
            fullWidth
            sx={{ "& > ul > li": { py: 3 } }}
          >
            <SelectInput
              label="Typ"
              source="type"
              choices={[
                { id: "text", name: "Text" },
                { id: "number", name: "Číslo" },
                { id: "checkbox", name: "Checkbox" },
                { id: "markdown", name: "Popisek" },
              ]}
              sx={inlineBlock}
            />
            <NumberInput
              label="Šířka"
              source="size"
              validate={[minValue(1), maxValue(12)]}
            />
            <FormDataConsumer>
              {({ scopedFormData, getSource, ...rest }) => {
                if (scopedFormData?.type === "markdown") {
                  return (
                    <MarkdownInput
                      source={getSource("content")}
                      label="Komentář"
                      {...rest}
                      fullWidth
                    />
                  );
                }
                return (
                  <>
                    <TextInput
                      source={getSource("props.id")}
                      label="ID"
                      {...rest}
                    />
                    <TextInput
                      source={getSource("props.label")}
                      label="Popisek"
                      {...rest}
                    />
                  </>
                );
              }}
            </FormDataConsumer>
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
      <FormTab label="Mapa">
        <ArrayInput label="Body na mapě" source="poi">
          <SimpleFormIterator
            inline
            fullWidth
            sx={{ "& li": { borderBottom: "none !important" } }}
          >
            <TextInput label="Název" source="name" />
            <TextInput label="Popisek" source="description" />
            <NumberInput
              label="Souřadnice - šířka"
              source="latitude"
              validate={[minValue(-180), maxValue(180)]}
            />
            <NumberInput
              label="Souřadnice - délka"
              source="longitude"
              validate={[minValue(-90), maxValue(90)]}
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
        <Grid container>
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
        </Grid>
        <ImageInput label="Foto organizátorů" source="contactImage">
          <ImageField source="src" title="title" />
        </ImageInput>
        <MarkdownInput
          label="O organizátorech"
          source="contactText"
          fullWidth
        />
      </FormTab>
      <FormTab label="Harmonogram">
        <Grid container>
          <TimeInput
            label="Začátek akce"
            source="onsiteStart"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <TimeInput
            label="Konec akce"
            source="onsiteEnd"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <br />
          <TimeInput
            label="Otevření registrace na místě"
            source="onsiteRegistrationOpen"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <TimeInput
            label="Uzavření registrace na místě"
            source="onsiteRegistrationClose"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <TimeInput
            label="Seznámení s pravidly"
            source="onsiteRules"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <TimeInput
            label="První quest"
            source="onsiteQuestStart"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
          <TimeInput
            label="Závěrečná bitva"
            source="onsiteLastQuest"
            options={{ ampm: false }}
            sx={inlineBlock}
          />
        </Grid>
      </FormTab>
    </TabbedForm>
  </EditBase>
);

export default Edit;
