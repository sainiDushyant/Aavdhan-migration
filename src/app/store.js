import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import middleware from './middleWare';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});
