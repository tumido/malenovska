import React from 'react';
import {
  Create as CreateBase,
  TabbedForm, FormTab,
  TextInput, BooleanInput, NumberInput, SelectInput, FileInput, ImageInput,
  FileField, ImageField,
  required
} from 'react-admin';

import MarkdownInput from 'components/MarkdownInput';

const Create = (props) => (
  <CreateBase title="Nová událost" { ...props }>
    <TabbedForm>
      <FormTab label="Obecné">
        <TextInput label="ID" source="id" />
        <TextInput label='Název' source="name" validate={ required() } />
        <NumberInput label='Rok konání' source="year"/>
        <NumberInput label='Rok konání' source="year"/>
        <SelectInput label='Tag' source="type"
          choices={ [
            { id: true, name: 'Bitva' },
            { id: false, name: 'Šarvátka' }
          ] }
        />
        <MarkdownInput label='Titulek' source="description" />
        <BooleanInput label='Zobrazitelné' source="display" />
      </FormTab>
      <FormTab label="Pravidla">
        <MarkdownInput addLabel={ false } source="rules" />
        <ImageInput label="Obrázek" source="rules_image">
          <ImageField source="src" title="title" />
        </ImageInput>
      </FormTab>
      <FormTab label="Registrace">
        <BooleanInput label='Otevřená registrace' source="registrationAvailable" />
        <MarkdownInput label='Úvod: Nahoře' source="registrationBeforeAbove" />
        <MarkdownInput label='Úvod: Dole' source="registrationBeforeBelow" />
        <MarkdownInput label='Úspěšná registrace' source="registrationAfter" />
        <MarkdownInput label='Přihlášení účastníci' source="registrationList" />
      </FormTab>
      <FormTab label="Ostatní">
        <FileInput label="Potvrzení pro nezletilé" source="declaration" accept="application/pdf">
          <FileField source="src" title="title" />
        </FileInput>
        <NumberInput label='Cena' source="price"/>
      </FormTab>
      <FormTab label="Kontakty">
        <ImageInput label="Foto organizátorů" source="contactImage">
          <ImageField source="src" title="title" />
        </ImageInput>
        <MarkdownInput label='O organizátorech' source="contactText" />
        <TextInput label='FB událost' source="contact.facebook"/>
        <TextInput label='Larpová databáze' source="contact.larpovadatabaze"/>
        <TextInput label='LARP.cz' source="contact.larpcz"/>
        <TextInput label='E-mail' source="contact.email"/>
        {/* <DateTimeInput source='times.date' format={v => v.toDate()} parse={v => v.fromDate()}/> */}
      </FormTab>
    </TabbedForm>
  </CreateBase>
);

export default Create;
