import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { loginApi } from '../../api/loginSlice';
import { forgotPasswordApi } from '../../api/forgot-passwordSlice';
import { commandHistoryApi } from '../../api/command-historySlice';
import { dropdownsApi } from '../../api/drop-downSlice';
import utilityMDASAssetListReducer from './commandExecutionSlice'


export const store = configureStore({
  reducer: {
    [loginApi.reducerPath]:loginApi.reducer,
    [forgotPasswordApi.reducerPath]:forgotPasswordApi.reducer,
    [commandHistoryApi.reducerPath]:commandHistoryApi.reducer,
    [dropdownsApi.reducerPath]:dropdownsApi.reducer,
    utilityMDASAssetList: utilityMDASAssetListReducer
  },
  middleware: (getDefaultMiddleware :any) =>
    getDefaultMiddleware().concat(loginApi.middleware).concat(forgotPasswordApi.middleware).concat(commandHistoryApi.middleware).concat(dropdownsApi.middleware),
    

});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
