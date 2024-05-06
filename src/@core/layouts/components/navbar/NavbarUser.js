// ** Dropdowns Imports
import { Fragment, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import UserDropdown from './UserDropdown'
import NavbarSearch from './NavbarSearch'

// ** Third Party Components
import { Sun, Moon, Menu, Calendar } from 'react-feather'
import { NavItem, NavLink } from 'reactstrap'

import Picker from 'react-month-picker'
import 'react-month-picker/css/month-picker.css'

import { handleCalendarMonthUpdated, resetAllDataExceptCalendarAndHierarchy } from '@store/actions/navbar/calendar'
import { handleSearchOptionVisibility } from '@store/actions/navbar/showSearchOption'

import { useLocation, useHistory } from 'react-router-dom'

import * as Icon from 'react-feather'

import jwt_decode from 'jwt-decode'

const NavbarUser = props => {
  const history = useHistory()

  const dispatch = useDispatch()

  const showSearchBar = useSelector(state => state.SearchOptionVisibilityReducer.showSearchBar)

  // Const to get Module Name
  const [moduleName, setModuleName] = useState(undefined)

  // Const to get Project Name
  const [projectName, setProjectName] = useState(undefined)

  // Const to show search Option
  // const [showSearchOption, setShowSearchOption] = useState(localStorage.getItem('userData'))

  // const [showSettingOption, setShowSettingOption] = useState(false)
  // const userData = JSON.parse(localStorage.getItem('userData'))

  let userData = null
  if (localStorage.getItem('accessToken')) {
    userData = jwt_decode(localStorage.getItem('accessToken')).userData
  }

  const location = useLocation()
  const loc_split = location.pathname.split('/')

  if (loc_split[2] && loc_split[3]) {
    const module_temp = loc_split[3]
    if (module_temp === 'mdms') {
      dispatch(handleSearchOptionVisibility(true))
    } else {
      dispatch(handleSearchOptionVisibility(false))
    }
  } else {
    dispatch(handleSearchOptionVisibility(false))
  }

  //REf for month picker
  const pickAMonth = useRef()

  //Get Current Month and Year
  const date = new Date()
  const current_month = date.getMonth()
  const current_year = date.getFullYear()

  //Get Month and Year Value from redux store
  const selected_month = useSelector(state => state.calendarReducer.month)
  // const selected_year = useSelector(state => state.calendarReducer.year)
  const monthUpdated = useSelector(state => state.calendarReducer.monthUpdated)

  let selected_value = { year: current_year, month: current_month + 1 }
  if (monthUpdated) {
    selected_value = selected_month
  } else if (!monthUpdated) {
    dispatch(handleCalendarMonthUpdated(selected_value, true))
  }

  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  //On Calendar Icon Clicked
  const OnCalendarIconClicked = () => {
    pickAMonth.current.show()
  }

  const pickerLang = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    from: 'From',
    to: 'To'
  }

  const handleAMonthChange = value => {}

  const handleAMonthDissmis = value => {
    dispatch(handleCalendarMonthUpdated(value, true))
    dispatch(resetAllDataExceptCalendarAndHierarchy('NewMonthSelected'))
  }

  const currentMonth = new Date().getMonth() + 1
  // console.log(currentMonth)
  const currentYear = new Date().getFullYear()
  // console.log(currentYear)

  const navigateToSettingsPage = () => {
    history.push('/admin')
  }

  return (
    <Fragment>
      <ul className='navbar-nav d-xl-none d-flex align-items-center'>
        <NavItem className='mobile-menu mr-auto'>
          <NavLink className='nav-menu-main menu-toggle hidden-xs is-active' onClick={() => setMenuVisibility(true)}>
            <Menu className='ficon' />
          </NavLink>
        </NavItem>
      </ul>
      {/* <div className='bookmark-wrapper d-flex align-items-center'>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <ThemeToggler />
          </NavLink>
        </NavItem>
      </div> */}
      {/* <div className='bookmark-wrapper d-flex align-items-center'>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <div className='edit'>
              <Picker
                ref={pickAMonth}
                years={{ min: { year: 2010, month: 1 }, max: { year: 2022, month: 7 } }}
                value={selected_value}
                lang={pickerLang.months}
                theme='light'
                onChange={handleAMonthChange}
                onDismiss={handleAMonthDissmis}>
                <Calendar onClick={OnCalendarIconClicked} />
              </Picker>
            </div>
          </NavLink>
        </NavItem>
      </div> */}
      {/* <div className='bookmark-wrapper d-flex align-items-center'>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <h3>
              Selected Month : {pickerLang.months[selected_value.month - 1]} {selected_value.year}
            </h3>
          </NavLink>
        </NavItem>
      </div> */}
      <ul className='nav navbar-nav align-items-center ml-auto'>
        {showSearchBar && <NavbarSearch />}
        {userData && userData['role'] === 'superadmin' && (
          <Icon.Settings
            className='ficon'
            onClick={e => {
              e.stopPropagation()
              navigateToSettingsPage()
            }}
          />
        )}
        <UserDropdown />
      </ul>
    </Fragment>
  )
}
export default NavbarUser
