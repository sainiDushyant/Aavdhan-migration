import StatsHorizontal from '../../../../../../@core/components/widgets/stats/StatsHorizontal';
import { Col } from 'reactstrap';
import { useState } from 'react';
import { ChevronsRight } from 'react-feather';

import BillingHistoryDataModal from './billingHistoryDataModal';

const BillingHistoryWrapper = () => {
  const [centeredModal, setCenteredModal] = useState(false);

  return (
    <div>
      <Col className=" ">
        <StatsHorizontal
          icon={<ChevronsRight size={21} />}
          color="primary"
          stats="Billing History"
          statTitle=""
          clas="h6"
          click={() => setCenteredModal(true)}
        />
      </Col>
      {centeredModal && (
        <BillingHistoryDataModal
          title={'Latest Billing History Information'}
          isOpen={centeredModal}
          handleModalState={setCenteredModal}
        />
      )}
    </div>
  );
};

export default BillingHistoryWrapper;
