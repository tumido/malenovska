import WebFont from 'webfontloader';

export default () => WebFont.load({
  google: {
    families: [
      'Open Sans:400,700',
      'Amatic SC:700',
      'Roboto:300,400,500,700',
      'Material Icons',
      'Material Icons Outlined'
    ]
  }
});
