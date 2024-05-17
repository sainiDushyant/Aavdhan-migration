import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { loginApi } from '../../api/loginSlice';
import { forgotPasswordApi } from '../../api/forgot-passwordSlice';
import { commandHistoryApi } from '../../api/command-historySlice';
import { dropdownsApi } from '../../api/drop-downSlice';
import { pushDataApi } from '../../api/push-dataSlice';
import {
  utilityMDASAssetListReducer,
  utilityMDASDlmsCommandReducer,
} from './commandExecutionSlice';
import { meterConfigurationApi } from '../../api/meter-configurationSlice';

export const store = configureStore({
  reducer: {
    [loginApi.reducerPath]: loginApi.reducer,
    [forgotPasswordApi.reducerPath]: forgotPasswordApi.reducer,
    [commandHistoryApi.reducerPath]: commandHistoryApi.reducer,
    [pushDataApi.reducerPath]: pushDataApi.reducer,
    [meterConfigurationApi.reducerPath]: meterConfigurationApi.reducer,
    [dropdownsApi.reducerPath]: dropdownsApi.reducer,
    utilityMDASAssetList: utilityMDASAssetListReducer,
    utilityMDASDlmsCommand: utilityMDASDlmsCommandReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware()
      .concat(loginApi.middleware)
      .concat(forgotPasswordApi.middleware)
      .concat(commandHistoryApi.middleware)
      .concat(dropdownsApi.middleware)
      .concat(pushDataApi.middleware)
      .concat(meterConfigurationApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
