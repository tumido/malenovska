import Loadable from 'react-loadable';

import { Loading } from 'components';

/* eslint-disable new-cap */
export default Loadable({
  loader: () => import('./index'),
  loading: Loading
});
