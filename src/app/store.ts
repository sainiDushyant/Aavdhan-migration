import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { loginApi } from '../api/loginSlice';
import { forgotPasswordApi } from '../api/forgot-passwordSlice';
import { commandHistoryApi } from '../api/command-historySlice';

export const store = configureStore({
  reducer: {
    [loginApi.reducerPath]:loginApi.reducer,
    [forgotPasswordApi.reducerPath]:forgotPasswordApi.reducer,
    [commandHistoryApi.reducerPath]:commandHistoryApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loginApi.middleware).concat(forgotPasswordApi.middleware).concat(commandHistoryApi.middleware),
    

});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
