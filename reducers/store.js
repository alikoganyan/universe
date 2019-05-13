import {
	createStore,
	applyMiddleware,
  } from 'redux';
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import devToolsEnhancer from 'remote-redux-devtools';
import thunk from 'redux-thunk';

const persistConfig = {
	key: 'root',
	timeout: 0,
	storage,
	blacklist: ['error']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk), devToolsEnhancer()))
export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
export const persistor = persistStore(store)