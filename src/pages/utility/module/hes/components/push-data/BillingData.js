import { CardBody, Card, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import CommonMeterDropdown from '../commonMeterDropdown';

import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';

import Loader from '../../../../../../components/loader/loader';

import { caseInsensitiveSort } from '../../../../../../utils';

import PushDataDownloadWrapper from './PushDataDownloadWrapper';

import { X } from 'react-feather';

import { getDefaultDateTimeRange } from '../../../../../../utils';
import { useGetBillingDataQuery } from '../../../../../../api/push-dataSlice';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';

const BillingData = () => {
  const location = useLocation();

  const defaultDateTime = getDefaultDateTimeRange();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(120);

  const [response, setResponse] = useState([]);
  const [filterParams, setFilterParams] = useState({
    start_date: defaultDateTime.startDateTime,
    end_date: defaultDateTime.endDateTime,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const [showReportDownloadModal, setShowReportDownloadModal] = useState(false);

  let project = '';
  if (location.pathname.split('/')[2] === 'sbpdcl') {
    project = 'ipcl';
  } else {
    project = location.pathname.split('/')[2];
  }

  let params = {};

  if (!filterParams.hasOwnProperty('site')) {
    params = {
      project,
      ...filterParams,
      page: currentPage,
      page_size: 10,
    };
    // params['site'] = dtr_list
  } else {
    params = {
      project,
      ...filterParams,
      page: currentPage,
      page_size: 10,
    };
  }

  const { data, isFetching, isError, refetch } = useGetBillingDataQuery(params);

  useEffect(() => {
    let statusCode = data?.responseCode;
    if (statusCode === 200) {
      const billingDataResponse = [];
      const results = data?.data.result.results;

      const command_sequence = {
        billing_datetime: 'Billing_Date',
        systemPF: 'Average_Power_Factor_For_Billing_Period',
        kwhSnap: 'Cum._Active_Imp._Energy_(kWh)',
        import_Wh_TOD_1: 'Cum._Active_Imp._Energy_(kWh)_T1',
        import_Wh_TOD_2: 'Cum._Active_Imp._Energy_(kWh)_T2',
        import_Wh_TOD_3: 'Cum._Active_Imp._Energy_(kWh)_T3',
        import_Wh_TOD_4: 'Cum._Active_Imp._Energy_(kWh)_T4',
        kvahSnap: 'Cum._Apparent_Imp._Energy_(kVAh)',
        import_VAh_TOD_1: 'Cum._Apparent_Imp._Energy_(kVAh)_T1',
        import_VAh_TOD_2: 'Cum._Apparent_Imp._Energy_(kVAh)_T2',
        import_VAh_TOD_3: 'Cum._Apparent_Imp._Energy_(kVAh)_T3',
        import_VAh_TOD_4: 'Cum._Apparent_Imp._Energy_(kVAh)_T4',
        MDKwh: 'MD_kW',
        MDKwhTS: 'MD_kW_with_Date/Time',
        MDKvah: 'MD_kVA',
        MDKvahTS: 'MD_kVA_with_Date/Time',
        billingDuration: 'Billing_Power_ON_Duration_(Minutes)',
        kwhSnapExport: 'Cum._Active_Exp._Energy_(kWh)',
        kvahSnapExport: 'Cum._Apparent_Exp._Energy_(kVAh)',
        reporting_timestamp: 'report_timestamp',
      };
      const keysToConvertWh = [
        'MD_kW',
        'Average_Power_Factor_For_Billing_Period',
        'Cum._Active_Imp._Energy_(kWh)',
        'Cum._Active_Imp._Energy_(kWh)_T1',
        'Cum._Active_Imp._Energy_(kWh)_T2',
        'Cum._Active_Imp._Energy_(kWh)_T3',
        'Cum._Active_Imp._Energy_(kWh)_T4',
        'Cum._Active_Exp._Energy_(kWh)',
      ];
      const keysToConvertVAh = [
        'MD_kVA',
        'Cum._Apparent_Imp._Energy_(kVAh)',
        'Cum._Apparent_Imp._Energy_(kVAh)_T1',
        'Cum._Apparent_Imp._Energy_(kVAh)_T2',
        'Cum._Apparent_Imp._Energy_(kVAh)_T3',
        'Cum._Apparent_Imp._Energy_(kVAh)_T4',
        'Cum._Apparent_Exp._Energy_(kVAh)',
      ];

      for (let i = 0; i < results.length; i++) {
        const item = results[i].data;
        item.reporting_timestamp = results[i].report_timestamp;

        // Check if item is an object (not an array)
        if (typeof item === 'object' && item !== null) {
          if (item.hasOwnProperty('total_poweron_duraion_min')) {
            item['Total power on duration'] = item['total_poweron_duraion_min'];
            delete item['total_poweron_duraion_min'];
          }
          for (const key in item) {
            if (command_sequence.hasOwnProperty(key)) {
              const commandSequence = command_sequence[key];

              if (
                keysToConvertWh &&
                keysToConvertWh.includes(commandSequence)
              ) {
                // Convert from Wh to kWh
                item[commandSequence] = item[key] / 1000;
                if (item[key] !== 0) {
                  item[commandSequence] = item[commandSequence]?.toFixed(4);
                }
              } else if (
                keysToConvertVAh &&
                keysToConvertVAh.includes(commandSequence)
              ) {
                // Convert from VAh to kVAh
                item[commandSequence] = item[key] / 1000;
                if (item[key] !== 0) {
                  item[commandSequence] = item[commandSequence]?.toFixed(4);
                }
              } else {
                item[commandSequence] = item[key];
              }
              // If the key is different from the mapped key, delete it
              if (commandSequence !== key) {
                delete item[key];
              }
            }
            if (item[key] === '65535-00-00 00:00:00') {
              item[key] = '--';
            }
          }
          billingDataResponse.push(item);
        }
      }

      setResponse(billingDataResponse);
      setTotalCount(data?.data.result.count);
    } else {
      setErrorMessage('Network Error, please retry');
    }
  }, [data]);
  const tblColumn = () => {
    const column = [];
    const custom_width = ['blockload_datetime'];

    for (const i in response[0]) {
      const col_config = {};
      if (i !== 'id') {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.sortable = true;
        col_config.reorder = true;
        col_config.width = '180px';
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);

        if (custom_width.includes(i)) {
          col_config.width = '190px';
        }

        col_config.cell = (row) => {
          return (
            <div className="d-flex">
              <span className="d-block font-weight-bold ">{row[i]}</span>
            </div>
          );
        };
        column.push(col_config);
      }
    }
    column.unshift({
      name: 'Sr No.',
      width: '90px',
      sortable: false,
      cell: (row, i) => {
        return (
          <div className="d-flex justify-content-center">
            {i + 1 + 10 * (currentPage - 1)}
          </div>
        );
      },
    });

    return column;
  };

  const onNextPageClicked = (number) => {
    setCurrentPage(number + 1);
  };
  const reloadData = () => {
    setCurrentPage(1);
    refetch();
  };

  const onSubmitButtonClicked = (filterParams) => {
    setFilterParams(filterParams);
    setCurrentPage(1);
  };

  const retryAgain = () => {
    refetch();
  };

  const handleReportDownloadModal = () => {
    setShowReportDownloadModal(!showReportDownloadModal);
  };

  // custom Close Button for Report Download Modal
  const CloseBtnForReportDownload = (
    <X
      className="cursor-pointer mt_5"
      size={15}
      onClick={handleReportDownloadModal}
    />
  );

  return (
    <>
      <Card>
        <CardBody>
          <CommonMeterDropdown
            tab="block_load"
            set_resp={setResponse}
            onSubmitButtonClicked={onSubmitButtonClicked}
            billingData={true}
          />
        </CardBody>
        {isFetching ? (
          <Loader hight="min-height-330" />
        ) : isError ? (
          <CardInfo
            props={{
              message: { errorMessage },
              retryFun: { retryAgain },
              retry: { isFetching },
            }}
          />
        ) : (
          !isFetching && (
            <div className="table-wrapper">
              <DataTableV1
                columns={tblColumn()}
                data={response}
                rowCount={10}
                tableName={'Billing Data'}
                showDownloadButton={true}
                showRefreshButton={true}
                refreshFn={reloadData}
                currentPage={currentPage}
                totalRowsCount={totalCount}
                onPageChange={onNextPageClicked}
                isLoading={isFetching}
                pointerOnHover={true}
                extraTextToShow={
                  <div
                    className={`${
                      totalCount ? 'text-success' : 'text-danger'
                    } m-0`}
                  >
                    Total Billing Count: {totalCount}
                  </div>
                }
                handleReportDownloadModal={handleReportDownloadModal}
                isDownloadModal={'yes'}
              />
            </div>
          )
        )}
      </Card>

      {/* Report Download Request History Modal */}
      <Modal
        isOpen={showReportDownloadModal}
        toggle={handleReportDownloadModal}
        style={{ width: '82%' }}
        modalClassName="modal-slide-in"
        contentClassName="pt-0"
      >
        <ModalHeader
          className="d-flex justify-content-between"
          toggle={handleReportDownloadModal}
          close={CloseBtnForReportDownload}
          tag="div"
        >
          <h4 className="modal-title">Download (Billing Data)</h4>
        </ModalHeader>
        <ModalBody className="flex-grow-1">
          <PushDataDownloadWrapper
            report_name={'billing_data'}
            table_name={'Billing Data Table'}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default BillingData;
