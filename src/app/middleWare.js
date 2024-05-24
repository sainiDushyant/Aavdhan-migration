import { MiddlewareArray } from '@reduxjs/toolkit';
import { loginApi } from '../api/loginSlice';
import { forgotPasswordApi } from '../api/forgot-passwordSlice';
import { commandHistoryApi } from '../api/hes/command-historySlice';
import { dropdownsApi } from '../api/hes/drop-downSlice';
import logoutApi from '../api/logoutSlice';
import { pushDataApi } from '../api/hes/push-dataSlice';
import { meterConfigurationApi } from '../api/hes/meter-configurationSlice';
import { energyConsumptionApi } from '../api/mdms/energy-consumptionSlice';

const middleware = new MiddlewareArray().concat(
  loginApi.middleware,
  forgotPasswordApi.middleware,
  commandHistoryApi.middleware,
  dropdownsApi.middleware,
  pushDataApi.middleware,
  meterConfigurationApi.middleware,
  logoutApi.middleware,
  energyConsumptionApi.middleware
);

export default middleware;
