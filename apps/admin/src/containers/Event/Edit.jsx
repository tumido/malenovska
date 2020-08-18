import React from 'react';
import {
  Edit as EditBase,
  Datagrid, TabbedForm, FormTab,
  TextInput, BooleanInput, NumberInput, SelectInput, FileInput, ImageInput,
  FunctionField, FileField, ImageField, TextField, ReferenceManyField, ReferenceField,
  EditButton,
  useNotify, useRedirect,
  required
} from 'react-admin';
import PropTypes from 'prop-types';
import { ColorField } from 'react-admin-color-input';
import { DateInput, KeyboardTimeInput } from 'react-admin-date-inputs';
import { Icon } from '@material-ui/core';

import MarkdownInput from 'components/MarkdownInput';
import { EventTitle } from './shared';
import { useStyles, setCacheForRecord } from '../shared';

const Edit = (props) => {
  const classes = useStyles();

  const notify = useNotify();
  const redirectTo = useRedirect();
  const onSuccess = setCacheForRecord({
    collection: 'events',
    records: [ 'contactImage', 'rulesImage', 'declaration' ],
    isCreate: false,
    basePath: props.basePath,
    redirectTo, notify
  });

  return (
    <EditBase
      onSuccess={ onSuccess } undoable={ false } title={ <EventTitle /> }  { ...props }>
      <TabbedForm>
        <FormTab label="Obecné">
          <TextInput label="ID" source="id" disabled formClassName={ classes.inlineBlock } />
          <TextInput label='Název' source="name" validate={ required() } formClassName={ classes.inlineBlock } />
          <NumberInput label='Rok' source="year" formClassName={ classes.inlineBlock } />
          <DateInput label="Datum konání" source='date' formClassName={ classes.inlineBlock } />
          <SelectInput label='Tag' source="type" formClassName={ classes.inlineBlock }
            choices={ [
              { id: true, name: 'Bitva' },
              { id: false, name: 'Šarvátka' }
            ] }
          />
          <BooleanInput label='Zobrazitelné' source="display"/>
          <MarkdownInput label='Titulek' source="description" />
        </FormTab>
        <FormTab label="Pravidla">
          <MarkdownInput label="" source="rules" />
          <ImageInput label="Obrázek" source="rulesImage">
            <ImageField source="src" title="title" />
          </ImageInput>
        </FormTab>
        <FormTab label="Strany">
          <ReferenceManyField reference='races' target='event' fullWidth>
            <Datagrid>
              <TextField label='Název' source="name" />
              <TextField label='Limit' source="limit" />
              <FunctionField label='Obrázek' source="image" render={ ({ image }) => <Icon>{image ? 'check' : 'close'}</Icon> } />
              <ColorField label='Barva' source='color' />
              <EditButton />
            </Datagrid>
          </ReferenceManyField>
        </FormTab>
        <FormTab label="Účastníci">
          <ReferenceManyField reference='participants' target='event' fullWidth>
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
          <NumberInput label='Cena' source="price" />
        </FormTab>
        <FormTab label="Kontakty">
          <TextInput label='FB událost' source="contact.facebook" formClassName={ classes.inlineBlock } />
          <TextInput label='Larpová databáze' source="contact.larpovadatabaze" formClassName={ classes.inlineBlock } />
          <TextInput label='LARP.cz' source="contact.larpcz" formClassName={ classes.inlineBlock } />
          <TextInput label='E-mail' source="contact.email" formClassName={ classes.inlineBlock } />
          <ImageInput label="Foto organizátorů" source="contactImage">
            <ImageField source="src" title="title" />
          </ImageInput>
          <MarkdownInput label='O organizátorech' source="contactText" />
        </FormTab>
        <FormTab label="Harmonogram">
          <KeyboardTimeInput label="Začátek akce" source='onsiteStart' options={ { ampm: false } } formClassName={ classes.inlineBlock }/>
          <KeyboardTimeInput label="Konec akce" source='onsiteEnd' options={ { ampm: false } } formClassName={ classes.inlineBlock }/>
          <br />
          <KeyboardTimeInput
            label="Otevření registrace na místě"
            source='onsiteRegistrationOpen'
            options={ { ampm: false } }
            formClassName={ classes.inlineBlock }/>
          <KeyboardTimeInput
            label="Uzavření registrace na místě"
            source='onsiteRegistrationClose'
            options={ { ampm: false } }
            formClassName={ classes.inlineBlock }/>
          <KeyboardTimeInput label="Seznámení s pravidly" source='onsiteRules' options={ { ampm: false } } formClassName={ classes.inlineBlock }/>
          <KeyboardTimeInput label="První quest" source='onsiteQuestStart' options={ { ampm: false } } formClassName={ classes.inlineBlock }/>
          <KeyboardTimeInput label="Závěrečná bitva" source='onsiteLastQuest' options={ { ampm: false } } formClassName={ classes.inlineBlock }/>
        </FormTab>
      </TabbedForm>
    </EditBase>
  );
};

Edit.propTypes = {
  basePath: PropTypes.string
};

export default Edit;
