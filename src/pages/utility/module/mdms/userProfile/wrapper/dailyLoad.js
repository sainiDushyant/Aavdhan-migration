import StatsHorizontal from '../../../../../../@core/components/widgets/stats/StatsHorizontal';
import { useState } from 'react';
import { ChevronRight } from 'react-feather';

import DailyLoadModal from './dailyLoadModal';

const DailyLoad = () => {
  const [centeredModal, setCenteredModal] = useState(false);

  return (
    <div>
      <StatsHorizontal
        icon={<ChevronRight size={21} />}
        color="primary"
        stats="Daily load"
        statTitle=""
        click={() => setCenteredModal(true)}
        clas="h6"
        avatar={true}
      />
      {centeredModal && (
        <DailyLoadModal
          title={'Daily load table'}
          isOpen={centeredModal}
          handleModalState={setCenteredModal}
        />
      )}
    </div>
  );
};

export default DailyLoad;
