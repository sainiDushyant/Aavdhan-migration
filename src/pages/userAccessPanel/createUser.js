import React, { useState, useEffect } from 'react';
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Button,
  Modal,
  ModalHeader,
  Badge,
  Card,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Select from 'react-select';
import { selectThemeColors } from '../../utils.js';
import { Edit, MoreVertical, Trash2 } from 'react-feather';
import ReactJson from 'react-json-view';
import { toast } from 'react-toastify';
import ModuleModal from './ModuleModal.js';
import SiteModal from './SiteModal.js';
import ReportsModal from './ReportsModal';
import TagsModal from './tagsModal';
import { caseInsensitiveSort } from '../../utils.js';
import {
  useGetAllVerticalsQuery,
  useGetReportsListQuery,
  useLazyGetTagsListQuery,
  useUpdateUserDataMutation,
} from '../../api/user-access-panel/index.js';
import { useCommandInfoAssetsQuery } from '../../api/hes/drop-downSlice.js';
import DataTableV1 from '../../components/dtTable/DataTableV1.js';

const CreateUser = (props) => {
  // Access Control Final Array
  const [FinalArray, setFinalArray] = useState([]);

  // Access Control Site Level Access
  const [projectLevelSiteAccess, setProjectLevelSiteAccess] = useState([]);
  // Access Control Tags Level Access
  const [projectLevelTagsAccess, setProjectLevelTagsAccess] = useState([]);
  // console.log('Project Level Site Access Report ....')
  // console.log(projectLevelSiteAccess)
  const [siteSelected, setSiteSelected] = useState([]);

  const [FinalArrayUpdate, setFinalArrayUpdate] = useState([]);
  const initialValues = { name: '', phone_number: '', email: '' };

  const [formValue, setFormValue] = useState(initialValues);
  const [addValues, setAddValues] = useState({});
  const [columns, setColumns] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [response, setResponse] = useState([]);
  const [loader, setLoader] = useState(false);
  const [sitesLoader, setSitesLoader] = useState(false);
  const [selected, setSelected] = useState(false);
  const [checked, setChecked] = useState(false);
  const [project, setProject] = useState([]);
  const [mod, setMod] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [fetchSiteList, setFetchSiteList] = useState(false);
  const [fetchTagList, setFetchTagList] = useState(false);
  const [siteList, setSiteList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [moduleModal, setModuleModal] = useState(false);
  const [verticalModulePassed, setVerticalModulePassed] = useState([]);
  const [verticalModuleSelected, setVerticalModuleSelected] = useState([]);
  const [rowSelectedToEdit, setRowSelectedToEdit] = useState(undefined);

  const [siteModal, setSiteModal] = useState(false);

  const [deletAdd, setDeletAdd] = useState(false);

  // UseState to control Analytics Report Dropdown
  const [showAnalyticsReport, setShowAnalyticsReport] = useState(false);
  const [analyticsReportList, setAnalyticsReportList] = useState([]);
  // console.log('Analytics Report List ....')
  // console.log(analyticsReportList)

  // Access Control Analytics Report Access
  const [
    projectLevelAnalyticsReportAccess,
    setProjectLevelAnalyticsReportAccess,
  ] = useState([]);
  // console.log('Project Level Analytics Report Access ....')
  // console.log(projectLevelAnalyticsReportAccess)
  const [analyticsReportSelected, setAnalyticsReportsSelected] = useState([]);

  // Fetched Complete list of Analytics Report Module Wise
  const [fetchedReportList, setFetchedReportList] = useState([]);

  const [reportModal, setReportModal] = useState(false);
  const [tagsModal, setTagsModal] = useState(false);
  // DropDown Values
  const [verticalDropDown, setVerticalDropDown] = useState();
  const [projectDropDown, setProjectDropDown] = useState();
  const [modulesDropDown, setModuleaDropDown] = useState([]);

  const [selectedTags, setSelectedTags] = useState([]);
  const [skip, setSkip] = useState(true);

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
        setSkip(true);
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
              onClick={() => setSkip(false)}
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

  // To handle checkbox
  const handleCheck = (event) => {
    const name = event.target.name;
    const value = event.target.checked;
    setChecked((values) => ({ ...values, [name]: value }));
  };

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

  // Api to Post the created user data  in a Table

  const postSubmitUserdata = () => {
    updateUserData({
      ...formValue,
      role: checked ? 'superadmin' : 'admin',
      // default_route: '/coliving/owner-access-control',
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
      method: 'POST',
    });
  };

  useEffect(() => {
    if (updateUserDataResponse.status === 'fulfilled') {
      let statusCode = updateUserDataResponse.data.responseCode;
      if (statusCode === 201) {
        setFinalArray(FinalArray);
        setFormValue(formValue);
        props.handleCreateUserFormModal();
        toast('New user added successfully.', {
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

  // on delete function
  const onDelete = (deletable, updateProjectReportLevelAccess) => {
    const array = [];
    const response = columns.filter((i) => i !== deletable);
    // If Only one vertical and one project exists
    if (FinalArray.length === 1 && FinalArray[0].children.length === 1) {
      setFinalArray([]);
      setFinalArrayUpdate(!FinalArrayUpdate);
      setColumns(response);
      setProjectLevelSiteAccess([]);
      if (updateProjectReportLevelAccess) {
        setProjectLevelAnalyticsReportAccess([]);
      }

      return;
    }
    //If More than One vertical and Muiltiple Project exists
    for (const ver of FinalArray) {
      if (ver.title === deletable.vertical) {
        let count = 0;
        for (const proj of ver.children) {
          if (proj.title === deletable.project) {
            ver.children.splice(count, 1);
            // setFinalArrayUpdate(!FinalArrayUpdate)
          }
          count += 1;
        }
      }
    }
    // Condition to check if Vertical Contain Empty Children List
    let ver_count = 0;
    for (const ver of FinalArray) {
      if (ver.children.length === 0) {
        FinalArray.splice(ver_count, 1);
      }
      ver_count += 1;
    }

    // Condition to check and delete data from project level Site Access Data
    const projectLevelSiteAccess_Dummy = projectLevelSiteAccess;
    for (let i = 0; i < projectLevelSiteAccess_Dummy.length; i++) {
      if (
        projectLevelSiteAccess_Dummy[i].vertical === deletable.vertical &&
        projectLevelSiteAccess_Dummy[i].project === deletable.project
      ) {
        projectLevelSiteAccess_Dummy.splice(i, 1);
      }
    }
    setProjectLevelSiteAccess(projectLevelSiteAccess_Dummy);

    // Condition to check and delete data from project level Tags Access Data
    const projectLevelTagsAccess_Dummy = projectLevelTagsAccess;
    for (let i = 0; i < projectLevelTagsAccess_Dummy.length; i++) {
      if (
        projectLevelTagsAccess_Dummy[i].vertical === deletable.vertical &&
        projectLevelTagsAccess_Dummy[i].project === deletable.project
      ) {
        projectLevelTagsAccess_Dummy.splice(i, 1);
      }
    }
    setProjectLevelTagsAccess(projectLevelTagsAccess_Dummy);

    if (updateProjectReportLevelAccess) {
      // Condition to check and delete data from project level Site Access Data
      const projectLevelAnalyticsReportAccess_Dummy =
        projectLevelAnalyticsReportAccess;
      // console.log('Project Level Analytics Report Access Dummy ....')
      // console.log(projectLevelAnalyticsReportAccess_Dummy)
      for (let i = 0; i < projectLevelAnalyticsReportAccess_Dummy.length; i++) {
        // console.log(projectLevelAnalyticsReportAccess_Dummy[i].vertical)
        // console.log(projectLevelAnalyticsReportAccess_Dummy[i].project)
        // console.log(deletable.vertical)
        // console.log(deletable.project)

        if (
          projectLevelAnalyticsReportAccess_Dummy[i].vertical ===
            deletable.vertical &&
          projectLevelAnalyticsReportAccess_Dummy[i].project ===
            deletable.project
        ) {
          projectLevelAnalyticsReportAccess_Dummy.splice(i, 1);
        }
      }

      // console.log('Project Level Access New Dummy .....')
      // console.log(projectLevelAnalyticsReportAccess_Dummy)
      // console.log('Deletable Object ....')
      // console.log(deletable)

      setProjectLevelAnalyticsReportAccess(
        projectLevelAnalyticsReportAccess_Dummy
      );
    }

    setColumns(response);
    setFinalArrayUpdate(!FinalArrayUpdate);
    toast(`succesfully deleted`, { hideProgressBar: true, type: 'success' });
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
            {/* Delete Row Option */}
            <Trash2
              size="15"
              className="ml-1 cursor-pointer"
              onClick={(i) => onDelete(row, true)}
            />
            <UncontrolledDropdown className="zindex_1001">
              <DropdownToggle
                className="icon-btn hide-arrow "
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
                    // console.log(row)
                    if (row.module.includes('Analytics')) {
                      // console.log('Analytics Module Exist')
                      setRowSelectedToEdit(row);
                      setReportModal(!reportModal);
                    }
                  }}
                >
                  <Edit className="mr-50" size={15} />{' '}
                  <span className="align-middle">
                    Edit Analytics Report List
                  </span>
                </DropdownItem>

                {/* Edit Modules List */}
                <DropdownItem
                  href="/"
                  onClick={(e) => {
                    // console.log('Row Selected .....')
                    // console.log(row)

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

                {/* Edit Sites List */}
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
                  <span className="align-middle">Edit Tags List</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    });

    return column;
  };

  //  formvalues to handle change form Values
  const handlechange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormValue((values) => ({ ...values, [name]: value }));
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
      setSkip(false);
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
    if (e) {
      setAnalyticsReportsSelected(e);
    } else {
      setAnalyticsReportsSelected([]);
    }
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

  const resetValues = () => {
    // console.log('Reset Values get called ....')

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

  // Add function to form the Json
  const Add = (addValuesParams, updateProjectReportLevelAccess) => {
    // console.log('Add Function get called ....')

    const modules = [];
    // condition to check input field empty or not
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
    } else if (
      !Object.keys(addValuesParams).includes('module') ||
      addValuesParams.module.length === 0
    ) {
      toast('Please Select atleast 1 Module.', {
        type: 'warning',
        hideProgressBar: true,
      });
      return false;
    } else {
      // Construct Modules List of Dict
      for (let index = 0; index < addValuesParams.module.length; index++) {
        const element = addValuesParams.module[index];
        modules.push({
          id: element.value.toLowerCase(),
          title: element.value,
          icon: 'Circle',
          navLink: `/${addValuesParams.vertical.toLowerCase()}/${addValuesParams.project.toLowerCase()}/${element.value.toLowerCase()}`,
        });
      }

      if (FinalArray.length !== 0) {
        let vertical_exist = false;
        for (const ver of FinalArray) {
          // Check If Vertical Exists
          if (ver.title === addValuesParams.vertical) {
            vertical_exist = true;
            let project_exist = false;

            // Check If Project Exists
            for (const proj of ver.children) {
              if (proj.title === addValuesParams.project) {
                project_exist = true;
              }
            }

            if (project_exist) {
              toast('Project already exist.', {
                hideProgressBar: true,
                type: 'warning',
              });
              return false;
            } else {
              // If Project already donot exist, but vertical already exist
              ver.children.push({
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
              const project_level_site_access_dummy = projectLevelSiteAccess;
              project_level_site_access_dummy.push(
                project_site_access_construct
              );
              setProjectLevelSiteAccess(project_level_site_access_dummy);

              // console.log('Add Values Params If Condition....')
              // console.log(addValuesParams)

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
              const project_level_tags_access_dummy = projectLevelTagsAccess;
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
            }
          }
        }

        // If Vertical and Project is not already added
        if (!vertical_exist) {
          FinalArray.push({
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

          // Set project Level Site Access Data
          const project_site_access_construct = {
            project: addValuesParams.project,
            vertical: addValuesParams.vertical,
            site_access: siteSelected,
          };
          const project_level_site_access_dummy = projectLevelSiteAccess;
          project_level_site_access_dummy.push(project_site_access_construct);
          setProjectLevelSiteAccess(project_level_site_access_dummy);

          // console.log('Add Values Params If Condition....')
          // console.log(addValuesParams)

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
        createTableData();
      } else {
        // console.log('Inside Else Block when array length is 0')

        FinalArray.push({
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
        setFinalArray(FinalArray);

        const project_site_access_construct = {
          project: addValuesParams.project,
          vertical: addValuesParams.vertical,
          site_access: siteSelected,
        };
        const project_level_site_access_dummy = projectLevelSiteAccess;
        project_level_site_access_dummy.push(project_site_access_construct);
        setProjectLevelSiteAccess(project_level_site_access_dummy);

        // console.log('Add Values Params Else Condition....')
        // console.log(addValuesParams)

        // Set Project Level Analytics Report Data
        if (updateProjectReportLevelAccess) {
          if (
            addValuesParams.module.filter((x) => x.value === 'Analytics').length
          ) {
            // console.log('Analytics Report Selected .....')
            // console.log(analyticsReportSelected)
            // console.log('Analytics Report List ....')
            // console.log(analyticsReportList)

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

        createTableData();
        toast(`Vertical (${addValuesParams.vertical}) added successfully.`, {
          hideProgressBar: true,
          type: 'success',
        });
        setFinalArrayUpdate(!FinalArrayUpdate);
        setSelected(!selected);
      }
      setSelected(!selected);
    }

    resetValues();
  };

  //  form handleSubmit function
  const handleSubmit = () => {
    setFormValue({ name: '', phone_number: '', email: '' });
  };

  useEffect(() => {
    if (deletAdd) {
      Add(deletAdd, false);
      setDeletAdd(false);
    }
  }, [deletAdd]);

  useEffect(() => {
    createTableData();
  }, [FinalArray]);

  // Conduct Delete and Add to update Modules List
  const DeleteAndAddRow = (delObj, addObj, reportAccess) => {
    // Delete selected row
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

  // On submit form validations handle
  const onSubmit = (event) => {
    event.preventDefault();

    if (FinalArray.length < 1) {
      toast('Can not add.', { hideProgressBar: true, type: 'warning' });
      return false;
    }

    if (!formValue.phone_number.includes('+91')) {
      formValue.phone_number = `+91${formValue.phone_number}`;
    }

    if (!/^(\+91)?[6789]\d{9}$/.test(formValue.phone_number)) {
      toast('Please insert correct mobile number.', {
        hideProgressBar: true,
        type: 'warning',
      });
      return false;
    }

    for (const user of props.userData) {
      if (user.email === formValue.email) {
        toast('Email Already Exist.', {
          type: 'warning',
          hideProgressBar: true,
        });
        return false;
      } else if (user.phone_number === formValue.phone_number) {
        toast('Phone Number Already Exist.', {
          type: 'warning',
          hideProgressBar: true,
        });
        return false;
      }
    }
    if (formValue.name && !/^[a-zA-Z .]+$/.test(formValue.name)) {
      toast('Please insert correct name.', {
        type: 'warning',
        hideProgressBar: true,
      });
      return false;
    }
    if (
      formValue.email &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formValue.email)
    ) {
      toast('Please insert correct email.', {
        type: 'warning',
        hideProgressBar: true,
      });
      return false;
    }
    formValue.email = formValue.email.toLowerCase();

    postSubmitUserdata();
  };

  return (
    <>
      <Form
        onSubmit={(event) => {
          onSubmit(event);
        }}
      >
        <Row>
          <Col md="4" sm="12">
            <FormGroup>
              <Label for="UserName">Name</Label>
              <Input
                type="text"
                name="name"
                id="UserName"
                placeholder="Name *"
                value={formValue.name}
                onChange={handlechange}
                required
              />
            </FormGroup>
          </Col>
          <Col md="4" sm="12">
            <FormGroup>
              <Label for="phoneNo">Phone</Label>
              <Input
                type="text"
                name="phone_number"
                id="phoneNo"
                placeholder="Phone *"
                value={formValue.phone_number.replaceAll(' ', '')}
                onChange={handlechange}
                required
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
                placeholder="Email *"
                value={formValue.email}
                onChange={handlechange}
              />
            </FormGroup>
          </Col>
          {/* Select Vertical */}
          <Col md="3" sm="12">
            <FormGroup>
              <Label for="selectvertical">Vertical</Label>
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
              />
            </FormGroup>
          </Col>
          {/* Select Project */}
          <Col md="3" sm="12">
            <FormGroup>
              <Label for="project">Project</Label>
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
                closeMenuOnSelect={false}
                isDisabled={sitesLoader}
                isClearable={true}
                onChange={dropdownSites}
                value={siteSelected}
                isLoading={isFetching}
                placeholder={'Select Sites *'}
                isMulti
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
                value={selectedTags}
                isLoading={tagsListResponse.isLoading}
                placeholder="Select Tags *"
              />
            </FormGroup>
          </Col>

          {/* Select Modules */}
          <Col md="3" sm="12">
            <FormGroup>
              <Label for="module">Module</Label>
              <Select
                id="module"
                isClearable={true}
                theme={selectThemeColors}
                key={`my_unique_select_key__${selected}`}
                isMulti
                name="colors"
                options={mod}
                className="react-select"
                classNamePrefix="select"
                onChange={dropdownModule}
                value={modulesDropDown}
                placeholder="Select Module *"
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
                  className="react-select zindex_999"
                  classNamePrefix="select"
                  onChange={dropdownAnalyticsReport}
                  value={analyticsReportSelected}
                  placeholder="Select Analytics Report *"
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
                Add(addValues, true);
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
            {!updateUserDataResponse.isFetching ? (
              <Button className="mr-1" color="primary" type="submit">
                Submit
              </Button>
            ) : (
              <Button color="secondary" className="mr-1 px-1" disabled>
                <Spinner color="white" size="sm" className="mx_2 mt_2" />
                <span className="ms-50">Loading...</span>
              </Button>
            )}

            <Button
              outline
              color="primary"
              type="reset"
              onClick={() => {
                handleSubmit();
              }}
            >
              Reset
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
          Edit Report List{' '}
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

export default CreateUser;
