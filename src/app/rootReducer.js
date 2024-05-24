import { combineReducers } from '@reduxjs/toolkit';
import { loginApi } from '../api/loginSlice';
import { forgotPasswordApi } from '../api/forgot-passwordSlice';
import { commandHistoryApi } from '../api/hes/command-historySlice';
import { dropdownsApi } from '../api/hes/drop-downSlice';
import logoutApi from '../api/logoutSlice';
import {
  utilityMDASAssetListReducer,
  utilityMDASDlmsCommandReducer,
} from '../app/redux/commandExecutionSlice';
import { MDMSHierarchyProgressReducer } from './redux/mdmsHeirarchySlice';
import { pushDataApi } from '../api/hes/push-dataSlice';
import { meterConfigurationApi } from '../api/hes/meter-configurationSlice';
import layoutReducer from './redux/layoutSlice';
import { energyConsumptionApi } from '../api/mdms/energy-consumptionSlice';

const rootReducer = combineReducers({
  [loginApi.reducerPath]: loginApi.reducer,
  [forgotPasswordApi.reducerPath]: forgotPasswordApi.reducer,
  [commandHistoryApi.reducerPath]: commandHistoryApi.reducer,
  [pushDataApi.reducerPath]: pushDataApi.reducer,
  [logoutApi.reducerPath]: logoutApi.reducer,
  [meterConfigurationApi.reducerPath]: meterConfigurationApi.reducer,
  [energyConsumptionApi.reducerPath]: energyConsumptionApi.reducer,
  layout: layoutReducer,
  [dropdownsApi.reducerPath]: dropdownsApi.reducer,
  utilityMDASAssetList: utilityMDASAssetListReducer,
  utilityMDASDlmsCommand: utilityMDASDlmsCommandReducer,
  MDMSHierarchyProgress: MDMSHierarchyProgressReducer,
});

export default rootReducer;
