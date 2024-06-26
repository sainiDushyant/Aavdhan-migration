import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  InputGroup,
} from 'reactstrap';
import moment from 'moment';
import Loader from '../../../../../../components/loader/loader';
import Flatpickr from 'react-flatpickr';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { caseInsensitiveSort } from '../../../../../../utils';

import { useLocation } from 'react-router-dom';
import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';
import { useGetPeriodPushQuery } from '../../../../../../api/hes/push-dataSlice';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';

const PeriodicDataModal = (props) => {
  const location = useLocation();
  // Error Handling
  const [errorMessage, setErrorMessage] = useState('');

  const project =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];
  const [response, setResponse] = useState([]);
  const [totalCount, setTotalCount] = useState(120);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDateTime, setStartDateTime] = useState(undefined);
  const [endDateTime, setEndDateTime] = useState(undefined);
  const [rowCount, setRowCount] = useState(10);
  const [skip, setSkip] = useState(false);

  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );

  let user_name = '';
  let meter_serial = '';
  if (HierarchyProgress && HierarchyProgress.user_name) {
    user_name = HierarchyProgress.user_name;
    meter_serial = HierarchyProgress.meter_serial_number;
  }

  const getParams = () => {
    let params = {};

    if (endDateTime) {
      params = {
        project: project,
        meter: HierarchyProgress.meter_serial_number,
        page: currentPage,
        start_date: startDateTime,
        end_date: endDateTime,
        page_size: rowCount,
      };
    } else {
      params = {
        project: project,
        meter: HierarchyProgress.meter_serial_number,
        page: currentPage,
        page_size: rowCount,
      };
    }
    return params;
  };

  const { data, isFetching, isError, status, refetch } = useGetPeriodPushQuery(
    getParams(),
    { skip }
  );

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        setTotalCount(data.data.result.count);
        const _temp = data.data.result.results;
        const _response_temp = [];
        for (let i = 0; i < _temp.length; i++) {
          const temp = _temp[i]['data'];
          temp['meter'] = _temp[i]['meter'];
          temp['reporting_timestamp'] = _temp[i]['reporting_timestamp'];

          const modifiedTemp = {
            meter: temp['meter'],
            ...temp,
          };

          _response_temp.push(modifiedTemp);
        }

        _response_temp.map((item) => {
          item.phase_current = Number(item.phase_current).toFixed(2);
          item.neutral_current = Number(item.neutral_current).toFixed(2);

          return item;
        });

        setResponse(_response_temp);
      }
    } else if (isError) {
      setErrorMessage('Something went wrong, please retry.');
    }
  }, [data, isError, status]);

  const tblColumn = () => {
    const column = [];
    const custom_width = [
      'meter_time',
      'push_triggered_time',
      'data_reporting_time',
    ];

    for (const i in response[0]) {
      const col_config = {};
      if (
        i !== 'id' &&
        i !== 'push_obis' &&
        i !== 'push_counter' &&
        i !== 'avon_obis_1' &&
        i !== 'avon_obis_2' &&
        i !== 'avon_obis_3' &&
        i !== 'avon_obis_4' &&
        i !== 'meter'
      ) {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.sortable = true;
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);

        col_config.style = {
          minHeight: '40px',
          maxHeight: '40px',
        };

        if (custom_width.includes(i)) {
          col_config.width = '240px';
        }

        col_config.cell = (row) => {
          return (
            <div className="d-flex">
              <span
                className="d-block font-weight-bold"
                title={
                  row[i]
                    ? row[i] !== ''
                      ? row[i].toString().length > 20
                        ? row[i]
                        : ''
                      : '-'
                    : '-'
                }
              >
                {row[i] && row[i] !== ''
                  ? row[i].toString().substring(0, 20)
                  : '-'}
                {row[i] && row[i] !== ''
                  ? row[i].toString().length > 20
                    ? '...'
                    : ''
                  : '-'}
              </span>
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
            {i + 1 + rowCount * (currentPage - 1)}
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
    refetch();
  };

  const dateTimeFormat = (inputDate) => {
    return ''.concat(
      inputDate.getFullYear(),
      '-',
      (inputDate.getMonth() + 1).toString().padStart(2, '0'),
      '-',
      inputDate.getDate().toString().padStart(2, '0'),
      ' ',
      inputDate.getHours().toString().padStart(2, '0'),
      ':',
      inputDate.getMinutes().toString().padStart(2, '0'),
      ':',
      inputDate.getSeconds().toString().padStart(2, '0')
    );
  };

  const onDateRangeSelected = (dateRange) => {
    if (dateRange.length === 1) {
      setStartDateTime(dateTimeFormat(dateRange[0]));
      setEndDateTime(undefined);
      setSkip(true);
    } else if (dateRange.length === 2) {
      setStartDateTime(dateTimeFormat(dateRange[0]));
      setEndDateTime(dateTimeFormat(dateRange[1]));
      setSkip(true);
    }
  };

  const onDateRangeSelectedButtonPressed = () => {
    if (startDateTime && endDateTime) {
      setCurrentPage(1);
      setSkip(false);
    } else {
      toast('Invalid DateTime Range', {
        hideProgressBar: true,
        type: 'error',
      });
    }
  };
  const retryAgain = () => {
    refetch();
  };

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={() => props.handleModalState(!props.isOpen)}
      scrollable
      className="modal_size"
    >
      <ModalHeader toggle={() => props.handleModalState(!props.isOpen)}>
        {props.title}
      </ModalHeader>
      <ModalBody>
        <Row className="justify-content-end mb-1">
          <Col md="5">
            <InputGroup>
              <Flatpickr
                placeholder="Select date ..."
                onChange={onDateRangeSelected}
                className="form-control"
                options={{ mode: 'range', enableTime: true }}
              />
              <Button
                color="primary"
                outline
                onClick={onDateRangeSelectedButtonPressed}
              >
                Go
              </Button>
            </InputGroup>
          </Col>
        </Row>
        {isError ? (
          <CardInfo
            props={{
              message: { errorMessage },
              retryFun: { retryAgain },
              retry: { isFetching },
            }}
          />
        ) : (
          <>
            {isFetching ? (
              <Loader hight="min-height-484" />
            ) : (
              <DataTableV1
                columns={tblColumn()}
                data={response}
                rowCount={rowCount}
                tableName={'Periodic Push Data'.concat('(', meter_serial, ')')}
                refresh={reloadData}
                currentPage={currentPage}
                totalRowsCount={totalCount}
                onPageChange={onNextPageClicked}
                showRefreshButton={true}
                showDownloadButton={true}
              />
            )}
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default PeriodicDataModal;
