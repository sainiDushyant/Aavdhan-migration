import DataTableV1 from '../../../../../../../components/dtTable/DataTableV1';
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Tooltip,
  Button,
} from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { Plus, Edit } from 'react-feather';

import { useLocation } from 'react-router-dom';

// import AddSchedulerData from './addSchedulerdata'
import { caseInsensitiveSort } from '../../../../../../../utils';

import Loader from '../../../../../../../components/loader/loader';

import CardInfo from '../../../../../../../components/ui-elements/cards/cardInfo';

import CommandRetryUpDateForm from './commandRetryUpdateForm';

import { useGetCommandRetryConfigDataQuery } from '../../../../../../../api/command-historySlice';

const CommandRetryConfig = () => {
  const location = useLocation();
  let project = '';
  if (location.pathname.split('/')[2] === 'sbpdcl') {
    project = 'ipcl';
  } else {
    project = location.pathname.split('/')[2];
  }

  const [commandRetryResponse, setCommandRetryResponse] = useState([]);

  const [hasError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [logout, setLogout] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState();

  const params = {
    project,
  };
  const { isFetching, refetch, data, isError } =
    useGetCommandRetryConfigDataQuery(params);

  useEffect(() => {
    if (data?.data) {
      const statusCode = data?.responseCode;

      if (statusCode === 200) {
        try {
          const resp = data?.data?.result;
          setCommandRetryResponse(resp);
          setTotalCount(resp?.length);
        } catch (error) {
          setErrorMessage('Network Error, please retry');
        }
      } else if (statusCode === 401 || statusCode === 403) {
        setLogout(true);
      } else {
        setErrorMessage('Network Error, please retry');
      }
    }
  }, [data]);

  const [showdataEdit, setShowDataEdit] = useState(false);
  const [commandSelectedForUpdate, setCommandSelectedForUpdate] =
    useState(undefined);

  const retryAgain = () => {
    refetch();
  };

  const rowSelected = (row) => {
    setCommandSelectedForUpdate(row);
    setShowDataEdit(true);
  };

  const reloadTableAfterUpdate = () => {
    setShowDataEdit(false);
    // setFetchingData(true);
  };

  function createColumns() {
    const columns = [];
    const ignoreColumns = ['id', 'sc_no', 'parameter'];
    const disableSortings = [
      'site id',
      'Parameter',
      'Command',
      'Current status',
      'Created at',
    ];

    if (commandRetryResponse?.length > 0) {
      for (const i in commandRetryResponse[0]) {
        const column = {};
        if (!ignoreColumns.includes(i)) {
          column.name = `${i.charAt(0).toUpperCase()}${i.slice(1)}`.replaceAll(
            '_',
            ' '
          );
          column.sortable = !disableSortings.includes(i);
          //column.sortFunction = !disableSortings.includes(i)
          //? (rowA, rowB) => caseInsensitiveSort(rowA, rowB, i)
          //: null;
          column.selector = (row) => row[i];
          column.reorder = true;
          //column.position = customPositions[i] || 1000;
          column.minWidth = '200px';
          column.wrap = true;

          column.cell = (row) => {
            if (row[i] || [0, '0'].includes(row[i])) {
              if (Array.isArray(row[i])) {
                row[i] = row[i].join(' , ');
              }
              if (row[i].toString()?.length > 25) {
                return (
                  <span
                    onClick={(event) => {
                      if (event.target.textContent.toString()?.length <= 29) {
                        event.target.textContent = row[i];
                        event.target.style.overflowY = 'scroll';
                      } else {
                        event.target.textContent = `${row[i]
                          .toString()
                          .substring(0, 25)}...`;
                        event.target.style.overflowY = 'visible';
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                      maxHeight: '200px',
                    }}
                    className="webi_scroller"
                    title={'click to expand text'}
                  >
                    {row[i].toString().substring(0, 25)}...
                  </span>
                );
              }
            } else {
              return '-';
            }
            return row[i];
          };
          columns.push(column);
        }
      }
      columns.push({
        name: 'Edit Retry Count',
        maxWidth: '100px',
        style: {
          minHeight: '40px',
          maxHeight: '40px',
        },
        cell: (row) => {
          return (
            <Edit
              size="20"
              className="ml-1 cursor-pointer"
              onClick={() => rowSelected(row)}
            />
          );
        },
      });
    }
    const sortedColumns = columns.sort((a, b) => {
      if (a.position < b.position) {
        return -1;
      } else if (a.position > b.position) {
        return 1;
      }
      return 0;
    });
    // sortedColumns.unshift({
    //   name: 'Sr No',
    //   width: '70px',
    //   cell: (row, i) => {
    //     return (
    //       <div className="d-flex w-100 justify-content-center">
    //         {i + 1 + 10 * (currentPage - 1)}
    //       </div>
    //     );
    //   },
    // });
    return sortedColumns;
  }
  const onNextPageClicked = (number) => {
    setCurrentPage(number + 1);
  };
  return (
    <>
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
          <DataTableV1
            columns={createColumns()}
            data={commandRetryResponse}
            rowCount={10}
            tableName={'Command Retry Configuration'}
            showDownloadButton={true}
            showRefreshButton={true}
            refreshFn={refetch}
            showAddButton={false}
            currentPage={currentPage}
            totalRowsCount={totalCount}
            onPageChange={onNextPageClicked}
            isLoading={isFetching}
            pointerOnHover={true}
          />
        )
      )}

      <Modal
        isOpen={showdataEdit}
        toggle={() => setShowDataEdit(!showdataEdit)}
        className={`modal-lg modal-dialog-centered`}
      >
        <ModalHeader toggle={() => setShowDataEdit(!showdataEdit)}>
          {commandSelectedForUpdate
            ? commandSelectedForUpdate.command_name
            : ''}
        </ModalHeader>
        <ModalBody className="p-0">
          <CommandRetryUpDateForm
            rowSelected={commandSelectedForUpdate}
            setShowDataEdit={setShowDataEdit}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default CommandRetryConfig;
