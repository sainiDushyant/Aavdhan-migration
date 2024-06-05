import React, { useState, useEffect } from 'react';
import { caseInsensitiveSort } from '../../../../utils';
import Loader from '../../../../components/loader/loader';
import CardInfo from '../../../../components/ui-elements/cards/cardInfo';
import { useGetTestCyclesQuery } from '../../../../api/sat';
import DataTableV1 from '../../../../components/dtTable/DataTableV1';

const UploadedCsvMetersModal = (props) => {
  const [page, setPage] = useState(1);

  const [error, setError] = useState('');
  const [response, setResponse] = useState([]);

  const params = {
    id: props.rowData.id,
  };

  const { data, isFetching, status, isError, refetch } =
    useGetTestCyclesQuery(params);

  const onPageChange = (page) => {
    setPage(page);
  };

  const retryAgain = () => {
    refetch();
  };

  useEffect(() => {
    if (status === 'fulfilled') {
      setResponse(data);
    } else if (isError) {
      setError('Something went wrong, please retry.');
    }
  }, [data, status, isError]);

  const tblColumn = () => {
    const column = [];
    if (response?.length > 0) {
      for (const i in response[0]) {
        const col_config = {};
        if (i !== 'id') {
          col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
            1
          )}`.replaceAll('_', ' ');
          col_config.serch = i;
          col_config.sortable = true;
          col_config.reorder = true;
          col_config.selector = (row) => row[i];
          col_config.sortFunction = (rowA, rowB) =>
            caseInsensitiveSort(rowA, rowB, i);

          col_config.cell = (row) => {
            return (
              <div className={`d-flex font-weight-bold w-100 `}>{row[i]}</div>
            );
          };
          column.push(col_config);
        }
      }
    }

    column.unshift({
      name: 'Sr No.',
      width: '90px',
      cell: (row, i) => {
        return <div className="d-flex justify-content-center">{page + i}</div>;
      },
    });
    return column;
  };
  return (
    <>
      {isFetching ? (
        <Loader hight="min-height-475" />
      ) : isError ? (
        <CardInfo
          props={{
            message: { error },
            retryFun: { retryAgain },
            retry: { isFetching },
          }}
        />
      ) : (
        <DataTableV1
          rowCount={10}
          currentPage={page}
          onPageChange={onPageChange}
          columns={tblColumn()}
          data={response}
          tableName={response?.fileName || 'Meters'}
          totalRowsCount={response?.length}
          refreshFn={refetch}
          showRefreshButton={true}
        />
      )}
    </>
  );
};

export default UploadedCsvMetersModal;
