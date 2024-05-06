// ** React Imports
import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn, selectThemeColors } from '@utils'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'

// ** Third Party Components
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Form,
  Row,
  Col,
  Button
} from 'reactstrap'
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power, FileText } from 'react-feather'

import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'

import { handleMDMSFlow } from '@store/actions/UtilityProject/MDMS/mdmsflow'

import { handleCalendarMonthUpdated, resetAllDataExceptCalendarAndHierarchy } from '@store/actions/navbar/calendar'

import useJwt from '@src/auth/jwt/useJwt'

import { toast } from 'react-toastify'
import Toast from '@src/views/ui-elements/cards/actions/createToast'

import jwt_decode from 'jwt-decode'

// import { useHistory } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
import authLogout from '../../../../auth/jwt/logoutlogic'

import UserProfileTab from './userProfileWrapper'
const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const history = useHistory()

  // Logout User
  const [logout, setLogout] = useState(false)
  useEffect(() => {
    if (logout) {
      authLogout(history, dispatch)
    }
  }, [logout])

  // ** State
  const [userData, setUserData] = useState(null)
  const [centeredModal, setCenteredModal] = useState(false)
  const [userProfile, setuserProfile] = useState(false)
  const [meterSerial, setMeterSerial] = useState(null)
  const [commandMeter, setCommandMeter] = useState(null)
  // console.log("Meter Serial Number ....")
  // console.log(meterSerial)

  const [timeStamp, setTimeStamp] = useState(null)
  // console.log("Time Stamp selected ...")
  // console.log(timeStamp)

  const [selectEvent, setSelectEvent] = useState(null)
  // console.log("Selected Event")
  // console.log(selectEvent)

  const [callSetEventAPI, setCallSetEventsAPI] = useState(false)

  const [showEventModal, setShowEventModal] = useState(false)

  let userLoginData = undefined
  // if (localStorage.getItem('userData')) {
  //   userLoginData = JSON.parse(localStorage.getItem('userData'))
  // }
  if (localStorage.getItem('accessToken')) {
    userLoginData = jwt_decode(localStorage.getItem('accessToken')).userData
  }

  if (userLoginData && userLoginData['email'] === 'dummy@grampower.com') {
    if (!showEventModal) {
      setShowEventModal(true)
    }
  }

  // //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      // setUserData(JSON.parse(localStorage.getItem('userData')))
      let userData_local = null
      if (localStorage.getItem('accessToken')) {
        userData_local = jwt_decode(localStorage.getItem('accessToken')).userData
      }
      setUserData(userData_local)
    }
  }, [])

  const fetchData = async params => {
    return await useJwt
      .enterEvents(params)
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

  const getClearCommand = async params => {
    return await useJwt
      .clearCommand(params)
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

  const logoutRequest = async params => {
    return await useJwt
      .logoutUser(params)
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

  // useEffect(async () => {
  //   if (callSetEventAPI) {
  //     const params = {
  //       meter_serial: meterSerial,
  //       date_time: timeStamp,
  //       event_list: selectEvent
  //     }
  //     const [statusCode, response] = await fetchData(params)
  //   }
  // }, [callSetEventAPI])

  // use history of react router dom
  // const history = useHistory()
  const handleLogoutHandler = async () => {
    try {
      const refresh_key = localStorage.getItem('refreshToken')
      const [statusCode, response] = await logoutRequest({ refresh: refresh_key })

      if (statusCode === 202) {
        toast.success(<Toast msg={response.data.data.result.results.message} type='success' />, { hideProgressBar: true })
      } else if (statusCode === 401 || statusCode === 403) {
        setLogout(true)
      } else {
        toast.warning(<Toast msg={response.data.error.detail} type='warning' />, { hideProgressBar: true })
      }
    } catch (err) {}

    // dispatch(handleMDMSFlow(undefined, true))
    history.replace('/login')
    dispatch(handleLogout())
    dispatch(resetAllDataExceptCalendarAndHierarchy('Logout'))
  }

  const dateTimeFormat = inputDate => {
    return ''.concat(
      inputDate.getFullYear(),
      '-',
      (inputDate.getMonth() + 1).toString().padStart(2, '0'),
      '-',
      inputDate.getDate().toString().padStart(2, '0'),
      ' ',
      inputDate.getHours().toString().padStart(2, '0'),
      ':',
      inputDate.getMinutes().toString().padStart(2, '0'),
      ':',
      inputDate.getSeconds().toString().padStart(2, '0')
    )
  }

  const onSubmitButtonClicked = async () => {
    if (!meterSerial) {
      toast.error(<Toast msg='Please enter meter serial.' type='danger' />, { hideProgressBar: true })
    } else if (selectEvent.length > 1) {
      toast.error(<Toast msg='Please select event' type='danger' />, { hideProgressBar: true })
    }

    const params = {
      meter_serial: meterSerial,
      date_time: timeStamp,
      event_list: selectEvent
    }

    const [statusCode, response] = await fetchData(params)

    toast.success(<Toast msg={response.data.data.result.results.message} type='success' />, { hideProgressBar: true })
  }

  const onCommandSubmitButtonClicked = async () => {
    const [statusCode, response] = await getClearCommand({ meter_serial: commandMeter })
    toast.info(<Toast msg={response.data.data.result.message} type='info' />, { hideProgressBar: true })
  }

  const handleMeterSerialNumberChange = events => {
    if (events.target.value) {
      setMeterSerial(events.target.value)
    } else {
      setMeterSerial(null)
    }
  }

  const handleTimeStampChange = events => {
    if (events && events.length > 0) {
      setTimeStamp(dateTimeFormat(events[0]))
    } else {
      setTimeStamp(null)
    }
  }

  const handleEventsSelectedChange = events => {
    if (events && events.length > 0) {
      const selected_events = []
      for (const i of events) {
        selected_events.push(i['value'])
      }
      setSelectEvent(selected_events)
    } else {
      setSelectEvent(null)
    }
  }

  const closeEventsModal = () => {
    setMeterSerial(null)
    setTimeStamp(null)
    setSelectEvent([])
    setCenteredModal(!centeredModal)
  }

  const userProfileModal = () => {
    setuserProfile(!userProfile)
  }
  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name font-weight-bold'>{(userData && userData['name']) || 'John Doe'}</span>
          <span className='user-status'>{(userData && userData.role) || 'Admin'}</span>
        </div>
        <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem
          onClick={() => {
            userProfileModal()
          }}>
          <User size={14} className='mr-75' />
          <span className='align-middle'>User Profile</span>
        </DropdownItem>
        <DropdownItem onClick={handleLogoutHandler}>
          <Power size={14} className='mr-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>
        {showEventModal && (
          <DropdownItem onClick={setCenteredModal}>
            <FileText size={14} className='mr-75' />
            <span className='align-middle'>Insert event</span>
          </DropdownItem>
        )}
      </DropdownMenu>

      {/* User Profile Modal */}
      <Modal isOpen={userProfile} toggle={userProfileModal} className={`modal-md modal-dialog-centered`}>
        <ModalHeader toggle={userProfileModal}>User Profile</ModalHeader>
        <ModalBody>
          <UserProfileTab />
        </ModalBody>
      </Modal>

      <Modal isOpen={centeredModal} toggle={closeEventsModal} backdrop={false} className={`modal-sm modal-dialog-top`}>
        <ModalHeader toggle={closeEventsModal}>Insert meter event</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col lg='12' className='my_5'>
                <Input type='text' onChange={handleMeterSerialNumberChange} placeholder='Meter serial / Meter ID' />
              </Col>
              <Col lg='12' className='my_5'>
                <Flatpickr
                  placeholder='Select date ...'
                  onChange={handleTimeStampChange}
                  className='form-control'
                  options={{ enableTime: true, static: true, enableSeconds: true }}
                />
              </Col>
              <Col lg='12' className='my_5'>
                <Select
                  isClearable={true}
                  // closeMenuOnSelect={false}
                  isMulti={true}
                  isSearchable={true}
                  theme={selectThemeColors}
                  options={[
                    {
                      label: '0: 1/2 - R Phase - Voltage missing for 3 phase meter',
                      value: 0
                    },
                    {
                      label: '1: 3/4 - Y Phase - Voltage missing Common to 3 Phase and single phase meter',
                      value: 1
                    },
                    {
                      label: '2: 5/6 - B Phase - Voltage missing',
                      value: 2
                    },
                    {
                      label: '3: 7/8 - Over voltage in any phase',
                      value: 3
                    },
                    {
                      label: '4: 9/10 - Low voltage in any phase',
                      value: 4
                    },
                    {
                      label: '5: 11/12 - Voltage unbalance',
                      value: 5
                    },
                    {
                      label: '6: 51/52 -R Phase current reverse (Import type only)',
                      value: 6
                    },
                    {
                      label: '7: 53/54 - Y Phase current reverse (Import type only)',
                      value: 7
                    },
                    {
                      label: '8: 55/56 - B Phase current reverse (Import type only)',
                      value: 8
                    },
                    {
                      label: '9: 63/64 - Current unbalance',
                      value: 9
                    },
                    {
                      label: '10: 65/66 - Current bypass/short',
                      value: 10
                    },
                    {
                      label: '11: 67/68 - Over current in any phase',
                      value: 11
                    },
                    {
                      label: '12: 205/206 - Very low PF',
                      value: 12
                    },
                    {
                      label: '51: 69/70 - Earth Loading (Occurrence/Restoration)',
                      value: 51
                    },
                    {
                      label: '81: 201/202 - Influence of permanent magnet or ac/dc electromagnet',
                      value: 81
                    },
                    {
                      label: '82: 203/204 - Neutral disturbance - HF, dc or alternate method',
                      value: 82
                    },
                    {
                      label: '83: 251 - Meter cover opening',
                      value: 83
                    },
                    {
                      label: '84: 301/302 - Meter load disconnected/Meter load connected',
                      value: 84
                    },
                    {
                      label: '85: Last Gasp - Occurrence',
                      value: 85
                    },
                    {
                      label: '86: First Breath - Restoration',
                      value: 86
                    },
                    {
                      label: '87: Increment in billing counter (Manual/MRI reset)',
                      value: 87
                    }
                  ]}
                  onChange={handleEventsSelectedChange}
                  className='react-select rounded'
                  classNamePrefix='select'
                  placeholder='Select Event ...'
                />
              </Col>
              <Col lg='12' className='my_5 mt-2 pb-2 text-center border-bottom'>
                <Button color='primary' outline className='btn-sm' onClick={onSubmitButtonClicked}>
                  Submit
                </Button>
              </Col>

              <Col>
                <h4 className='mb-2 mt-1'>Clear command</h4>
                <Input type='text' onChange={e => setCommandMeter(e.target.value)} placeholder='Meter serial / Meter ID' />
              </Col>
              <Col lg='12' className='my_5 mt-2 pb-2 text-center'>
                <Button color='danger' outline className='btn-sm' onClick={onCommandSubmitButtonClicked}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
