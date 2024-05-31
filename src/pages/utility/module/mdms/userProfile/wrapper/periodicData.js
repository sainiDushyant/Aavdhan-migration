import StatsHorizontal from '../../../../../../@core/components/widgets/stats/StatsHorizontal';
import { useState } from 'react';
import { ChevronRight } from 'react-feather';

import PeriodicDataModal from './periodicDataModal';

const PeriodicWrapper = () => {
  const [centeredModal, setCenteredModal] = useState(false);

  return (
    <div>
      <StatsHorizontal
        icon={<ChevronRight size={21} />}
        color="primary"
        stats="Periodic data"
        statTitle=""
        click={() => setCenteredModal(true)}
        clas="h6"
        avatar={true}
      />
      {centeredModal && (
        <PeriodicDataModal
          title={'Periodic data table'}
          isOpen={centeredModal}
          handleModalState={setCenteredModal}
        />
      )}
    </div>
  );
};

export default PeriodicWrapper;
