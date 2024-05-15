import SimpleDataTable from '../../../../../../../components/dtTable/simpleTable';

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

  const tblColumn = () => {
    const column = [];

    if (commandRetryResponse && commandRetryResponse.length > 0) {
      for (const i in commandRetryResponse[0]) {
        const col_config = {};
        if (i !== 'id') {
          col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
            1
          )}`.replaceAll('_', ' ');
          col_config.serch = i;
          col_config.sortable = true;
          col_config.sortFunction = (rowA, rowB) =>
            caseInsensitiveSort(rowA, rowB, i);
          // col_config.style = {
          //   width: '400px'
          // }
          col_config.cell = (row) => {
            return (
              <div className="d-flex">
                <span
                  className="d-block font-weight-bold "
                  // style={{ width: '18vh' }}
                  // onClick={() => handleRowClick(row.id, row.feeder_id, row.pss_id)}
                >
                  {row[i]}
                </span>
              </div>
            );
          };
          column.push(col_config);
        }
      }
    }

    column.push({
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

    return column;
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
          <SimpleDataTable
            columns={tblColumn()}
            tblData={commandRetryResponse}
            rowCount={10}
            // tableName={'Command Retry Configuration'}
            refresh={refetch}
            // totalCount={totalCount}
            // onNextPageClicked={onNextPageClicked}
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
