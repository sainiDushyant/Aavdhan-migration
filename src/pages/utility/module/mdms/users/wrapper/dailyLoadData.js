import StatsHorizontal from '../../../../../../@core/components/widgets/stats/StatsHorizontal';
import { Col } from 'reactstrap';
import { useState } from 'react';
import { ChevronsRight } from 'react-feather';

import DailyLoadDataModal from './dailyLoadDataModal';
const DailyLoadWrapper = () => {
  const [centeredModal, setCenteredModal] = useState(false);

  return (
    <div>
      <Col className=" ">
        <StatsHorizontal
          icon={<ChevronsRight size={21} />}
          color="primary"
          stats="Daily Load"
          statTitle=""
          clas="h6"
          click={() => setCenteredModal(true)}
        />
      </Col>
      {centeredModal && (
        <DailyLoadDataModal
          title={'Latest Daily Load Information'}
          isOpen={centeredModal}
          handleModalState={setCenteredModal}
        />
      )}
    </div>
  );
};

export default DailyLoadWrapper;
