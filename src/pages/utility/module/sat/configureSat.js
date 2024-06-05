import { useEffect, useState } from 'react';
import {
  Col,
  ModalBody,
  ModalHeader,
  Row,
  Button,
  Modal,
  Badge,
} from 'reactstrap';

import { Copy } from 'react-feather';
import Loader from '../../../../components/loader/loader';
import CardInfo from '../../../../components/ui-elements/cards/cardInfo';
import ConfigreTestSatModal from './configreTestSatModal';
import { caseInsensitiveSort } from '../../../../utils';
import SampleTestMetersModal from './sampleTestMetersModal';
import CommandExecutionSat from './commandExecutionSat';

import CopyTestConfig from './copyTestConfig';
import TestConfigSampleMeters from './testConfigSampleMeters';
import { useGetTestsQuery } from '../../../../api/sat';
import DataTableV1 from '../../../../components/dtTable/DataTableV1';

const ConfigureSat = (props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [response, setResponse] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [testRowData, setTestRowData] = useState([]);
  const [meterId, setMeterId] = useState('');
  const [disabled, setDisabled] = useState(false);

  const [testSatModal, setTestSatModal] = useState(false);
  const [updatedTestSatModal, setUpdatedTestSatModal] = useState(false);
  const [sampleMetersTestModal, setSampleMetersTestModal] = useState(false);
  const [commandExecutionModal, setCommandExecutionModal] = useState(false);
  const [testConfigSampleMeters, setTestConfigSampleMeters] = useState([]);
  const [testConfigSampleMetersModal, setTestConfigSampleMetersModal] =
    useState(false);

  // Error Handling
  const [errorMessage, setErrorMessage] = useState('');

  const getParams = () => {
    let params = {};
    params = {};
    if (props.row?.id) {
      params.id = props.row.id;
      return params;
    } else {
      return;
    }
  };
  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
    refetch();
  };
  const { isFetching, data, isError, status, refetch } = useGetTestsQuery(
    getParams()
  );

  useEffect(() => {
    if (status === 'fulfilled') {
      setResponse(data);
    } else if (isError) {
      setErrorMessage('Something went wrong, please retry.');
    }
  }, [data, isError, status]);

  const testConfigModal = () => {
    setTestSatModal(!testSatModal);
  };

  const updatedTestConfigModal = () => {
    setUpdatedTestSatModal(!updatedTestSatModal);
  };

  const sampleMetersModal = () => {
    setSampleMetersTestModal(!sampleMetersTestModal);
  };
  const commandExecution = () => {
    setCommandExecutionModal(!commandExecutionModal);
  };

  const testConfigSampleMeterModal = (row) => {
    setTestConfigSampleMetersModal(!testConfigSampleMetersModal);
  };
  const onRowClicked = (row) => {
    setRowData(row);
    if (row.resultCalculations?.finalResult === 'Not Initiated') {
      setCommandExecutionModal(true);
    } else {
      setSampleMetersTestModal(true);
    }
  };

  const tblColumn = () => {
    const column = [];
    const custom_width = ['create_time'];
    for (const i in response[0]) {
      const col_config = {};
      if (
        i !== 'sampleCount' &&
        i !== 'testCycleId' &&
        i !== 'sampleMeters' &&
        i !== 'cmdArgs' &&
        i !== 'result' &&
        i !== 'resultCalculations'
      ) {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.sortable = true;
        col_config.reorder = true;

        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);

        if (i === 'createdBy') {
          col_config.width = '250px';
        }
        col_config.cell = (row) => {
          return (
            <div
              className={`d-flex font-weight-bold w-100 `}
              data-tag="allowRowEvents"
            >
              {row[i]}
            </div>
          );
        };
        column.push(col_config);
      }
    }

    column.push({
      name: 'Result',
      width: '80px',
      cell: (row, i) => {
        return (
          <Badge pill color="light-primary" data-tag="allowRowEvents">
            View
          </Badge>
        );
      },
    });

    column.push({
      name: 'Meters',
      width: '100px',
      cell: (row, i) => {
        return (
          <Badge
            pill
            color="light-primary"
            className=" cursor-pointer"
            onClick={() => {
              setMeterId(row.id);
              testConfigSampleMeterModal(row);
            }}
          >
            Preview
          </Badge>
        );
      },
    });
    column.push({
      name: 'Copy Test',
      width: '100px',
      cell: (row, i) => {
        return (
          <Button
            data-tag="allowRowEvents"
            color="transparent"
            size="sm"
            disabled={disabled}
            onClick={() => {
              setTestRowData(row);
              updatedTestConfigModal();
            }}
          >
            <Copy size="20" color="black" className="ml-1 cursor-pointer" />
          </Button>
        );
      },
    });

    column.unshift({
      name: 'Sr No.',
      width: '90px',
      cell: (row, i) => {
        return (
          <div className="d-flex justify-content-center">
            {(page - 1) * pageSize + 1 + i}
          </div>
        );
      },
    });
    return column;
  };

  const retryAgain = () => {
    refetch();
  };

  const refresh = () => {
    setPage(1);
    refetch();
  };

  const onPageChange = (page) => {
    setPage(page + 1);
  };

  return (
    <>
      <h5 className="mb-1">Test Configuration</h5>
      <Row>
        <Col>
          <Button
            color="primary"
            type=""
            onClick={() => testConfigModal()}
            className="float-end mb-1"
          >
            {/* <Plus size={14} /> */}
            <span className="align-middle ml-25 " id="new_cyclw">
              Test Configuration
            </span>
          </Button>
        </Col>
      </Row>

      {isFetching ? (
        <Loader hight="min-height-475" />
      ) : isError ? (
        <CardInfo
          props={{
            message: { errorMessage },
            retryFun: { retryAgain },
            retry: { isFetching },
          }}
        />
      ) : (
        <DataTableV1
          rowCount={pageSize}
          setRowCount={setRowCount}
          currentPage={page}
          onPageChange={onPageChange}
          columns={tblColumn()}
          data={response}
          totalRowsCount={response.length}
          tableName={'Tests'}
          pointerOnHover={true}
          showRefreshButton={true}
          refreshFn={refresh}
          donotShowDownload={true}
          onRowClicked={onRowClicked}
        />
      )}

      <Modal
        isOpen={testSatModal}
        toggle={testConfigModal}
        className={`modal-lg modal-dialog-centered`}
      >
        <ModalHeader toggle={testConfigModal}>Test Configuration </ModalHeader>
        <ModalBody>
          <ConfigreTestSatModal
            rowData={props.row}
            setTestSatModal={setTestSatModal}
          />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={updatedTestSatModal}
        toggle={updatedTestConfigModal}
        className={`modal-lg modal-dialog-centered`}
      >
        <ModalHeader toggle={updatedTestConfigModal}>
          Test Configuration{' '}
        </ModalHeader>
        <ModalBody>
          <CopyTestConfig
            rowData={props.row}
            testsRowsData={testRowData}
            updatedTestConfigModal={updatedTestConfigModal}
          />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={commandExecutionModal}
        // toggle={commandExecution}
        toggle={() => {}}
        className={`modal-lg modal-dialog-centered`}
      >
        <ModalHeader toggle={commandExecution}>Test Execution</ModalHeader>
        <ModalBody>
          <CommandExecutionSat
            rowData={rowData}
            commandExecutionModal={commandExecutionModal}
            setCommandExecutionModal={setCommandExecutionModal}
          />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={sampleMetersTestModal}
        toggle={sampleMetersModal}
        className={`modal-xl modal-dialog-centered`}
      >
        <ModalHeader
          toggle={sampleMetersModal}
        >{`Test Cycle Id : ${rowData.testCycleId} | Test Id : ${rowData.id} | Command Name : ${rowData.cmdName} | ExpResTime : ${rowData.expResTime} | Sample Size : ${rowData?.sampleSize}`}</ModalHeader>
        <ModalBody>
          <SampleTestMetersModal rowData={rowData} />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={testConfigSampleMetersModal}
        toggle={testConfigSampleMeterModal}
        className={`modal-lg modal-dialog-centered`}
      >
        <ModalHeader toggle={testConfigSampleMeterModal}>Meters</ModalHeader>
        <ModalBody>
          <TestConfigSampleMeters
            testConfigSampleMeters={testConfigSampleMeters}
            id={meterId}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default ConfigureSat;
