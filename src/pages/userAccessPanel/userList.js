import React, { useState, useEffect } from 'react';
import { Eye, Minus, Trash2, User } from 'react-feather';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import CreateUser from './createUser';
import EditUser from './editUser';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { caseInsensitiveSort } from '../../utils';
import CardInfo from '../../components/ui-elements/cards/cardInfo';
import Loader from '../../components/loader/loader';
import {
  useDeleteUserMutation,
  useGetUserAccessListQuery,
} from '../../api/user-access-panel';
import DataTableV1 from '../../components/dtTable/DataTableV1';
import { toast } from 'react-toastify';

const UserList = () => {
  const [centeredModal, setCenteredModal] = useState(false);
  const [createUserModal, setcreateUserModal] = useState(false);
  const [formValue, setFormValue] = useState();
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState({});

  const MySwal = withReactContent(Swal);

  const { data, isFetching, isError, status, refetch } =
    useGetUserAccessListQuery();

  const [deleteUser, deleteUserResponse] = useDeleteUserMutation();

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        setUserData(data.data.result);
      }
    } else if (isError) {
      setErrorMessage('Something went wrong, please retry.');
    }
  }, [data, isError, status]);

  useEffect(() => {
    if (deleteUserResponse.status === 'fulfilled') {
      if (deleteUserResponse) {
        MySwal.fire({
          icon: 'success',
          title: 'User Deleted',
          text: `Successfully ! User ${rowData.name} Deleted`,
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    } else if (deleteUserResponse.isError) {
      toast('Something went wrong, please retry.', {
        hideProgressBar: true,
        type: 'error',
      });
    }
  }, [deleteUserResponse]);

  const onPageChange = (page) => {
    setPage(page + 1);
  };

  const handleConfirmDeleteuser = async (row) => {
    return MySwal.fire({
      text: "You won't be able to revert this! ",
      title: 'Are you sure!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      customClass: {
        confirmButton: 'btn btn-primary mx-1',
        cancelButton: 'btn btn-outline-danger',
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        deleteUser(row);
      }
    });
  };

  const tblColumn = () => {
    const column = [];
    if (userData.length > 0) {
      for (const i in userData[0]) {
        const col_config = {};
        if (
          i !== 'id' &&
          i !== 'site_access' &&
          i !== 'avatar' &&
          i !== 'command_access' &&
          i !== 'access' &&
          i !== 'report_access' &&
          i !== 'tag_access'
        ) {
          col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
            1
          )}`.replaceAll('_', ' ');
          col_config.serch = i;
          col_config.sortable = true;
          col_config.selector = (row) => row[i];
          col_config.sortFunction = (rowA, rowB) =>
            caseInsensitiveSort(rowA, rowB, i);
          col_config.cell = (row) => {
            return (
              <div className="d-flex">
                <span className="d-block font-weight-bold ">{row[i]}</span>
              </div>
            );
          };
          column.push(col_config);
        }
      }
    }
    column.push({
      name: 'Action',
      width: '120px',
      cell: (row) => {
        return (
          <>
            <Eye
              size="16"
              className="cursor-pointer"
              onClick={() => {
                setFormValue(row);
                setCenteredModal(!centeredModal);
              }}
            />
            {row.role !== 'superadmin' ? (
              <Trash2
                size="15"
                className="mx-1 cursor-pointer"
                onClick={() => {
                  handleConfirmDeleteuser(row);
                  setRowData(row);
                }}
              />
            ) : (
              <Minus size="15" className="mx-1 cursor-pointer" />
            )}
          </>
        );
      },
    });
    column.unshift({
      name: 'Sr No.',
      width: '90px',
      sortable: false,
      cell: (row, i) => {
        return (
          <div className="d-flex justify-content-center">
            {i + 1 + (page - 1) * 10}
          </div>
        );
      },
    });

    return column;
  };

  const handleCreateUserFormModal = () => setcreateUserModal(!createUserModal);
  const updateFormModal = () => setCenteredModal(!centeredModal);

  return (
    <>
      <Row className="mb-2">
        <Col>
          <h2>User Access Panel</h2>
        </Col>
        <Col>
          <Button
            color="danger"
            className="float-end p_8"
            onClick={() => {
              handleCreateUserFormModal();
            }}
          >
            <User size={16} />
            <span className="align-middle ml-25"> Create User</span>
          </Button>
        </Col>
      </Row>
      {isFetching ? (
        <Loader hight="min-height-330" />
      ) : isError ? (
        <CardInfo
          props={{
            message: { errorMessage },
            retryFun: { refetch },
            retry: { isFetching },
          }}
        />
      ) : (
        <DataTableV1
          columns={tblColumn()}
          data={userData}
          tableName={'User Access List '}
          rowCount={10}
          totalRowsCount={userData.length}
          onPageChange={onPageChange}
          currentPage={page}
        />
      )}
      {/* Edit User form  */}
      <Modal
        isOpen={centeredModal}
        toggle={updateFormModal}
        className="modal-dialog-centered modal-xl mb-0"
      >
        <ModalHeader toggle={updateFormModal}>Update Form </ModalHeader>
        <ModalBody className="">
          <EditUser
            editdata={formValue}
            updateFormModal={updateFormModal}
            isCenteredModalOpen={centeredModal}
          />
        </ModalBody>
      </Modal>

      {/* create user form  */}
      <Modal
        isOpen={createUserModal}
        toggle={handleCreateUserFormModal}
        className="modal-dialog-centered modal-xl mb-0"
      >
        <ModalHeader toggle={handleCreateUserFormModal}>
          Create User Form{' '}
        </ModalHeader>
        <ModalBody className="">
          <CreateUser
            userData={userData}
            handleCreateUserFormModal={handleCreateUserFormModal}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default UserList;
