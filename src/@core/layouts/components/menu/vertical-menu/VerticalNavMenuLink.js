// ** React Imports
import { useEffect } from 'react'
import { NavLink, useLocation, matchPath, useParams, useHistory } from 'react-router-dom'

// ** Third Party Components
import { Badge } from 'reactstrap'
import classnames from 'classnames'

// ** Vertical Menu Array Of Items
//import navigation from '@src/navigation/vertical'

// ** Utils
import { isNavLinkActive, search, getAllParents } from '@layouts/utils'

// String to icon tag
import IcoFun from '@src/utility/dynamicIcon'

import jwt_decode from 'jwt-decode'

const VerticalNavMenuLink = ({
  item,
  groupActive,
  setGroupActive,
  activeItem,
  setActiveItem,
  groupOpen,
  setGroupOpen,
  toggleActiveGroup,
  parentItem,
  routerProps,
  currentActiveItem
}) => {
  // const navigation = JSON.parse(localStorage.getItem('userData')).access

  let navigation = null
  if (localStorage.getItem('accessToken')) {
    navigation = jwt_decode(localStorage.getItem('accessToken')).userData.access
  }

  // Condition to handle Intellismart Account Menu Item
  // const emailAddress = jwt_decode(localStorage.getItem('accessToken')).userData.email

  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink

  // Onclick push link of first item if module group
  const history = useHistory()

  // ** URL Vars
  const location = useLocation()
  const currentURL = location.pathname

  // ** To match path
  const match = matchPath(currentURL, {
    path: `${item.navLink}/:param`,
    exact: true,
    strict: false
  })

  // ** Search for current item parents
  const searchParents = (navigation, currentURL) => {
    const parents = search(navigation, currentURL, routerProps) // Search for parent object
    const allParents = getAllParents(parents, 'id') // Parents Object to Parents Array
    return allParents
  }

  // ** URL Vars
  const resetActiveGroup = navLink => {
    const parents = search(navigation, navLink, match)
    toggleActiveGroup(item.id, parents)
  }

  // ** Reset Active & Open Group Arrays
  const resetActiveAndOpenGroups = () => {
    setGroupActive([])
    setGroupOpen([])
  }

  // ** Checks url & updates active item
  useEffect(() => {
    if (currentActiveItem !== null) {
      setActiveItem(currentActiveItem)
      const arr = searchParents(navigation, currentURL)
      setGroupActive([...arr])
    }
  }, [location])

  // Handle the dynamic modules
  const handleModules = modules => {}

  return (
    <li
      className={classnames({
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem
      })}>
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || '/'
            }
          : {
              to: item.navLink || '/',
              isActive: (match, location) => {
                if (!match) {
                  return false
                }

                if (match.url && match.url !== '' && match.url === item.navLink) {
                  currentActiveItem = item.navLink
                }
              }
              // onClick: handleModules(item.children)
            })}
        /*eslint-enable */
        onClick={e => {
          if (item.modules) {
            // handleModules(item.modules)
          }
          if (!item.navLink.length) {
            e.preventDefault()
          }
          parentItem ? resetActiveGroup(item.navLink) : resetActiveAndOpenGroups()
        }}>
        {IcoFun(item.icon, 20)}
        <span className='menu-item text-truncate'>{item.title}</span>

        {item.badge && item.badgeText ? (
          <Badge className='ml-auto mr-1' color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  )
}

export default VerticalNavMenuLink
