import StatsHorizontal from '../../../../../../@core/components/widgets/stats/StatsHorizontal';
import { useState } from 'react';
import { ChevronRight } from 'react-feather';

import BlockLoadModal from './blockLoadModal';

const BlockLoad = () => {
  const [centeredModal, setCenteredModal] = useState(false);

  return (
    <div>
      <StatsHorizontal
        icon={<ChevronRight size={21} />}
        color="primary"
        stats="Block load"
        statTitle=""
        click={() => setCenteredModal(true)}
        clas="h6"
        avatar={true}
      />
      {centeredModal && (
        <BlockLoadModal
          title={'Block load table'}
          isOpen={centeredModal}
          handleModalState={setCenteredModal}
        />
      )}
    </div>
  );
};

export default BlockLoad;
