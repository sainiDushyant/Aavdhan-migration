import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Eye } from 'react-feather';
import { useEffect, useState } from 'react';
import Loader from '../../../../../../components/loader/loader';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';

import { useLocation } from 'react-router-dom';

import { caseInsensitiveSort } from '../../../../../../utils';
import { useGetPullBasedTamperEventQuery } from '../../../../../../api/mdms/userConsumptionSlice';

const BillDetermineActionModal = (props) => {
  const location = useLocation();

  const [histyData, setHistyData] = useState();
  const [centeredModal, setCenteredModal] = useState(false);
  const [response, setResponse] = useState({ push_data: [], pull_data: [] });
  const [currentPage, setCurrentPage] = useState(1);

  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);

  const projectName =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];
  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );

  const params = {
    page: currentPage,
    meter: HierarchyProgress.meter_serial_number,
    project: projectName,
    start_date: props.eventHistoryStartTime,
    end_date: props.eventHistoryEndTime,
    tamperd: '1',
  };
  const { isFetching, data, isError, status, refetch } =
    useGetPullBasedTamperEventQuery(params);

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        setResponse(data.data.result.results);
      }
    }
  }, [data, isError, status]);

  const tblColumn1 = () => {
    const column = [];

    for (const i in response.push_data[0]) {
      const col_config = {};
      if (i !== 'data' && i !== 'meter_id') {
        col_config.id = i;
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(1)}`.replace(
          '_',
          ' '
        );
        col_config.serch = i;
        col_config.sortable = true;
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);
        col_config.style = {
          minHeight: '40px',
          maxHeight: '40px',
        };
        col_config.width =
          i === 'meter_id'
            ? '100px'
            : i === 'event_message'
            ? '400px'
            : i === 'event_code'
            ? '120px'
            : '';

        col_config.cell = (row) => {
          return (
            <div className="d-flex">
              {row[i] ? (
                <span
                  className="d-block font-weight-bold text-truncate cursor-pointer"
                  title={
                    row[i].toString().length >
                    (props.txtLen ? props.txtLen : 10)
                      ? row[i]
                      : ''
                  }
                >
                  {row[i]
                    .toString()
                    .substring(0, props.txtLen ? props.txtLen : 10)}{' '}
                  {row[i].toString().length > (props.txtLen ? props.txtLen : 10)
                    ? '...'
                    : ''}
                </span>
              ) : (
                <span className="d-block font-weight-bold text-truncate cursor-pointer">
                  {' '}
                  -{' '}
                </span>
              )}
            </div>
          );
        };
        column.push(col_config);
      }
    }

    const showData = async (row) => {
      let data = '';
      if (row.data && row.event_code) {
        data = JSON.parse(row.data);
      } else if (row.event_message && !row.event_code) {
        data = JSON.parse(row.event_message);
      }

      if (data) {
        Array.isArray(data) ? setHistyData(data) : setHistyData([data]);
        setCenteredModal(true);
      } else {
        toast('No data found.', {
          hideProgressBar: true,
          type: 'error',
        });
      }
    };

    return column;
  };

  const tblColumn2 = () => {
    const column = [];

    for (const i in response.pull_data[0]) {
      const col_config = {};
      if (i !== 'data') {
        col_config.id = i;
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(1)}`.replace(
          '_',
          ' '
        );
        col_config.serch = i;
        col_config.sortable = true;
        col_config.selector = (row) => row[i];
        col_config.style = {
          minHeight: '40px',
          maxHeight: '40px',
        };
        col_config.width =
          i === 'meter_id'
            ? '100px'
            : i === 'event_message'
            ? '400px'
            : i === 'event_code'
            ? '120px'
            : '';

        col_config.cell = (row) => {
          return (
            <div className="d-flex">
              {row[i] ? (
                <span
                  className="d-block font-weight-bold text-truncate cursor-pointer"
                  title={
                    row[i].toString().length >
                    (props.txtLen ? props.txtLen : 10)
                      ? row[i]
                      : ''
                  }
                >
                  {row[i]
                    .toString()
                    .substring(0, props.txtLen ? props.txtLen : 10)}{' '}
                  {row[i].toString().length > (props.txtLen ? props.txtLen : 10)
                    ? '...'
                    : ''}
                </span>
              ) : (
                <span className="d-block font-weight-bold text-truncate cursor-pointer">
                  {' '}
                  -{' '}
                </span>
              )}
            </div>
          );
        };
        column.push(col_config);
      }
    }

    const showData = async (row) => {
      let data = '';
      if (row.data && row.event_code) {
        data = JSON.parse(row.data);
      } else if (row.event_message && !row.event_code) {
        data = JSON.parse(row.event_message);
      }

      if (data) {
        Array.isArray(data) ? setHistyData(data) : setHistyData([data]);
        setCenteredModal(true);
      } else {
        toast('No data found.', {
          hideProgressBar: true,
          type: 'error',
        });
      }
    };
    column.push({
      name: 'Action',
      maxWidth: '100px',
      style: {
        minHeight: '40px',
        maxHeight: '40px',
      },
      cell: (row) => {
        return (
          <Eye
            size="20"
            className={row.data ? 'ml-1 cursor-pointer' : 'd-none'}
            onClick={() => showData(row)}
          />
        );
      },
    });

    return column;
  };

  const tblColumn = (data) => {
    const column = [];
    const custom_width = ['manufacturer_name', 'exec_datetime'];

    for (const i in data[0]) {
      const col_config = {};
      if (
        i !== 'id' &&
        i !== 'SM_device_id' &&
        i !== 'MD_W_TOD_1' &&
        i !== 'MD_W_TOD_2' &&
        i !== 'MD_W_TOD_3' &&
        i !== 'MD_W_TOD_4' &&
        i !== 'MD_W_TOD_1' &&
        i !== 'MD_VA_TOD_1' &&
        i !== 'MD_VA_TOD_2' &&
        i !== 'MD_VA_TOD_3' &&
        i !== 'MD_VA_TOD_4' &&
        i !== 'MD_W_TOD_1_datetime' &&
        i !== 'MD_W_TOD_2_datetime' &&
        i !== 'MD_W_TOD_3_datetime' &&
        i !== 'MD_W_TOD_4_datetime' &&
        i !== 'MD_VA_TOD_1_datetime' &&
        i !== 'MD_VA_TOD_2_datetime' &&
        i !== 'MD_VA_TOD_3_datetime' &&
        i !== 'MD_VA_TOD_4_datetime' &&
        i !== 'exec_datetime' &&
        i !== 'cumm_VARH_lead' &&
        i !== 'MD_W_datetime' &&
        i !== 'MD_VA_datetime'
      ) {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.selector = (row) => row[i];
        col_config.sortable = true;

        col_config.width = '190px';
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
      name: 'Sr',
      width: '90px',
      cell: (row, i) => {
        return (
          <div className="d-flex  justify-content-center">{page3 + i}</div>
        );
      },
    });
    return column;
  };

  const onNextPageClicked1 = (page) => {
    setPage1(page + 1);
  };

  const onNextPageClicked2 = (page) => {
    setPage2(page + 1);
  };

  const onNextPageClicked3 = (page) => {
    setPage3(page + 1);
  };

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        toggle={() => props.handleModal(!props.isOpen)}
        className={`modal-xl modal-dialog-centered`}
      >
        <ModalHeader toggle={() => props.handleModal(!props.isOpen)}>
          Tamper events data
        </ModalHeader>
        <ModalBody>
          {isFetching ? (
            <Loader hight="min-height-600" />
          ) : (
            <>
              <DataTableV1
                columns={tblColumn2()}
                data={response.pull_data}
                showRefreshButton={true}
                refreshFn={refetch}
                rowCount={10}
                currentPage={page2}
                onPageChange={onNextPageClicked2}
                totalRowsCount={response.pull_data.length}
                tableName={'Pull tampered data'}
                showDownloadButton={true}
              />
              <DataTableV1
                columns={tblColumn1()}
                data={response.push_data}
                refreshFn={refetch}
                showRefreshButton={true}
                totalRowsCount={response.push_data.length}
                rowCount={10}
                currentPage={page1}
                onPageChange={onNextPageClicked1}
                tableName={'Push tampered data'}
                showDownloadButton={true}
              />
            </>
          )}
        </ModalBody>
      </Modal>

      <Modal
        isOpen={centeredModal}
        toggle={() => setCenteredModal(!centeredModal)}
        className={`modal-xl modal-dialog-centered`}
      >
        <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
          Event History data
        </ModalHeader>
        <ModalBody>
          <DataTableV1
            columns={tblColumn(histyData)}
            data={histyData}
            rowCount={10}
            currentPage={page3}
            onPageChange={onNextPageClicked3}
            totalRowsCount={histyData.length}
            tableName="Event History data"
            showDownloadButton={true}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default BillDetermineActionModal;
