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

import { toast } from 'react-toastify';

import { useState, useEffect, forwardRef, useRef } from 'react';

import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Eye, Trash2 } from 'react-feather';
import MeterDetailsModal from '../selectedMeterDetailsModal';
import { caseInsensitiveSort } from '../../../../../../../../utils';
import { useLazyGISMetersListQuery } from '../../../../../../../../api/hes/drop-downSlice';
import SimpleDataTable from '../../../../../../../../components/dtTable/simpleTable';

const DtrAsset = (props) => {
  const meter_command_execution_allowed = 250;
  const { tableData, setTableData } = props;
  const menuPortalTarget = useRef(null);

  // console.log(tableData)

  const location = useLocation();

  // Logout User

  // to get dtr list
  const responseData = useSelector((state) => state.utilityMDASAssetList); // Use State for dtr list
  const [dtr, setDtr] = useState('');
  // Local State to maintain meter Selected
  const [meter, setMeter] = useState([]);

  const [showDTRDropDown, setShowDTRDropDown] = useState(false);
  // Use State for Meter List
  const [meterList, setMeterList] = useState([]);
  const [selectedMeter, setSelectedMeter] = useState(null);
  // Use State for Selected DTR List for command execution
  const [selectedDTR, setSelectedDTR] = useState([]);
  // Local State to maintain total DTR Count
  const [dtrCount, setDTRCount] = useState('');
  const [meterModal, setMeterModal] = useState(false);

  // To get Meter Row Id
  const [meterRowId, setMeterRowId] = useState('');

  // To get Selected Row
  const [selectedDtrRow, setSelectedDtrRow] = useState('');

  const [totalSelectedMeterCount, setTotalSelectedMeterCount] = useState(0);

  // local state to show loader
  const [loader, setLoader] = useState(false);

  const [getGISDTRMeterList, GISDTRMeterListResponse] =
    useLazyGISMetersListQuery();

  // UseEffect to fetch Meter List for Selected DTR from Dropdown
  useEffect(() => {
    if (selectedDTR.length > 0) {
      setLoader(true);
      const params = {
        project:
          location.pathname.split('/')[2] === 'sbpdcl'
            ? 'ipcl'
            : location.pathname.split('/')[2],
        site_id: selectedDTR[0]['value'],
      };

      // Fetch Meter List
      getGISDTRMeterList(params);
    }
  }, [selectedDTR]);

  useEffect(() => {
    if (GISDTRMeterListResponse.status === 'fulfilled') {
      let statusCode = GISDTRMeterListResponse.currentData.responseCode;
      if (statusCode) {
        if (statusCode === 200) {
          // Construct Meter List for DropDown
          const temp_meter_list =
            GISDTRMeterListResponse.currentData.data.result.stat.meters;

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
  }, [GISDTRMeterListResponse]);

  // If DTR Count undefined set DTR Count Value
  if (!dtrCount) {
    if (responseData.responseData.dtr_list.length > 0) {
      setDTRCount(responseData.responseData.dtr_list.length);
    }
  }

  useEffect(() => {
    setShowDTRDropDown(true);

    const temp_dtr = [];
    const dtr_list = responseData.responseData.dtr_list;

    if (dtr_list.length > 0) {
      for (const ele of dtr_list) {
        const temp = {};
        temp['value'] = ele['dtr_id'];
        temp['label'] = ele['dtr_name'];
        temp['pss_id'] = ele['pss_id'];
        temp['feeder_id'] = ele['feeder_id'];
        temp['isFixed'] = 'true';
        temp_dtr.push(temp);
      }
      setDtr(temp_dtr);
    }
  }, [dtrCount]);

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

  //  Dtr on Change function
  const onDtrSelected = (selectedOption) => {
    if (selectedOption) {
      setMeter([]);
      setMeterList([]);
      const temp_selected_dtr = [];
      temp_selected_dtr.push(selectedOption);
      setSelectedDTR(temp_selected_dtr);
      // setDTRSelected(selectedOption)
      setSelectedMeter(null);
    } else {
      setSelectedDTR([]);
      setSelectedMeter(null);
      // setMeter([])
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
      if (selectedDTR.length > 0) {
        let exists = false;
        tableData.forEach((ele) => {
          if (ele.site_id === selectedDTR[0].value) {
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
                setSelectedDTR([]);
                setMeter([]);
                toast('Site Already Exists', {
                  type: 'warning',
                  hideProgressBar: true,
                });
                return false;
              } else {
                const newObj = {
                  site_id: selectedDTR[0].value,
                  site_name: selectedDTR[0].label,
                  meters: meter,
                  total_Meters_Count: meter.length,
                };
                const processData = [...tableData, newObj];
                setTableData(processData);
              }
              setTotalSelectedMeterCount(
                totalSelectedMeterCount + meter.length
              );
              setSelectedDTR([]);
              setMeter([]);
            } else {
              setSelectedDTR([]);
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
                setSelectedDTR([]);
                setMeterList([]);
                toast('Site Already Exists', {
                  hideProgressBar: true,
                  type: 'warning',
                });
                return false;
              } else {
                const newObj = {
                  site_id: selectedDTR[0].value,
                  site_name: selectedDTR[0].label,
                  // meters: meterList,
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
              setSelectedDTR([]);
              setMeterList([]);
            } else {
              toast('Command Execution more than 30 meters are not allowed', {
                hideProgressBar: true,
                type: 'warning',
              });
              return false;
            }
          }
        } else {
          setSelectedDTR([]);
          setMeterList([]);
          toast('In Selected Site not any Meter exist', {
            hideProgressBar: true,
            type: 'warning',
          });
          return false;
        }
      } else {
        toast('select Site', {
          type: 'warning',
          hideProgressBar: true,
        });
        return false;
      }
    } else {
      setSelectedDTR([]);
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

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 'unset', // Reset minHeight4
      maxHeight: '100px',
      overflowY: 'scroll',
      height: 'auto', // Allow dynamic height
    }),
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

                setSelectedDtrRow(row);
                MeterDataModal();
              }}
            />
            <Trash2
              size="15"
              className=" ml-1 cursor-pointer"
              onClick={(i) => {
                onDelete(row);
              }}
            />
          </div>
        );
      },
    });
    return column;
  };

  return (
    <>
      {/* Site or Dtr Dropdown */}
      <Row>
        {showDTRDropDown && (
          <Col lg="4" sm="6" className="mb-1">
            <Select
              onChange={onDtrSelected}
              isClearable={true}
              value={selectedDTR}
              isSearchable
              options={dtr}
              className="react-select rounded zindex_1003"
              classNamePrefix="select"
              placeholder="Select site ..."
            />
          </Col>
        )}

        {/* Meter DropDown */}

        <>
          <Col lg="4" sm="6" className="mb-1">
            <Select
              isClearable={true}
              closeMenuOnSelect={false}
              theme={selectThemeColors}
              onChange={onMeterSelected}
              menuPortalTarget={menuPortalTarget.current}
              menuPlacement="auto"
              value={meter}
              autoFocus={true}
              isLoading={GISDTRMeterListResponse.isFetching}
              options={meterList}
              styles={customStyles}
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
              className="d-grid col-12 "
              onClick={Submitresponse}
            >
              Add
            </Button>
          </Col>
        </>
      </Row>
      <SimpleDataTable
        columns={tblColumn()}
        tblData={tableData}
        tableName={'Added Dtr and Meter '}
        donotShowDownload={true}
        rowCount={5}
      />

      {/* Next Button */}
      <div className="d-flex justify-content-end">
        <Button
          color="primary"
          outline
          className="me-2"
          onClick={() => setTableData([])}
        >
          Reset
        </Button>
        <Button
          color="primary"
          className="btn-next"
          onClick={() => {
            if (tableData.length > 0) {
              props.stepper.next();
            } else {
              toast(
                'Select DTR and Please insert at least one data in table.',
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
        className="  styles={customStyles}modal-dialog-centered modal-xl"
      >
        <ModalHeader toggle={MeterDataModal}>Meter Details</ModalHeader>
        <ModalBody>
          <MeterDetailsModal
            MeterTblData={tableData}
            rowIndex={meterRowId}
            updateMeterList={updateMeterList}
            selectedDtrRow={selectedDtrRow}
            assetType={'dtr'}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default DtrAsset;
