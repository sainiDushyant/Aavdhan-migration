import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import MdmsPssModule from './pss';
import MdmsFeederModule from './feeder';
import MdmsDtrModule from './dtr';

// import MdmsFeederModule from '@src/views/project/utility/module/mdms/feeder';
// import MdmsDtrModule from '@src/views/project/utility/module/mdms/dtr';
// import Error from '@src/views/Error';

// import AllUsers from '@src/views/project/utility/module/mdms/users';
// import MdmsUserConsumptionModule from '@src/views/project/utility/module/mdms/userProfile';

const MdmsUtility = () => {
  const location = useLocation();

  //Local state to manage selected user connection type
  const [connectionType, setConnectionType] = useState('');

  //Local State to manage whether to show back button on User Component or not
  const [usersBackButton, setUserBackButton] = useState(true);

  const updateConnectionType = (type) => {
    setConnectionType(type);
  };

  let project = '';
  if (location.pathname.split('/')[2] === 'sbpdcl') {
    project = 'ipcl';
  } else {
    project = location.pathname.split('/')[2];
  }

  const [mdmsState, setMdmsState] = useState('pss');
  const mdmsStateHandler = (state) => {
    setMdmsState(state);
  };

  return mdmsState === 'pss' ? (
    <MdmsPssModule statehandler={mdmsStateHandler} />
  ) : mdmsState === 'feeder' ? (
    <MdmsFeederModule statehandler={mdmsStateHandler} />
  ) : mdmsState === 'dtr' ? (
    <MdmsDtrModule statehandler={mdmsStateHandler} />
  ) : (
    ''
  );
  // ) : mdmsState === 'dtr' ? (
  //   <MdmsDtrModule statehandler={mdmsStateHandler} />
  // ) : mdmsState === 'user' ? (
  //   <AllUsers
  //     updateConnectionType={updateConnectionType}
  //     // id={props.dtr_list[0]['id']}
  //     txtLen={16}
  //     tableName={'All Users'}
  //     updateMdmsState={mdmsStateHandler}
  //     showBackButton={usersBackButton}
  //   />
  // ) : mdmsState === 'userConsumption' || mdmsState === 'user_profile' ? (
  //   <MdmsUserConsumptionModule
  //     showBackButton={true}
  //     connection_type={connectionType}
  //     updateMdmsState={mdmsStateHandler}
  //   />
  // ) : (
  //   ''
  // );
  // return <MdmsPssModule statehandler={mdmsStateHandler} />;
};

export default MdmsUtility;
