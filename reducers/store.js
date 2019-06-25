import {
	createStore,
  } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';
import devToolsEnhancer from 'remote-redux-devtools';

const persistConfig = {
	key: 'root',
	timeout: 0,
	storage,
	blacklist: ['error']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(rootReducer,  devToolsEnhancer());
export const persistor = persistStore(store);
