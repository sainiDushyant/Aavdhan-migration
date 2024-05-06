import { Fragment, useState } from 'react'
import { Key, User } from 'react-feather'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import UpdatePassword from './updatePassword'
import UserProfile from './userProfile'

const UserProfileTab = () => {
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  return (
    <Fragment>
      <Nav className='justify-content-center' tabs>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}>
            <User size={18} />
            User Profile
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}>
            <Key size={17} />
            Update Password
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className='py-50' activeTab={active}>
        <TabPane tabId='1'>
          <UserProfile />
        </TabPane>
        <TabPane tabId='2'>
          <UpdatePassword />
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserProfileTab
