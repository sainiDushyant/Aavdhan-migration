import StatsHorizontal from '../../../../../../@core/components/widgets/stats/StatsHorizontal';
import { Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useState } from 'react';
import { ChevronRight } from 'react-feather';

import BillDetermine from './billDetermine';

const MonthlyBillDetermine = () => {
  const [centeredModal, setCenteredModal] = useState(false);

  return (
    <div>
      <StatsHorizontal
        icon={<ChevronRight size={21} />}
        color="primary"
        stats="Monthly bill determinant"
        statTitle=""
        click={() => setCenteredModal(true)}
        clas="h6"
        avatar={true}
      />
      {centeredModal && (
        <Modal
          isOpen={centeredModal}
          toggle={() => setCenteredModal(!centeredModal)}
          scrollable
          className="modal_size"
        >
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
            Monthly bill determinant table
          </ModalHeader>
          <ModalBody className="webi_scroller">
            <BillDetermine title="Monthly billing determinant" txtLen={10} />
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};

export default MonthlyBillDetermine;
