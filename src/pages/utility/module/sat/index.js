import { useEffect, useRef, useState } from 'react';
import Wizard from '../../../../@core/components/wizard';
import { FileText, User } from 'react-feather';
import CreateSatProject from './createSatProject';
import ConfigureSat from './configureSat';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setCurrentSelectedModule } from '../../../../app/redux/previousSelectedModuleSlice';

const Sat = () => {
  const [stepper, setStepper] = useState(null);
  const [row, setRow] = useState({});

  const ref = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const project = location.pathname.split('/')[2];
  const previousSelectedModule = useSelector(
    (state) => state.currentSelectedModule
  );

  // Effect to handle module change and stepper navigation
  useEffect(() => {
    if (previousSelectedModule !== project) {
      dispatch(setCurrentSelectedModule(project));
      if (stepper) {
        stepper.to(0); // Navigate to the first step
      }
    }
  }, [previousSelectedModule, project, dispatch, stepper]);

  const steps = [
    {
      id: 'test-cycle',
      title: 'Test Cycles ',
      icon: <FileText size={18} />,
      content: (
        <CreateSatProject
          stepper={stepper}
          setRow={setRow}
          type="wizard-horizontal"
        />
      ),
    },
    {
      id: 'text-config',
      title: 'Tests',
      icon: <User size={18} />,
      content: (
        <ConfigureSat stepper={stepper} row={row} type="wizard-horizontal" />
      ),
    },
  ];

  return (
    <>
      <h4> SAT</h4>
      <div className="horizontal-wizard ">
        <Wizard ref={ref} steps={steps} instance={(el) => setStepper(el)} />
      </div>
    </>
  );
};

export default Sat;
