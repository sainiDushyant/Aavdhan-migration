import {
  Col,
  Button,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
} from 'reactstrap';
import Select from 'react-select';
import { selectThemeColors } from '../../../../../../../../utils';
import SimpleDataTable from '../../../../../../../../components/dtTable/simpleTable';

import { toast } from 'react-toastify';
// import { useSelector } from 'react-redux'
import { useState, useEffect, forwardRef } from 'react';

import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ArrowRight, Eye, Trash2 } from 'react-feather';
import MeterDetailsModal from '../selectedMeterDetailsModal';
import { caseInsensitiveSort } from '../../../../../../../../utils';
import { useLazyGISMetersListQuery } from '../../../../../../../../api/drop-downSlice';

const FeederAsset = (props) => {
  const location = useLocation();
  const meter_command_execution_allowed = 250;

  const { tableData, setTableData } = props;

  // console.log(tableData)

  // Logout User

  // to get feeder list
  const responseData = useSelector((state) => state.utilityMDASAssetList);
  // Use State for feeder list
  const [feeder, setFeeder] = useState(undefined);
  // Local State to maintain meter Selected
  const [meter, setMeter] = useState(undefined);

  const [showFeederDropdown, setShowFeederDropdown] = useState(false);
  // Use State for Meter List
  const [meterList, setMeterList] = useState(undefined);
  const [selectedMeter, setSelectedMeter] = useState(null);
  // Use State for Selected feeder List for command execution
  const [selectedFeeder, setSelectedFeeder] = useState([]);
  // Local State to maintain total feeder Count
  const [feederCount, setFeederCount] = useState(undefined);

  const [meterModal, setMeterModal] = useState(false);

  // To get Meter Row Id
  const [meterRowId, setMeterRowId] = useState();

  // To get Selected Row
  const [selectedFeederRow, setSelectedFeederRow] = useState();

  const [totalSelectedMeterCount, setTotalSelectedMeterCount] = useState(0);

  const [fetchMeterList, GISMetersListResponse] = useLazyGISMetersListQuery();

  // local state to show loader

  // UseEffect to fetch Meter List for Selected feeder from Dropdown
  useEffect(() => {
    if (selectedFeeder.length > 0) {
      const params = {
        project:
          location.pathname.split('/')[2] === 'sbpdcl'
            ? 'ipcl'
            : location.pathname.split('/')[2],
        feeder_id: selectedFeeder[0]['value'],
      };

      // Fetch Meter List
      fetchMeterList(params);
    }
  }, [selectedFeeder]);

  useEffect(() => {
    if (GISMetersListResponse.status === 'fulfilled') {
      let statusCode = GISMetersListResponse.currentData.responseCode;
      if (statusCode) {
        if (statusCode === 200) {
          // Construct Meter List for DropDown
          const temp_meter_list =
            GISMetersListResponse.currentData.data.result.stat.meters;

          const meter_list = temp_meter_list
            .map((meter) => {
              // Create a shallow copy of the meter object
              const temp_meter = { ...meter };
              temp_meter['value'] = temp_meter['meter_number'];
              temp_meter['label'] = temp_meter['meter_number'];
              temp_meter['isFixed'] = 'true';
              return temp_meter;
            })
            .filter(
              (meter) =>
                meter['grid_id'] !== undefined &&
                meter['grid_id'] !== '' &&
                meter['grid_id'] !== null &&
                meter['meter_sw_version'] !== undefined &&
                meter['meter_sw_version'] !== '' &&
                meter['meter_sw_version'] !== null &&
                meter['meter_address'] !== undefined &&
                meter['meter_address'] !== '' &&
                meter['meter_address'] !== null
            );

          setMeterList(meter_list);
        }
      }
    }
  }, [GISMetersListResponse]);

  // If feeder Count undefined set feeder Count Value
  if (!feederCount) {
    if (responseData.responseData.feeder_list.length > 0) {
      setFeederCount(responseData.responseData.feeder_list.length);
    }
  }

  useEffect(() => {
    setShowFeederDropdown(true);

    const temp_dtr = [];
    const dtr_list = responseData.responseData.feeder_list;

    if (dtr_list.length > 0) {
      for (const ele of dtr_list) {
        const temp = {};
        temp['value'] = ele['feeder_id'];
        temp['label'] = ele['feeder_name'];
        temp['pss_id'] = ele['pss_id'];
        temp['pss_name'] = ele['pss_name'];
        temp['isFixed'] = 'true';
        temp_dtr.push(temp);
      }
      setFeeder(temp_dtr);
    }
  }, [feederCount]);

  const NumberInput = forwardRef((props, ref) => {
    const handleChange = (event) => {
      const { value } = event.target;
      // Only allow numbers to be entered
      if (/^\d*$/.test(value)) {
        props.onChange(event);
      }
    };

    return (
      <input
        className="no-style"
        placeholder={meter?.length > 0 ? '' : 'Select meter...'}
        {...props}
        ref={ref}
        onChange={handleChange}
        autoFocus={meter?.length > 0}
      />
    );
  });

  // Feeder Change function
  const onFeederSelected = (selectedOption) => {
    if (selectedOption) {
      setMeter([]);
      setMeterList([]);
      const temp_selected_feeder = [];
      temp_selected_feeder.push(selectedOption);
      setSelectedFeeder(temp_selected_feeder);
      // setDTRSelected(selectedOption)
      setSelectedMeter(null);
    } else {
      setSelectedFeeder([]);
      setSelectedMeter(null);
      setMeter([]);
      setMeterList([]);
    }
  };

  // Meter  on change function
  const onMeterSelected = (selectedOption) => {
    if (selectedOption.length) {
      const meter_list = [];
      for (let i = 0; i < selectedOption.length; i++) {
        meter_list.push(selectedOption[i]);
      }
      // const meter_list_string = meter_list.join(',')
      setMeter(meter_list);
    } else {
      setMeter([]);
    }
  };

  // On Add button
  const Submitresponse = () => {
    if (totalSelectedMeterCount <= meter_command_execution_allowed) {
      if (selectedFeeder.length > 0) {
        let exists = false;
        tableData.forEach((ele) => {
          if (ele.feeder_id === selectedFeeder[0].value) {
            exists = true;
          }
        });
        if (meterList && meterList.length > 0) {
          if (meter && meter.length > 0) {
            const temp_total_selected_meter_count =
              totalSelectedMeterCount + meter.length;

            if (
              temp_total_selected_meter_count <= meter_command_execution_allowed
            ) {
              if (exists) {
                setSelectedFeeder([]);
                setMeter([]);
                toast('Feeder Already Exists', {
                  hideProgressBar: true,
                  type: 'warning',
                });
                return false;
              } else {
                const newObj = {
                  feeder_id: selectedFeeder[0].value,
                  feeder_name: selectedFeeder[0].label,
                  meters: meter,
                  total_Meters_Count: meter.length,
                };
                const processData = [...tableData, newObj];
                setTableData(processData);
              }

              setTotalSelectedMeterCount(
                totalSelectedMeterCount + meter.length
              );
              setSelectedFeeder([]);
              setMeter([]);
            } else {
              setSelectedFeeder([]);
              setMeter([]);
              toast('Command Execution more than 30 meters are not allowed', {
                hideProgressBar: true,
                type: 'warning',
              });
              return false;
            }
          } else {
            const temp_total_selected_meter_count =
              totalSelectedMeterCount + meterList.length;

            if (
              temp_total_selected_meter_count <= meter_command_execution_allowed
            ) {
              if (exists) {
                setSelectedFeeder([]);
                setMeterList([]);
                toast('Feeder Already Exists', {
                  hideProgressBar: true,
                  type: 'warning',
                });
                return false;
              } else {
                const newObj = {
                  feeder_id: selectedFeeder[0].value,
                  feeder_name: selectedFeeder[0].label,
                  meters: meterList.map((meter) => {
                    return meter;
                  }),
                  total_Meters_Count: meterList.length,
                };
                const processData = [...tableData, newObj];
                setTableData(processData);
              }
              setTotalSelectedMeterCount(
                totalSelectedMeterCount + meterList.length
              );
              setSelectedFeeder([]);
              setMeterList([]);
            } else {
              setSelectedFeeder([]);
              setMeterList([]);
              toast('Command Execution more than 30 meters are not allowed', {
                hideProgressBar: true,
                type: 'warning',
              });
              return false;
            }
          }
        } else {
          setSelectedFeeder([]);
          setMeterList([]);
          toast('In this Feeder not any Meter exist', {
            hideProgressBar: true,
            type: 'warning',
          });
          return false;
        }
      } else {
        toast('select Feeder', {
          hideProgressBar: true,
          type: 'warning',
        });
        return false;
      }
    } else {
      setSelectedFeeder([]);
      setMeterList([]);
      setMeter([]);
      toast('Command Execution more than 30 meters are not allowed', {
        hideProgressBar: true,
        type: 'warning',
      });
      return false;
    }
  };

  // Meter modal
  const MeterDataModal = () => {
    setMeterModal(!meterModal);
  };

  // To update Meter LIst
  const updateMeterList = (updatedTableData) => {
    let temp_total_selected_meter_count = 0;
    updatedTableData.forEach((ele) => {
      temp_total_selected_meter_count += ele.total_Meters_Count;
    });
    setTotalSelectedMeterCount(temp_total_selected_meter_count);

    setMeterModal(false);
    setTableData(updatedTableData);
  };

  // on delte function to delete the table row
  const onDelete = (deletable) => {
    const temp_total_selected_meter_count =
      totalSelectedMeterCount - deletable.total_Meters_Count;
    const response = tableData.filter((i) => i !== deletable);
    setTotalSelectedMeterCount(temp_total_selected_meter_count);
    setTableData(response);
  };

  // table columns
  const tblColumn = () => {
    const column = [];
    for (const i in tableData[0]) {
      const col_config = {};
      if (i !== 'meters') {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.sortable = true;
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);
        col_config.width = '250px';
        col_config.cell = (row) => {
          return (
            <div className="d-flex">
              <span
                className="d-block font-weight-bold "
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
                  ? row[i].toString().substring(0, 30)
                  : '-'}
                {row[i] && row[i] !== ''
                  ? row[i].toString().length > 30
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
    column.push({
      name: 'Action',
      width: '120px',
      cell: (row, index) => {
        return (
          <div className="d-flex gap-1">
            <Eye
              size="15"
              className=" cursor-pointer"
              onClick={() => {
                setMeterRowId(index);
                setSelectedFeederRow(row);
                MeterDataModal();
              }}
            />
            <Trash2
              size="15"
              className=" ml-1 cursor-pointer"
              onClick={(i) => onDelete(row)}
            />
          </div>
        );
      },
    });
    return column;
  };

  return (
    <>
      {/* Feeder Dropdown */}
      <Row>
        {showFeederDropdown && (
          <Col lg="4" sm="6" className="mb-1">
            <Select
              onChange={onFeederSelected}
              isClearable={true}
              value={selectedFeeder}
              isSearchable
              options={feeder}
              className="react-select rounded zindex_1003"
              classNamePrefix="select"
              placeholder="Select Feeder ..."
            />
          </Col>
        )}

        {/* Meter DropDown */}

        <>
          <Col lg="4" sm="6" className="mb-1">
            <Select
              closeMenuOnSelect={false}
              isClearable={true}
              theme={selectThemeColors}
              onChange={onMeterSelected}
              value={meter}
              options={meterList}
              isLoading={GISMetersListResponse.isFetching}
              isSearchable
              isMulti={true}
              className="react-select border-secondary rounded"
              classNamePrefix="select"
              components={{ Input: NumberInput }}
              placeholder=""
            />
          </Col>

          {/* Add Button */}
          <Col lg="2" sm="5">
            <Button
              color="primary"
              className="btn-block "
              onClick={Submitresponse}
            >
              Add
            </Button>
          </Col>
        </>
      </Row>
      <SimpleDataTable
        columns={tblColumn()}
        height={true}
        tblData={tableData}
        tableName={'Added feeder and Meter '}
        donotShowDownload={true}
        rowCount={5}
      />

      <div className="d-flex gap-1 float-end">
        {/* Reset Button */}
        <Button
          color="primary"
          outline
          className="mr-2"
          onClick={() => setTableData([])}
        >
          Reset
        </Button>
        {/* Next Button */}
        <Button
          color="primary"
          className="btn-next"
          onClick={() => {
            if (tableData.length > 0) {
              props.stepper.next();
            } else {
              toast(
                'Select Feeder and Please insert at least one data in table.',
                { hideProgressBar: true, type: 'warning' }
              );
            }
          }}
        >
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ml-sm-25 ml-0"
          ></ArrowRight>
        </Button>
      </div>

      {/* Modal for Meter Data Table */}
      <Modal
        isOpen={meterModal}
        toggle={MeterDataModal}
        className="modal-dialog-centered modal-xl"
      >
        <ModalHeader toggle={MeterDataModal}>Meter Details</ModalHeader>
        <ModalBody>
          <MeterDetailsModal
            MeterTblData={tableData}
            rowIndex={meterRowId}
            updateMeterList={updateMeterList}
            selectedFeederRow={selectedFeederRow}
            assetType={'feeder'}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default FeederAsset;
