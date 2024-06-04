// ** React Imports
import { useState, useEffect } from 'react';

import classnames from 'classnames';
import * as Icon from 'react-feather';
import {
  NavItem,
  NavLink,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from 'reactstrap';

// ** Custom Components
import Autocomplete from '../../../@core/components/autocomplete';
import { useDispatch, batch } from 'react-redux';

import { useLocation } from 'react-router-dom';

import { updateMDMSHierarchyProgress } from '../../../app/redux/mdmsHeirarchySlice';
import { toast } from 'react-toastify';
import { useLazyGISMeterSearchQuery } from '../../../api/hes/command-historySlice';

const NavbarSearch = ({ setOpenSearchBar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const project =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];

  const [userInputParameter, setUserInputParameter] = useState('');

  const [selectedOption, setSelectedOption] = useState('meter');

  const [search, response] = useLazyGISMeterSearchQuery();

  const searchMeter = () => {
    const params = {
      project: project,
      unique_id: userInputParameter,
      asset_type: selectedOption,
    };
    //Get searched Meter Info
    search(params);
  };

  useEffect(() => {
    if (response.status === 'fulfilled') {
      let statusCode = response.currentData.responseCode;
      if (statusCode === 200) {
        const meter_details = response.currentData.data.result.stat.asset;

        if (meter_details.length > 0) {
          toast('Asset Found ....', { hideProgressBar: true, type: 'success' });

          batch(() => {
            if (selectedOption === 'meter') {
              dispatch(
                updateMDMSHierarchyProgress({
                  project_type: location.pathname.split('/')[1],
                  project_name: project,
                  module_name: 'mdms',
                  pss_name: meter_details[0].pss_id,
                  feeder_name: meter_details[0].feeder_id,
                  dtr_name: meter_details[0].site_id,
                  user_name: meter_details[0].sc_no,
                  meter_serial_number: meter_details[0].meter_number,
                  mdms_state: 'user_profile',
                  user_type: meter_details[0].connection_type,
                  dtr_real_name: meter_details[0].site_name,
                  feeder_real_name: meter_details[0].feeder_name,
                  grid_id: meter_details[0].grid_id,
                  meter_address: meter_details[0].meter_address,
                  meter_protocol_type:
                    meter_details[0].meter_protocol_type.toLowerCase(),
                  pss_real_name: meter_details[0].pss_name,
                  user_real_name: '',
                })
              );
            } else if (selectedOption === 'dtr') {
              dispatch(
                updateMDMSHierarchyProgress({
                  project_type: location.pathname.split('/')[1],
                  project_name: project,
                  module_name: 'mdms',
                  pss_name: meter_details[0].pss_id,
                  feeder_name: meter_details[0].feeder_id,
                  dtr_name: meter_details[0].site_id,
                  user_name: '',
                  meter_serial_number: '',
                  mdms_state: 'user',
                  user_type: '',
                  dtr_real_name: meter_details[0].site_name,
                  feeder_real_name: meter_details[0].feeder_name,
                  grid_id: '',
                  meter_address: '',
                  meter_protocol_type: '',
                  pss_real_name: meter_details[0].pss_name,
                  user_real_name: '',
                })
              );
            } else if (selectedOption === 'feeder') {
              dispatch(
                updateMDMSHierarchyProgress({
                  project_type: location.pathname.split('/')[1],
                  project_name: project,
                  module_name: 'mdms',
                  pss_name: meter_details[0].pss_id,
                  feeder_name: meter_details[0].feeder_id,
                  dtr_name: '',
                  user_name: '',
                  meter_serial_number: '',
                  mdms_state: 'dtr',
                  user_type: '',
                  dtr_real_name: '',
                  feeder_real_name: meter_details[0].feeder_name,
                  grid_id: '',
                  meter_address: '',
                  meter_protocol_type: '',
                  pss_real_name: meter_details[0].pss_name,
                  user_real_name: '',
                })
              );
            } else if (selectedOption === 'pss') {
              dispatch(
                updateMDMSHierarchyProgress({
                  project_type: location.pathname.split('/')[1],
                  project_name: project,
                  module_name: 'mdms',
                  pss_name: meter_details[0].pss_id,
                  feeder_name: '',
                  dtr_name: '',
                  user_name: '',
                  meter_serial_number: '',
                  mdms_state: 'feeder',
                  user_type: '',
                  dtr_real_name: '',
                  feeder_real_name: '',
                  grid_id: '',
                  meter_address: '',
                  meter_protocol_type: '',
                  pss_real_name: meter_details[0].pss_name,
                  user_real_name: '',
                })
              );
            }
          });
        } else {
          toast('No result found ....', {
            hideProgressBar: true,
            type: 'error',
          });
        }
      }
    } else if (response.isError) {
      toast('Something went wrong, please retry.', {
        hideProgressBar: true,
        type: 'error',
      });
    }
  }, [response]);

  const userInputFun = (val) => {
    setUserInputParameter(val);
  };

  // ** Function to close search on ESC & ENTER Click
  const onKeyDown = (e) => {
    if (e.keyCode === 27 || e.keyCode === 13) {
      // console.log(e.keyCode)
      setTimeout(() => {
        // setNavbarSearch(false);
        if (
          userInputParameter === undefined ||
          userInputParameter.length <= 0
        ) {
          // Do Nothing
        } else {
          searchMeter();
        }
      }, 1);
    }
  };
  const handleSearchIconClicked = () => {
    if (userInputParameter === undefined || userInputParameter.length <= 0) {
      //do Nothing
    } else {
      searchMeter();
    }
  };

  return (
    <NavItem className="nav-item-search">
      <Icon.Search className="me-1 ms-1" onClick={handleSearchIconClicked} />
      <Autocomplete
        className="form-control border-0 me-2 autocomplete"
        filterHeaderKey="groupTitle"
        grouped={true}
        placeholder="Search for Substation,Feeder,Site,Meter"
        autoFocus={true}
        onKeyDown={onKeyDown}
        userInputFun={userInputFun}
      />
      <h6 className="mb-0 me-2 ms-auto">Select Asset:</h6>
      <FormGroup check inline className="me-1">
        <Input
          type="radio"
          id="pss"
          name="ex1"
          value="PSS"
          checked={selectedOption === 'pss'}
          onChange={() => setSelectedOption('pss')}
        />
        <Label check for="pss" className="mb-0">
          PSS
        </Label>
      </FormGroup>
      <FormGroup check inline className="me-1">
        <Input
          type="radio"
          id="feeder"
          name="ex1"
          value="FEEDER"
          checked={selectedOption === 'feeder'}
          onChange={() => setSelectedOption('feeder')}
        />
        <Label check for="feeder" className="mb-0">
          FEEDER
        </Label>
      </FormGroup>
      <FormGroup check inline className="me-1">
        <Input
          type="radio"
          id="DTR"
          name="ex1"
          value="DTR"
          checked={selectedOption === 'dtr'}
          onChange={() => setSelectedOption('dtr')}
        />
        <Label check for="DTR" className="mb-0">
          DTR
        </Label>
      </FormGroup>
      <FormGroup check inline className="me-1">
        <Input
          type="radio"
          id="METER"
          name="ex1"
          value="METER"
          checked={selectedOption === 'meter'}
          onChange={() => setSelectedOption('meter')}
        />
        <Label check for="METER" className="mb-0">
          METER
        </Label>
      </FormGroup>
      <Icon.X
        className="ms-auto me-1 icon-x"
        onClick={(e) => {
          e.stopPropagation();
          setOpenSearchBar(false);
        }}
      />
    </NavItem>

    // <NavItem
    //   // className="navbar border d-flex gap-1"
    //   className="d-flex"
    //   style={{ width: '100%' }}
    //   //  onClick={() => setNavbarSearch(true)}
    // >
    //   {/* <NavLink className="nav-link-search">
    //     <Icon.Search className="ficon" />
    //   </NavLink> */}
    //   {/* <div
    //     className={classnames('search-input', {
    //       open: navbarSearch === true,
    //     })}
    //   > */}
    //   <Row>
    //     <Col lg="6" md="12" sm="12">
    //       {/* <div
    //       // className="search-input-icon "
    //       >

    //       </div> */}
    //       {/* {navbarSearch ? (*/}

    //       <>
    //         <Icon.Search />
    //         <Autocomplete
    //           className="form-control"
    //           filterKey="title"
    //           filterHeaderKey="groupTitle"
    //           grouped={true}
    //           placeholder="Search for Substation,Feeder,Site,Meter"
    //           autoFocus={true}
    //           onKeyDown={onKeyDown}
    //           userInputFun={userInputFun}
    //         />
    //       </>
    //       {/* ) : null}  */}
    //     </Col>
    //     <Col lg="6" className="mt_20 px-2 mb-1">
    //       <h6 className="float-start">Select Asset :- &nbsp;&nbsp;&nbsp; </h6>
    //       <div className="float-end">
    //         <FormGroup check inline className="">
    //           <Input
    //             type="radio"
    //             id="pss"
    //             name="ex1"
    //             value="PSS"
    //             // defaultChecked
    //             checked={selectedOption === 'pss'}
    //             onChange={() => setSelectedOption('pss')}
    //           />
    //           <Label check for="pss">
    //             PSS
    //           </Label>
    //         </FormGroup>
    //         <FormGroup check inline>
    //           <Input
    //             type="radio"
    //             id="feeder"
    //             name="ex1"
    //             value="FEEDER"
    //             checked={selectedOption === 'feeder'}
    //             onChange={() => setSelectedOption('feeder')}
    //           />
    //           <Label check for="feeder">
    //             FEEDER
    //           </Label>
    //         </FormGroup>
    //         <FormGroup check inline>
    //           <Input
    //             type="radio"
    //             id="DTR"
    //             name="ex1"
    //             value="DTR"
    //             checked={selectedOption === 'dtr'}
    //             onChange={() => setSelectedOption('dtr')}
    //           />
    //           <Label check for="DTR">
    //             DTR
    //           </Label>
    //         </FormGroup>
    //         <FormGroup check inline>
    //           <Input
    //             type="radio"
    //             id="METER"
    //             name="ex1"
    //             value="METER"
    //             checked={selectedOption === 'meter'}
    //             onChange={() => setSelectedOption('meter')}
    //           />
    //           <Label check for="METER">
    //             METER
    //           </Label>
    //         </FormGroup>
    //       </div>
    //     </Col>
    //   </Row>
    //   <div className="search-input-close">
    //     <Icon.X
    //       className="float-end"
    //       //className="ficon"
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         //setNavbarSearch(false);
    //         setOpenSearchBar(false);
    //       }}
    //     />
    //   </div>
    //   {/* </div> */}
    // </NavItem>
  );
};

export default NavbarSearch;
