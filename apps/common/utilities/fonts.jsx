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
  },
  custom: {
    families: ['Font Awesome\ 5 Icons:400,900', 'Font Awesome\ 5 Brands:400'],
    urls: ['//use.fontawesome.com/releases/v5.11.1/css/all.css']
  }
});
