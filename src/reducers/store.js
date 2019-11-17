import { createStore, applyMiddleware } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './rootReducer'
// import { composeWithDevTools } from 'redux-devtools-extension'
// import devToolsEnhancer from 'remote-redux-devtools'
import logger from 'redux-logger'
// import thunk from 'redux-thunk'

const persistConfig = {
  key: 'root3',
  timeout: 0,
  storage,
  blacklist: ['error', 'userReducer'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const store = createStore(rootReducer);
// export const store = createStore(rootReducer, composeWithDevTools())
export const store = __DEV__
  ? createStore(persistedReducer, applyMiddleware(logger))
  : createStore(persistedReducer)
export const persistor = persistStore(store)
