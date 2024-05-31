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

const NavbarSearch = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const project =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];

  // console.log('Hierarchy Progress ....')
  // console.log(HierarchyProgress)

  const [navbarSearch, setNavbarSearch] = useState(false);
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
  }, []);

  const userInputFun = (val) => {
    setUserInputParameter(val);
  };

  // ** Function to close search on ESC & ENTER Click
  const onKeyDown = (e) => {
    if (e.keyCode === 27 || e.keyCode === 13) {
      // console.log(e.keyCode)
      setTimeout(() => {
        setNavbarSearch(false);
        if (
          userInputParameter === undefined ||
          userInputParameter.length <= 0
        ) {
          // Do Nothing
        } else {
          // console.log('Make an API Call .....')
          // console.log('Meter Serial number .....')
          // console.log(userInputParameter)
          searchMeter();
        }
      }, 1);
    }
  };

  return (
    <NavItem className="nav-search" onClick={() => setNavbarSearch(true)}>
      <NavLink className="nav-link-search">
        <Icon.Search className="ficon" />
      </NavLink>
      <div
        className={classnames('search-input', {
          open: navbarSearch === true,
        })}
      >
        <Row>
          <Col lg="6" md="12" sm="12">
            <div className="search-input-icon ">
              <Icon.Search />
            </div>
            {navbarSearch ? (
              <>
                <Autocomplete
                  className="form-control"
                  filterKey="title"
                  filterHeaderKey="groupTitle"
                  grouped={true}
                  placeholder="Search for Substation,Feeder,Site,Meter"
                  autoFocus={true}
                  onKeyDown={onKeyDown}
                  userInputFun={userInputFun}
                />
              </>
            ) : null}
          </Col>
          <Col lg="6" className="mt_20 px-2 mb-1">
            <h6 className="float-left">Select Asset :- &nbsp;&nbsp;&nbsp; </h6>
            <div className="float-left">
              <FormGroup check inline className="">
                <Input
                  type="radio"
                  id="pss"
                  name="ex1"
                  value="PSS"
                  // defaultChecked
                  checked={selectedOption === 'pss'}
                  onChange={() => setSelectedOption('pss')}
                />
                <Label check for="pss">
                  PSS
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type="radio"
                  id="feeder"
                  name="ex1"
                  value="FEEDER"
                  checked={selectedOption === 'feeder'}
                  onChange={() => setSelectedOption('feeder')}
                />
                <Label check for="feeder">
                  FEEDER
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type="radio"
                  id="DTR"
                  name="ex1"
                  value="DTR"
                  checked={selectedOption === 'dtr'}
                  onChange={() => setSelectedOption('dtr')}
                />
                <Label check for="DTR">
                  DTR
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type="radio"
                  id="METER"
                  name="ex1"
                  value="METER"
                  checked={selectedOption === 'meter'}
                  onChange={() => setSelectedOption('meter')}
                />
                <Label check for="METER">
                  METER
                </Label>
              </FormGroup>
            </div>
          </Col>
        </Row>
        <div className="search-input-close">
          <Icon.X
            className="ficon"
            onClick={(e) => {
              e.stopPropagation();
              setNavbarSearch(false);
            }}
          />
        </div>
      </div>
    </NavItem>
  );
};

export default NavbarSearch;
