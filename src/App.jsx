import React, { useEffect } from 'react';
import Router from './pages/Router';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSelectedModule } from './app/redux/previousSelectedModuleSlice';

const App = () => {
  const dispatch = useDispatch();
  const project = window.location.href.split('/')[5];
  const currentSelectedModule = useSelector(
    (state) => state.currentSelectedModule
  );

  useEffect(() => {
    if (currentSelectedModule !== project) {
      dispatch(setCurrentSelectedModule(project));
    }
  }, [currentSelectedModule, project, dispatch]);

  return <Router />;
};

export default App;
