import { useState, useEffect, Fragment } from 'react';
import ReactPaginate from 'react-paginate';
import DataTable from 'react-data-table-component';
import {
  ChevronDown,
  Download,
  RefreshCw,
  PlusCircle,
  Filter,
  File,
  FileText,
} from 'react-feather';
import {
  Card,
  Row,
  Col,
  Input,
  Tooltip,
  Label,
  FormGroup,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { DownloadCSV, DownloadPDF } from '../dtTable/downloadTableData';
import CardInfo from '../../components/ui-elements/cards/NoDataCardInfo';
import PaginationDropDown from '../layout/components/paginationDropDown/paginationDropDown';

const DataTableV1 = (props) => {
  const [data, setData] = useState(props.data);
  const totalRowsCount = props.totalRowsCount;
  const [currentPageData, setCurrentPageData] = useState([]);
  const [refreshTooltip, setRefreshTooltip] = useState(false);
  const [downloadTooltip, setDownloadTooltip] = useState(false);
  const [filterTooltip, setFilterTooltip] = useState(false);
  const CustomPagination = () => (
    <div className="pagination react-paginate separated-pagination pagination-sm align-items-center justify-content-end mt-1 mb-1">
      {props.setRowCount && (
        <PaginationDropDown
          rowCount={props.rowCount}
          setRowCount={props.setRowCount}
          currentPage={props.currentPage}
          totalCount={props.totalRowsCount}
          //   disabledCounts={props.disabledCounts}
          disabled={props.rowCount < 10 || data.length < 10}
        />
      )}
      <ReactPaginate
        previousLabel=""
        nextLabel=""
        forcePage={props.currentPage - 1}
        onPageChange={(page) => props.onPageChange(page.selected)}
        pageCount={Math.ceil(totalRowsCount / props.rowCount || 1)}
        breakLabel="..."
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        activeClassName="active"
        pageClassName="page-item"
        nextClassName={`page-item next ${
          Math.trunc(totalRowsCount / props.rowCount) + 1 === props.currentPage
            ? 'disabled'
            : ''
        }`}
        nextLinkClassName="page-link"
        previousClassName="page-item prev"
        previousLinkClassName="page-link"
        pageLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end mt-1 mb-1"
      />
    </div>
  );

  const customStyles = {
    cells: {
      style: {
        paddingLeft: '12px !important',
      },
    },
    headCells: {
      style: {
        textTransform: 'inherit',
        paddingLeft: '12px !important',
      },
    },
    rows: {
      style: {
        fontWeight: '500',
      },
    },
  };

  function paginateData(data, page) {
    // console.log(page, 'this is page');
    if (data?.length > props.rowCount) {
      if (page === 1) {
        setCurrentPageData(data.slice(0, props.rowCount));
      } else {
        setCurrentPageData(
          data.slice((page - 1) * props.rowCount, page * props.rowCount)
        );
      }
    } else {
      setCurrentPageData(data);
    }
  }

  const onProtocolSelection = (value) => {
    props.protocolSelected(value);
  };

  function search(search) {
    const searchData = props.data.filter((obj) => {
      const txtObj = JSON.stringify(Object.values(obj)).toLowerCase().trim();
      return txtObj.includes(search.toLowerCase().trim());
    });
    setData([...searchData]);
  }

  useEffect(() => {
    paginateData(data, props.currentPage);
  }, [props.currentPage, data, props.rowCount]);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  if (!data && data?.length < 1) {
    return (
      <Card className="">
        <CardInfo />
      </Card>
    );
  } else {
    return (
      <>
        <Card className="p-1" style={{ minHeight: '300px' }}>
          <Row className="border-bottom">
            <Col className="p-1 w-100 d-flex">
              <div className="d-flex align-items-center gap-1 h-100">
                <h4 className="m-0 ">{props.tableName}</h4>
              </div>
            </Col>

            <Col className="p-1">
              <div className="d-flex justify-content-end align-items-center gap-1 h-100">
                <Input
                  type="text"
                  placeholder="Search..."
                  onChange={(event) => {
                    search(event.target.value);
                  }}
                  style={{
                    maxWidth: 280,
                    minWidth: 90,
                  }}
                />
                {props.filter && (
                  <Fragment>
                    <Filter
                      onClick={() => props.filter()}
                      id="filter_table"
                      size={18}
                      className=""
                      style={{ minWidth: 18 }}
                    />
                    <Tooltip
                      placement="top"
                      isOpen={filterTooltip}
                      target="filter_table"
                      toggle={() => setFilterTooltip(!filterTooltip)}
                    >
                      Advance filter for Command history !
                    </Tooltip>
                  </Fragment>
                )}
                {props.isDownloadModal === 'yes' ? (
                  <>
                    <Download
                      onClick={() => props.handleReportDownloadModal()}
                      id="_download"
                      size={18}
                      className=""
                      style={{ minWidth: 18 }}
                    />
                  </>
                ) : props.isDownloadModal === 'no' ? (
                  ''
                ) : (
                  props.showDownloadButton && (
                    <>
                      <UncontrolledButtonDropdown disabled={data?.length === 0}>
                        <DropdownToggle color="flat">
                          <Download
                            id="Download"
                            className={data?.length === 0 ? 'isDisabled' : ''}
                            // onClick={() => {
                            //   if (props?.onDownload) {
                            //     props.onDownload();
                            //   } else {
                            //     DownloadCSV(
                            //       data,
                            //       props.downloadFileName || props.tableName
                            //     );
                            //   }
                            // }}
                            size={18}
                            style={{ minWidth: 18 }}
                          />
                        </DropdownToggle>

                        <DropdownMenu>
                          <DropdownItem
                            className="w-100"
                            onClick={() => {
                              if (props?.onDownload) {
                                props.onDownload();
                              } else {
                                DownloadCSV(
                                  data,
                                  props.downloadFileName || props.tableName
                                );
                              }
                            }}
                          >
                            <FileText size={15} className="ml_20 mx_6" />
                            <span> CSV</span>
                          </DropdownItem>
                          <DropdownItem
                            className="w-100"
                            onClick={() =>
                              DownloadPDF(props.tableName, props.columns, data)
                            }
                          >
                            <File size={15} className="ml_20 mx_6" />
                            <span>PDF</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                      <Tooltip
                        placement="top"
                        isOpen={downloadTooltip}
                        target="Download"
                        toggle={() => setDownloadTooltip(!downloadTooltip)}
                      >
                        Download Data
                      </Tooltip>
                    </>
                  )
                )}
                {props.showRefreshButton && (
                  <>
                    <RefreshCw
                      id="refresh_table"
                      onClick={(event) => {
                        event.target.classList.add('spin-360');
                        props.refreshFn();
                        setTimeout(() => {
                          event.target.classList.remove('spin-360');
                        }, 500);
                      }}
                      size={18}
                      className=""
                      style={{ minWidth: 18 }}
                    />
                    <Tooltip
                      placement="top"
                      isOpen={refreshTooltip}
                      target="refresh_table"
                      toggle={() => setRefreshTooltip(!refreshTooltip)}
                    >
                      Refresh Table
                    </Tooltip>
                  </>
                )}

                {props.showAddButton && (
                  <PlusCircle
                    onClick={() =>
                      props.setShowForm((prevShowForm) => !prevShowForm)
                    }
                    size={18}
                    style={{ minWidth: 18 }}
                  />
                )}
                {props.extraTextToShow}
                {props.protocol && (
                  <span>
                    <FormGroup check inline>
                      <Label check onClick={() => onProtocolSelection('dlms')}>
                        <Input
                          style={{ marginTop: 6 }}
                          type="radio"
                          disabled
                          name="protocol_type"
                          defaultChecked={'dlms' === props.protocol}
                        />
                        <span style={{ fontSize: '18px' }}>Protocol 1</span>
                      </Label>
                    </FormGroup>
                  </span>
                )}
              </div>
            </Col>
          </Row>
          {props.isLoading ? (
            <div className="d-flex w-100 p-5 justify-content-center">
              <div className="dot-pulse"></div>
            </div>
          ) : (
            <DataTable
              noHeader
              pagination
              data={currentPageData}
              columns={props.columns}
              className="react-dataTable webi_scroller"
              sortIcon={<ChevronDown size={10} />}
              paginationPerPage={props.rowCount}
              paginationComponent={CustomPagination}
              paginationDefaultPage={props.currentPage}
              customStyles={
                props.customStyles
                  ? { ...customStyles, ...props.customStyles }
                  : customStyles
              }
              conditionalRowStyles={props.conditionalRowStyles}
              pointerOnHover={props.pointerOnHover}
              highlightOnHover={false}
              onRowClicked={props.onRowClicked}
              onSort={props.onSort}
              sortServer={props.sortServer}
            />
          )}
        </Card>
      </>
    );
  }
};

export default DataTableV1;
