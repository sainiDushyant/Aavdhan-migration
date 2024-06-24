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
import { currentSelectedModuleReducer } from './redux/previousSelectedModuleSlice';
import { MDMSHierarchyProgressReducer } from './redux/mdmsHeirarchySlice';
import { pushDataApi } from '../api/hes/push-dataSlice';
import { meterConfigurationApi } from '../api/hes/meter-configurationSlice';
import layoutReducer from './redux/layoutSlice';
import { energyConsumptionApi } from '../api/mdms/energy-consumptionSlice';
import { operationalStatsApi } from '../api/mdms/operational-statisticsSlice';
import { loadsApi } from '../api/mdms/loadSlice';
import { userConsumptionApi } from '../api/mdms/userConsumptionSlice';
import { slaReportsApi } from '../api/sla-reports';
import { satApi } from '../api/sat';
import { userAccessPanelApi } from '../api/user-access-panel';

const rootReducer = combineReducers({
  [loginApi.reducerPath]: loginApi.reducer,
  [forgotPasswordApi.reducerPath]: forgotPasswordApi.reducer,
  [commandHistoryApi.reducerPath]: commandHistoryApi.reducer,
  [pushDataApi.reducerPath]: pushDataApi.reducer,
  [logoutApi.reducerPath]: logoutApi.reducer,
  [meterConfigurationApi.reducerPath]: meterConfigurationApi.reducer,
  [energyConsumptionApi.reducerPath]: energyConsumptionApi.reducer,
  [operationalStatsApi.reducerPath]: operationalStatsApi.reducer,
  [loadsApi.reducerPath]: loadsApi.reducer,
  [userConsumptionApi.reducerPath]: userConsumptionApi.reducer,
  [slaReportsApi.reducerPath]: slaReportsApi.reducer,
  [userAccessPanelApi.reducerPath]: userAccessPanelApi.reducer,
  [dropdownsApi.reducerPath]: dropdownsApi.reducer,
  [satApi.reducerPath]: satApi.reducer,
  layout: layoutReducer,
  utilityMDASAssetList: utilityMDASAssetListReducer,
  utilityMDASDlmsCommand: utilityMDASDlmsCommandReducer,
  currentSelectedModule: currentSelectedModuleReducer,
  MDMSHierarchyProgress: MDMSHierarchyProgressReducer,
});

export default rootReducer;
