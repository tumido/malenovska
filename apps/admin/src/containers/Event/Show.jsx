import React from 'react';
import {
  Show as ShowBase,
  Datagrid, TabbedForm, FormTab,
  FunctionField, FileField, ImageField, NumberField, TextField, BooleanField, SelectField, ReferenceManyField, ReferenceField, UrlField,
  EditButton
} from 'react-admin';
import { Icon } from '@material-ui/core';

import { MarkdownField, TimeField } from 'components';
import { EventTitle } from './shared';
import { useStyles, LocaleDateField } from '../shared';

const Show = (props) => {
  const classes = useStyles();

  return (
    <ShowBase title={ <EventTitle /> } { ...props }>
      <TabbedForm>
        <FormTab label="Obecné">
          <TextField label="ID" source="id" formClassName={ classes.inlineBlock } />
          <TextField label='Název' source="name" formClassName={ classes.inlineBlock } />
          <TextField label='Rok konání' source="year" formClassName={ classes.inlineBlock } />
          <LocaleDateField label="Datum konání" source='date' formClassName={ classes.inlineBlock } />
          <SelectField label='Tag' source="type" formClassName={ classes.inlineBlock }
            choices={ [
              { id: true, name: 'Bitva' },
              { id: false, name: 'Šarvátka' }
            ] }
          />
          <BooleanField label='Zobrazitelné' source="display" />
          <MarkdownField label='Titulek' source="description" />
        </FormTab>
        <FormTab label="Pravidla">
          <MarkdownField label="" source="rules" />
          <ImageField source="rules_image.src" title="title" />
        </FormTab>
        <FormTab label="Strany">
          <ReferenceManyField reference='races' target='event' label="" fullWidth>
            <Datagrid>
              <TextField label='Název' source="name" />
              <TextField label='Limit' source="limit" />
              <FunctionField label='Obrázek' source="image" render={ ({ image }) => <Icon>{image ? 'check' : 'close'}</Icon> } />
              <TextField label='Barva' source='color' />
              <EditButton />
            </Datagrid>
          </ReferenceManyField>
        </FormTab>
        <FormTab label="Účastníci">
          <ReferenceManyField reference='participants' target='event' label="" fullWidth>
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
          <BooleanField label='Otevřená registrace' source="registrationAvailable" />
          <MarkdownField label='Úvod: Nahoře' source="registrationBeforeAbove" />
          <MarkdownField label='Úvod: Dole' source="registrationBeforeBelow" />
          <MarkdownField label='Úspěšná registrace' source="registrationAfter" />
          <MarkdownField label='Přihlášení účastníci' source="registrationList" />
        </FormTab>
        <FormTab label="Ostatní">
          <FileField source="declaration.src" title="declaration.title" label="Potvrzení pro nezletilé" formClassName={ classes.inlineBlock } />
          <NumberField
            label='Cena'
            source="price"
            locales="cs"
            options={ { style: 'currency', currency: 'CZK' } }
            formClassName={ classes.inlineBlock } />
        </FormTab>
        <FormTab label="Kontakty">
          <UrlField label='FB událost' source="contact.facebook" formClassName={ classes.inlineBlock } />
          <UrlField label='Larpová databáze' source="contact.larpovadatabaze" formClassName={ classes.inlineBlock } />
          <UrlField label='LARP.cz' source="contact.larpcz" formClassName={ classes.inlineBlock } />
          <UrlField label='E-mail' source="contact.email" formClassName={ classes.inlineBlock } />
          <ImageField source="contactImage.src" title="title" />
          <MarkdownField label='O organizátorech' source="contactText" />
        </FormTab>
        <FormTab label="Harmonogram">
          <TimeField label="Začátek akce" source='onsiteStart' formClassName={ classes.inlineBlock } />
          <TimeField label="Konec akce" source='onsiteEnd' formClassName={ classes.inlineBlock } />
          <br />
          <TimeField label="Otevření registrace na místě" source='onsiteRegistrationOpen' formClassName={ classes.inlineBlock } />
          <TimeField label="Uzavření registrace na místě" source='onsiteRegistrationClose' formClassName={ classes.inlineBlock } />
          <TimeField label="Seznámení s pravidly" source='onsiteRules' formClassName={ classes.inlineBlock } />
          <TimeField label="První quest" source='onsiteQuestStart' formClassName={ classes.inlineBlock } />
          <TimeField label="Závěrečná bitva" source='onsiteLastQuest' formClassName={ classes.inlineBlock } />
        </FormTab>
      </TabbedForm>
    </ShowBase>
  );
};

export default Show;
