import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../components/counter/counterSlice';
import { loginApi } from '../api/loginSlice';
import { generateOTP } from '../api/forgot-passwordSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [loginApi.reducerPath]:loginApi.reducer,
    [generateOTP.reducerPath]:generateOTP.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loginApi.middleware).concat(generateOTP.middleware),
    

});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
