import {
  Badge,
  Button,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from 'reactstrap';

import { useState, useEffect } from 'react';
import Loader from '../../../../components/loader/loader';
import CardInfo from '../../../../components/ui-elements/cards/cardInfo';
import { caseInsensitiveSort } from '../../../../utils';
import CreateSatProjectModal from './createSatProjectModal';
import UploadedCsvMetersModal from './uploadedCsvMetersModal';
import { useGetTestCyclesQuery } from '../../../../api/sat';
import DataTableV1 from '../../../../components/dtTable/DataTableV1';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setCurrentSelectedModule } from '../../../../app/redux/previousSelectedModuleSlice';
import { satApi } from '../../../../api/sat';

const CreateSatProject = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [response, setResponse] = useState([]);

  const [centeredModal, setCenteredModal] = useState(false);
  const [meterModal, setMeterModal] = useState(false);
  const [rowData, setRowData] = useState();

  const [errorMessage, setErrorMessage] = useState('');
  const project = location.pathname.split('/')[2];
  const currentSelectedModule = useSelector(
    (state) => state.currentSelectedModule
  );

  if (currentSelectedModule !== project) {
    dispatch(satApi.util.invalidateTags(['testcycles']));
    dispatch(setCurrentSelectedModule(project));
  }

  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
  };

  const { data, isFetching, isError, status, refetch } =
    useGetTestCyclesQuery();

  useEffect(() => {
    if (status === 'fulfilled') {
      setResponse(data);
    } else if (isError) {
      setErrorMessage('Something went wrong, please retry.');
    }
  }, [data, isError, status]);

  // To open modal
  const testCycleModal = () => {
    setCenteredModal(!centeredModal);
  };
  const rowModalData = () => {
    setMeterModal(!meterModal);
  };

  const tblColumn = () => {
    const column = [];
    const customWidths = {
      fileName: '180px',
      createdAt: '180px',
      updatedAt: '180px',
    };
    const customPositions = {
      projectName: 2,
      id: 1,
      fileName: 4,
      createdAt: 6,
      updatedAt: 7,
      metersCount: 3,
      Meters: 5,
    };
    for (const i in response[0]) {
      const col_config = {};
      {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.sortable = true;
        col_config.reorder = true;
        col_config.position = customPositions[i] || 1000;
        col_config.width = customWidths[i];
        col_config.minWidth = customWidths[i] || '130px';
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);

        col_config.cell = (row) => {
          if (i === 'fileName') {
            return (
              <div className="font-weight-bold w-100">
                {row[i]
                  ? `${row[i].slice(0, 10)}...'${row[i].slice(-10)}`
                  : '--'}
              </div>
            );
          }
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

    column.unshift({
      name: 'Sr No.',
      width: '90px',
      cell: (row, i) => {
        return (
          <div className="d-flex justify-content-center">
            {i + 1 + pageSize * (page - 1)}
          </div>
        );
      },
    });

    column.splice(4, 0, {
      name: 'Meters',
      width: '120px',
      cell: (row) => {
        return (
          <Badge
            pill
            color="light-primary"
            className=" cursor-pointer"
            onClick={() => {
              setRowData(row);
              rowModalData();
            }}
          >
            Preview
          </Badge>
        );
      },
    });
    const sortedColumns = column.sort((a, b) => {
      if (a.position < b.position) {
        return -1;
      } else if (a.position > b.position) {
        return 1;
      }
      return 0;
    });
    return sortedColumns;
  };

  const onRowClicked = (row) => {
    props.setRow(row);
    props.stepper.next();
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
      <Row>
        <Col>
          <Button
            color="primary"
            type=""
            onClick={() => testCycleModal()}
            className="float-end mb-1"
          >
            <span className="align-middle ml-25 " id="new_cyclw">
              New Test Cycle
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
        !isFetching && (
          <DataTableV1
            rowCount={pageSize}
            setRowCount={setRowCount}
            currentPage={page}
            onPageChange={onPageChange}
            columns={tblColumn()}
            data={response}
            totalRowsCount={response.length}
            tableName={'Test Cycles'}
            pointerOnHover={true}
            showRefreshButton={true}
            refreshFn={refresh}
            onRowClicked={onRowClicked}
          />
        )
      )}
      <Modal
        isOpen={centeredModal}
        toggle={testCycleModal}
        className={`modal-lg modal-dialog-centered`}
      >
        <ModalHeader toggle={testCycleModal}>Test Cycle Creation</ModalHeader>
        <ModalBody>
          <CreateSatProjectModal setCenteredModal={setCenteredModal} />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={meterModal}
        toggle={rowModalData}
        className={`modal-lg modal-dialog-centered`}
      >
        <ModalHeader toggle={rowModalData}>
          Uploaded Meters From CSV
        </ModalHeader>
        <ModalBody>
          <UploadedCsvMetersModal
            rowModalData={rowModalData}
            rowData={rowData}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreateSatProject;
