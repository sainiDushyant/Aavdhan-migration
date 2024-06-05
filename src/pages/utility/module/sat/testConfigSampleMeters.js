import React, { useState, useEffect } from 'react';
import Loader from '../../../../components/loader/loader';
import CardInfo from '../../../../components/ui-elements/cards/cardInfo';
import { caseInsensitiveSort } from '../../../../utils';
import DataTableV1 from '../../../../components/dtTable/DataTableV1';
import { useGetTestsByIdQuery } from '../../../../api/sat';

const TestConfigSampleMeters = (props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [response, setResponse] = useState([]);
  const [error, setError] = useState('');

  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
    refetch();
  };

  const retryAgain = () => {
    refetch();
  };

  const shuffleArray = (array) => {
    if (!array) {
      return;
    }
    if (!Array.isArray(array)) return;
    // Fisher-Yates (aka Knuth) Shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const { isFetching, data, isError, status, refetch } = useGetTestsByIdQuery({
    id: props.id,
  });
  useEffect(() => {
    if (status === 'fulfilled') {
      setResponse(
        shuffleArray(
          data?.sampleMeters.map((e) => {
            return { meterSerial: e.meterSerial };
          })
        )
      );
    } else if (isError) {
      setError('Something went wrong, please retry.');
    }
  }, [status, data, isError]);

  const tblColumn = () => {
    const column = [];
    const custom_width = ['create_time'];
    for (const i in response[0]) {
      const col_config = {};
      if (i !== 'id') {
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
          return (
            <div className={`d-flex font-weight-bold w-100 `}>{row[i]}</div>
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
            {(page - 1) * pageSize + 1 + i}
          </div>
        );
      },
    });
    return column;
  };
  const onPageChange = (number) => {
    setPage(number + 1);
  };
  const refresh = () => {
    refetch();
    setPage(1);
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
          rowCount={pageSize}
          setRowCount={setRowCount}
          currentPage={page}
          onPageChange={onPageChange}
          columns={tblColumn()}
          data={response}
          tableName={'Meters List'}
          totalRowsCount={response?.length}
          refreshFn={refresh}
          showRefreshButton={true}
          pointerOnHover={true}
        />
      )}
    </>
  );
};

export default TestConfigSampleMeters;
