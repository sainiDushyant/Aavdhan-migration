import React, { useEffect, useState } from 'react';
import { setIsMobileSidebarOpen } from '../../../app/redux/layoutSlice';
import { useDispatch } from 'react-redux';
import { setCollapsed } from '../../../app/redux/layoutSlice';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import {
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../../api/logoutSlice';
import UserProfileTab from './userProfileWrapper';
function Navbar() {
  const navigate = useNavigate();
  const [openDropDown, setOpenDropDown] = useState(false);
  const [logout, logoutResponse] = useLogoutMutation();
  const [userProfile, setUserProfile] = useState(false);
  const token = localStorage.getItem('token') || '';
  let name = '';
  let role = '';

  try {
    if (token) {
      const userDetails = jwtDecode(token);
      name = userDetails?.userData?.name;
      role = userDetails?.userData?.role;
    }
  } catch (error) {
    toast('Failed to decode token or retrieve user details:', {
      hideProgressBar: true,
      type: error,
    });
  }

  const dispatch = useDispatch();
  const toggleCollapse = () => {
    dispatch(setCollapsed(false));
  };
  const handleIsMobileSidebarOpen = () => {
    dispatch(setIsMobileSidebarOpen(true));
    toggleCollapse();
  };

  const handleResize = (event) => {
    if (event.target.innerWidth > 991) {
      dispatch(setIsMobileSidebarOpen(false));
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (logoutResponse.status === 'fulfilled') {
      const statusCode = logoutResponse.data.responseCode;
      if (statusCode === 202) {
        localStorage.clear();
        navigate('/', { replace: true });
        toast(logoutResponse.data.data.result.message, {
          hideProgressBar: true,
          type: 'success',
        });
      } else if (logoutResponse.isError) {
        toast('Something went wrong!! Please try again.', {
          hideProgressBar: true,
          type: 'error',
        });
      }
    }
  }, [logoutResponse]);

  const handleDropDown = () => {
    setOpenDropDown(!openDropDown);
  };
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast('Failed to logout', {
        hideProgressBar: true,
        type: 'error',
      });
    }
  };
  const userProfileModal = () => {
    setUserProfile(!userProfile);
    setOpenDropDown(false);
  };

  return (
    <>
      <nav class="navbar border">
        <div class="container-fluid">
          <div className="menu-btn-container d-flex">
            <button
              class="btn d-block d-lg-none"
              id="menu-btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#drawer"
              aria-controls="drawer"
              onClick={handleIsMobileSidebarOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="ficon"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            {/* <h3 className="d-none d-sm-block">Avdhaan</h3> */}
            <div className="d-none d-lg-flex align-items-center gap-1">
              <img
                src={`${process.env.PUBLIC_URL}/polaris-logo.svg`}
                alt="Avdhaan Logo"
                style={{
                  width: '30px',
                  height: '30px',
                }}
              />
              <h1
                style={{
                  fontWeight: 'bold',
                  color: '#0A3690',
                  margin: '0px',
                  fontFamily: 'sans-serif',
                }}
              >
                Avdhaan
              </h1>
            </div>
          </div>
          <ul class="navbar-nav d-flex flex-row align-items-center gap-1">
            {role === 'superadmin' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="ficon"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            ) : (
              ''
            )}
            <li className="text-end">
              <b>{name}</b> <br />
              <small className="d-block">{role}</small>
            </li>
            <li className="dropdown-user nav-item dropdown">
              <a
                aria-haspopup="true"
                className="nav-link dropdown-user-link"
                aria-expanded="false"
                // onClick={(event) => handleDropDown(event)}
              >
                <div className="avatar">
                  <img
                    className=""
                    src="https://img.icons8.com/office/16/000000/user.png"
                    alt="avatarImg"
                    height="40"
                    width="40"
                    onClick={handleDropDown}
                  />
                  {/* <span className="avatar-status-online"></span> */}
                </div>
              </a>
              {openDropDown && (
                <Card
                  tabIndex="-1"
                  role="menu"
                  // aria-hidden="true"
                  className="position-absolute end-0 mt-1 "
                  style={{
                    zIndex: '150',
                  }}
                >
                  <CardBody className="p-0">
                    <ListGroup>
                      <ListGroupItem
                        tag="button"
                        action
                        className="dropdown-item"
                        onClick={userProfileModal}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="me-1"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span className="align-middle">User Profile</span>
                      </ListGroupItem>
                      <ListGroupItem
                        tag="button"
                        action
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="me-1"
                        >
                          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                          <line x1="12" y1="2" x2="12" y2="12"></line>
                        </svg>
                        <span className="align-middle">Logout</span>
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <Modal
        isOpen={userProfile}
        toggle={userProfileModal}
        className={`modal-md modal-dialog-centered`}
      >
        <ModalHeader toggle={userProfileModal}>User Profile</ModalHeader>
        <ModalBody>
          <UserProfileTab />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Navbar;
