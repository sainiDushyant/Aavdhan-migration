import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LayoutWrapper from '../../components/layout/LayoutWrapper';
import Error from '../Error';
import { routes } from './Routes';
import Loader from '../../components/loader/loader';
import PrivateRoute from './ProtectedRoute'; // Import the PrivateRoute component

const LazyLogin = lazy(() => import('../login'));
const LazyForgotPassword = lazy(() => import('../forgotPassword'));
const LazyUserAccessPanel = lazy(() => import('../userAccessPanel/index'));

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Route for Login and ForgotPassword */}
        <Route
          path="/"
          element={
            <Suspense fallback={<Loader hight={'min-height-800'} />}>
              <LazyLogin />
            </Suspense>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loader hight={'min-height-800'} />}>
              <LazyForgotPassword />
            </Suspense>
          }
        />
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          {routes.map((mainRoute) =>
            mainRoute.modules.map((module) => (
              <Route
                key={module.key}
                path={module.path}
                element={
                  <LayoutWrapper>
                    <Suspense fallback={<Loader hight={'min-height-800'} />}>
                      <module.component />
                    </Suspense>
                  </LayoutWrapper>
                }
              />
            ))
          )}
          <Route
            path="/admin"
            element={
              <LayoutWrapper>
                <Suspense fallback={<Loader hight={'min-height-800'} />}>
                  <LazyUserAccessPanel />
                </Suspense>
              </LayoutWrapper>
            }
          />
        </Route>
        {/* Route for Error */}
        <Route path="*" element={<Error />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
