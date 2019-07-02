import { createStore, applyMiddleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import devToolsEnhancer from 'remote-redux-devtools';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  timeout: 0,
  storage,
  blacklist: ['error']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(rootReducer, devToolsEnhancer());
// export const store = createStore(rootReducer, applyMiddleware(logger));
export const persistor = persistStore(store);
