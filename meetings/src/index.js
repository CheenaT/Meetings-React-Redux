import React from 'react';
import { render } from 'react-dom';
import Meetings from './Meetings';
import * as serviceWorker from './serviceWorker';
import "./style.scss";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducers';

const store = createStore(rootReducer);

render(
  <Provider store={store}>
    <Meetings />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
