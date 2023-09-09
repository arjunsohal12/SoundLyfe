import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from "./state";
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  REGISTER
} from "redux-persist"; // so we can save user State in local state, so when user closes tab/browser we still have user information
import storage from "redux-persist/lib/storage";
import { PersistGate } from 'redux-persist/integration/react';

// Some boilerplate, redux likes to do a little trolling
const persistConfig = { key: "root", storage, version: 1}; // , blacklist:['chatData']
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({ // Redux-js-toolkit docs
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PURGE, REGISTER] // stops some error apparently, check redux docs
      }
    })
  
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <Provider store = {store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>

  //</React.StrictMode>
);

