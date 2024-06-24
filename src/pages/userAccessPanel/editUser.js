import React, { useState, useEffect } from 'react';
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Button,
  Card,
  Badge,
  Modal,
  ModalHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Select from 'react-select';
import ReactJson from 'react-json-view';
import { selectThemeColors } from '../../utils.js';
import { Edit, MoreVertical, Trash2 } from 'react-feather';
import { toast } from 'react-toastify';
import ModuleModal from './ModuleModal.js';
import SiteModal from './SiteModal.js';
import ReportsModal from './ReportsModal';
import { caseInsensitiveSort } from '../../utils.js';
import TagsModal from './tagsModal';
import {
  useGetAllVerticalsQuery,
  useGetReportsListQuery,
  useLazyGetTagsListQuery,
  useUpdateUserDataMutation,
} from '../../api/user-access-panel/index.js';

import { useCommandInfoAssetsQuery } from '../../api/hes/drop-downSlice.js';
import DataTableV1 from '../../components/dtTable/DataTableV1.js';

const EditUser = (props) => {
  const [FinalArray, setFinalArray] = useState(
    props.editdata.access ? props.editdata.access : []
  );

  // Access Control Site Level Access
  const [projectLevelSiteAccess, setProjectLevelSiteAccess] = useState(
    props.editdata.site_access ? props.editdata.site_access : []
  );

  // Access Control Tags Level Access
  const [projectLevelTagsAccess, setProjectLevelTagsAccess] = useState(
    props.editdata.tag_access ? props.editdata.tag_access : []
  );

  const [siteSelected, setSiteSelected] = useState([]);

  const [FinalArrayUpdate, setFinalArrayUpdate] = useState([]);
  const [addValues, setAddValues] = useState({});

  const [columns, setColumns] = useState([]);
  const [response, setResponse] = useState([]);
  const [selected, setSelected] = useState(false);
  const [checked, setChecked] = useState(false);
  const [project, setProject] = useState([]);
  const [mod, setMod] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [deletAdd, setDeletAdd] = useState(false);

  const [loader, setLoader] = useState(false);
  const [skip, setSKip] = useState(true);

  // UseState to control Analytics Report Dropdown
  const [showAnalyticsReport, setShowAnalyticsReport] = useState(false);
  const [analyticsReportList, setAnalyticsReportList] = useState([]);

  // Access Control Analytics Report Access
  const [
    projectLevelAnalyticsReportAccess,
    setProjectLevelAnalyticsReportAccess,
  ] = useState(
    props.editdata.report_access ? props.editdata.report_access : []
  );
  // console.log('Report Access Data ....')
  // console.log(projectLevelAnalyticsReportAccess)

  const [analyticsReportSelected, setAnalyticsReportsSelected] = useState([]);

  // Fetched Complete list of Analytics Report Module Wise
  const [fetchedReportList, setFetchedReportList] = useState([]);

  // DropDown Values
  const [verticalDropDown, setVerticalDropDown] = useState();
  const [projectDropDown, setProjectDropDown] = useState();
  const [modulesDropDown, setModuleaDropDown] = useState([]);

  const [fetchSiteList, setFetchSiteList] = useState(false);
  const [fetchTagList, setFetchTagList] = useState(false);
  // const [showSiteSelection, setShowSiteSelection] = useState(false)
  const [siteList, setSiteList] = useState([]);
  const [tagList, setTagList] = useState([]);

  const [moduleModal, setModuleModal] = useState(false);
  const [verticalModulePassed, setVerticalModulePassed] = useState([]);
  const [verticalModuleSelected, setVerticalModuleSelected] = useState([]);
  const [rowSelectedToEdit, setRowSelectedToEdit] = useState(undefined);

  // const [getModule, setGetModule] = useState(false)
  const [siteModal, setSiteModal] = useState(false);
  const [tagsModal, setTagsModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);

  const [getTagsList, tagsListResponse] = useLazyGetTagsListQuery();
  const [updateUserData, updateUserDataResponse] = useUpdateUserDataMutation();

  let params = {
    project:
      addValues?.project?.toLowerCase() === 'sbpdcl'
        ? 'ipcl'
        : addValues.project,
    vertical: addValues.vertical,
  };

  const { data, isFetching, isError, status } = useCommandInfoAssetsQuery(
    params,
    { skip }
  );

  //  To handle checkbox
  const handleCheck = (event) => {
    const name = event.target.name;
    const value = event.target.checked;
    setChecked(value);
  };

  useEffect(() => {
    console.log(FinalArray, ' this is final array');
  }, [FinalArray]);

  useEffect(() => {
    if (!skip) {
      if (status === 'fulfilled') {
        let statusCode = data.responseCode;
        const pss_list = [];
        const feeder_list = [];
        const dtr_list = [];
        if (statusCode === 200) {
          const newData = data.data.result.stat;
          // Create pss list
          // const pss_list = []
          for (const pss of newData['pss_list']) {
            const temp = {};
            temp['pss_name'] = pss['pss_name'];
            temp['pss_id'] = pss['pss_id'];

            pss_list.push(temp);
          }

          // Create Feeder list
          // const feeder_list = []
          for (const feeder of newData['feeder_list']) {
            const temp = {};
            const parent_pss = feeder['pss_id'];
            for (const pss of pss_list) {
              if (pss['pss_id'] === parent_pss) {
                temp['feeder_name'] = feeder['feeder_name'];
                temp['feeder_id'] = feeder['feeder_id'];
                temp['pss_name'] = pss['pss_name'];
                temp['pss_id'] = pss['pss_id'];
                feeder_list.push(temp);
              }
            }
          }

          // Create DTR List
          // const dtr_list = []
          for (const dtr of newData['live_dt_list']) {
            const temp = {};
            const parent_feeder = dtr['feeder_id'];
            for (const feeder of feeder_list) {
              if (feeder['feeder_id'] === parent_feeder) {
                temp['feeder_name'] = feeder['feeder_name'];
                temp['feeder_id'] = feeder['feeder_id'];
                temp['pss_name'] = feeder['pss_name'];
                temp['pss_id'] = feeder['pss_id'];
                temp['dtr_name'] = dtr['site_name'];
                temp['dtr_id'] = dtr['site_id'];
                temp['label'] = dtr['site_name'];
                temp['value'] = dtr['site_id'];
                temp['project'] = params.project;
                dtr_list.push(temp);
              }
            }
          }
        }
        setSiteList(dtr_list);
        setLoader(false);
        setSiteSelected([]);
      } else if (isError) {
        setSKip(true);
        toast(
          <>
            Error fetching list...
            <Button
              style={{
                width: '100px',
                height: '30px',
                backgroundColor: '#7367f0',
                color: 'white',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => setSKip(false)}
            >
              Retry
            </Button>
          </>,
          {
            hideProgressBar: true,
            type: 'error',
            closeOnClick: true,
            autoClose: false,
          }
        );
      }
    }
  }, [skip, isError, status, data]);

  const {
    data: verticalData,
    isFetching: verticalDataFetching,
    isError: verticalError,
    status: verticalStatus,
    refetch: refetchVertical,
  } = useGetAllVerticalsQuery();
  const {
    data: reportList,
    isFetching: reportListFetching,
    isError: reportListError,
    status: reportListStatus,
    refetch: refetchReportList,
  } = useGetReportsListQuery();

  useEffect(() => {
    if (verticalStatus === 'fulfilled') {
      if (verticalData.responseCode === 200) {
        setResponse(verticalData.data.result);
        let verticalArray = verticalData.data.result.map((e) => {
          return {
            value: e.vertical,
            label: e.vertical,
          };
        });
        setVertical(verticalArray);
      }
    } else if (verticalError) {
      toast(
        <>
          Error fetching vertical list...
          <Button
            style={{
              width: '100px',
              height: '30px',
              backgroundColor: '#7367f0',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={refetchVertical}
          >
            Retry
          </Button>
        </>,
        {
          hideProgressBar: true,
          type: 'error',
          closeOnClick: true,
          autoClose: false,
        }
      );
    }
  }, [verticalData, verticalError, verticalStatus]);

  useEffect(() => {
    if (reportListStatus === 'fulfilled') {
      if (reportList.responseCode === 200) {
        setResponse(reportList.data.result);
      }
    } else if (reportListError) {
      toast(
        <>
          Error fetching report list...
          <Button
            style={{
              width: '100px',
              height: '30px',
              backgroundColor: '#7367f0',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={refetchReportList}
          >
            Retry
          </Button>
        </>,
        {
          hideProgressBar: true,
          type: 'error',
          closeOnClick: true,
          autoClose: false,
        }
      );
    }
  }, [reportList, reportListError, reportListStatus]);

  useEffect(() => {
    if (fetchTagList) {
      const params = {};

      params['project'] = addValues?.project;
      getTagsList(params, { preferCacheValue: true });
    }
  }, [fetchTagList]);

  useEffect(() => {
    if (tagsListResponse.status === 'fulfilled') {
      if (tagsListResponse.currentData.responseCode === 200) {
        const data = tagsListResponse.currentData.data.result
          .filter((ele) => ele.project === addValues.project)
          .map((ele) => ({
            value: ele.tag,
            label: ele.tag,
          }));

        setTagList(data);
        setFetchTagList(false);
      }
    } else if (tagsListResponse.isError) {
      setFetchTagList(false);
      toast(
        <>
          {tagsListResponse.error.status === 406 ? (
            tagsListResponse.error.data.data.error.detail
          ) : (
            <>
              Error fetching tags list...
              <Button
                style={{
                  width: '100px',
                  height: '30px',
                  backgroundColor: '#7367f0',
                  color: 'white',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => setFetchTagList(true)}
              >
                Retry
              </Button>
            </>
          )}
        </>,
        {
          hideProgressBar: true,
          type: 'error',
          closeOnClick: true,
          autoClose: tagsListResponse.error.status === 406 ? true : false,
        }
      );
    }
  }, [tagsListResponse]);

  // Api fetch to update the user data
  const updateUser = () => {
    updateUserData({
      name: props.editdata.name,
      phone_number: props.editdata.phone_number,
      email: props.editdata.email,
      role: checked ? 'superadmin' : 'admin',
      default_route:
        FinalArray.length > 0
          ? FinalArray[0].children[0].children[0].navLink
          : '',
      ability: [
        {
          action: 'manage',
          subject: 'all',
        },
      ],
      extras: {
        eCommerceCartItemsCount: 5,
      },
      access: FinalArray,
      avatar: 'https://img.icons8.com/office/16/000000/user.png',
      // site_access: [{}],
      site_access: projectLevelSiteAccess,
      command_access: [{}],
      report_access: projectLevelAnalyticsReportAccess,
      tag_access: projectLevelTagsAccess,
      method: 'PUT',
    });
  };

  useEffect(() => {
    if (updateUserDataResponse.status === 'fulfilled') {
      let statusCode = updateUserDataResponse.data.responseCode;
      if (statusCode === 202) {
        setFinalArray(FinalArray);
        toast('Updated successfully...', {
          hideProgressBar: true,
          type: 'success',
        });
      }
    } else if (updateUserDataResponse.isError) {
      toast('Failed to update user data, please retry', {
        type: 'error',
        hideProgressBar: true,
      });
    }
  }, [updateUserDataResponse]);

  // TO check Edit modal is open or close and according to that reload data

  useEffect(() => {
    verticalData?.data?.result?.map((e) => {
      if (e.vertical === addValues.vertical) {
        let projectArray = e.project.map((k) => {
          return {
            value: k,
            label: k,
          };
        });
        let moduleArray = e.modules.map((k) => {
          return {
            value: k,
            label: k,
          };
        });
        setMod(moduleArray);
        setProject(projectArray);
      }
    });
  }, [addValues]);

  //  To insert the data in a table
  const createTableData = () => {
    const UpdateTableData = [];
    let row = {};
    let vertical, project;
    FinalArray.forEach((obj) => {
      const { title } = obj;
      vertical = title;
      obj.children.forEach((ele) => {
        const module = [];
        const { title } = ele;
        project = title;
        ele.children.forEach((temp) => {
          const { title } = temp;
          module.push(title);
          // module += `${title}, `
        });
        row = {
          vertical,
          project,
          module,
        };
        UpdateTableData.push(row);
      });
    });
    setColumns(UpdateTableData);
  };

  useEffect(() => {
    createTableData();
    if (props.editdata.role === 'superadmin') {
      document.getElementById('basic-cb-unchecked').checked = true;
      setChecked(true);
    }
  }, [FinalArray]);

  // on delete
  const onDelete = (deletable, updateProjectReportLevelAccess) => {
    const array = [];
    const response = columns.filter((i) => i !== deletable);

    let finalArrayTemp = JSON.parse(JSON.stringify(FinalArray));

    for (let i = 0; i < finalArrayTemp.length; i++) {
      if (finalArrayTemp[i].id === deletable.vertical) {
        for (let j = 0; j < finalArrayTemp[i].children.length; j++) {
          if (finalArrayTemp[i].children[j].id === deletable.project) {
            finalArrayTemp[i].children.splice(j, 1);
          }
        }
      }
    }

    if (
      finalArrayTemp.length === 1 &&
      finalArrayTemp[0].children.length === 0
    ) {
      // setFinalArray([])
      finalArrayTemp = [];
      // console.log('Final Array Temp is empty .....', finalArrayTemp)
      // setFinalArrayUpdate(!FinalArrayUpdate)
      // setColumns(response)
      toast(`Successfully deleted`, {
        hideProgressBar: true,
        type: 'success',
      });
    } else {
      for (let i = 0; i < finalArrayTemp.length; i++) {
        if (finalArrayTemp[i].children.length <= 0) {
          finalArrayTemp.splice(i, 1);
        }
      }

      // console.log('Final Array Temp is not empty .....', finalArrayTemp)
      toast(`Successfully deleted`, {
        hideProgressBar: true,
        type: 'success',
      });
    }

    setFinalArray(finalArrayTemp);
    setColumns(response);
    setFinalArrayUpdate(!FinalArrayUpdate);

    // console.log('Final Array Temp .....')
    // console.log(finalArrayTemp)
    // console.log('Final Array ....')
    // console.log(FinalArray)
  };

  // Delete Table Row and Data From ProjectSiteLevel Access
  const onDeleteTableRow = (row) => {
    // Delete Data from Site Level Access
    const projectLevelSiteAccessTemp = [...projectLevelSiteAccess];
    for (let i = 0; i < projectLevelSiteAccess.length; i++) {
      if (
        row.vertical === projectLevelSiteAccess[i].vertical &&
        row.project === projectLevelSiteAccess[i].project
      ) {
        projectLevelSiteAccessTemp.splice(i, 1);
      }
    }
    setProjectLevelSiteAccess(projectLevelSiteAccessTemp);

    // Condition to check and delete data from project level Site Access Data
    const projectLevelAnalyticsReportAccess_Dummy =
      projectLevelAnalyticsReportAccess;
    for (let i = 0; i < projectLevelAnalyticsReportAccess_Dummy.length; i++) {
      if (
        projectLevelAnalyticsReportAccess_Dummy[i].vertical === row.vertical &&
        projectLevelAnalyticsReportAccess_Dummy[i].project === row.project
      ) {
        projectLevelAnalyticsReportAccess_Dummy.splice(i, 1);
      }
    }
    setProjectLevelAnalyticsReportAccess(
      projectLevelAnalyticsReportAccess_Dummy
    );

    onDelete(row, true);
  };

  // table columns
  const tblColumn = () => {
    const column = [];

    for (const i in columns[0]) {
      const col_config = {};
      if (i !== 'id') {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.sortable = true;
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);

        if (i === 'vertical') {
          col_config.width = '150px';
        }
        if (i === 'project') {
          col_config.width = '150px';
        }

        col_config.cell = (row) => {
          let val = '';
          if (i === 'module') {
            val = row[i].map((mod_val) => {
              return (
                <Badge
                  pill
                  color="success"
                  className="p_4 m_1 me-1"
                  key={mod_val}
                >
                  {mod_val}
                </Badge>
              );
            });
          } else {
            val = row[i];
          }
          return (
            <div className="d-flex">
              <span className="d-block font-weight-bold ">{val}</span>
            </div>
          );
        };
        column.push(col_config);
      }
    }

    column.push({
      name: 'Action',
      width: '120px',
      cell: (row) => {
        return (
          <>
            {columns.length > 1 ? (
              <Trash2
                size="15"
                className=" cursor-pointer"
                onClick={(i) => onDeleteTableRow(row)}
              />
            ) : (
              ''
            )}
            <UncontrolledDropdown>
              <DropdownToggle
                className="icon-btn hide-arrow"
                color="transparent"
                size="sm"
                caret
              >
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu positionFixed={true}>
                {/* Edit Analytics Report Access List */}
                <DropdownItem
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();

                    if (projectLevelAnalyticsReportAccess.length > 0) {
                      // console.log(row)
                      if (row.module.includes('Analytics')) {
                        // console.log('Analytics Module Exist')
                        setRowSelectedToEdit(row);
                        setReportModal(!reportModal);
                      }
                    }
                  }}
                >
                  <Edit className="mr-50" size={15} />{' '}
                  <span className="align-middle">
                    Edit Analytics Report List
                  </span>
                </DropdownItem>

                {/* Edit Module List */}
                <DropdownItem
                  href="/"
                  onClick={(e) => {
                    // Set Already Selected module
                    const modulesAvail = [];
                    for (let i = 0; i < row.module.length; i++) {
                      const temp = {
                        value: row.module[i],
                        label: row.module[i],
                      };
                      modulesAvail.push(temp);
                    }
                    setVerticalModuleSelected(modulesAvail);

                    // Set Module Selection Option
                    for (let i = 0; i < verticalData.data.result.length; i++) {
                      if (
                        verticalData.data.result[i].vertical === row.vertical
                      ) {
                        setVerticalModulePassed(
                          verticalData.data.result[i].modules
                        );
                      }
                    }
                    // Set Row Selected to edit
                    setRowSelectedToEdit(row);

                    e.preventDefault();
                    setModuleModal(!moduleModal);
                  }}
                >
                  <Edit className="mr-50" size={15} />{' '}
                  <span className="align-middle"> Edit Modules List</span>
                </DropdownItem>

                {/* Edit Site List */}
                <DropdownItem
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setSiteModal(!siteModal);
                    // Set Row Selected to edit
                    setRowSelectedToEdit(row);
                  }}
                >
                  <Edit className="mr-50" size={15} />{' '}
                  <span className="align-middle">Edit Site List</span>
                </DropdownItem>

                {/* Edit Tag List */}
                <DropdownItem
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setTagsModal(!tagsModal);
                    //  Set Row Selected to edit
                    setRowSelectedToEdit(row);
                  }}
                >
                  <Edit className="mr-50" size={15} />{' '}
                  <span className="align-middle">Edit Tag List</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    });

    return column;
  };

  // dropdown options
  const setValues = (param) => {
    const temp = { ...addValues, ...param };
    setAddValues(temp);
  };

  //  onchnage dropdown Vertical
  const dropdownVertical = (e) => {
    if (e) {
      setProjectDropDown(null);
      setModuleaDropDown([]);
      setAnalyticsReportsSelected([]);
      setAnalyticsReportList([]);
      setValues({ vertical: e.value });
      setVerticalDropDown(e);
    } else {
      // setVertical([])
      setVerticalDropDown();
      setProjectDropDown(null);
      setModuleaDropDown([]);

      setShowAnalyticsReport(false);
      setAnalyticsReportList([]);
      setAnalyticsReportsSelected([]);

      setSiteList([]);
      setSiteSelected([]);
      setProject([]);
      setMod([]);
      setLoader(false);
      setAddValues({});
    }
  };

  //  onchnage dropdown Project
  const dropdownProject = (e) => {
    if (e) {
      setModuleaDropDown([]);
      setValues({ project: e.value });
      setProjectDropDown(e);
      setFetchSiteList(true);
      setSKip(false);
      setFetchTagList(true);
    } else {
      setModuleaDropDown([]);
      setProjectDropDown(null);

      setShowAnalyticsReport(false);
      setAnalyticsReportList([]);
      setAnalyticsReportsSelected([]);

      // setProject([])
      setMod([]);
      setSiteList([]);
      setLoader(false);
      setSiteSelected([]);
      setSelectedTags([]);
      const temp_addValues = addValues;
      // Remove key-value pair for project and Module from dict of addValues
      if (temp_addValues.hasOwnProperty('project')) {
        delete temp_addValues['project'];
      }
      if (temp_addValues.hasOwnProperty('module')) {
        delete temp_addValues['module'];
      }
      setAddValues(temp_addValues);
    }
  };

  // OnChange SiteLst Dropdown module
  const dropdownSites = (e) => {
    if (e) {
      setSiteSelected(e);
    } else {
      setSiteSelected([]);
      setLoader(false);
    }
  };

  //  onchnage dropdown module
  const dropdownModule = (e) => {
    // Condition to check If show/hide analytics Module
    if (e) {
      if (e.filter((x) => x.value === 'Analytics').length) {
        // Show Analytics Report DropDown
        setShowAnalyticsReport(true);

        // Fetch Report List and populate Dropdown as per vertical
        const report_list = fetchedReportList.filter(
          (e) => e.vertical_name === addValues.vertical
        );
        if (report_list.length > 0) {
          const list = report_list[0].report_access;
          for (let i = 0; i < list.length; i++) {
            list[i][
              'label'
            ] = `${list[i]['report_type']}-${list[i]['report_name']}`;
            list[i]['value'] = list[i]['report_id'];
          }
          setAnalyticsReportList(list);
        }
        // console.log(report_list)
      } else {
        setShowAnalyticsReport(false);
      }
    } else {
      setShowAnalyticsReport(false);
    }

    if (e) {
      setValues({ module: e });
      setModuleaDropDown(e);
    } else {
      setModuleaDropDown([]);

      // setMod([])
      const temp_addValues = addValues;
      // Remove key-value pair for modules from dict of addValues
      if (temp_addValues.hasOwnProperty('module')) {
        delete temp_addValues['module'];
      }
      setAddValues(temp_addValues);
    }
  };

  const dropdownAnalyticsReport = (e) => {
    // console.log(e)
    setAnalyticsReportsSelected(e);
  };

  // Add function to form the Json
  // const Add = (addValuesParams, updateProjectReportLevelAccess) => {
  //   // console.log('Added new Row Values ....')
  //   // console.log(addValuesParams)
  //   // console.log('Final Array after deletion inside add function  .....')
  //   // console.log(FinalArray)

  //   const modules = [];
  //   if (!Object.keys(addValuesParams).includes('vertical')) {
  //     toast('Please Select Vertical.', {
  //       type: 'warning',
  //       hideProgressBar: true,
  //     });
  //     return false;
  //   } else if (!Object.keys(addValuesParams).includes('project')) {
  //     toast('Please Select Project.', {
  //       type: 'warning',
  //       hideProgressBar: true,
  //     });
  //     return false;
  //   } else if (!Object.keys(addValuesParams).includes('module')) {
  //     toast('Please Select Module.', {
  //       type: 'warning',
  //       hideProgressBar: true,
  //     });
  //     return false;
  //   } else {
  //     // Construct Modules List of Dict
  //     for (let index = 0; index < addValuesParams.module.length; index++) {
  //       const element = addValuesParams.module[index];
  //       modules.push({
  //         id: element.value.toLowerCase(),
  //         title: element.value,
  //         icon: 'Circle',
  //         navLink: `/${addValuesParams.vertical.toLowerCase()}/${addValuesParams.project.toLowerCase()}/${element.value.toLowerCase()}`,
  //       });
  //     }
  //     let FinalArrayCopy = [...FinalArray];

  //     if (FinalArrayCopy.length !== 0) {
  //       let vertical_exist = false;
  //       for (const ver of FinalArrayCopy) {
  //         if (ver.title === addValuesParams.vertical) {
  //           vertical_exist = true;
  //           let project_exist = false;

  //           for (const proj of ver.children) {
  //             if (proj.title === addValuesParams.project) {
  //               project_exist = true;
  //             }
  //           }

  //           if (project_exist) {
  //             toast('Project already exist.', {
  //               hideProgressBar: true,
  //               type: 'warning',
  //             });
  //             return false;
  //           } else {
  //             ver.children.push({
  //               id: addValuesParams.project,
  //               title: addValuesParams.project,
  //               icon: 'Circle',
  //               children: modules,
  //             });
  //             // Set project Level Site Access Data
  //             const project_site_access_construct = {
  //               project: addValuesParams.project,
  //               vertical: addValuesParams.vertical,
  //               site_access: siteSelected,
  //             };
  //             const project_level_site_access_dummy = [
  //               ...projectLevelSiteAccess,
  //             ];
  //             project_level_site_access_dummy.push(
  //               project_site_access_construct
  //             );
  //             setProjectLevelSiteAccess(project_level_site_access_dummy);

  //             // console.log('Add Values Params If Condition....')
  //             // console.log(addValuesParams)

  //             // Set Project Level Analytics Report Data
  //             if (updateProjectReportLevelAccess) {
  //               if (
  //                 addValuesParams.module.filter((x) => x.value === 'Analytics')
  //                   .length
  //               ) {
  //                 const project_analytics_report_construct = {
  //                   project: addValuesParams.project,
  //                   vertical: addValuesParams.vertical,
  //                   report_access:
  //                     analyticsReportSelected.length > 0
  //                       ? analyticsReportSelected
  //                       : analyticsReportList,
  //                 };
  //                 const project_level_analytics_report_dummy =
  //                   projectLevelAnalyticsReportAccess;
  //                 project_level_analytics_report_dummy.push(
  //                   project_analytics_report_construct
  //                 );
  //                 setProjectLevelAnalyticsReportAccess(
  //                   project_level_analytics_report_dummy
  //                 );
  //               }
  //             }

  //             //  Set project Level TAgs Access Data
  //             const project_tags_access_construct = {
  //               project: addValuesParams.project,
  //               vertical: addValuesParams.vertical,
  //               tag_access: selectedTags,
  //             };
  //             const project_level_tags_access_dummy = projectLevelTagsAccess;
  //             project_level_tags_access_dummy.push(
  //               project_tags_access_construct
  //             );

  //             setProjectLevelTagsAccess(project_level_tags_access_dummy);

  //             toast(
  //               `Project (${addValuesParams.project}) added in vertical (${addValuesParams.vertical}) successfully`,
  //               {
  //                 hideProgressBar: true,
  //                 type: 'success',
  //               }
  //             );
  //             setFinalArray(FinalArrayCopy);
  //           }
  //         }
  //       }
  //       if (!vertical_exist) {
  //         FinalArrayCopy.push({
  //           id: addValuesParams.vertical,
  //           title: addValuesParams.vertical,
  //           icon: 'Award',
  //           children: [
  //             {
  //               id: addValuesParams.project,
  //               title: addValuesParams.project,
  //               icon: 'Circle',
  //               children: modules,
  //             },
  //           ],
  //         });
  //         console.log(FinalArrayCopy, 'final array copt');
  //         setFinalArray(FinalArrayCopy);
  //         const project_site_access_construct = {
  //           project: addValuesParams.project,
  //           vertical: addValuesParams.vertical,
  //           site_access: siteSelected,
  //         };
  //         const project_level_site_access_dummy = [...projectLevelSiteAccess];
  //         project_level_site_access_dummy.push(project_site_access_construct);
  //         setProjectLevelSiteAccess(project_level_site_access_dummy);

  //         // Set Project Level Analytics Report Data
  //         if (updateProjectReportLevelAccess) {
  //           if (
  //             addValuesParams.module.filter((x) => x.value === 'Analytics')
  //               .length
  //           ) {
  //             const project_analytics_report_construct = {
  //               project: addValuesParams.project,
  //               vertical: addValuesParams.vertical,
  //               report_access:
  //                 analyticsReportSelected.length > 0
  //                   ? analyticsReportSelected
  //                   : analyticsReportList,
  //             };
  //             const project_level_analytics_report_dummy =
  //               projectLevelAnalyticsReportAccess;
  //             project_level_analytics_report_dummy.push(
  //               project_analytics_report_construct
  //             );
  //             setProjectLevelAnalyticsReportAccess(
  //               project_level_analytics_report_dummy
  //             );
  //           }
  //         }

  //         // Set project Level TAgs Access Data
  //         const project_tags_access_construct = {
  //           project: addValuesParams.project,
  //           vertical: addValuesParams.vertical,
  //           tag_access: selectedTags,
  //         };
  //         const project_level_tags_access_dummy = [...projectLevelTagsAccess];
  //         project_level_tags_access_dummy.push(project_tags_access_construct);

  //         setProjectLevelTagsAccess(project_level_tags_access_dummy);

  //         toast(`Vertical (${addValuesParams.vertical}) added successfully.`, {
  //           hideProgressBar: true,
  //           type: 'success',
  //         });
  //         setFinalArrayUpdate(!FinalArrayUpdate);
  //         setSelected(!selected);
  //       }
  //     } else {
  //       // console.log('Inside Else Block when array length is 0')

  //       FinalArrayCopy.push({
  //         id: addValuesParams.vertical,
  //         title: addValuesParams.vertical,
  //         icon: 'Award',
  //         children: [
  //           {
  //             id: addValuesParams.project,
  //             title: addValuesParams.project,
  //             icon: 'Circle',
  //             children: modules,
  //           },
  //         ],
  //       });
  //       setFinalArray(FinalArrayCopy);

  //       const project_site_access_construct = {
  //         project: addValuesParams.project,
  //         vertical: addValuesParams.vertical,
  //         site_access: siteSelected,
  //       };
  //       const project_level_site_access_dummy = [...projectLevelSiteAccess];
  //       project_level_site_access_dummy.push(project_site_access_construct);
  //       setProjectLevelSiteAccess(project_level_site_access_dummy);

  //       // Set Project Level Analytics Report Data
  //       if (updateProjectReportLevelAccess) {
  //         if (
  //           addValuesParams.module.filter((x) => x.value === 'Analytics').length
  //         ) {
  //           const project_analytics_report_construct = {
  //             project: addValuesParams.project,
  //             vertical: addValuesParams.vertical,
  //             report_access:
  //               analyticsReportSelected.length > 0
  //                 ? analyticsReportSelected
  //                 : analyticsReportList,
  //           };
  //           const project_level_analytics_report_dummy =
  //             projectLevelAnalyticsReportAccess;
  //           project_level_analytics_report_dummy.push(
  //             project_analytics_report_construct
  //           );
  //           setProjectLevelAnalyticsReportAccess(
  //             project_level_analytics_report_dummy
  //           );
  //         }
  //       }

  //       // Set project Level TAgs Access Data
  //       const project_tags_access_construct = {
  //         project: addValuesParams.project,
  //         vertical: addValuesParams.vertical,
  //         tag_access: selectedTags,
  //       };
  //       const project_level_tags_access_dummy = projectLevelTagsAccess;
  //       project_level_tags_access_dummy.push(project_tags_access_construct);

  //       setProjectLevelTagsAccess(project_level_tags_access_dummy);
  //       toast(`Vertical (${addValuesParams.vertical}) added successfully.`, {
  //         hideProgressBar: true,
  //         type: 'success',
  //       });
  //       setFinalArrayUpdate(!FinalArrayUpdate);
  //       setSelected(!selected);
  //     }
  //     setSelected(!selected);
  //   }

  //   setVerticalDropDown();
  //   setProjectDropDown(null);
  //   setModuleaDropDown([]);

  //   setShowAnalyticsReport(false);
  //   setAnalyticsReportList([]);
  //   setAnalyticsReportsSelected([]);

  //   // setVertical([]);
  //   setProject([]);
  //   setMod([]);
  //   setSiteList([]);
  //   setSiteSelected([]);
  //   setAddValues({});
  //   setSelectedTags([]);
  // };

  const Add = (addValuesParams, updateProjectReportLevelAccess) => {
    const modules = [];

    if (!Object.keys(addValuesParams).includes('vertical')) {
      toast('Please Select Vertical.', {
        type: 'warning',
        hideProgressBar: true,
      });
      return false;
    } else if (!Object.keys(addValuesParams).includes('project')) {
      toast('Please Select Project.', {
        type: 'warning',
        hideProgressBar: true,
      });
      return false;
    } else if (!Object.keys(addValuesParams).includes('module')) {
      toast('Please Select Module.', {
        type: 'warning',
        hideProgressBar: true,
      });
      return false;
    } else {
      // Construct Modules List of Dict
      addValuesParams.module.forEach((element) => {
        modules.push({
          id: element.value.toLowerCase(),
          title: element.value,
          icon: 'Circle',
          navLink: `/${addValuesParams.vertical.toLowerCase()}/${addValuesParams.project.toLowerCase()}/${element.value.toLowerCase()}`,
        });
      });

      let FinalArrayCopy = [...FinalArray];

      if (FinalArrayCopy.length !== 0) {
        let vertical_exist = false;

        FinalArrayCopy.forEach((ver) => {
          if (ver.title === addValuesParams.vertical) {
            vertical_exist = true;
            let project_exist = false;

            ver.children.forEach((proj) => {
              if (proj.title === addValuesParams.project) {
                project_exist = true;
              }
            });

            if (project_exist) {
              toast('Project already exist.', {
                hideProgressBar: true,
                type: 'warning',
              });
              return false;
            } else {
              const verCopy = { ...ver }; // Copy the vertical element
              verCopy.children = [...ver.children];
              verCopy.children.push({
                id: addValuesParams.project,
                title: addValuesParams.project,
                icon: 'Circle',
                children: modules,
              });

              // Set project Level Site Access Data
              const project_site_access_construct = {
                project: addValuesParams.project,
                vertical: addValuesParams.vertical,
                site_access: siteSelected,
              };
              const project_level_site_access_dummy = [
                ...projectLevelSiteAccess,
              ];
              project_level_site_access_dummy.push(
                project_site_access_construct
              );
              setProjectLevelSiteAccess(project_level_site_access_dummy);

              // Set Project Level Analytics Report Data
              if (updateProjectReportLevelAccess) {
                if (
                  addValuesParams.module.filter((x) => x.value === 'Analytics')
                    .length
                ) {
                  const project_analytics_report_construct = {
                    project: addValuesParams.project,
                    vertical: addValuesParams.vertical,
                    report_access:
                      analyticsReportSelected.length > 0
                        ? analyticsReportSelected
                        : analyticsReportList,
                  };
                  const project_level_analytics_report_dummy =
                    projectLevelAnalyticsReportAccess;
                  project_level_analytics_report_dummy.push(
                    project_analytics_report_construct
                  );
                  setProjectLevelAnalyticsReportAccess(
                    project_level_analytics_report_dummy
                  );
                }
              }

              // Set project Level TAgs Access Data
              const project_tags_access_construct = {
                project: addValuesParams.project,
                vertical: addValuesParams.vertical,
                tag_access: selectedTags,
              };
              const project_level_tags_access_dummy = [
                ...projectLevelTagsAccess,
              ];
              project_level_tags_access_dummy.push(
                project_tags_access_construct
              );

              setProjectLevelTagsAccess(project_level_tags_access_dummy);

              toast(
                `Project (${addValuesParams.project}) added in vertical (${addValuesParams.vertical}) successfully`,
                {
                  hideProgressBar: true,
                  type: 'success',
                }
              );
              FinalArrayCopy = FinalArrayCopy.map((v) =>
                v.title === verCopy.title ? verCopy : v
              );
              setFinalArray(FinalArrayCopy);
            }
          }
        });

        if (!vertical_exist) {
          FinalArrayCopy.push({
            id: addValuesParams.vertical,
            title: addValuesParams.vertical,
            icon: 'Award',
            children: [
              {
                id: addValuesParams.project,
                title: addValuesParams.project,
                icon: 'Circle',
                children: modules,
              },
            ],
          });
          console.log(FinalArrayCopy, 'final array copy');
          setFinalArray(FinalArrayCopy);
          const project_site_access_construct = {
            project: addValuesParams.project,
            vertical: addValuesParams.vertical,
            site_access: siteSelected,
          };
          const project_level_site_access_dummy = [...projectLevelSiteAccess];
          project_level_site_access_dummy.push(project_site_access_construct);
          setProjectLevelSiteAccess(project_level_site_access_dummy);

          // Set Project Level Analytics Report Data
          if (updateProjectReportLevelAccess) {
            if (
              addValuesParams.module.filter((x) => x.value === 'Analytics')
                .length
            ) {
              const project_analytics_report_construct = {
                project: addValuesParams.project,
                vertical: addValuesParams.vertical,
                report_access:
                  analyticsReportSelected.length > 0
                    ? analyticsReportSelected
                    : analyticsReportList,
              };
              const project_level_analytics_report_dummy =
                projectLevelAnalyticsReportAccess;
              project_level_analytics_report_dummy.push(
                project_analytics_report_construct
              );
              setProjectLevelAnalyticsReportAccess(
                project_level_analytics_report_dummy
              );
            }
          }

          // Set project Level TAgs Access Data
          const project_tags_access_construct = {
            project: addValuesParams.project,
            vertical: addValuesParams.vertical,
            tag_access: selectedTags,
          };
          const project_level_tags_access_dummy = [...projectLevelTagsAccess];
          project_level_tags_access_dummy.push(project_tags_access_construct);

          setProjectLevelTagsAccess(project_level_tags_access_dummy);

          toast(`Vertical (${addValuesParams.vertical}) added successfully.`, {
            hideProgressBar: true,
            type: 'success',
          });
          setFinalArrayUpdate(!FinalArrayUpdate);
          setSelected(!selected);
        }
      } else {
        // When FinalArrayCopy length is 0
        FinalArrayCopy.push({
          id: addValuesParams.vertical,
          title: addValuesParams.vertical,
          icon: 'Award',
          children: [
            {
              id: addValuesParams.project,
              title: addValuesParams.project,
              icon: 'Circle',
              children: modules,
            },
          ],
        });
        setFinalArray(FinalArrayCopy);

        const project_site_access_construct = {
          project: addValuesParams.project,
          vertical: addValuesParams.vertical,
          site_access: siteSelected,
        };
        const project_level_site_access_dummy = [...projectLevelSiteAccess];
        project_level_site_access_dummy.push(project_site_access_construct);
        setProjectLevelSiteAccess(project_level_site_access_dummy);

        // Set Project Level Analytics Report Data
        if (updateProjectReportLevelAccess) {
          if (
            addValuesParams.module.filter((x) => x.value === 'Analytics').length
          ) {
            const project_analytics_report_construct = {
              project: addValuesParams.project,
              vertical: addValuesParams.vertical,
              report_access:
                analyticsReportSelected.length > 0
                  ? analyticsReportSelected
                  : analyticsReportList,
            };
            const project_level_analytics_report_dummy =
              projectLevelAnalyticsReportAccess;
            project_level_analytics_report_dummy.push(
              project_analytics_report_construct
            );
            setProjectLevelAnalyticsReportAccess(
              project_level_analytics_report_dummy
            );
          }
        }

        // Set project Level TAgs Access Data
        const project_tags_access_construct = {
          project: addValuesParams.project,
          vertical: addValuesParams.vertical,
          tag_access: selectedTags,
        };
        const project_level_tags_access_dummy = projectLevelTagsAccess;
        project_level_tags_access_dummy.push(project_tags_access_construct);

        setProjectLevelTagsAccess(project_level_tags_access_dummy);
        toast(`Vertical (${addValuesParams.vertical}) added successfully.`, {
          hideProgressBar: true,
          type: 'success',
        });
        setFinalArrayUpdate(!FinalArrayUpdate);
        setSelected(!selected);
      }
      setSelected(!selected);
    }

    setVerticalDropDown();
    setProjectDropDown(null);
    setModuleaDropDown([]);
    setShowAnalyticsReport(false);
    setAnalyticsReportList([]);
    setAnalyticsReportsSelected([]);
    setProject([]);
    setMod([]);
    setSiteList([]);
    setSiteSelected([]);
    setAddValues({});
    setSelectedTags([]);
  };

  useEffect(() => {
    createTableData();
  }, [FinalArray]);

  const onUpdate = (event) => {
    event.preventDefault();
    updateUser();
    props.updateFormModal();
  };

  useEffect(() => {
    if (deletAdd) {
      // console.log('Final Array after apply ....')
      // console.log(FinalArray)
      Add(deletAdd, false);
      setDeletAdd(false);
    }
  }, [deletAdd]);

  // Conduct Delete and Add to update Modules List
  const DeleteAndAddRow = (delObj, addObj, reportAccess) => {
    setProjectLevelAnalyticsReportAccess(reportAccess);
    onDelete(delObj, false);
    setDeletAdd(addObj);
    setModuleModal(false);
  };

  const updateSiteAccessData = (siteObj) => {
    // console.log('Updated Site Obj ....')
    // console.log(siteObj)

    setProjectLevelSiteAccess(siteObj);
    setSiteModal(false);
  };

  const updateProjectLevelAnalyticsAccessData = (reportObj) => {
    setProjectLevelAnalyticsReportAccess(reportObj);
    setReportModal(false);
  };

  const updateTagsAccessData = (siteObj) => {
    // console.log('Updated Site Obj ....')
    // console.log(siteObj)

    setProjectLevelTagsAccess(siteObj);
    setTagsModal(false);
  };

  const dropdownTags = (val) => {
    if (val) {
      const tagsList = [];
      for (let i = 0; i < val.length; i++) {
        tagsList.push(val[i]);
      }
      setSelectedTags(tagsList);
    }
  };

  return (
    <>
      <Form
        onSubmit={(event) => {
          onUpdate(event);
        }}
      >
        <Row>
          <Col md="4" sm="12">
            <FormGroup>
              <Label for="nameMulti">Name</Label>
              <Input
                type="text"
                id="UserName"
                value={props.editdata.name}
                placeholder="Name"
                disabled
              />
            </FormGroup>
          </Col>
          <Col md="4" sm="12">
            <FormGroup>
              <Label for="lastNameMulti">Phone</Label>
              <Input
                type="text"
                name="phone"
                id="phone"
                value={props.editdata.phone_number}
                placeholder="Phone"
                disabled
              />
            </FormGroup>
          </Col>
          <Col md="4" sm="12">
            <FormGroup>
              <Label for="EmailMulti">Email</Label>
              <Input
                type="email"
                name="email"
                id="EmailMulti"
                placeholder="Email"
                value={props.editdata.email}
                disabled
              />
            </FormGroup>
          </Col>

          {/* Select Vertical */}
          <Col md="3" sm="12">
            <Label>Vertical</Label>
            <FormGroup>
              <Select
                id="selectvertical"
                name="vertical"
                key={`my_unique_select_key__${selected}`}
                theme={selectThemeColors}
                className=""
                classNamePrefix="select"
                options={vertical}
                isClearable={true}
                isLoading={verticalDataFetching}
                onChange={dropdownVertical}
                value={verticalDropDown}
                placeholder="Select Vertical *"
                // required
              />
            </FormGroup>
          </Col>

          {/* Select Project */}
          <Col md="3" sm="12">
            <Label>Project</Label>
            <FormGroup>
              <Select
                id="project"
                name="project"
                key={`my_unique_select_key__${selected}`}
                theme={selectThemeColors}
                className="react-select rounded zindex_1003"
                classNamePrefix="select"
                options={project}
                isClearable={true}
                onChange={dropdownProject}
                value={projectDropDown}
                placeholder="Select Project *"
                // required
              />
            </FormGroup>
          </Col>

          {/* Select Sites */}

          <Col md="3" sm="12">
            <Label>Sites</Label>
            <FormGroup>
              <Select
                id="sites"
                name="sites"
                key={`my_unique_select_key__${selected}`}
                theme={selectThemeColors}
                className="react-select rounded zindex_1003"
                classNamePrefix="select"
                options={siteList}
                isLoading={isFetching}
                isClearable={true}
                closeMenuOnSelect={false}
                isDisabled={loader}
                onChange={dropdownSites}
                value={siteSelected}
                placeholder={'Select Sites *'}
                isMulti
                // required
              />
            </FormGroup>
          </Col>

          {/* select Tags */}
          <Col md="3" sm="12">
            <FormGroup>
              <Label for="tag">Tags</Label>
              <Select
                id="tag"
                isClearable={true}
                theme={selectThemeColors}
                key={`my_unique_select_key__${selected}`}
                isMulti
                name="colors"
                options={tagList}
                className="react-select"
                classNamePrefix="select"
                onChange={dropdownTags}
                isLoading={tagsListResponse.isLoading}
                value={selectedTags}
                placeholder="Select Tags *"
                // required
              />
            </FormGroup>
          </Col>

          {/* Select Modules */}
          <Col md="3" sm="12">
            <Label>Module</Label>
            <FormGroup>
              <Select
                isClearable={true}
                theme={selectThemeColors}
                isMulti
                key={`my_unique_select_key__${selected}`}
                name="colors"
                options={mod}
                className="react-select"
                classNamePrefix="select"
                onChange={dropdownModule}
                value={modulesDropDown}
                placeholder="Select Module *"
                // required
              />
            </FormGroup>
          </Col>

          {/* Select Analytics Report */}
          {showAnalyticsReport && (
            <Col md="4" sm="12">
              <FormGroup>
                <Label for="analytics_report">Analytics Report</Label>
                <Select
                  id="module"
                  isClearable={true}
                  theme={selectThemeColors}
                  key={`my_unique_select_key__${selected}`}
                  isMulti
                  name="colors"
                  options={analyticsReportList}
                  className="react-select zindex_1003"
                  classNamePrefix="select"
                  onChange={dropdownAnalyticsReport}
                  value={analyticsReportSelected}
                  placeholder="Select Analytics Report *"
                  // required
                />
              </FormGroup>
            </Col>
          )}

          <Col lg="1">
            <Button
              className="mt-2 px-2"
              color="primary"
              type="reset"
              onClick={(e) => {
                e.preventDefault();
                const addValuesCopy = { ...addValues };
                Add(addValuesCopy, true);
              }}
            >
              Add
            </Button>
          </Col>
        </Row>
        <FormGroup check inline>
          <Input
            type="checkbox"
            id="basic-cb-unchecked"
            name="enable"
            onChange={handleCheck}
            value={checked}
            className=""
          />
          <Label for="basic-cb-unchecked" check className="h6">
            Select user as a Superadmin
          </Label>
        </FormGroup>
        <Row className="mt-1">
          <Col lg="7">
            <DataTableV1
              columns={tblColumn()}
              data={columns}
              tableName={'Added Module Table'}
              rowCount={10}
              totalRowsCount={columns.length}
              currentPage={1}
              // className="p-0 zindex_99999;"
            />
          </Col>

          <Col lg="5">
            <Card className="">
              <h4 className="my-1 mx-1">Json Viewer</h4>
              <div className=" px-1 height-425 webi_scroller">
                <ReactJson src={FinalArray} />
              </div>
            </Card>
          </Col>
        </Row>
        <Col sm="12">
          <FormGroup className="d-flex float-end gap-1">
            <Button className="mr-1" color="primary" type="submit">
              Update
            </Button>
            <Button
              color="danger"
              type="reset"
              onClick={() => {
                props.updateFormModal();
              }}
            >
              Cancel
            </Button>
          </FormGroup>
        </Col>
      </Form>

      {/* Modal to update/edit modules list */}
      <Modal
        isOpen={moduleModal}
        toggle={() => setModuleModal(!moduleModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setModuleModal(!moduleModal)}>
          Edit Modules List
        </ModalHeader>
        <ModuleModal
          // setModuleModal={setModuleModal}
          modulesAlreadySelected={verticalModuleSelected}
          modulesOption={verticalModulePassed}
          rowSelectedToEdit={rowSelectedToEdit}
          DeleteAndAddRow={DeleteAndAddRow}
          fetchedReportList={fetchedReportList}
          projectLevelAnalyticsReportAccess={projectLevelAnalyticsReportAccess}
        />
      </Modal>

      {/* Modal to updae/Edit Sites List */}
      <Modal
        isOpen={siteModal}
        toggle={() => setSiteModal(!siteModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setSiteModal(!siteModal)}>
          Edit Sites List{' '}
        </ModalHeader>
        <SiteModal
          projectLevelSiteAccess={projectLevelSiteAccess}
          rowSelectedToEdit={rowSelectedToEdit}
          updateSiteAccessData={updateSiteAccessData}
        />
      </Modal>

      {/* Modal to update/Eidt Report List */}
      <Modal
        isOpen={reportModal}
        toggle={() => setReportModal(!reportModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setReportModal(!reportModal)}>
          Edit Report List{' '}
        </ModalHeader>
        <ReportsModal
          fetchedReportList={fetchedReportList}
          projectLevelAnalyticsReportAccess={projectLevelAnalyticsReportAccess}
          rowSelectedToEdit={rowSelectedToEdit}
          updateProjectLevelAnalyticsAccessData={
            updateProjectLevelAnalyticsAccessData
          }
        />
      </Modal>

      {/* Modal to update/Eidt tags List */}
      <Modal
        isOpen={tagsModal}
        toggle={() => setTagsModal(!tagsModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setTagsModal(!tagsModal)}>
          Edit Tag List{' '}
        </ModalHeader>

        <TagsModal
          projectLevelTagsAccess={projectLevelTagsAccess}
          rowSelectedToEdit={rowSelectedToEdit}
          updateTagsAccessData={updateTagsAccessData}
        />
      </Modal>
    </>
  );
};

export default EditUser;
