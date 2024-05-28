import StatsHorizontal from '../../../../../../@core/components/widgets/stats/StatsHorizontal';
import { Col } from 'reactstrap';
import { useState } from 'react';
import { ChevronsRight } from 'react-feather';

import BlockLoadDataModal from './blockLoadDataModal';

const BlockLoadWrapper = (parms) => {
  const [centeredModal, setCenteredModal] = useState(false);

  return (
    <div>
      <Col className=" ">
        <StatsHorizontal
          icon={<ChevronsRight size={21} />}
          color="primary"
          stats="Block Load"
          statTitle=""
          clas="h6"
          click={() => setCenteredModal(true)}
        />
      </Col>
      {centeredModal && (
        <BlockLoadDataModal
          title={'Latest Block Load Information'}
          isOpen={centeredModal}
          handleModalState={setCenteredModal}
        />
      )}
    </div>
  );
};

export default BlockLoadWrapper;
