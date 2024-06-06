import React, { useState, useEffect } from 'react';
import { Download } from 'react-feather';
import { Col, Row, Button, Badge } from 'reactstrap';
import { caseInsensitiveSort } from '../../../../utils';
import CardInfo from '../../../../components/ui-elements/cards/cardInfo';
import Loader from '../../../../components/loader/loader';

import { toast } from 'react-toastify';
import { useGetCmdResDataQuery } from '../../../../api/sat';
import { usePostCmdResReqMutation } from '../../../../api/sat';
import DataTableV1 from '../../../../components/dtTable/DataTableV1';

const RequestCommandResponseModal = (props) => {
  // Error Handling
  const [errorMessage, setErrorMessage] = useState('');
  const [postCmdRes] = usePostCmdResReqMutation();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [response, setResponse] = useState([]);

  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
  };

  const { isError, isFetching, data, status, refetch } = useGetCmdResDataQuery({
    id: props.rowData.id,
  });

  useEffect(() => {
    if (status === 'fulfilled') {
      setResponse(data);
    } else if (isError) {
      setErrorMessage('Something went wrong, please retry.');
    }
  }, [isError, status, data]);

  const onRequest = () => {
    const params = {
      id: props.rowData?.id,
    };
    try {
      const response = postCmdRes(params);
      toast(response.data?.message, {
        hideProgressBar: true,
        type: 'success',
      });
    } catch (error) {
      if (error?.response?.status === 400 || error?.response?.status === 500) {
        toast(error.response.data.error, {
          hideProgressBar: true,
          type: 'error',
        });
      } else {
        toast('Request Failed', {
          hideProgressBar: true,
          type: 'error',
        });
      }
    }
  };

  const onPageChange = (page) => {
    setPage(page + 1);
  };

  const tblColumn = () => {
    const column = [];
    const custom_width = ['create_time'];
    for (const i in response[0]) {
      const col_config = {};
      if (
        i !== 'id' &&
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
        // col_config.width = '150px'
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);

        col_config.cell = (row) => {
          if (i === 'status') {
            if (row[i] === 'Success') {
              return (
                <Badge pill color="success" data-tag="allowRowEvents">
                  {row[i]}
                </Badge>
              );
            } else if (row[i] === 'Processing') {
              return (
                <Badge pill color="warning" data-tag="allowRowEvents">
                  {row[i]}
                </Badge>
              );
            } else if (row[i] === 'Failed') {
              return (
                <Badge pill color="danger" data-tag="allowRowEvents">
                  {row[i]}
                </Badge>
              );
            } else {
              return (
                <Badge pill color="secondary" data-tag="allowRowEvents">
                  {row[i]}
                </Badge>
              );
            }
          }
          if (i === 'fileLink') {
            return (
              <a href={row[i]}>
                <Download size={20} className="mx-2" />
              </a>
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
            {(page - 1) * 10 + 1 + i}
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
  return (
    <>
      <h5 className="mb-1">Request Command Response</h5>
      <Row>
        <Col>
          <Button
            color="primary"
            type=""
            onClick={onRequest}
            className="float-end mb-1"
          >
            {/* < size={14} /> */}
            <span className="align-middle ml-25 " id="new_cyclw">
              New Request
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
            tableName={'Requests'}
            pointerOnHover={true}
            refreshFn={refresh}
            totalRowsCount={response.length}
            showRefreshButton={true}
          />
        )
      )}
    </>
  );
};

export default RequestCommandResponseModal;
