import { STORAGE } from '../actionTypes';

export const getURL = (ref) => (dispatch, getState, getFirebase) => {
  const { storage: state } = getState();

  const handleFailure = () => {
    dispatch({ type: STORAGE.failed, id: ref });
    return Promise.resolve(null);
  };

  const handleSuccess = (url) => {
    dispatch({ type: STORAGE.pendingUrl, id: ref, href: url });
    return fetch(url, { mode: 'no-cors' })
    .then(() => {
      dispatch({ type: STORAGE.success, id: ref, href: url });
      return Promise.resolve(url);
    })
    .catch(handleFailure);
  };

  if (state[ref] && state[ref].status === 'FILE_SUCCESS') {
    return Promise.resolve(state[ref].href);
  }

  if (state[ref] && state[ref].status === 'FILE_FAILED') {
    return Promise.resolve(null);
  }

  dispatch({ type: STORAGE.pending, id: ref });

  const storage = getFirebase().storage();
  const fileRef = storage.ref().child(ref);

  return fileRef.getDownloadURL()
  .then(handleSuccess)
  .catch(handleFailure);
};

