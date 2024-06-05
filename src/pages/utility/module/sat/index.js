import { useRef, useState } from 'react';
import Wizard from '../../../../@core/components/wizard';
import { FileText, User } from 'react-feather';
import CreateSatProject from './createSatProject';
import ConfigureSat from './configureSat';

const Sat = () => {
  const [stepper, setStepper] = useState(null);
  const [row, setRow] = useState({});

  const ref = useRef(null);

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
      onClick: () => {
        stepper.previous();
      },
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
