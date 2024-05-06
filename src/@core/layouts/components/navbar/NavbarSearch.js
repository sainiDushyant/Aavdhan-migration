// ** React Imports
import { useState, useEffect } from 'react'

import useJwt from '@src/auth/jwt/useJwt'

import classnames from 'classnames'
import * as Icon from 'react-feather'
import { CustomInput, NavItem, NavLink, FormGroup, Label, Input, Form, Row, Col } from 'reactstrap'

// ** Custom Components
import Autocomplete from '@components/autocomplete'

import { useDispatch, useSelector, batch } from 'react-redux'

import { useLocation, useHistory } from 'react-router-dom'

import { handleMDMSHierarchyProgress } from '@store/actions/UtilityProject/MDMS/HierarchyProgress'

import { toast } from 'react-toastify'
import Toast from '@src/views/ui-elements/cards/actions/createToast'
// import { useHistory } from 'react-router-dom'

import authLogout from '../../../../auth/jwt/logoutlogic'

import {
  handleEnergyConsumptionData,
  handleAlertsData,
  handleOpertationalStatisticsData,
  handleUptimeData,
  handleBillsGeneratedData,
  handleSLAInformationData
} from '@store/actions/UtilityProject/MDMS/user'

import {
  handleEnergyConsumptionData as handleEnergyConsumptionDatadtr,
  handleAlertsData as handleAlertsDatadtr,
  handleOpertationalStatisticsData as handleOpertationalStatisticsDatadtr,
  handleUptimeData as handleUptimeDatadtr,
  handleBillsGeneratedData as handleBillsGeneratedDatadtr
} from '@store/actions/UtilityProject/MDMS/dtr'

import {
  handleEnergyConsumptionData as handleEnergyConsumptionDatafeeder,
  handleAlertsData as handleAlertsDatafeeder,
  handleOpertationalStatisticsData as handleOpertationalStatisticsDatafeeder,
  handleUptimeData as handleUptimeDatafeeder,
  handleBillsGeneratedData as handleBillsGeneratedDatafeeder
} from '@store/actions/UtilityProject/MDMS/feeder'

import {
  handleEnergyConsumptionData as handleEnergyConsumptionDatapss,
  handleAlertsData as handleAlertsDatapss,
  handleOpertationalStatisticsData as handleOpertationalStatisticsDatapss,
  handleUptimeData as handleUptimeDatapss,
  handleBillsGeneratedData as handleBillsGeneratedDatapss
} from '@store/actions/UtilityProject/MDMS/pss'

import {
  handleConsumerProfileInformationData,
  handleConsumerTotalConsumptionData,
  handleConsumerTotalRechargesData,
  handleConsumerTopAlertsData,
  handleConsumerTopMeterAlertsData,
  handleCommandInfoData
} from '@store/actions/UtilityProject/MDMS/userprofile'

import { handleCurrentSelectedModuleStatus } from '@store/actions/Misc/currentSelectedModuleStatus'

const NavbarSearch = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()

  // Logout User
  const [logout, setLogout] = useState(false)
  useEffect(() => {
    if (logout) {
      authLogout(history, dispatch)
    }
  }, [logout])

  const HierarchyProgress = useSelector(state => state.UtilityMDMSHierarchyProgressReducer.responseData)
  const currentSelectedModuleStatus = useSelector(state => state.CurrentSelectedModuleStatusReducer.responseData)

  // console.log('Hierarchy Progress ....')
  // console.log(HierarchyProgress)

  const [navbarSearch, setNavbarSearch] = useState(false)
  const [userInputParameter, setUserInputParameter] = useState(undefined)

  const [selectedOption, setSelectedOption] = useState('meter')

  const [selected_project, set_selected_project] = useState(undefined)

  if (currentSelectedModuleStatus.prev_project) {
    if (
      selected_project !== currentSelectedModuleStatus.project &&
      currentSelectedModuleStatus.prev_project !== currentSelectedModuleStatus.project
    ) {
      set_selected_project(currentSelectedModuleStatus.project)
      setNavbarSearch(false)
    }
  }

  const fetchData = async params => {
    return await useJwt
      .getProjectAsset(params)
      .then(res => {
        const status = res.status
        return [status, res]
      })
      .catch(err => {
        if (err.response) {
          const status = err.response.status
          return [status, err]
        } else {
          return [0, err]
        }
      })
  }

  const searchMeter = async () => {
    const params = {
      project: HierarchyProgress.project_name,
      unique_id: userInputParameter,
      asset_type: selectedOption
    }
    //Get searched Meter Info
    const [statusCode, responseInfo] = await fetchData(params)

    if (statusCode) {
      if (statusCode === 401 || statusCode === 403) {
        setLogout(true)
      } else {
        const meter_details = responseInfo.data.data.result.stat.asset
        // console.log('Searched Meter Data ....')
        // console.log(meter_details)

        if (meter_details.length > 0) {
          toast.success(<Toast msg={'Asset Found ....'} type='success' />, { hideProgressBar: true })

          batch(() => {
            if (selectedOption === 'meter') {
              dispatch(
                handleMDMSHierarchyProgress({
                  project_type: location.pathname.split('/')[1],
                  project_name: HierarchyProgress.project_name,
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
                  meter_protocol_type: meter_details[0].meter_protocol_type.toLowerCase(),
                  pss_real_name: meter_details[0].pss_name,
                  user_real_name: ''
                })
              )
            } else if (selectedOption === 'dtr') {
              dispatch(
                handleMDMSHierarchyProgress({
                  project_type: location.pathname.split('/')[1],
                  project_name: HierarchyProgress.project_name,
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
                  user_real_name: ''
                })
              )
            } else if (selectedOption === 'feeder') {
              dispatch(
                handleMDMSHierarchyProgress({
                  project_type: location.pathname.split('/')[1],
                  project_name: HierarchyProgress.project_name,
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
                  user_real_name: ''
                })
              )
            } else if (selectedOption === 'pss') {
              dispatch(
                handleMDMSHierarchyProgress({
                  project_type: location.pathname.split('/')[1],
                  project_name: HierarchyProgress.project_name,
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
                  user_real_name: ''
                })
              )
            }

            //Clear All User Data from redux store For DTR  level
            dispatch(handleEnergyConsumptionData([], true))
            dispatch(handleAlertsData([], true))
            dispatch(handleUptimeData([], true))
            dispatch(handleBillsGeneratedData([], true))
            dispatch(handleOpertationalStatisticsData([], true))

            //Clear All User profile Data from redux store
            dispatch(handleConsumerProfileInformationData([], true))
            dispatch(handleConsumerTotalConsumptionData([], true))
            dispatch(handleConsumerTotalRechargesData([], true))
            dispatch(handleConsumerTopAlertsData([], true))
            dispatch(handleConsumerTopMeterAlertsData([], true))
            dispatch(handleCommandInfoData([], true))

            //Clear All Feeder Level Data
            dispatch(handleEnergyConsumptionDatadtr([], true))
            dispatch(handleAlertsDatadtr([], true))
            dispatch(handleUptimeDatadtr([], true))
            dispatch(handleBillsGeneratedDatadtr([], true))
            dispatch(handleOpertationalStatisticsDatadtr([], true))

            // Clear All PSS Level Data
            dispatch(handleEnergyConsumptionDatafeeder([], true))
            dispatch(handleAlertsDatafeeder([], true))
            dispatch(handleUptimeDatafeeder([], true))
            dispatch(handleBillsGeneratedDatafeeder([], true))
            dispatch(handleOpertationalStatisticsDatafeeder([], true))

            // Clear All Project Level Data
            dispatch(handleEnergyConsumptionDatapss([], true))
            dispatch(handleAlertsDatapss([], true))
            dispatch(handleUptimeDatapss([], true))
            dispatch(handleBillsGeneratedDatapss([], true))
            dispatch(handleOpertationalStatisticsDatapss([], true))
          })
        } else {
          toast.error(<Toast msg='No result found ....' type='danger' />, { hideProgressBar: true })
        }
      }
    }
  }

  const userInputFun = val => {
    setUserInputParameter(val)
  }

  // ** Function to close search on ESC & ENTER Click
  const onKeyDown = e => {
    if (e.keyCode === 27 || e.keyCode === 13) {
      // console.log(e.keyCode)
      setTimeout(() => {
        setNavbarSearch(false)
        if (userInputParameter === undefined || userInputParameter.length <= 0) {
          // Do Nothing
        } else {
          // console.log('Make an API Call .....')
          // console.log('Meter Serial number .....')
          // console.log(userInputParameter)
          searchMeter()
        }
      }, 1)
    }
  }

  return (
    <NavItem className='nav-search' onClick={() => setNavbarSearch(true)}>
      <NavLink className='nav-link-search'>
        <Icon.Search className='ficon' />
      </NavLink>
      <div
        className={classnames('search-input', {
          open: navbarSearch === true
        })}>
        <Row>
          <Col lg='6' md='12' sm='12'>
            <div className='search-input-icon '>
              <Icon.Search />
            </div>
            {navbarSearch ? (
              <>
                <Autocomplete
                  className='form-control'
                  filterKey='title'
                  filterHeaderKey='groupTitle'
                  grouped={true}
                  placeholder='Search for Substation,Feeder,Site,Meter'
                  autoFocus={true}
                  onKeyDown={onKeyDown}
                  userInputFun={userInputFun}
                />
              </>
            ) : null}
          </Col>
          <Col lg='6' className='mt_20 px-2 mb-1'>
            <h6 className='float-left'>Select Asset :- &nbsp;&nbsp;&nbsp; </h6>
            <div className='float-left'>
              <FormGroup check inline className=''>
                <Input
                  type='radio'
                  id='pss'
                  name='ex1'
                  value='PSS'
                  // defaultChecked
                  checked={selectedOption === 'pss'}
                  onChange={() => setSelectedOption('pss')}
                />
                <Label check for='pss'>
                  PSS
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type='radio'
                  id='feeder'
                  name='ex1'
                  value='FEEDER'
                  checked={selectedOption === 'feeder'}
                  onChange={() => setSelectedOption('feeder')}
                />
                <Label check for='feeder'>
                  FEEDER
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Input type='radio' id='DTR' name='ex1' value='DTR' checked={selectedOption === 'dtr'} onChange={() => setSelectedOption('dtr')} />
                <Label check for='DTR'>
                  DTR
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type='radio'
                  id='METER'
                  name='ex1'
                  value='METER'
                  checked={selectedOption === 'meter'}
                  onChange={() => setSelectedOption('meter')}
                />
                <Label check for='METER'>
                  METER
                </Label>
              </FormGroup>
            </div>
          </Col>
        </Row>
        <div className='search-input-close'>
          <Icon.X
            className='ficon'
            onClick={e => {
              e.stopPropagation()
              setNavbarSearch(false)
            }}
          />
        </div>
      </div>
    </NavItem>
  )
}

export default NavbarSearch
