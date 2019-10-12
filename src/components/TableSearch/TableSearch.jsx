import React from 'react';
import PropTypes from 'prop-types';
import { Icon, InputBase } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.05),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.10)
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 100
    },
    '&:focus': {
      [theme.breakpoints.up('md')]: {
        width: 170
      }
    }
  }
}));

const TableSearch = ({ onChange = () => null }) => {
  const classes = useStyles();
  const [ value, setValue ] = React.useState('');

  const handleEscKeyPress = (event) => {
    if (event.key === 'Escape') {
      setValue('');
    }
  };

  React.useEffect(() => onChange(value), [ value ]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className={ classes.search }>
      <div className={ classes.searchIcon }>
        <Icon>search</Icon>
      </div>
      <InputBase
        placeholder="Hledat…"
        classes={ {
          root: classes.inputRoot,
          input: classes.inputInput
        } }
        inputProps={ { 'aria-label': 'search' } }
        onChange={ handleChange }
        onKeyDown={ handleEscKeyPress }
        value={ value }
      />
    </div>
  );
};

TableSearch.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default TableSearch;
