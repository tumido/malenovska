import React from 'react';
import {
  Show as ShowBase,
  Datagrid, TabbedForm, FormTab,
  FunctionField, FileField, ImageField, NumberField, TextField, BooleanField, SelectField, ReferenceManyField, ReferenceField, UrlField,
  EditButton,
  required
} from 'react-admin';
import { ColorField } from 'react-admin-color-input';
import { Icon } from '@material-ui/core';

import MarkdownField from 'components/MarkdownField';
import { EventTitle } from './shared';

const Show = (props) => (
  <ShowBase title={ <EventTitle /> } { ...props }>
    <TabbedForm>
      <FormTab label="Obecné">
        <TextField label="ID" source="id" />
        <TextField label='Název' source="name" validate={ required() } />
        <NumberField label='Rok konání' source="year"/>
        <NumberField label='Rok konání' source="year"/>
        <SelectField label='Tag' source="type"
          choices={ [
            { id: true, name: 'Bitva' },
            { id: false, name: 'Šarvátka' }
          ] }
        />
        <MarkdownField label='Titulek' source="description" />
        <BooleanField label='Zobrazitelné' source="display" />
      </FormTab>
      <FormTab label="Pravidla">
        <MarkdownField addLabel={ false } source="rules" />
        <ImageField source="rules_image.src" title="title" />
      </FormTab>
      <FormTab label="Strany">
        <ReferenceManyField reference='races' target='event' addLabel={ false }>
          <Datagrid>
            <TextField label='Název' source="name" />
            <TextField label='Limit' source="limit" />
            <FunctionField label='Obrázek' source="image" render={ ({ image }) => <Icon>{ image ? 'check' : 'close' }</Icon> }/>
            <ColorField label='Barva' source='color'/>
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </FormTab>
      <FormTab label="Účastníci">
        <ReferenceManyField reference='participants' target='event' addLabel={ false }>
          <Datagrid>
            <TextField source="nickName" label="Přezdívka" />
            <TextField source="firstName" label="Jméno" />
            <TextField source="lastName" label="Příjmení" />
            <ReferenceField source="race" reference="races" addLabel={ false }>
              <TextField source="name" label="Strana" />
            </ReferenceField>
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </FormTab>
      <FormTab label="Registrace">
        <BooleanField label='Otevřená registrace' source="registrationAvailable" />
        <MarkdownField label='Úvod: Nahoře' source="registrationBeforeAbove" />
        <MarkdownField label='Úvod: Dole' source="registrationBeforeBelow" />
        <MarkdownField label='Úspěšná registrace' source="registrationAfter" />
        <MarkdownField label='Přihlášení účastníci' source="registrationList" />
      </FormTab>
      <FormTab label="Ostatní">
        <FileField source="declaration.src" title="title" />
        <NumberField label='Cena' source="price"/>
      </FormTab>
      <FormTab label="Kontakty">
        <ImageField source="contactImage.src" title="title" />
        <MarkdownField label='O organizátorech' source="contactText" />
        <UrlField label='FB událost' source="contact.facebook"/>
        <UrlField label='Larpová databáze' source="contact.larpovadatabaze"/>
        <UrlField label='LARP.cz' source="contact.larpcz"/>
        <UrlField label='E-mail' source="contact.email"/>
        {/* <DateTimeField source='times.date' format={v => v.toDate()} parse={v => v.fromDate()}/> */}
      </FormTab>
    </TabbedForm>
  </ShowBase>
);

export default Show;
